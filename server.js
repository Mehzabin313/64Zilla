console.log("SERVER STARTING...");

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const fs = require("fs");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 3000;

const User = require("./models/user");
const Seller = require("./models/seller");
const Product = require("./models/product");
const Order = require("./models/order");

// ================= ENV CHECK =================
console.log("ENV CHECK:", process.env.CLOUD_NAME, process.env.MONGO_URL ? "OK" : "MISSING");

// ================= MIDDLEWARE =================
app.use(cors({
  origin: "https://six4zilla.onrender.com",
  credentials: true
}));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: "secret123",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// ================= CLOUDINARY =================
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "six4zilla-products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"]
  }
});

const upload = multer({ storage });

// ================= DB =================
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ================= VERIFY TOKEN =================
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ success: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false });
  }
}

// ================= ROUTES =================

// HOME
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// REGISTER USER
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({ username, email, password: hashed });
  await user.save();

  res.json({ success: true });
});

// LOGIN USER
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ success: false });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ success: true, token });
});

// REGISTER SELLER
app.post("/register-seller", async (req, res) => {
  const seller = new Seller(req.body);
  await seller.save();
  res.json({ success: true });
});

// LOGIN SELLER
app.post("/seller-login", async (req, res) => {
  const seller = await Seller.findOne({ email: req.body.email });

  if (!seller) return res.status(404).json({ success: false });

  const match = await bcrypt.compare(req.body.password, seller.password);
  if (!match) return res.status(401).json({ success: false });

  res.json({ success: true, sellerId: seller._id });
});

// PRODUCTS
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ADD PRODUCT (FIXED)
app.post("/add-product", (req, res) => {
  upload.single("image")(req, res, async function (err) {
    try {
      if (err) return res.status(500).json({ success: false });

      if (!req.file) return res.status(400).json({ success: false });

      const seller = await Seller.findById(req.body.sellerId);
      if (!seller) return res.status(404).json({ success: false });

      const product = new Product({
        sellerId: req.body.sellerId,
        name: req.body.name,
        price: req.body.price,
        district: req.body.district,
        size: req.body.size,
        availability: req.body.availability,
        image: req.file.path,
        storeName: seller.storeName || "",
        sellerName: seller.username || ""
      });

      await product.save();

      res.json({ success: true });

    } catch (err) {
      res.status(500).json({ success: false });
    }
  });
});

// DELETE PRODUCT
app.delete("/delete-product/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// UPDATE PRODUCT
app.put("/update-product/:id", (req, res) => {
  upload.single("image")(req, res, async function (err) {
    if (err) return res.status(500).json({ success: false });

    const updateData = { ...req.body };

    if (req.file) updateData.image = req.file.path;

    await Product.findByIdAndUpdate(req.params.id, updateData);

    res.json({ success: true });
  });
});

// SINGLE PRODUCT
app.get("/product/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

// SEARCH
app.get("/search-products", async (req, res) => {
  const key = req.query.q;

  const products = await Product.find({
    $or: [
      { name: { $regex: key, $options: "i" } },
      { district: { $regex: key, $options: "i" } }
    ]
  });

  res.json(products);
});

// ORDERS (ONLY ONE VERSION - FIXED)
app.get("/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// CREATE ORDER
app.post("/orders", async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.json({ success: true });
});

// USER ORDERS
app.get("/orders/my", verifyToken, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
});

// SELLER ORDERS
app.get("/seller/orders/:sellerId", async (req, res) => {
  const orders = await Order.find();

  const filtered = orders.filter(o =>
    o.items.some(i => String(i.sellerId) === req.params.sellerId)
  );

  res.json(filtered);
});

// UPDATE ORDER STATUS
app.put("/orders/:id", async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, {
    status: req.body.status
  });

  res.json({ success: true });
});

// ================= START =================
app.listen(port, () => {
  console.log("Server running on port", port);
});