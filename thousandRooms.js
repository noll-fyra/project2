for (var i = 0; i < 100; i++) {
  console.log(randomise(4, 1))
  console.log(randomDate())
}

// createRoom()
function createRoom () {
  var newRoom = new Room()
  newRoom.beds = randomise(4, 1)
  newRoom.price = randomise(1000, 50)
  var dates = randomDate()
  newRoom.dateFrom = dates[0]
  newRoom.dateTo = dates[1]
  newRoom.status = false
  newRoom.save()
}

function randomise (top, minimum) {
  return Math.floor(Math.random() * top) + minimum
}

function randomDate () {
  var x = new Date()
  var y = new Date()
  x.setDate(x.getDate() + randomise(365, 0))
  y.setDate(x.getDate() + randomise(365, 1))
  return [x, y]
}
