const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
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
        enum: ['user', 'seller', 'admin'], 
        default: 'user' 
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("user", userSchema);