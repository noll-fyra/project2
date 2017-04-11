var mongoose = require('mongoose')
var User = require('./user')

var MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  subname: {
    type: String
  },
  description: {
    type: String
  },
  price: {
    type: Number
  },
  tag: [{
    type: String
  }],
  course: [{
    type: String
  }],
  ingredients: [{
    type: String
  }],
  recipe: [{
    type: String
  }],
  active: {
    type: Boolean
  },
  special: {
    type: Boolean
  },
  image: {
    type: String
  },
  index: {
    type: Number
  },
  orderedBy: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: User
    }]
  },
  orderedAt: {
    type: Date
  },
  orderCompletedAt: {
    type: Date
  }
})

module.exports = mongoose.model('MenuItem', MenuItemSchema)
