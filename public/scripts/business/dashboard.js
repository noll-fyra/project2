var accountButtons = [document.getElementById('profile'), document.getElementById('users'), document.getElementById('transactions'), document.getElementById('advanced')]
var accountDivs = [document.querySelector('.profile'), document.querySelector('.users'), document.querySelector('.transactions'), document.querySelector('.advanced')]

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

document.querySelector('.profile').style.display = 'block'
