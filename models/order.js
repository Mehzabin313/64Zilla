
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  customer: {
    name: String,
    phone: String,
    address: String
  },

  paymentMethod: String,
  bkashNumber: String,
  transactionId: String,

  paymentStatus: {
    type: String,
    default: "unpaid"
  },

  items: [
    {
      productId: String,
      sellerId: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],

  total: Number,

  status: {
    type: String,
    default: "pending"
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);