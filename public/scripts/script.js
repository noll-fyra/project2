$(function () {
  var socket = io()
  // var comp = '45'
  $('form').submit(function () {
    socket.emit('messageRestaurant', $('#m').val())
    $('#m').val('')
    return false
  })
  socket.on('messageRestaurant', function (msg) {
    $('#messages').append($('<li>').text(msg))
  })
})
