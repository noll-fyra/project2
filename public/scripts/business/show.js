// hide and show sections as needed
var buttons = [document.getElementById('about'), document.getElementById('menu')]
var sections = [document.querySelector('.about'), document.querySelector('.menu')]

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

// hide everything to start
sections.forEach((section) => {
  section.style.display = 'none'
})

// show the starting views
document.querySelector('.about').style.display = 'block'
document.getElementById('about').style.backgroundColor = 'rgba(50,150,200,0.3)'
document.getElementById('eat-here-button').style.backgroundColor = 'rgba(200,50,50,0.3)'
