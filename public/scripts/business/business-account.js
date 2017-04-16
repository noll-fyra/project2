var accountButtons = [document.getElementById('profile'), document.getElementById('menu'), document.getElementById('users'), document.getElementById('transactions'), document.getElementById('advanced')]
var accountDivs = [document.querySelector('.business-profile'), document.querySelector('.menu'), document.querySelector('.users'), document.querySelector('.transactions'), document.querySelector('.advanced')]

accountButtons.forEach((button, index) => {
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

document.querySelector('.business-profile').style.display = 'block'
