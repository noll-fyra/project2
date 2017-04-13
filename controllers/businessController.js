var express = require('express')
var router = express.Router()
var Business = require('../models/business')

router.get('/', function (req, res) {
  Business.find({}, (err, data) => {
    if (err) return console.log(err)
    res.render('business/index', {allBusinesses: data})
  })
})

router.route('/register')
.get((req, res) => {
  res.render('business/register')
})
.post((req, res) => {
  console.log(req.body)
  var newBusiness = new Business()
  newBusiness.name = req.body.name
  newBusiness.address = req.body.address
  newBusiness.email = req.body.email
  newBusiness.phone = req.body.phone
  newBusiness.description = req.body.description
  newBusiness.save((err) => {
    if (err) return console.log(err)
    res.redirect('/business')
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
