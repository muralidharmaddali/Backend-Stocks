const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  description: String
});

module.exports = mongoose.model('Stock', stockSchema);
