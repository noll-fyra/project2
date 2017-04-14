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
    type: String
  },
  menu: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: 'MenuItem'
    }]
  },
  email: {
    type: String,
    lowercase: true,
    match: emailRegex
  },
  phone: {
    type: String
  },
  hours: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Day'
    }]
  },
  description: {
    type: String
  },
  image: {
    type: String
  }
})

module.exports = mongoose.model('Business', BusinessSchema)
