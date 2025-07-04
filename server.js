require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Product = require('./models/ProductModel');
const Order = require('./models/OrderModel');

const app = express();

// Middleware
app.use(cors()); // In production, specify origin: 'https://your-netlify-app.netlify.app'
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes

// Root test
app.get('/', (req, res) => {
  res.send('Urbanwear backend is live 🎉');
});

// Register User
app.post('/api/users/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Registration failed', error: err.message });
  }
});

// Login User
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// Get All Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});

// Add Product
app.post('/api/products', async (req, res) => {
  const { name, price, image, brand, material, sizes, rating, inStock, category, description } = req.body;
  try {
    const newProduct = new Product({
      name, price, image, brand, material, sizes, rating, inStock, category, description
    });
    await newProduct.save();
    res.json({ message: 'Product added successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to add product', error: err.message });
  }
});

// Save Order
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json({ message: 'Order saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save order', error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at https://urbanwear-backend.onrender.com`);
});
