var mongoose = require('mongoose')

var TransactionSchema = new mongoose.Schema({
  dateFrom: Date,
  dateTo: Date,
  orderedItems: [{
    type: mongoose.Schema.ObjectId,
    ref: 'MenuItem'
  }],
  customers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  table: [{
    type: Number
  }]
})

module.exports = mongoose.model('Transaction', TransactionSchema)
