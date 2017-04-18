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
  address: String,
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
  description: String,
  image: String,
  transactions: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Transaction'
  }],
  cuisine: String
})

module.exports = mongoose.model('Business', BusinessSchema)
