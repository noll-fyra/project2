var express = require('express')
var router = express.Router()
// get data
var getData = require('../config/getData')
var dataFile = require('../data.json')

router.get('/', (req, res) => {
  res.render('search', {data: dataFile, token: dataFile.next_page_token})
})

router.post('/', (req, res) => {
  console.log(req.body.query.split(' ').join('+'))
  getData(req.body.query.split(' ').join('+'), res)
})

module.exports = router
