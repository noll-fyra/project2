// check if the user has uploaded a file
module.exports = function (req, res, next) {
  if (!req.file) {
    req.flash('error', 'You must upload a file')
    res.redirect('/business/dashboard')
  } else {
    next()
  }
}
