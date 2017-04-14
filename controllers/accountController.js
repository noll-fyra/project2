var express = require('express')
var router = express.Router()
var isLoggedIn = require('../middleware/isLoggedIn')
var User = require('../models/user')

// check that the user is logged in to access their account
router.use(isLoggedIn)

// display user account
router.get('/', (req, res) => {
  res.render('account/account', {currentUser: req.user})
})

// update user profile
router.put('/', (req, res) => {
  var update = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    restrictions: req.body.restrictions
  }
  User.findByIdAndUpdate(req.user.id, update, (err, data) => {
    if (err) {
      req.flash('error', 'There was an error updating your profile. Please try again.')
      return res.redirect('/account')
    }
    req.flash('success', 'Your profile was successfully updated.')
    res.redirect('/account')
  })
})

// router.get('/password', (req, res) => {
//   res.send('passwordpage')
// })

// update user password
router.put('/password', (req, res) => {
  User.findById(req.user.id, function (err, data) {
    if (err) {
      req.flash('error', 'There was an error updating your account. Please try again.')
      return res.redirect('/account')
    }
    if (!req.body.oldPassword || !req.body.newPassword) {
      req.flash('error', 'Both password fields must be filled in.')
      return res.redirect('/account')
    }
    if (!data.validPassword(req.body.oldPassword)) {
      console.log('bad password')
      req.flash('error', 'Your old password is incorrect. Please try again.')
      return res.redirect('/account')
    }
    var update = {
      password: req.body.newPassword
    }
    User.findByIdAndUpdate(req.user.id, update, (err, data) => {
      if (err) {
        req.flash('error', 'There was an error updating your password. Please try again.')
        return res.redirect('/account')
      }
      req.flash('success', 'Your password was successfully updated.')
      res.redirect('/account')
    })
  })
})

module.exports = router
