// hide and show sections as needed
var buttons = [document.getElementById('profile'), document.getElementById('history'), document.getElementById('advanced')]
var sections = [document.querySelector('.profile'), document.querySelector('.history'), document.querySelector('.advanced')]

buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    buttons.forEach((button) => {
      button.style.backgroundColor = 'rgba(50,50,50,0.1)'
    })
    sections.forEach((section) => {
      section.style.display = 'none'
    })
    sections[index].style.display = 'block'
    buttons[index].style.backgroundColor = 'rgba(50,150,200,0.3)'
  })
})
sections.forEach((section) => {
  section.style.display = 'none'
})
document.querySelector('.profile').style.display = 'block'
document.getElementById('profile').style.backgroundColor = 'rgba(50,150,200,0.3)'

// handle account deletion
document.querySelector('.delete-account-confirm').style.display = 'none'

document.querySelector('.delete-account-button').addEventListener('click', () => {
  document.querySelector('.delete-account-confirm').style.display = 'block'
})

document.querySelector('.delete-account-cancel').addEventListener('click', () => {
  document.querySelector('.delete-account-confirm').style.display = 'none'
})
