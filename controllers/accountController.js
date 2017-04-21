var express = require('express')
var router = express.Router()
// format dates
var formatDate = require('../config/formatDate')
// check
var isLoggedIn = require('../middleware/isLoggedIn')
// models
// var User = require('../models/user')
var Transaction = require('../models/transaction')

// check that the user is logged in to access their account
router.use(isLoggedIn)

// display the user's account
router.route('/')
.get((req, res) => {
  Transaction.find({customer: req.user}).populate('business').populate({path: 'orderedItems', populate: {path: 'menuItem', model: 'MenuItem'}}).exec((err, allTransactions) => {
    if (err) {
      req.flash('error', 'There was an error finding your account. Please try again.')
      return res.redirect('back')
    }
    res.render('account/account', {currentUser: req.user, transactions: allTransactions, formatDate: formatDate})
  })
})
// update the user's profile
.put((req, res) => {
  var update = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    restrictions: req.body.restrictions
  }
  req.user.update(update, (err, data) => {
    if (err) {
      req.flash('error', 'There was an error updating your profile. Please try again.')
      return res.redirect('back')
    }
    req.flash('success', 'Your profile was successfully updated.')
    res.redirect('/account')
  })
})
// delete the user's account
.delete((req, res) => {
  req.user.remove((err, data) => {
    if (err) {
      req.flash('error', 'There was an error updating your profile. Please try again.')
      return res.redirect('back')
    }
    req.logout()
    req.flash('success', 'Your account was successfully deleted.')
    res.redirect('/')
  })
})

module.exports = router
