//IMPORTING PACKAGES
const mongoose = require('mongoose');

const invalidCustomerSchema = new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }

});

module.exports = InvalidCustomer = mongoose.model('invalid_customer', invalidCustomerSchema);