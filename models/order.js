const mongoose = require('mongoose')

let orderSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    require: true
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    require: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  date: {
    type: Date
  },
  table: {
    type: Number
  }
})

let Order = mongoose.model('Order', orderSchema)

module.exports = Order
