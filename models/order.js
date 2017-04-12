const mongoose = require('mongoose')

let orderSchema = new mongoose.Schema({
  content: {
    type: String,
    require: true
  },
  businessUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  }
})

let Order = mongoose.model('Order', orderSchema)

module.exports = Order
