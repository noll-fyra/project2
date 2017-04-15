// check if the user has registered a business
module.exports = function (req, res, next) {
  if (!req.user.business) {
    req.flash('error', 'You must register a business first (Account > Advanced > Register a business)')
    res.redirect('/account')
  } else {
    next()
  }
}
