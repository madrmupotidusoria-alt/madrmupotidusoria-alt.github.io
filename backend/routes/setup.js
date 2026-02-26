const express = require('express');
const { setupElasticsearchIndex } = require('../services/elasticsearch');

const router = express.Router();

// Initialize Elasticsearch index
router.post('/elasticsearch', async (req, res) => {
  try {
    const result = await setupElasticsearchIndex();
    res.json({
      success: true,
      message: result.created ? 'Index created successfully' : 'Index already exists',
      data: result
    });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
