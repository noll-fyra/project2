// listen for connections and route orders
const Order = require('../models/order')
const User = require('../models/user')
const Transaction = require('../models/transaction')
const formatDate = require('../config/formatDate')

module.exports = function (socket) {
  // make sockets join only the room of the business they are ordering from
  socket.on('join', (room) => {
    console.log('socket joining ' + room)
    socket.join(room)
  })

  // redirect menu orders to the socket of the relevant business
  socket.on('menuOrder', (data) => {
    console.log('sending message to: ' + data.room)
    User.findById(data.customer).populate('transaction').exec((err, user) => {
      if (err) return console.log('There was an error finding the customer. Please try again')
      // create the order
      var newOrder = new Order({
        section: data.type,
        business: data.room,
        menuItem: data.menuId,
        customer: data.customer,
        orderedAt: new Date(),
        completed: false
      })
      // save the order
      newOrder.save((err, newOrderData) => {
        console.log(newOrderData)
        if (err) return console.log('There was an error creating the order. Please try again')
        // send the order to the business
        io.sockets.in(data.room).emit('order', {section: data.section, menuItem: data.menuName, customer: user.name, date: formatDate(newOrder.orderedAt)[1], orderId: newOrder.id})
        console.log(' message is: ' + data.menuName + ' ' + data.customer + ' ' + newOrder.orderedAt)
        // create transaction if it's the first order
        if (!user.transaction) {
          var transaction = new Transaction()
          transaction.dateFrom = new Date()
          transaction.customer = user.id
          transaction.business = data.room
          transaction.orderedItems.push(newOrderData.id)
          transaction.isActive = true
          transaction.total = data.total
          // save the transaction and update the user model as well
          transaction.save((err, newTransactionData) => {
            console.log(newTransactionData)
            if (err) return console.log('There was an error creating the transaction. Please try again')
            User.findByIdAndUpdate(user.id, {transaction: transaction.id}, (err, data) => {
              if (err) return console.log('There was an error updating the customer\'s transaction. Please try again')
            })
          })
          // update the transaction if it's not the first order
        } else {
          Transaction.findByIdAndUpdate(user.transaction, {$push: {orderedItems: newOrder.id}}, (err, transaction) => {
            if (err) return console.log('There was an error updating the transaction. Please try again')
          })
        }
      })
    })
  })

// update the transaction total
  socket.on('orderTotal', (data) => {
    console.log('updating the transaction total')
    User.findById(data.customer, (err, user) => {
      if (err) return console.log('There was an error finding the customer. Please try again')
      Transaction.findByIdAndUpdate(user.transaction, {total: data.total}, (err, transaction) => {
        if (err) return console.log('There was an error updating the transaction total. Please try again')
      })
    })
  })

  // redirect service orders to the socket of the relevant business
  socket.on('service', (data) => {
    console.log('asking for service by: ' + data.room)
        // send the service request to the business
    User.findById(data.customer, (err, customer) => {
      if (err) return console.log('There was an error finding the customer. Please try again')
      io.sockets.in(data.room).emit('serviceRequest', {section: data.section, serviceItem: data.serviceItem, customer: customer.name, date: formatDate(new Date())[1]})
      console.log(' message is: ' + formatDate(new Date())[1] + ' ' + customer.name + ' ' + data.serviceItem)
    })
  })

  // complete orders
  socket.on('remove', (data) => {
    console.log('removing order: ' + data)
    Order.findByIdAndUpdate(data, {completed: true, completedAt: new Date()}, (err, data) => {
      if (err) return console.log('There was an error removing the order. Please try again.')
    })
  })
}
