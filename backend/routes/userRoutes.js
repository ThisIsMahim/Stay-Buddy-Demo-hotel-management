const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users — all users (admin)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-notificationLog -deviceTokens').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-notificationLog -deviceTokens');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/users/sync — Sync Clerk user
router.post('/sync', async (req, res) => {
  try {
    const { clerkId, email, name, avatar } = req.body;
    let user = await User.findOne({ clerkId });
    if (!user && email) user = await User.findOne({ email });
    
    if (user) {
      if (!user.clerkId) user.clerkId = clerkId;
      if (email === 'mdtohid232020@gmail.com' || email === 'mdtohidbd@gmail.com') user.role = 'ADMIN';
      if (name) user.name = name;
      if (avatar) user.avatar = avatar;
      await user.save();
    } else {
      const role = (email === 'mdtohid232020@gmail.com' || email === 'mdtohidbd@gmail.com') ? 'ADMIN' : 'USER';
      user = await User.create({ clerkId, email, name, avatar, role });
    }
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/users — create user or owner
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (email) {
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        Object.assign(existingUser, req.body);
        await existingUser.save();
        return res.status(200).json(existingUser);
      }
    }
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PATCH /api/users/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/users/:id — general update (verification, subscription, override)
router.patch('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
