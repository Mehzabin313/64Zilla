/*const mongoose = require("mongoose");

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

module.exports = mongoose.model("Seller", sellerSchema);*/
const mongoose = require("mongoose");

const sellerSchema = mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: { 
        type: String, 
        required: true,
        select: false
    },
    role: { 
        type: String,
        enum: ['seller'],
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
    createdAt: { 
        type: Date,
        default: Date.now 
    }
});

sellerSchema.index({ email: 1 }, { unique: true });
sellerSchema.index({ nid: 1 }, { unique: true });

module.exports = mongoose.model("Seller", sellerSchema);