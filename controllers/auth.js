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
  if (req.isAuthenticated()) {
    req.flash('error', 'you have logged in already')
    return res.redirect('/account')
  }
  res.render('auth/login')
})

router.get('/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/auth/login/',
  successRedirect: '/',
  successFlash: 'connected to fb' }),
  function (res, req) {
    res.redirect('/')
  }
)

router.get('/login/facebook', passport.authenticate('facebook'))

// FLASH
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid username and/or password',
  successFlash: 'You have logged in. Welcome to the Matrix.'
}))

router.get('/logout', function (req, res) {
  req.logout()
  // FLASH
  req.flash('success', 'You have logged out. Come back soon!')
  res.redirect('/')
})

module.exports = router
