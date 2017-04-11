const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const path = require('path')
const methodOverride = require('method-override')

// connect to db
const mongoose = require('mongoose')
const dbURI = 'mongodb://admin:admin@ds157390.mlab.com:57390/mymdb'
mongoose.Promise = global.Promise

// require the controller
// const todosController = require('./controllers/todos_controller')

// setting the layout
app.set('view engine', 'ejs')
const ejsLayouts = require('express-ejs-layouts')
app.use(ejsLayouts)
app.use(express.static(path.join(__dirname, '/public')))
app.use(methodOverride('_method'))

// handle the post request
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))

if (!mongoose.connection.db) mongoose.connect(dbURI)

app.use('/', function (req, res) {
  res.render('index')
})

app.use(function (req, res) {
  res.send('404')
})

app.listen(port, function () {
  console.log('listening on ' + port)
})
