// returns dates and times in a usable form
module.exports = function (date) {
  function month (monthNumber) {
    switch (monthNumber) {
      case 0:
        return 'Jan'
      case 1:
        return 'Feb'
      case 2:
        return 'Mar'
      case 3:
        return 'Apr'
      case 4:
        return 'May'
      case 5:
        return 'Jun'
      case 6:
        return 'Jul'
      case 7:
        return 'Aug'
      case 8:
        return 'Sep'
      case 9:
        return 'Oct'
      case 10:
        return 'Nov'
      case 11:
        return 'Dec'
      default:
        return 'month error'
    }
  }

  function padding (hourOrMinutes) {
    return hourOrMinutes < 10 ? '0' + hourOrMinutes : hourOrMinutes
  }

  function ampm (hour) {
    return hour < 12 ? 'AM' : 'PM'
  }

  if (date) {
    var dateString = date.getDate() + ' ' + month(date.getMonth()) + ' ' + date.getFullYear()
    var timeString = padding(date.getHours()) + ':' + padding(date.getMinutes()) + ' ' + ampm(date.getHours())

    return [dateString, timeString]
  }
}
