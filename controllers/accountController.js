var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must log in to view your account')
    return res.redirect('/auth/login')
  }
  res.render('account/account', {currentUser: req.user})
})

module.exports = router
