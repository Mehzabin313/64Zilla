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
    }, 
    district: { 
        type: String,
         required: true 
        }, 
    productCategory: { 
        type: String, 
        required: true 
    }, 
    storeName: {
    type: String,
    default: "My Store"
},
    createdOn: { 
        type: Date,
         default: Date.now 
        }
});

module.exports = mongoose.model("Seller", sellerSchema);