const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// GET /api/notifications/:recipientId
router.get('/:recipientId', async (req, res) => {
  try {
    const notifs = await Notification.find({ recipientId: req.params.recipientId }).sort({ createdAt: -1 }).lean();
    res.json(notifs.map(n => ({ ...n, id: n._id.toString() })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/notifications/read-all/:recipientId
router.patch('/read-all/:recipientId', async (req, res) => {
  try {
    await Notification.updateMany({ recipientId: req.params.recipientId }, { isRead: true });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
