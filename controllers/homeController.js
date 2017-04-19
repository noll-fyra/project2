var express = require('express')
var router = express.Router()
var User = require('../models/user')

// the home page
router.get('/', (req, res) => {
  res.render('index')
})

module.exports = router
