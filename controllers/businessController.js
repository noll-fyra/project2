const express = require('express')
const router = express.Router()
const formatDate = require('../config/formatDate')
// handle images
const multer = require('multer')
const upload = multer({dest: './uploads/'})
const cloudinary = require('cloudinary')
cloudinary.config({
  cloud_name: 'noll-fyra',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
// checks
const isLoggedIn = require('../middleware/isLoggedIn')
const hasRegisteredBusiness = require('../middleware/hasRegisteredBusiness')
// models
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
// search for businesses with a specific term
.post((req, res) => {
  var search = new RegExp('^((.*?)(' + req.body.search + ')(.*?))$', 'i')
  Business.find().or([{name: { $regex: search }}, {description: { $regex: search }}, {cuisine: { $regex: search }}]).exec((err, data) => {
    if (err) {
      // req.flash('error', 'There was an error fetching the businesses. Please try again.')
      return res.redirect('/business')
    }
    res.render('business/index', {allBusinesses: data})
  })
})
// update the business' profile
.put((req, res) => {
  var update = {
    name: req.body.name,
    address: req.body.address,
    email: req.body.email,
    phone: req.body.phone,
    website: req.body.website,
    description: req.body.description,
    cuisine: req.body.cuisine
  }
  Business.findByIdAndUpdate(req.user.business, update, (err, data) => {
    if (err) {
      req.flash('error', 'There was an error updating your business\' profile. Please try again.')
      return res.redirect('back')
    }
    req.flash('success', 'Your business\' profile was successfully updated.')
    res.redirect('/business/dashboard')
  })
})
// deregister the user's business
.delete((req, res) => {
  Business.findByIdAndRemove(req.user.business, (err, data) => {
    if (err) {
      req.flash('error', 'There was an error deregistering your business. Please try again.')
      return res.redirect('back')
    }
    User.findByIdAndUpdate(req.user, {business: null}, (err, data) => {
      if (err) {
        req.flash('error', 'There was an error deregistering your business. Please try again.')
        return res.redirect('back')
      }
      req.flash('success', 'Your business was successfully deregistered.')
      res.redirect('/business')
    })
  })
})

// find specific business
router.get('/find/:name/:id', (req, res) => {
  Business.findById(req.params.id).populate('menu').exec((err, data) => {
    if (err) {
      // req.flash('error', 'There was an error fetching the business. Please try again.')
      return res.redirect('back')
    }
    res.render('business/show', {business: data, cloud: cloudinary.image})
  })
})

// check that the user is logged in to access the following pages
router.use(isLoggedIn)

// for users to send orders and view their transaction
router.get('/find/:name/:id/order', (req, res) => {
  Business.findById(req.params.id).populate('menu').exec((err, business) => {
    if (err) {
      // req.flash('error', 'There was an error fetching the business. Please try again.')
      return res.redirect('back')
    }
    User.findById(req.user).populate({path: 'transaction', populate: {path: 'orderedItems', populate: {path: 'menuItem', model: 'MenuItem'}}}).exec((err, user) => {
      if (err) {
        // req.flash('error', 'There was an error fetching your details. Please try again.')
        return res.redirect('back')
      }
      // if the user has no active transaction, create one
      if (!user.transaction) {
        var transaction = new Transaction()
        transaction.dateFrom = new Date()
        transaction.customer = req.user
        transaction.business = req.params.id
        transaction.isActive = true
        // save the transaction and update the user model as well
        transaction.save((err, newTransactionData) => {
          if (err) {
            req.flash('error', 'There was an error creating the transaction. Please try again.')
            return res.redirect('back')
          }
          User.findByIdAndUpdate(user.id, {transaction: transaction.id}, (err, data) => {
            if (err) {
              req.flash('error', 'There was an error updating the customer\'s transaction. Please try again.')
              return res.redirect('back')
            }
            res.render('business/order', {chat: req.params.id, name: business.name, menu: business.menu, transaction: newTransactionData, cloud: cloudinary.image})
          })
        })
        // if the user has an active transaction with another business, change the business and remove all ordered items
      } else if (user.transaction.business.toString() !== req.params.id) {
        Transaction.findByIdAndUpdate(user.transaction, {$set: {business: req.params.id, orderedItems: []}}, (err, changedTransaction) => {
          if (err) {
            req.flash('error', 'There was an error updating the transaction. Please try again.')
            return res.redirect('back')
          }
          res.render('business/order', {chat: req.params.id, name: business.name, menu: business.menu, transaction: transaction, cloud: cloudinary.image})
        })
      } else {
        // render the active transaction
        res.render('business/order', {chat: req.params.id, name: business.name, menu: business.menu, transaction: user.transaction, cloud: cloudinary.image})
      }
    })
  })
})

// thank you screen for paying the bill
router.post('/bill', (req, res) => {
  User.findById(req.body.id).populate('transaction').exec((err, user) => {
    if (err) {
      // req.flash('error', 'There was an error fetching the user. Please try again.')
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

// template to register for a business
router.route('/register')
.get((req, res) => {
  res.render('business/register', {currentUserId: req.user.id})
})
// create the business
.post((req, res) => {
  User.findById(req.body.userId, (err, user) => {
    if (err) {
      req.flash('error', 'There was an error registering your business. Please try again.')
      return res.redirect('back')
    }
    if (user.business) {
      req.flash('error', 'You have already registered a business. Please create another account to register a new one.')
      res.redirect('/auth/signup')
    } else {
      var newBusiness = new Business()
      newBusiness.name = req.body.name
      newBusiness.address = req.body.address
      newBusiness.email = req.body.email
      newBusiness.phone = req.body.phone
      newBusiness.website = req.body.website
      newBusiness.description = req.body.description
      newBusiness.cuisine = req.body.cuisine
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
  Business.findById(req.user.business).populate('menu').exec((err, business) => {
    if (err) {
      // req.flash('error', 'There was an error fetching your business dashboard. Please try again.')
      return res.redirect('back')
    }
    Transaction.find({business: req.user.business}).populate('customer').populate({path: 'orderedItems', populate: {path: 'menuItem', model: 'MenuItem'}}).exec((err, transactions) => {
      if (err) {
        // req.flash('error', 'There was an error finding your business. Please try again')
        res.redirect('back')
      }
      res.render('business/dashboard', {business: business, transactions: transactions, formatDate: formatDate, cloud: cloudinary.image})
    })
  })
})

router.put('/transaction/:id', (req, res) => {
  console.log(req.params.id)
  Transaction.findByIdAndUpdate(req.params.id, {isActive: false}, (err, data) => {
    if (err) {
      // req.flash('error', 'There was an error finding your transaction. Please try again.')
      return res.redirect('back')
    }
    res.redirect('/business/dashboard')
  })
})

// view the menu
router.route('/menu')
// create menu items
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
        res.redirect('/business/dashboard')
      })
    })
  })
})
// update the menu item
.put((req, res) => {
  console.log(req.body)
  var update = {
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price)
  }
  MenuItem.findByIdAndUpdate(req.body.id, update, (err, item) => {
    console.log(item)
    if (err) {
      req.flash('error', 'There was an error updating the menu item. Please try again.')
      return res.redirect('back')
    }
    req.flash('success', 'Your menu item was successfully updated.')
    res.redirect('/business/dashboard')
  })
})
// delete the menu item
.delete((req, res) => {
  Business.findByIdAndUpdate(req.user.business, {$pull: {menu: req.body.id}}, (err, data) => {
    if (err) {
      req.flash('error', 'There was an error finding your business. Please try again.')
      return res.redirect('back')
    }
    req.flash('success', 'Your menu item was successfully removed.')
    res.redirect('/business/dashboard')
  })
})

// businesses receive orders here
router.get('/service', (req, res) => {
  Business.findById(req.user.business, (err, business) => {
    if (err) {
      req.flash('error', 'There was an error finding your business. Please try again')
      res.redirect('back')
    }
    Order.find({business: business.id}).populate('menuItem').populate('customer').populate('business').sort({date: 'asc'}).exec((err, orders) => {
      if (err) {
        // req.flash('error', 'There was an error finding your orders. Please try again')
        res.redirect('back')
      }
      res.render('business/service', {chat: business.id, name: business.name, orders: orders, formatDate: formatDate})
    })
  })
})

// add menu images
router.route('/image/menu/:id')
// add image template
.get((req, res) => {
  MenuItem.findById(req.params.id, (err, item) => {
    if (err) {
      req.flash('error', 'There was an error finding your menu item. Please try again')
      res.redirect('back')
    }
    res.render('business/menuImage', {item: item, cloud: cloudinary.image})
  })
})
// add images
.put(upload.single('image'), (req, res) => {
  console.log('5', req.file.path)
  cloudinary.uploader.upload(req.file.path, (result) => {
    MenuItem.findByIdAndUpdate(req.params.id, {image: result.url}, (err, item) => {
      if (err) {
        req.flash('error', 'There was an error finding your menu item. Please try again')
        res.redirect('back')
      }
      res.redirect('/business/dashboard')
    })
  })
})

// add menu images
router.route('/image/business/:id')
// add image template
.get((req, res) => {
  Business.findById(req.params.id, (err, item) => {
    if (err) {
      req.flash('error', 'There was an error finding your menu item. Please try again')
      res.redirect('back')
    }
    res.render('business/businessImage', {item: item, cloud: cloudinary.image})
  })
})
// add images
.put(upload.single('image'), (req, res) => {
  console.log('5', req.file.path)
  cloudinary.uploader.upload(req.file.path, (result) => {
    Business.findByIdAndUpdate(req.params.id, {image: result.url}, (err, item) => {
      if (err) {
        req.flash('error', 'There was an error finding your menu item. Please try again')
        res.redirect('back')
      }
      res.redirect('/business/dashboard')
    })
  })
})

module.exports = router
