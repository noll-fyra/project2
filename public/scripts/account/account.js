var accountButtons = [document.getElementById('profile'), document.getElementById('password'), document.getElementById('history'), document.getElementById('creditCards'), document.getElementById('advanced')]
var accountDivs = [document.querySelector('.profile'), document.querySelector('.password'), document.querySelector('.history'), document.querySelector('.creditCards'), document.querySelector('.advanced')]
accountButtons.forEach(function (button, index) {
  button.addEventListener('click', () => {
    accountDivs.forEach((div) => {
      div.style.display = 'none'
    })
    accountDivs[index].style.display = 'block'
  })
})
accountDivs.forEach((div) => {
  div.style.display = 'none'
})
document.querySelector('.profile').style.display = 'block'
