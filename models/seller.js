const mongoose = require("mongoose");

const sellerSchema = mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true,
         unique: true 
        },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String,
         default: 'seller' 
        },
    nid: { 
        type: String, 
        required: true, 
        unique: true 
    }, // NID ইউনিক হতে হবে
    district: { 
        type: String,
         required: true 
        }, // জেলা
    productCategory: { 
        type: String, 
        required: true 
    }, // কী বিক্রি করবে
    createdOn: { 
        type: Date,
         default: Date.now 
        }
});

module.exports = mongoose.model("Seller", sellerSchema);