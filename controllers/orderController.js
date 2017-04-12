var express = require('express')
var router = express.Router()

router.get('/:id', function (req, res) {
  res.render('socketreceive', {chat: req.params.id})
})

module.exports = router
