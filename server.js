const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user'); // ✅ Import user routes

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Models
const User = require('./models/User');
const Stock = require('./models/Stock');
const StockRequest = require('./models/StockRequest');

// Auth Routes
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.password !== password) return res.status(400).json({ message: 'Incorrect password' });
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/signup', async (req, res) => {
    const { username, password, name, department, idNumber, email } = req.body;
  
    // Basic validation
    if (!username || !password || !name || !department || !idNumber || !email)
      return res.status(400).json({ message: 'All fields are required' });
  
    try {
      // Check if username or email already exists
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) return res.status(409).json({ message: 'Username or email already exists' });
  
      const newUser = new User({
        username,
        password,
        name,
        department,
        idNumber,
        email,
        role: 'user' // ✅ default role
      });
  
      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// Use User Routes
app.use('/api/users', userRoutes); // ✅ Mount the user routes

// Stocks Routes
app.get('/api/stocks', async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stocks' });
  }
});

app.post('/api/stocks/request', async (req, res) => {
  const { userId, stockId } = req.body;
  if (!userId || !stockId) return res.status(400).json({ message: 'Missing userId or stockId' });

  try {
    const newRequest = new StockRequest({
      userId,
      stockId,
      status: 'pending',
      requestDate: new Date()
    });
    await newRequest.save();
    res.status(201).json({ message: 'Request submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating request' });
  }
});

// Admin Routes
app.get('/api/admin/pending-requests', async (req, res) => {
  try {
    const requests = await StockRequest.find({ status: 'pending' })
      .populate('userId', 'username')
      .populate('stockId', 'name');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending requests' });
  }
});

app.post('/api/admin/accept-request', async (req, res) => {
  const { requestId } = req.body;
  if (!requestId) return res.status(400).json({ message: 'Request ID is required' });

  try {
    const request = await StockRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'approved';
    await request.save();
    res.status(200).json({ message: 'Request approved' });
  } catch (error) {
    res.status(500).json({ message: 'Error approving request' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


