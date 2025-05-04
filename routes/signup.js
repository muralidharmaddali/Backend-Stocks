const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust the path if needed

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, password, name, department, idNumber, email, role } = req.body;

  // Basic validation
  if (!username || !password || !name || !department || !idNumber || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      department,
      idNumber,
      email,
      role: role || 'user' // fallback to 'user'
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

module.exports = router;
