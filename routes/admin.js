const express = require('express');
const router = express.Router();
const StockRequest = require('../models/StockRequest');
const Stock = require('../models/Stock');
const User = require('../models/User');

// GET /api/admin/pending-requests - list all pending stock requests
router.get('/pending-requests', async (req, res) => {
  try {
    const requests = await StockRequest.find({ status: 'pending' })
      .populate('userId', 'username')
      .populate('stockId', 'name');

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/accept-request - accept and update a request
router.post('/accept-request', async (req, res) => {
  const { requestId } = req.body;

  if (!requestId) {
    return res.status(400).json({ message: 'Request ID is required' });
  }

  try {
    const request = await StockRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'approved';
    await request.save();

    res.status(200).json({ message: 'Request approved' });
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
