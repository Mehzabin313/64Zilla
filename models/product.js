const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sellerId: String,
    name: String,
    price: Number,
    district: String,
    size: String,
    availability: String,
    image: String
});

module.exports = mongoose.model('Product', productSchema);