var express = require('express')
var router = express.Router()
var isLoggedIn = require('../middleware/isLoggedIn')
var hasRegisteredBusiness = require('../middleware/hasRegisteredBusiness')
var Business = require('../models/business')
var User = require('../models/user')
var MenuItem = require('../models/menuItem')

// list all businesses
router.get('/', function (req, res) {
  Business.find({}, (err, data) => {
    if (err) return console.log(err)
    res.render('business/index', {allBusinesses: data})
  })
})

// find specific business
router.get('/:name/:id', function (req, res) {
  Business.findById(req.params.id).populate('menu').exec((err, data) => {
    if (err) return console.log(err)
    res.render('business/business', {business: data})
  })
})

// for users to send
router.get('/:name/:id/send', function (req, res) {
  Business.findById(req.params.id).populate('menu').exec((err, data) => {
    if (err) return console.log(err)
    res.render('business/send', {chat: req.params.id, name: data.name, menu: data.menu})
  })
})

// check that the user is logged in to access their account
router.use(isLoggedIn)

// check that the user has registered a business
router.use(hasRegisteredBusiness)

// display the user's business account
router.get('/account', (req, res) => {
  Business.findById(req.user.business).populate('users').exec((err, data) => {
    if (err) return console.log(err)
    res.render('business/account', {currentUser: data})
  })
})

// register for a business
router.route('/register')
.get((req, res) => {
  res.render('business/register', {currentUserId: req.user.id})
})
.post((req, res) => {
  User.findById(req.body.userId, (err, data) => {
    if (err) return console.log(err)
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
        if (err) return console.log(err)
        User.findByIdAndUpdate(req.body.userId, {business: newBusiness.id}, (err, data) => {
          if (err) return console.log(err)
          res.redirect('/business/account')
        })
      })
    }
  })
})

router.get('/menu', (req, res) => {
  Business.findById(req.user.business).populate('menu').exec((err, data) => {
    if (err) return console.log(err)
    res.render('business/menu', {menu: data.menu, name: data.name})
  })
})

router.post('/menu', (req, res) => {
  Business.findById(req.user.business, (err, data) => {
    if (err) return console.log(err)
    var newMenuItem = new MenuItem({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      business: req.user.business
    })
    newMenuItem.save((err) => {
      if (err) return console.log(err)
      var id = newMenuItem.id
      Business.findByIdAndUpdate(req.user.business, {$push: {menu: id}}, (err, data) => {
        if (err) return console.log(err)
        res.redirect('/business/menu')
      })
    })
  })
})

// for business to receive
router.get('/:name/:id/receive', function (req, res) {
  res.render('business/receive', {chat: req.params.id, name: req.params.name})
})

module.exports = router
