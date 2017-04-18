// hide and show sections as needed
var buttons = [document.getElementById('about'), document.getElementById('menu'), document.getElementById('photos')]
var sections = [document.querySelector('.about'), document.querySelector('.menu'), document.querySelector('.photos')]

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
document.querySelector('.about').style.display = 'block'
document.getElementById('about').style.backgroundColor = 'rgba(50,150,200,0.3)'
document.getElementById('eat-here-button').style.backgroundColor = 'rgba(200,50,50,0.3)'
