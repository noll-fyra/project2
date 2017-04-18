// user authentication
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

// stores user's id
passport.serializeUser(function (user, done) {
  done(null, user.id)
})

// restores user's details from id
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})

// check if the user's login details are correct
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function (email, password, done) {
  User.findOne({ email: email }, function (err, user) {
    if (err) return done(err)
    if (!user) return done(null, false)
    if (!user.validPassword(password)) return done(null, false)
    return done(null, user)
  })
}))

module.exports = passport
