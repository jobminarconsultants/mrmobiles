// subscriber.js
const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function(value) {
        return /^\S+@\S+\.\S+$/.test(value);
      },
      message: 'Invalid email address'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscriber;