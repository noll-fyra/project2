var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var emailRegex = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name must be between 3 and 99 characters'],
    maxlength: [99, 'Name must be between 3 and 99 characters']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: emailRegex
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be between 8 and 99 characters'],
    maxlength: [99, 'Password must be between 8 and 99 characters']
  },
  contact: {
    type: String
  },
  creditCard: {
    type: String
  }
})

UserSchema.pre('save', function (next) {
  var user = this

   // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()
  var hash = bcrypt.hashSync(user.password, 6)
  user.password = hash
  next()
})

// check if the password is correct
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

// return the user profile sans password and creditCard
UserSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    delete ret.password
    delete ret.creditCard
    return ret
  }
}

module.exports = mongoose.model('User', UserSchema)
