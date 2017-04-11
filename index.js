// set up express
const express = require('express')
const app = express()

// set up the database
const mongoose = require('mongoose')
const dbURI = process.env.PROD_MONGODB || 'mongodb://admin:admin@ds157390.mlab.com:57390/mymdb'
const port = process.env.PORT || 4000
mongoose.Promise = global.Promise

// add middleware and layouts
require('dotenv').config({silent: true})
const ejsLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const isLoggedIn = require('./middleware/isLoggedIn')
const session = require('express-session')
const passport = require('./config/ppConfig')
const flash = require('connect-flash')
const MongoStore = require('connect-mongo')(session)

// require the controller
// const todosController = require('./controllers/todos_controller')

// connect to the database
if (!mongoose.connection.db) mongoose.connect(dbURI)
var db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', function () {
  console.log('Connected!')
})

// set the layout
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(ejsLayouts)

// handle requests
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({extended: false}))
// app.use(bodyParser.json())

// handle login/logout (session comes before passport)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: process.env.PROD_MONGODB,
    autoReconnect: true,
    autoRemove: 'native',
    mongooseConnection: mongoose.connection
  })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(function (req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash()
  res.locals.currentUser = req.user
  next()
})

app.get('/profile', isLoggedIn, function (req, res) {
  res.render('profile')
})

app.use('/auth', require('./controllers/auth'))

app.use('/', function (req, res) {
  res.render('index')
})

app.use(function (req, res) {
  res.send('404')
})

app.listen(port, function () {
  console.log('App is running on port: ' + port)
})
