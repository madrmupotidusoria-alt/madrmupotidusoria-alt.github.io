const express = require('express');
const rateLimit = require('express-rate-limit');
const { authenticateUser } = require('../middleware/auth');
const { searchBreaches } = require('../services/search');

const router = express.Router();

// Rate limiting for search endpoint
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  message: { error: 'Too many search requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Search endpoint
router.post('/search', authenticateUser, searchLimiter, async (req, res) => {
  try {
    const { query, searchType, page = 1 } = req.body;

    // Validate inputs
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required and must be a string' });
    }

    if (!searchType || typeof searchType !== 'string') {
      return res.status(400).json({ error: 'Search type is required and must be a string' });
    }

    const validTypes = ['email', 'username', 'ip', 'phone'];
    if (!validTypes.includes(searchType)) {
      return res.status(400).json({ error: 'Invalid search type. Must be: email, username, ip, or phone' });
    }

    if (query.trim().length === 0) {
      return res.status(400).json({ error: 'Query cannot be empty' });
    }

    if (query.length > 256) {
      return res.status(400).json({ error: 'Query too long (max 256 characters)' });
    }

    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: 'Page must be a positive integer' });
    }

    // Perform search
    const results = await searchBreaches(query.trim(), searchType, pageNum, req.user.id);

    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Search route error:', error);
    
    if (error.message === 'Invalid search type') {
      return res.status(400).json({ error: error.message });
    }
    
    if (error.message === 'Query cannot be empty' || error.message === 'Query too long') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
