var buttons = [document.getElementById('active-transactions-button'), document.getElementById('completed-transactions-button')]
var sections = [document.querySelector('.active-transactions'), document.querySelector('.completed-transactions')]

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

document.querySelector('.active-transactions').style.display = 'block'
