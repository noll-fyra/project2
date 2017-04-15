var express = require('express')
var router = express.Router()
var User = require('../models/user')

// the home page
router.get('/', (req, res) => {
  User.find({}).populate('business').exec((err, data) => {
    if (err) return res.send('There was an error loading Locavorus. Please try again.')
    res.render('index', {allProfiles: data})
  })
})

module.exports = router
