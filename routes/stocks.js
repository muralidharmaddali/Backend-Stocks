const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const StockRequest = require('../models/StockRequest');

// GET /api/stocks - fetch all stock items
router.get('/', async (req, res) => {
  try {
    const stocks = await Stock.find({});
    res.status(200).json(stocks);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/stocks/request - user requests a stock item
router.post('/request', async (req, res) => {
  const { userId, stockId } = req.body;

  if (!userId || !stockId) {
    return res.status(400).json({ message: 'Missing userId or stockId' });
  }

  try {
    const newRequest = new StockRequest({
      userId,
      stockId,
      status: 'pending',
      requestDate: new Date()
    });

    await newRequest.save();
    res.status(201).json({ message: 'Stock request submitted' });
  } catch (error) {
    console.error('Error submitting stock request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
