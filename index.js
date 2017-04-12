// set up hidden secret
require('dotenv').config()

// set up express
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

// set up the database
const mongoose = require('mongoose')
const dbURI = process.env.PROD_MONGODB || 'mongodb://admin:admin@ds157390.mlab.com:57390/mymdb'
const port = process.env.PORT || 4000
mongoose.Promise = global.Promise

// add layouts, middleware, session and authentication
const ejsLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const passport = require('./config/ppConfig')
const isLoggedIn = require('./middleware/isLoggedIn')
const flash = require('connect-flash')

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
  secret: 'savethecheerleadersavetheworld',
  cookie: {},
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

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/socket.html')
})

app.get('/profile', isLoggedIn, function (req, res) {
  res.render('profile')
})

app.use('/auth', require('./controllers/auth'))

app.use('/', function (req, res) {
  var User = require('./models/user')
  User.find({}, function (err, data) {
    if (err) res.send('error')
    res.render('index', {allProfiles: data})
  })
})

app.use(function (req, res) {
  res.send('404')
})

io.on('connection', function (socket) {
  console.log('socket.io - a user connected')
  socket.on('chat message', function (msg) {
    io.emit('chat message', msg)
  })
  socket.on('disconnect', function () {
    console.log('user disconnected')
  })
})

http.listen(port, function () {
  console.log('App is running on port: ' + port)
})
