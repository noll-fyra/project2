var mongoose = require('mongoose')

var DaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  inOperation: {
    type: Boolean
  },
  hours: {
    type: [{
      type: Date
    }]
  }
})

module.exports = mongoose.model('Day', DaySchema)
