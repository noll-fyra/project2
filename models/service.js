var mongoose = require('mongoose')

var ServiceSchema = new mongoose.Schema({
  customer: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  askForMenu: Boolean,
  askforWater: Boolean,
  askForCutleryCrockery: Boolean,
  askForTableClear: Boolean,
  orderedItems: [{
    type: mongoose.Schema.ObjectId,
    ref: 'MenuItem'
  }],
  askForBill: Boolean,
  specialRequest: String,
  requestTimes: [{
    type: Date
  }],
  feedback: String
})

module.exports = mongoose.model('Service', ServiceSchema)
