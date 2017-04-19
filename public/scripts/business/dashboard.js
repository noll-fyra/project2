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
    document.querySelector('.add-menu-item').style.display = 'none'
    document.querySelector('.update-menu-item').style.display = 'none'
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
document.getElementById('add-menu-item-button').addEventListener('click', () => {
  document.querySelector('.menu').style.display = 'none'
  document.querySelector('.add-menu-item').style.display = 'block'
  document.querySelector('.update-menu-item').style.display = 'none'
})
document.querySelectorAll('.menu-cancel').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.menu').style.display = 'block'
    document.querySelector('.add-menu-item').style.display = 'none'
    document.querySelector('.update-menu-item').style.display = 'none'
  })
})

// hide everything to start
sections.forEach((section) => {
  section.style.display = 'none'
})
transactionSections.forEach((section) => {
  section.style.display = 'none'
})
document.querySelector('.add-menu-item').style.display = 'none'
document.querySelector('.update-menu-item').style.display = 'none'
document.querySelector('.transactions-nav').style.display = 'none'

// show the starting views
document.getElementById('active-transactions-button').style.backgroundColor = 'rgba(50,150,200,0.3)'
document.querySelector('.active-transactions').style.display = 'block'
document.querySelector('.menu').style.display = 'block'
document.getElementById('menu').style.backgroundColor = 'rgba(50,150,200,0.3)'
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

// update and remove menu items
document.querySelector('.menu').addEventListener('click', function (event) {
  var clickedElement = event.target
  if (clickedElement.className === 'update-menu-button') {
    document.querySelector('.update-menu-item').style.display = 'block'
    document.querySelector('.menu').style.display = 'none'
    var item = clickedElement.value.split('/')
    var name = document.getElementById('update-menu-name')
    name.value = item[0]
    var description = document.getElementById('update-menu-description')
    description.value = item[1]
    var price = document.getElementById('update-menu-price')
    price.value = item[2]
    var id = document.getElementById('update-menu-id')
    id.value = item[3]
  }
  if (clickedElement.className === 'remove-menu-button') {
    clickedElement.parentNode.submit()
  }
})
