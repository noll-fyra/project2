var buttons = [document.getElementById('profile'), document.getElementById('users'), document.getElementById('advanced')]
var sections = [document.querySelector('.profile'), document.querySelector('.users'), document.querySelector('.advanced')]

buttons.forEach((button, index) => {
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
