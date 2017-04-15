// user authentication
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

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

// facebook - check if the user's login details are correct
// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_API_KEY,
//   clientSecret: process.env.FACEBOOK_API_SECRET,
//   callbackURL: 'http://localhost:3000/auth/facebook/callback',
//   enableProof: true,
//   profileFields: ['name', 'emails']
// }, function (accessToken, refreshToken, profile, next) {
//   console.log({accessToken, refreshToken, profile})
// }))

module.exports = passport
