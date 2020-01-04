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
  let squaresPlayer = []
  const selectionPlayer = document.querySelector('.player-selection')
  const squaresSelection = []

  // game variables
  const width = 10
  let freeSpaceOnBoard = false
  let complete = false
  let playerShipSelected = ''
  let sideDirection = true

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

  const playerPlaying = {
    carrier: [],
    battleship: [],
    cruiser: [],
    submarine: [],
    destroyer: []
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

  Object.keys(shipsObj).forEach(i => {
    const square = document.createElement('div')
    square.classList.add('select-' + i)
    square.innerHTML = i
    square.addEventListener('click',selectionShips)
    squaresSelection.push(i)
    selectionPlayer.appendChild(square)
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
      countArray = document.querySelectorAll('.' + i).length
    }
  }

  function selectionShips(e) {
    playerShipSelected = e.target.innerHTML.toString()
    squaresPlayer.forEach(i => i.addEventListener('mouseenter',hoverTest))
    squaresPlayer.forEach(i => i.addEventListener('mouseleave',hoverTest2))
  }

  function hoverTest(i) {
    const indexPlayer = squaresPlayer.indexOf(this)
    const shipLength = shipsObj[playerShipSelected].length
    if (sideDirection && indexPlayer % width + shipLength > width || !sideDirection && indexPlayer > (width * width - 1) - (shipLength * width) + width) {
      shipsObj[playerShipSelected].forEach((it,ind) => {
        if (sideDirection) {
          if (indexPlayer % width + ind >= width) return
          squaresPlayer[indexPlayer + ind].classList.add('error')
        } else {
          if (indexPlayer + 10 * ind >= width * width) return
          squaresPlayer[indexPlayer + 10 * ind].classList.add('error')
        }
      })
    } else {
      squaresPlayer.forEach(i => i.addEventListener('click',clickOnBoard))
      shipsObj[playerShipSelected].forEach((it,ind) => {
        if (sideDirection) {
          squaresPlayer[indexPlayer + ind].classList.add(playerShipSelected)
        } else {
          squaresPlayer[indexPlayer + 10 * ind].classList.add(playerShipSelected)
        }
      })
    } 
  }
  

  function hoverTest2() {
    squaresPlayer.forEach(i => i.removeEventListener('click',clickOnBoard))
    squaresPlayer.forEach(i => i.classList.remove(playerShipSelected))
    squaresPlayer.forEach(i => i.classList.remove('error'))
  }

  function clickOnBoard() {
    squaresPlayer.forEach(i => i.removeEventListener('mouseenter',hoverTest))
    squaresPlayer.forEach(i => i.removeEventListener('mouseleave',hoverTest2))
    const shipLocation = squaresPlayer.reduce((a,i,ind) => {
      (i.classList.contains(playerShipSelected)) ? a.push(ind) : a
      return a
    },[])
    playerPlaying[playerShipSelected] = shipLocation
    console.log(playerPlaying)
  }
  
  window.addEventListener('keydown', e => {
    if (e.keyCode.toString().match(/32|37|39/)) sideDirection = !sideDirection
    console.log(sideDirection)
  })
  
}

window.addEventListener('DOMContentLoaded', init)


