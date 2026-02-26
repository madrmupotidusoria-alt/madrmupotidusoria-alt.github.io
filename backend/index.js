require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { elasticClient } = require('./config/elasticsearch');
const authRoutes = require('./routes/auth');
const setupRoutes = require('./routes/setup');
const searchRoutes = require('./routes/search');
const simpleAuthRoutes = require('./routes/simple-auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api/setup', setupRoutes);
app.use('/api', searchRoutes);
app.use('/api/simple', simpleAuthRoutes);

// Health check route
app.get('/health', async (req, res) => {
  try {
    // Test Supabase connection
    const { data: supabaseData, error: supabaseError } = await supabase
      .from('scans')
      .select('count')
      .limit(1);

    // Test Elasticsearch connection
    const elasticHealth = await elasticClient.cluster.health();

    const response = {
      status: 'ok',
      elastic: elasticHealth.status === 'green' || elasticHealth.status === 'yellow' ? 'connected' : 'disconnected',
      supabase: supabaseError ? 'disconnected' : 'connected'
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      elastic: 'disconnected',
      supabase: 'disconnected',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
