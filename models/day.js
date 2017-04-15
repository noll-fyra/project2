var mongoose = require('mongoose')

var dayObject = {
  name: {
    type: String,
    required: true
  },
  inOperation: {
    type: Boolean
  },
  hours: [{
    type: Date
  }]
}

var DaySchema = new mongoose.Schema(dayObject)

module.exports.dayObject = dayObject
module.exports.model = mongoose.model('Day', DaySchema)
