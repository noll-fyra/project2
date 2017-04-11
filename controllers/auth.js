var express = require('express')
var router = express.Router()

var User = require('../models/user')
var passport = require('../config/ppConfig')

router.get('/signup', function (req, res) {
  res.render('auth/signup')
})

router.post('/signup', function (req, res) {
  User.create({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  }, function (err, createdUser) {
    if (err) {
      // FLASH
      req.flash('error', 'Could not create user account =(')
      res.redirect('/auth/signup')
    } else {
      // FLASH
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created and logged in. You are now a Locavore!'
      })(req, res)
    }
  })
})

router.get('/login', function (req, res) {
  res.render('auth/login')
})

// FLASH
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFLASH: 'Invalid username and/or password',
  successFLASH: 'You have logged in. Welcome to the Matrix.'
}))

router.get('/logout', function (req, res) {
  req.logout()
  // FLASH
  req.flash('success', 'You have logged out. Come back soon!')
  res.redirect('/')
})

module.exports = router
