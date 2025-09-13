const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config(); // load .env if using process.env.MONGO_URI

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dsa_sheet')
  .then(async () => {
    const hash = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: hash,
      role: 'admin',
    });
    console.log('Admin created:', admin);
    process.exit();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
