const mongoose = require('mongoose');

const customerRequestSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
});

const CustomerRequest = mongoose.model('CustomerRequest', customerRequestSchema);

module.exports = CustomerRequest;