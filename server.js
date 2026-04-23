require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require('multer');
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

// ================= Middleware =================
app.use(cors({
  origin: "https://six4zilla.onrender.com",
  credentials: true
}));

//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cookieParser());

//----session cookie-----
//app.use(cors({ origin: true, credentials: true }));

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

// ================= Ensure uploads folder =================
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express.static(uploadDir));

// ================= MongoDB =================
const connect = async () => {
    if (!mongo) {
        console.error("MONGO_URL missing in .env");
        return;
    }
    try {
        await mongoose.connect(mongo);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('DB error:', error.message);
    }
};
connect();

// ================= Multer =================
/*const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ================= ROUTES =================
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
// Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// ================= USER REGISTER =================
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

        res.status(201).json({ success: true, message: "Registration Successful" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= USER LOGIN =================
/*app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, { httpOnly: true });

        res.json({
            success: true,
            role: user.role,
            token
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});*/
// ================= LOGIN (SESSION) =================
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.json({ success: false });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.json({ success: false });

    // ✅ SESSION SAVE
    req.session.user = {
        id: user._id,
        role: user.role
    };

    res.json({
        success: true,
        role: user.role
    });
});


// ================= SELLER REGISTER =================
app.post('/register-seller', async (req, res) => {
    try {
        const { username, email, password, nid, district, productCategory } = req.body;

        const existingSeller = await Seller.findOne({
            $or: [{ email }, { nid }]
        });

        if (existingSeller) {
            return res.status(400).json({
                success: false,
                message: "Seller already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newSeller = new Seller({
            username,
            email,
            password: hashedPassword,
            nid,
            district,
            productCategory
        });

        await newSeller.save();

        res.json({ success: true, message: "Seller registered" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= SELLER LOGIN =================
app.post('/seller-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const seller = await Seller.findOne({ email });

        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const isMatch = await bcrypt.compare(password, seller.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Wrong password" });
        }

        // 🔥 FIXED RESPONSE
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

// ================= ADD PRODUCT =================
app.get("/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});
// SELLER PRODUCTS

app.get("/my-products/:sellerId", async (req, res) => {
    try {

        const sellerId = String(req.params.sellerId);

        const products = await Product.find({ sellerId });

        res.json(products);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//-----seller add product-------
/*app.post('/add-product', upload.single('image'), async (req, res) => {
    try {

        const { sellerId, name, price, district, size, availability } = req.body;

        // 🔥 VALIDATION (IMPORTANT)
        if (!sellerId || !name || !price) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // 🔥 IMAGE CHECK (IMPORTANT)
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const product = new Product({
            sellerId: String(sellerId),
            name,
            price,
            district,
            size,
            availability,
            image: req.file.filename
        });

        await product.save();

        res.json({
            success: true,
            message: "Product added successfully",
            image: req.file.filename
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});*/
app.post('/add-product', upload.single('image'), async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file); // 🔥 IMPORTANT

       
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }
        

const product = new Product({
    sellerId: req.body.sellerId,
    name: req.body.name,
    price: req.body.price,
    district: req.body.district,
    size: req.body.size,
    availability: req.body.availability,
    image: req.file.filename
});

        await product.save();

      res.json({
      success: true,
      message: "Product added"
    });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

// ================= DELETE PRODUCT =================
app.delete('/delete-product/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ================= EDIT PRODUCT =================
app.put('/update-product/:id', upload.single('image'), async (req, res) => {
    try {

        const { name, price, district, size, availability } = req.body;

        const updateData = {
            name,
            price,
            district,
            size,
            availability
        };

      if (req.file) {
      updateData.image = req.file.filename;
    }


        await Product.findByIdAndUpdate(req.params.id, updateData);

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
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
// 🔥 PLACE ORDER (from checkout)
/*app.post("/orders", async (req, res) => {
    try {
        const { customer, paymentMethod, bkashNumber, items, total } = req.body;

        if (!items || items.length === 0) {
            return res.json({ success: false, message: "Empty cart" });
        }

        const order = new Order({

            customer: {
                name: customer?.name || "",
                phone: customer?.phone || "",
                address: customer?.address || ""
            },

            paymentMethod: paymentMethod || "COD",
            bkashNumber: bkashNumber || "",

            // 🔥 NEW
            paymentStatus: paymentMethod === "COD" ? "unpaid" : "paid",
            transactionId: paymentMethod === "bKash" ? "TXN" + Date.now() : "",

            items: items.map(i => ({
                productId: i.productId,
                sellerId: i.sellerId,
                name: i.name,
                price: Number(i.price),
                quantity: Number(i.quantity)
            })),

            // 🔥 FIXED
            total: Number(total) || 0,

            status: "pending",
            date: new Date()
        });

        await order.save();

        res.json({ success: true, order });

    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
});*/
// ================= ORDER MODEL LOGIC FIX =================
/*app.post("/orders", async (req, res) => {
  try {

    const method = (req.body.paymentMethod || "").toLowerCase(); // ✅ HERE

    const order = new Order({
      customer: {
        name: req.body.customer?.name,
        phone: req.body.customer?.phone,
        address: req.body.customer?.address
      },

      paymentMethod: req.body.paymentMethod,

      bkashNumber: req.body.bkashNumber || "",

      transactionId:
        method === "bkash" ? "TXN" + Date.now() : "",

      paymentStatus:
        method === "cod" ? "unpaid" : "paid",

      items: req.body.items || [],
      total: Number(req.body.total),

      status: "pending",
      date: new Date()
    });

    await order.save();

    res.json({ success: true, order });

  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});
*/
app.post("/orders", async (req, res) => {
  try {
const { customer, paymentMethod, bkashNumber, items, total } = req.body;

    // validation (optional but recommended)
    if (!customer || !customer.name || !customer.phone) {
       return res.status(400).json({ success: false, message: "Customer details missing" });
    }
    const order = new Order({
      customer: {
        name: req.body.customer?.name || "",
        phone: req.body.customer?.phone || "",
        address: req.body.customer?.address || ""
      },

      paymentMethod: req.body.paymentMethod,
      bkashNumber: req.body.bkashNumber || "",

      transactionId: "",
      paymentStatus: req.body.paymentMethod === "COD" ? "unpaid" : "paid",

      items: req.body.items || [],
      total: Number(req.body.total) || 0,

      status: "pending",
      date: new Date()
      
    });

    const saved = await order.save();

    res.json({ success: true, order: saved });

  } catch (err) {
    console.log(err);
    res.json({ success: false, error: err.message });
  }
  console.log("Full Request Body:", req.body);
});
// 🔥 SELLER/ADMIN GET ALL ORDERS
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

// 🔥 ORDER STATUS UPDATE (seller use করবে)
app.put("/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/sellers", async (req, res) => {
    try {
        const sellers = await Seller.find();
        res.json(sellers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//-----user profile details------
app.get("/me", async (req, res) => {
    if (!req.session.user) {
        return res.json({ success: false });
    }

    const user = await User.findById(req.session.user.id).select("-password");

    res.json({ success: true, user });
});
app.post("/change-password", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.json({ success: false, message: "Not logged in" });
        }

        const user = await User.findById(req.session.user.id);

        const match = await bcrypt.compare(req.body.oldPassword, user.password);

        if (!match) {
            return res.json({ success: false, message: "Old password wrong" });
        }

        const hashed = await bcrypt.hash(req.body.newPassword, 10);

        user.password = hashed;
        await user.save();

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ================= START SERVER =================
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});