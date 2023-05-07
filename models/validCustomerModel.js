//IMPORTING PACKAGES
const mongoose = require('mongoose');

const ValidCustomerSchema = new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }

});

module.exports = ValidCustomer = mongoose.model('valid_customer', ValidCustomerSchema);