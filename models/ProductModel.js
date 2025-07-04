const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category: String,
  name: String,
  sizes: [String],
  price: Number,
  image: String,
  description: String,
  brand: String,
  material: String,
  rating: Number,
  inStock: Boolean
});

module.exports = mongoose.model('Product', productSchema);
