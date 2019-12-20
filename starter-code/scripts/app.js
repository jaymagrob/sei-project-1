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


  //Creating Game
  Object.keys(shipsObj).forEach(i => {
    const axis = Math.random() < 0.5
    console.log(axis)
    const randomNum = Math.floor(Math.random() * (width * width))
    shipsObj[i].forEach((item,index) => {
      if (axis) {
        squares[randomNum + index - 1].classList.add(i)
      } else {
        squares[randomNum + (index * width)].classList.add(i)
      }
    })
  })


}

window.addEventListener('DOMContentLoaded', init)
