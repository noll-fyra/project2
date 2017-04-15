var express = require('express')
var router = express.Router()
var passport = require('../config/passport')
var isLoggedIn = require('../middleware/isLoggedIn')
var User = require('../models/user')

// send the user to the sign up page and create their account
router.route('/signup')
.get((req, res) => {
  res.render('auth/signup')
})
.post((req, res) => {
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }, (err, createdUser) => {
    if (err) {
      req.flash('error', 'Could not create user account. Please try again.')
      res.redirect('/auth/signup')
    } else {
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created and logged in. You are now a Locavore!'
      })(req, res)
    }
  })
})

// send the user to the login page
router.route('/login')
.get((req, res) => {
  if (req.isAuthenticated()) {
    req.flash('error', 'You are already logged in.')
    return res.redirect('/account')
  }
  res.render('auth/login')
})
.post(passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid username and/or password.',
  successFlash: 'You have logged in. Welcome back!'
}))

// check if the user is logged in
router.use(isLoggedIn)

// log the user out
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', 'You have successfully logged out. Come back soon!')
  res.redirect('/')
})

// router.get('/facebook/callback',
// passport.authenticate('facebook', { failureRedirect: '/auth/login/',
//   successRedirect: '/',
//   successFlash: 'connected to fb' }),
//   (res, req) => {
//     res.redirect('/')
//   }
// )
//
// router.get('/login/facebook', passport.authenticate('facebook'))

module.exports = router
