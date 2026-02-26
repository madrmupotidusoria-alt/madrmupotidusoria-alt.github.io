const express = require('express');
const bcrypt = require('bcryptjs');
const { supabase } = require('../config/supabase');

const router = express.Router();

// Custom user registration without email requirement
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    
    const { username, password } = req.body;
    
    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    console.log('Creating user with username:', username);
    
    // Simple success response for testing
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('Generated user ID:', userId);
    
    res.json({ 
      message: 'User created successfully',
      user: {
        id: userId,
        username: username
      },
      token: 'mock_token_' + userId
    });
    
  } catch (error) {
    console.error('Custom auth error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Custom login without email requirement
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    
    const { username, password } = req.body;
    
    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    console.log('Authenticating user:', username);
    
    // Mock authentication for testing
    if (username === 'test' && password === 'test123') {
      const userId = `user_${Date.now()}`;
      console.log('Mock authentication successful for:', username);
      
      return res.json({
        message: 'Login successful',
        user: {
          id: userId,
          username: username
        },
        token: 'mock_token_' + userId
      });
    }
    
    // Invalid credentials
    console.log('Invalid credentials for:', username);
    return res.status(401).json({ error: 'Invalid credentials' });
    
  } catch (error) {
    console.error('Custom login error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;
