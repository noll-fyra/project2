const https = require('https')
const fs = require('fs')
// '&pagetoken=' + nextPageToken +
module.exports = function (query, res) {
  return https.get({
    host: 'maps.googleapis.com',
    path: '/maps/api/place/textsearch/json?query=' + query + '&type=restaurant&key=' + process.env.GOOGLE_PLACES_API_KEY
  }, function (response) {
    var body = ''
    response.on('data', function (d) {
      body += d
    })
    response.on('end', function () {
      fs.writeFile('../data.json', JSON.parse(body), (err) => {
        if (err) console.log(err)
        res.send({
          message: 'saved data',
          body: JSON.parse(body)
        })
      })
    })
  })
}
