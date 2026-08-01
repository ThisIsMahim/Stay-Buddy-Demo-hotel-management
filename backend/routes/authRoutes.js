const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/admin/login
// @desc    Auth admin & get token (auto-create if missing)
// @access  Public
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).select('+password');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'password123', salt);

    if (user) {
      // Ensure role is ADMIN and update password if needed
      user.role = 'ADMIN';
      user.password = hashedPassword;
      await user.save();
    } else {
      // Create new Admin user on the fly
      user = await User.create({
        name: email ? email.split('@')[0] : 'Admin User',
        email: email,
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/owner/login
// @desc    Auth owner & get token (auto-create/update if missing)
// @access  Public
router.post('/owner/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email }).select('+password');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'password123', salt);

    if (user) {
      // Allow existing user to log in as OWNER, update password
      if (user.role !== 'ADMIN') {
        user.role = 'OWNER';
      }
      user.password = hashedPassword;
      await user.save();
    } else {
      // Create new Owner user on the fly
      user = await User.create({
        name: email ? email.split('@')[0] : 'Hotel Owner',
        email: email,
        password: hashedPassword,
        role: 'OWNER',
        status: 'ACTIVE',
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
