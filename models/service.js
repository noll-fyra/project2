var mongoose = require('mongoose')
var MenuItem = require('./menuItem')
var User = require('./user')

var ServiceSchema = new mongoose.Schema({
  customer: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: User
    }]
  },
  askForMenu: {
    type: Boolean
  },
  askforWater: {
    type: Boolean
  },
  askForCutleryCrockery: {
    type: Boolean
  },
  askForTableClear: {
    type: Boolean
  },
  orderedItems: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: MenuItem
    }]
  },
  askForBill: {
    type: Boolean
  },
  specialRequest: {
    type: String
  },
  requestTimes: {
    type: [{
      type: Date
    }]
  },
  feedback: {
    type: String
  }
})

module.exports = mongoose.model('Service', ServiceSchema)
