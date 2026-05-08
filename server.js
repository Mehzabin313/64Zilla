const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const fs = require('fs');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

const mongo = process.env.MONGO_URL;

// Models
const User = require("./models/user");
const Seller = require("./models/seller");
const Product = require("./models/product");
const Order = require("./models/order");

// ================= MIDDLEWARE =================
app.use(cors({
  origin: "https://six4zilla.onrender.com",
  credentials: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: 'secret123',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// ================= VERIFY TOKEN (FIX) =================
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

// ================= CLOUDINARY =================
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "six4zilla-products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"]
  }
});

const upload = multer({ storage });

// ================= MONGO CONNECT =================
mongoose.connect(mongo)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ROUTES 
//-----search product--------
app.get("/search-products", async (req, res) => {
    try {
        const key = req.query.q;

        const products = await Product.find({
            $or: [
                { name: { $regex: key, $options: "i" } },
                { district: { $regex: key, $options: "i" } },
                { size: { $regex: key, $options: "i" } }
            ]
        });

        res.json(products);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// HOME
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// ================= AUTH =================
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SELLER LOGIN =================
app.post('/seller-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller) return res.json({ success: false });

    const match = await bcrypt.compare(password, seller.password);
    if (!match) return res.json({ success: false });

    res.json({
      success: true,
      role: "seller",
      seller: {
        _id: seller._id,
        email: seller.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= PRODUCTS =================
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get("/my-products/:sellerId", async (req, res) => {
  const products = await Product.find({ sellerId: req.params.sellerId });
  res.json(products);
});

// ================= ADD PRODUCT FIX =================
app.post("/add-product", (req, res) => {
  upload.single("image")(req, res, async function (err) {
    if (err) return res.status(500).json({ success: false });

    const product = new Product({
      sellerId: req.body.sellerId,
      name: req.body.name,
      price: req.body.price,
      district: req.body.district,
      size: req.body.size,
      availability: req.body.availability,
      image: req.file.path
    });

    await product.save();
    res.json({ success: true });
  });
});

// ================= DELETE =================
app.delete("/delete-product/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ================= UPDATE =================
app.put("/update-product/:id", (req, res) => {
  upload.single("image")(req, res, async function () {
    const updateData = {
      name: req.body.name,
      price: req.body.price,
      district: req.body.district,
      size: req.body.size,
      availability: req.body.availability
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);

    res.json({ success: true });
  });
});

// ================= ORDERS =================
app.post("/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.json({ success: false });
  }
});

app.get("/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// ================= USER ORDERS =================
app.get("/orders/my", verifyToken, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
});

// ================= ME =================
app.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json({ success: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    res.json({ success: true, user });

  } catch (err) {
    res.json({ success: false });
  }
});
app.get("/product/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ================= GET PRODUCTS BY DISTRICT =================
app.get("/products/district/:district", async (req, res) => {
    const district = req.params.district;

    const products = await Product.find({
    district: { $regex: `^${district}$`, $options: "i" }
});

    res.json(products);
});
app.get("/seller/orders/:sellerId", async (req, res) => {
  try {

    const sellerId = req.params.sellerId;

    const orders = await Order.find().sort({ date: -1 });

    const filtered = orders.filter(order =>
      order.items.some(item =>
        String(item.sellerId) === String(sellerId)
      )
    );

    res.json(filtered);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= START SERVER =================
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});