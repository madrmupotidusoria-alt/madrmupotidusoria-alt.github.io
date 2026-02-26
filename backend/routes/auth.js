const express = require('express');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Protected route to get user info
router.get('/me', authenticateUser, (req, res) => {
  try {
    const user = {
      id: req.user.id,
      email: req.user.email,
      created_at: req.user.created_at,
      user_metadata: req.user.user_metadata,
      app_metadata: req.user.app_metadata
    };

    res.json({ user });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

module.exports = router;
