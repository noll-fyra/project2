var mongoose = require('mongoose')

var TransactionSchema = new mongoose.Schema({
  dateFrom: Date,
  dateTo: Date,
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  business: {
    type: mongoose.Schema.ObjectId,
    ref: 'Business'
  },
  orderedItems: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Order'
  }],
  isActive: Boolean,
  total: Number
})

module.exports = mongoose.model('Transaction', TransactionSchema)
