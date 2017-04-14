var express = require('express')
var router = express.Router()
var Business = require('../models/business')
var User = require('../models/user')

router.get('/', function (req, res) {
  Business.find({}, (err, data) => {
    if (err) return console.log(err)
    res.render('business/index', {allBusinesses: data})
  })
})

router.get('/account', (req, res) => {
  console.log(req.user.business)
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must log in to view your business account')
    return res.redirect('/auth/login')
  }
  if (!req.user.business) {
    req.flash('error', 'You must register a business first (Account > Advanced > Register a business)')
    return res.redirect('/account')
  }
  res.render('business/account', {currentUser: req.user})
})

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
          res.redirect('/business')
        })
      })
    }
  })
})

router.get('/:name/:id', function (req, res) {
  Business.findById(req.params.id, (err, data) => {
    if (err) return console.log(err)
    res.render('business/business', {business: data})
  })
})

router.get('/:name/:id/receive', function (req, res) {
  res.render('business/receive', {chat: req.params.id, name: req.params.name})
})

router.get('/:name/:id/send', function (req, res) {
  res.render('business/send', {chat: req.params.id, name: req.params.name})
})

module.exports = router
