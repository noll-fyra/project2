var mongoose = require('mongoose')

var MenuItemSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.ObjectId,
    ref: 'Business'
  },
  name: {
    type: String,
    required: true
  },
  subname: String,
  description: String,
  price: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  tag: [{String}],
  course: [{String}],
  ingredients: [{String}],
  recipe: [{String}],
  isActive: Boolean,
  isSpecial: Boolean,
  image: String,
  index: Number
})

module.exports = mongoose.model('MenuItem', MenuItemSchema)
