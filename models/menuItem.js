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
  description: {
    type: String
  },
  price: Number,
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
