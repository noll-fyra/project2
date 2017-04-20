var customerButton = document.querySelector('.hero-customer-button')
var businessButton = document.querySelector('.hero-business-button')
var customerSection = document.querySelector('.hero-customer')
var businessSection = document.querySelector('.hero-business')

var buttons = [customerButton, businessButton]
var sections = [customerSection, businessSection]

buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    sections.forEach((section) => {
      section.style.display = 'none'
    })
    sections[index].style.display = 'block'
  })
})

businessSection.style.display = 'none'
