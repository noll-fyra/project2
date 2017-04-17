var buttons = [document.getElementById('profile'), document.getElementById('password'), document.getElementById('history'), document.getElementById('creditCards'), document.getElementById('advanced')]
var sections = [document.querySelector('.profile'), document.querySelector('.password'), document.querySelector('.history'), document.querySelector('.creditCards'), document.querySelector('.advanced')]
buttons.forEach(function (button, index) {
  button.addEventListener('click', () => {
    sections.forEach((section) => {
      section.style.display = 'none'
    })
    sections[index].style.display = 'block'
  })
})
sections.forEach((section) => {
  section.style.display = 'none'
})
document.querySelector('.profile').style.display = 'block'
