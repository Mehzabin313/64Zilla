<<<<<<< HEAD
const express = require('express');
const mongoose = require('mongoose'); 
const app = express();
const cors=require("cors");
require ("dotenv").config();
const port= process.env.PORT || 4000
app.use(cors());
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected Successfully! ✅"))
  .catch(err => {
    console.log("Database Connection Error: ❌");
    console.error(err.message);
  });
app.get('/', (req, res) => {
    res.send("অভিনন্দন! ৬৪-জেলা প্রজেক্টের সার্ভার চালু হয়েছে।");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
=======
require('dotenv').config(); // Add this at the very top!
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const app = express();

const port = process.env.PORT || 3000;
const mongo = process.env.MONGO_URL;
//model
const User=require("./models/user");
const Seller=require("./models/seller");
const Product = require('./models/product');
// Middleware
app.use(express.static(path.join(__dirname, 'public'))); // path সহ লিখুন
app.use('/uploads', express.static('uploads'));


app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true })); // Frontend এর সাথে কুকি শেয়ার করার জন্য

const connect = async () => {
    if (!mongo) {
        console.error("Error: MONGO_URL is missing in .env file!");
        return;
    }
    try {
        await mongoose.connect(mongo);
        console.log('mongoDb is connected');
    } catch (error) {
        console.error('Database connection failure:', error.message);
    }
};
connect();
// MULTER SETUP
// =====================
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },

    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});
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
        res.status(201).json({ message: "Registration Successful!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
        res.json({ 
            success: true, 
            role: user.role, // এই লাইনটা মাস্ট!
            message: "Login Successful" 
        });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});
app.post('/register-seller', async (req, res) => {
    try {
        const { username, email, password, nid, district, productCategory } = req.body;

        // চেক করা যে এই ইমেইল বা NID আগে কেউ ব্যবহার করেছে কি না
        const existingSeller = await Seller.findOne({ $or: [{ email }, { nid }] });
        if (existingSeller) {
            return res.status(400).json({ 
                success: false, 
                message: "This person is already exist" 
            });
        }

        // পাসওয়ার্ড হ্যাশ করা
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
        res.status(201).json({ success: true, message: "Registration Successful!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "সার্ভারে সমস্যা হয়েছে!" });
    }
});
app.post('/seller-login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const seller = await Seller.findOne({ email });

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        const isMatch = await bcrypt.compare(password, seller.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        res.json({
            success: true,
            role: "seller",
            message: "Seller login successful"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});
// Add product
app.post('/add-product', upload.single('image'), async (req, res) => {
    try {
        const { sellerId, name, price, district, size, availability } = req.body;

        const newProduct = new Product({
            sellerId,
            name,
            price,
            district,
            size,
            availability,
            image: req.file.filename // multer saves filename
        });

        await newProduct.save();
        res.json({ success: true, product: newProduct });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get seller products
app.get('/my-products/:sellerId', async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.params.sellerId });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete product
app.delete('/delete-product/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// সার্ভার স্টার্ট
app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
>>>>>>> 7bcd348 (remove env file from tracking)
});