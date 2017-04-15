// listen for connections and route orders
const Order = require('../models/order')
const User = require('../models/user')
const formatDate = require('../config/formatDate')

module.exports = function (socket) {
  // make sockets join only the room of the business they are ordering from
  socket.on('join', (room) => {
    console.log('socket joining ' + room)
    socket.join(room)
  })

  // redirect orders to the socket of the relevant business
  socket.on('message', (data) => {
    console.log('sending message to: ' + data.room)
    var newOrder = new Order({
      business: data.room,
      menuItem: data.menuId,
      customer: data.customer,
      date: new Date()
    })
    newOrder.save((err) => {
      if (err) return console.log('There was an error saving the order. Please try again')
      User.findById(newOrder.customer, (err, user) => {
        if (err) return console.log('There was an error saving the order. Please try again')
        io.sockets.in(data.room).emit('order', {menuItem: data.menuName, customer: user.name, date: formatDate(newOrder.date)[1], orderId: newOrder.id})
        console.log(' message is: ' + data.menuName + ' ' + data.customer + ' ' + newOrder.date)
      })
    })
  })

  // remove orders
  socket.on('remove', (data) => {
    console.log('removing order: ' + data)
    Order.findByIdAndRemove(data, (err) => {
      if (err) return console.log('There was an error removing the order. Please try again.')
    })
  })
}
