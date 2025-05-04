const mongoose = require('mongoose');

const stockRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  stockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
  status: { type: String, default: 'pending' },
  requestDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StockRequest', stockRequestSchema);
