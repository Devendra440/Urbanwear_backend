const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  paymentMethod: String,
  totalPrice: Number,
  cartItems: Array,
  deliveryDate: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
