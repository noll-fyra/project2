const mongoose = require('mongoose')

let orderSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.ObjectId,
    ref: 'MenuItem',
    require: true
  },
  section: String,
  business: {
    type: mongoose.Schema.ObjectId,
    ref: 'Business'
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  orderedAt: Date,
  completed: Boolean,
  completedAt: Date
})

let Order = mongoose.model('Order', orderSchema)

module.exports = Order
