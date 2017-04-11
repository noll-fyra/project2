var mongoose = require('mongoose')
var MenuItem = require('./menuItem')
var User = require('./user')

var TransactionSchema = new mongoose.Schema({
  dateFrom: {
    type: Date
  },
  dateTo: {
    type: Date
  },
  orderedItems: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: MenuItem
    }]
  },
  customers: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: User
    }]
  },
  table: {
    type: [{
      type: Number
    }]
  }
})

module.exports = mongoose.model('Transaction', TransactionSchema)
