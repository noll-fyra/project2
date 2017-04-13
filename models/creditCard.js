var mongoose = require('mongoose')

var CreditCardSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    minlength: 14,
    maxlength: 16
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true,
    min: 17,
    max: 99
  }
})

module.exports = mongoose.model('CreditCard', CreditCardSchema)
