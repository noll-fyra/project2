var mongoose = require('mongoose')

var emailRegex = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/

var BusinessSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: 'no address listed'
  },
  menu: [{
    type: mongoose.Schema.ObjectId,
    ref: 'MenuItem'
  }],
  email: {
    type: String,
    lowercase: true,
    match: emailRegex
  },
  phone: String,
  website: String,
  hours: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Day'
  }],
  description: {
    type: String,
    default: 'business'
  },
  image: String,
  transactions: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Transaction'
  }],
  cuisine: {
    type: String,
    default: 'food'
  }
})

module.exports = mongoose.model('Business', BusinessSchema)
