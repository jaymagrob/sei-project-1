function init() {
  
  // Remember colors
  console.log('%cFive', 'background: red; color: white')
  console.log('%cFour', 'background: blue; color: white')
  console.log('%cThree', 'background: green; color: white')
  console.log('%cThree', 'background: black; color: white')
  console.log('%cTwo', 'background: orange; color: white')
  
  // DOM variables
  const gridCompetitor = document.querySelector('.grid-competitor')
  const squaresCompetitor = []
  const gridPlayer = document.querySelector('.grid-player')
  const squaresPlayer = []

  // game variables
  const width = 10
  let freeSpaceOnBoard = false
  let complete = false

  //Game Objects
  const shipsObj = {
    carrier: ['t','m','m','m','b'],
    battleship: ['t','m','m','b'],
    cruiser: ['t','m','b'],
    submarine: ['t','m','b'],
    destroyer: ['t','b']
  }

  const counter = {
    carrier: 5,
    battleship: 9,
    cruiser: 12,
    submarine: 15,
    destroyer: 17
  }

  //Loop as many times as width times the width to fill the grid
  
  Array(width * width).join('.').split('.').forEach((i,index) => {
    const square = document.createElement('div')
    square.classList.add('grid-item-competitor')
    square.innerHTML = (Math.floor(index / width)) + ' - ' + index
    squaresCompetitor.push(square)
    gridCompetitor.appendChild(square)
  })

  Array(width * width).join('.').split('.').forEach((i,index) => {
    const square = document.createElement('div')
    square.classList.add('grid-item-player')
    square.innerHTML = (Math.floor(index / width)) + ' - ' + index
    squaresPlayer.push(square)
    gridPlayer.appendChild(square)
  })



  //Creating Game
  Object.keys(shipsObj).forEach(i => {
    complete = false
    console.log(i)
    while (!complete) {
      createLoop(i)
      if (document.querySelectorAll('.ship').length === counter[i]) {
        complete = true
      } else {
        console.log('broke')
        document.querySelectorAll('.'+i).forEach(it => it.classList.remove(i))
        document.querySelectorAll('.ship').forEach(it => {
          if (it.classList.length <= 2) it.classList.remove('ship')
        })
        
        
      }
    
    }
    
  })

  function createLoop(i) {
    let countArray = 0
    while (countArray < shipsObj[i].length) {
      const randomNum = Math.floor(Math.random() * (width * width))
      const horizontalVert = Math.random() > 0.5
      shipsObj[i].forEach((item,index) => {
        const indexHorizontal = randomNum + index
        const indexVert = randomNum + (10 * index)
        if (!horizontalVert) {
          if (width - shipsObj[i].length > (randomNum % width)) {
            squaresCompetitor[indexHorizontal].classList.add(i)
            squaresCompetitor[indexHorizontal].classList.add('ship')
          } 
        } else {
          if (width - shipsObj[i].length > Math.floor(randomNum / width)) {
            squaresCompetitor[indexVert].classList.add(i)
            squaresCompetitor[indexVert].classList.add('ship')
          } 
        }
      })
      countArray = document.querySelectorAll('.'+i).length
    }
    
  
  }
  
}

window.addEventListener('DOMContentLoaded', init)