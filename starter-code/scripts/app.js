function init() {
  // DOM variables
  const grid = document.querySelector('.grid')
  const squares = []

  // game variables
  const width = 10

  //Game Objects
  const shipsObj = {
    carrier: ['t','m','m','m','b'],
    battleship: ['t','m','m','b'],
    cruiser: ['t','m','b'],
    submarine: ['t','m','b'],
    destroyer: ['t','b']
  }

  //Loop as many times as width times the width to fill the grid
  Array(width * width).join('.').split('.').forEach(() => {
    const square = document.createElement('div')
    square.classList.add('grid-item')
    squares.push(square)
    grid.appendChild(square)
  })

  //Functions

  Object.keys(shipsObj).forEach(i => {
    const randomNum = Math.floor(Math.random() * (width * width))
    console.log('running')
    
    squares[randomNum].classList.add(i)
    console.log('ran')
  })


}

window.addEventListener('DOMContentLoaded', init)
