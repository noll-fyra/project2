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
router.route('/')
.get((req, res) => {
  Business.find({}, (err, data) => {
    if (err) {
      req.flash('error', 'There was an error fetching the businesses. Please try again.')
      return res.redirect('/business')
    }
    res.render('business/index', {allBusinesses: data})
  })
})
// find specific businesses
.post((req, res) => {
  var search = new RegExp('^(.*(' + req.body.search + ').*)$', 'i')
  Business.find().or([{name: { $regex: search }}, {description: { $regex: search }}]).exec((err, data) => {
    if (err) {
      req.flash('error', 'There was an error fetching the businesses. Please try again.')
      return res.redirect('/business')
    }
    res.render('business/index', {allBusinesses: data})
  })
})

// find specific business
router.get('/find/:name/:id', (req, res) => {
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

// for users to send orders and view their transaction
router.get('/find/:name/:id/order', (req, res) => {
  Business.findById(req.params.id).populate('menu').exec((err, data) => {
    if (err) {
      req.flash('error', 'There was an error fetching the business. Please try again.')
      return res.redirect('back')
    }

    User.findById(req.user).populate({path: 'transaction', populate: {path: 'orderedItems', populate: {path: 'menuItem', model: 'MenuItem'}}})

    User.findById(req.user).populate({path: 'transaction', populate: {path: 'orderedItems', populate: {path: 'menuItem', model: 'MenuItem'}}}).exec((err, user) => {
      if (err) {
        req.flash('error', 'There was an error fetching your details. Please try again.')
        return res.redirect('back')
      }
      console.log(user)
      if (user.transaction) {
        res.render('business/order', {chat: req.params.id, name: data.name, menu: data.menu, transaction: user.transaction})
      } else {
        res.render('business/order', {chat: req.params.id, name: data.name, menu: data.menu})
      }
    })
  })
})

// thank you screen for paying the bill
router.post('/bill/:id', (req, res) => {
  User.findById(req.params.id).populate('transaction').exec((err, user) => {
    if (err) {
      req.flash('error', 'There was an error fetching the user. Please try again.')
      return res.redirect('back')
    }
    Transaction.findByIdAndUpdate(user.transaction, {$set: {isActive: false, dateTo: new Date()}}, (err, transaction) => {
      if (err) {
        req.flash('error', 'There was an error fetching the transaction. Please try again.')
        return res.redirect('back')
      }
      User.findByIdAndUpdate(user.id, {transaction: null}, (err, user) => {
        if (err) {
          req.flash('error', 'There was an error fetching the user. Please try again.')
          return res.redirect('back')
        }
        res.render('business/bill', {user: user})
      })
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
          res.redirect('/business/dashboard')
        })
      })
    }
  })
})

// check that the user has registered a business
router.use(hasRegisteredBusiness)

// display the user's business dashboard
router.get('/dashboard', (req, res) => {
  Business.findById(req.user.business).populate('users').exec((err, data) => {
    if (err) {
      req.flash('error', 'There was an error fetching your business dashboard. Please try again.')
      return res.redirect('back')
    }
    res.render('business/dashboard', {business: data})
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
      section: req.body.section,
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

// form to create new menu items
router.get('/menu/new', (req, res) => {
  Business.findById(req.user.business).exec((err, data) => {
    if (err) {
      req.flash('error', 'There was an error fetching your business. Please try again.')
      return res.redirect('back')
    }
    res.render('business/newMenu', {name: data.name})
  })
})

// businesses receive orders here
router.get('/service', (req, res) => {
  Business.findById(req.user.business, (err, business) => {
    if (err) {
      req.flash('error', 'There was an error finding your business. Please try again')
      res.redirect('back')
    }
    Order.find({business: business.id}).populate('menuItem').populate('customer').populate('business').sort({date: 'asc'}).exec((err, data) => {
      if (err) {
        req.flash('error', 'There was an error finding your orders. Please try again')
        res.redirect('back')
      }
      res.render('business/service', {chat: business.id, name: business.name, orders: data, formatDate: formatDate})
    })
  })
})

// check transaction history
router.get('/transactions', (req, res) => {
  Transaction.find({business: req.user.business}).exec((err, transactions) => {
    if (err) {
      req.flash('error', 'There was an error finding your business. Please try again')
      res.redirect('back')
    }
    res.render('business/transactions', {transactions: transactions})
  })
})

module.exports = router
