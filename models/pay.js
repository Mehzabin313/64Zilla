const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  transactionId: String,
  customer: {
    name: String,
    phone: String,
    address: String
  },
  items: Array,
  total: Number,
  status: { type: String, default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);