const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  // ... existing fields ...
  images: [{
    type: String,
    required: false
  }],
  // ... existing fields ...
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema); 