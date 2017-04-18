// hide and show sections as needed
var buttons = [document.getElementById('menu'), document.getElementById('transactions'), document.getElementById('profile'), document.getElementById('advanced')]
var sections = [document.querySelector('.menu'), document.querySelector('.transactions'), document.querySelector('.profile'), document.querySelector('.advanced')]
var transactionButtons = [document.getElementById('active-transactions-button'), document.getElementById('completed-transactions-button')]
var transactionSections = [document.querySelector('.active-transactions'), document.querySelector('.completed-transactions')]

buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    buttons.forEach((button) => {
      button.style.backgroundColor = 'rgba(50,50,50,0.1)'
    })
    sections.forEach((section) => {
      section.style.display = 'none'
    })
    document.querySelector('.transactions-nav').style.display = 'none'
    document.querySelector('.menu-options').style.display = 'none'
    if (button.id === 'transactions') { document.querySelector('.transactions-nav').style.display = 'block' }
    if (button.id === 'menu') { document.querySelector('.menu-options').style.display = 'block' }
    sections[index].style.display = 'block'
    buttons[index].style.backgroundColor = 'rgba(50,150,200,0.3)'
  })
})
transactionButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    transactionButtons.forEach((button) => {
      button.style.backgroundColor = 'rgba(50,50,50,0.1)'
    })
    transactionSections.forEach((section) => {
      section.style.display = 'none'
    })
    transactionSections[index].style.display = 'block'
    transactionButtons[index].style.backgroundColor = 'rgba(50,150,200,0.3)'
  })
})
// hide everything to start
sections.forEach((section) => {
  section.style.display = 'none'
})
transactionSections.forEach((section) => {
  section.style.display = 'none'
})
document.querySelector('.transactions-nav').style.display = 'none'

// show the starting views
document.getElementById('active-transactions-button').style.backgroundColor = 'rgba(50,150,200,0.3)'
document.querySelector('.active-transactions').style.display = 'block'
document.querySelector('.menu').style.display = 'block'
document.getElementById('menu').style.backgroundColor = 'rgba(50,150,200,0.3)'

// menu/service colour
document.getElementById('add-menu-item-button').style.backgroundColor = 'rgba(200,50,50,0.3)'
document.getElementById('service').style.backgroundColor = 'rgba(200,50,50,0.3)'

// handle business deregistration
document.querySelector('.deregister-business-confirm').style.display = 'none'

document.querySelector('.deregister-business-button').addEventListener('click', () => {
  document.querySelector('.deregister-business-confirm').style.display = 'block'
})

document.querySelector('.deregister-business-cancel').addEventListener('click', () => {
  document.querySelector('.deregister-business-confirm').style.display = 'none'
})
