const express = require('express')
const router = express.Router()
const formatDate = require('../config/formatDate')
const isLoggedIn = require('../middleware/isLoggedIn')
const hasRegisteredBusiness = require('../middleware/hasRegisteredBusiness')
const Business = require('../models/business')
const User = require('../models/user')
const MenuItem = require('../models/menuItem')
const Order = require('../models/order')
const Transaction = require('../models/transaction')

// list all businesses
router.get('/', (req, res) => {
  Business.find({}, (err, data) => {
    if (err) {
      req.flash('error', 'There was an error fetching the businesses. Please try again.')
      return res.redirect('/business')
    }
    res.render('business/index', {allBusinesses: data})
  })
})

// find specific business
router.get('/:name/:id', (req, res) => {
  Business.findById(req.params.id).populate('menu').exec((err, data) => {
    if (err) {
      req.flash('error', 'There was an error fetching the business. Please try again.')
      return res.redirect('back')
    }
    res.render('business/show', {business: data})
  })
})

// check that the user is logged in to access the following pages
router.use(isLoggedIn)

router.get('/transcheck', (req, res) => {
  Transaction.find({customer: req.user}).populate({path:'orderedItems', populate: {path:'menuItem', model: 'MenuItem'}}).exec((err,data) => {
    console.log(data)
    res.send(data)
  })
})

// for users to send orders and view their transaction
router.get('/:name/:id/send', (req, res) => {
  Business.findById(req.params.id).populate('menu').exec((err, data) => {
    if (err) {
      req.flash('error', 'There was an error fetching the business. Please try again.')
      return res.redirect('back')
    }
    Transaction.find({customer: req.user}).exec((err, transactionData) => {
      if (err) {
        req.flash('error', 'There was an error fetching your details. Please try again.')
        return res.redirect('back')
      }
      console.log(transactionData)
      if (transactionData) {

        res.render('business/send', {chat: req.params.id, name: data.name, menu: data.menu, transaction: transactionData})
      } else {
        res.render('business/send', {chat: req.params.id, name: data.name, menu: data.menu})
      }
    })
  })
})

// register for a business
router.route('/register')
.get((req, res) => {
  res.render('business/register', {currentUserId: req.user.id})
})
.post((req, res) => {
  User.findById(req.body.userId, (err, data) => {
    if (err) {
      req.flash('error', 'There was an error registering your business. Please try again.')
      return res.redirect('back')
    }
    if (data.business) {
      req.flash('error', 'You have already registered a business. Please create another account to register a new one.')
      res.redirect('/auth/signup')
    } else {
      var newBusiness = new Business()
      newBusiness.name = req.body.name
      newBusiness.address = req.body.address
      newBusiness.email = req.body.email
      newBusiness.phone = req.body.phone
      newBusiness.description = req.body.description
      newBusiness.users.push(req.body.userId)
      newBusiness.save((err) => {
        if (err) {
          req.flash('error', 'There was an error registering your business. Please try again.')
          return res.redirect('back')
        }
        User.findByIdAndUpdate(req.body.userId, {business: newBusiness.id}, (err, data) => {
          if (err) {
            req.flash('error', 'There was an error registering your business. Please try again.')
            return res.redirect('back')
          }
          res.redirect('/business/account')
        })
      })
    }
  })
})

// check that the user has registered a business
router.use(hasRegisteredBusiness)

// display the user's business account
router.get('/account', (req, res) => {
  Business.findById(req.user.business).populate('users').exec((err, data) => {
    if (err) {
      req.flash('error', 'There was an error fetching your business account. Please try again.')
      return res.redirect('back')
    }
    res.render('business/account', {currentUser: data})
  })
})

// view and create menu items
router.route('/menu')
.get((req, res) => {
  Business.findById(req.user.business).populate('menu').exec((err, data) => {
    if (err) {
      req.flash('error', 'There was an error fetching your menu. Please try again.')
      return res.redirect('back')
    }
    res.render('business/menu', {menu: data.menu, name: data.name})
  })
})
.post((req, res) => {
  Business.findById(req.user.business, (err, data) => {
    if (err) {
      req.flash('error', 'There was an error finding your businessController. Please try again.')
      return res.redirect('back')
    }
    var newMenuItem = new MenuItem({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      business: req.user.business
    })
    newMenuItem.save((err) => {
      if (err) {
        req.flash('error', 'There was an error adding your menu item. Please try again.')
        return res.redirect('back')
      }
      var id = newMenuItem.id
      Business.findByIdAndUpdate(req.user.business, {$push: {menu: id}}, (err, data) => {
        if (err) {
          req.flash('error', 'There was an error adding your menu item. Please try again.')
          return res.redirect('back')
        }
        res.redirect('/business/menu')
      })
    })
  })
})

// businesses receive orders here
router.get('/:name/:id/receive', (req, res) => {
  if (req.user.business.toString() !== req.params.id) {
    req.flash('error', 'You can only receive orders for your own business.')
    return res.redirect('back')
  }
  Business.findById(req.params.id, (err, business) => {
    if (err) {
      req.flash('error', 'There was an error finding your business. Please try again')
      res.redirect('back')
    }
    Order.find({business: req.params.id}).populate('menuItem').populate('customer').populate('business').sort({date: 'asc'}).exec((err, data) => {
      if (err) {
        req.flash('error', 'There was an error finding your orders. Please try again')
        res.redirect('back')
      }
      res.render('business/receive', {chat: req.params.id, name: business.name, orders: data, formatDate: formatDate})
    })
  })
})

module.exports = router
