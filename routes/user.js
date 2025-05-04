const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Endpoint to fetch user profile by ID (from URL)
router.get('/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      const user = await User.findById(userId).select('name department idNumber email role');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Get admin user details
router.get('/role/admin', async (req, res) => {
    try {
      const admin = await User.findOne({ role: 'admin' }).select('name email idNumber department');
      if (!admin) return res.status(404).json({ message: 'Admin not found' });
      res.json(admin);
    } catch (err) {
      console.error('Error fetching admin:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

module.exports = router;
