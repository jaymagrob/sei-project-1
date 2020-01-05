function init() {
  
  // DOM variables
  const gridCompetitor = document.querySelector('.grid-competitor')
  const squaresCompetitor = []
  const gridPlayer = document.querySelector('.grid-player')
  const squaresPlayer = []
  const selectionPlayer = document.querySelector('.player-selection')
  const squaresSelection = []
  const btnTest = document.querySelector('button') //THIS IS FOR TESTING FUNCTIONS! Delete before commit

  // game variables
  const width = 10
  let complete = false
  let playerShipSelected = ''
  let sideDirection = true
  let whosTurn = ''

  //Game Objects
  const shipObject = {
    carrier: {
      ship: ['t','m','m','m','b'],
      counter: 5,
      playerPlaying: [],
      computerPlaying: []
    },
    battleship: {
      ship: ['t','m','m','b'],
      counter: 9,
      playerPlaying: [],
      computerPlaying: []
    },
    cruiser: {
      ship: ['t','m','b'],
      counter: 12,
      playerPlaying: [],
      computerPlaying: []
    },
    submarine: {
      ship: ['t','m','b'],
      counter: 15,
      playerPlaying: [],
      computerPlaying: []
    },
    destroyer: {
      ship: ['t','b'],
      counter: 17,
      playerPlaying: [],
      computerPlaying: []
    }
  }

  const gameSelections = {
    player: [],
    competitor: []
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

  Object.keys(shipObject).forEach(i => {
    const square = document.createElement('div')
    square.classList.add('select-' + i)
    square.classList.add('selector')
    square.innerHTML = i
    square.addEventListener('click',selectionShips)
    squaresSelection.push(i)
    selectionPlayer.appendChild(square)
  })

  //Creating Game
  Object.keys(shipObject).forEach(i => {
    complete = false
    console.log(i)
    while (!complete) {
      createLoop(i)
      if (document.querySelectorAll('.ship').length === shipObject[i].counter) {
        squaresCompetitor.forEach((item,ind) => (item.classList.contains(i)) ? shipObject[i].computerPlaying.push(ind) : '')
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
    while (countArray < shipObject[i].ship.length) {
      const randomNum = Math.floor(Math.random() * (width * width))
      const horizontalVert = Math.random() > 0.5
      shipObject[i].ship.forEach((item,index) => {
        const indexHorizontal = randomNum + index
        const indexVert = randomNum + (10 * index)
        if (!horizontalVert) {
          if (width - shipObject[i].ship.length > (randomNum % width)) {
            squaresCompetitor[indexHorizontal].classList.add(i)
            squaresCompetitor[indexHorizontal].classList.add('ship')
          } 
        } else {
          if (width - shipObject[i].ship.length > Math.floor(randomNum / width)) {
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
    const shipLength = shipObject[playerShipSelected].ship.length
    if (sideDirection && indexPlayer % width + shipLength > width || !sideDirection && indexPlayer > (width * width - 1) - (shipLength * width) + width) {
      shipObject[playerShipSelected].ship.forEach((it,ind) => {
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
      shipObject[playerShipSelected].ship.forEach((it,ind) => {
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
    shipObject[playerShipSelected].playerPlaying = shipLocation
    const allLocations = Object.keys(shipObject).reduce((a,i) => a += shipObject[i].playerPlaying + ',','').split(',').map(i => parseInt(i)).filter(i =>  (i))  
    const findDuplicates = new Set(allLocations).size
    if (allLocations.length !== findDuplicates) shipOnShip(playerShipSelected)
    if (allLocations.length === 17 && findDuplicates === 17) startGame()

  }
    
  function shipOnShip(i) {
    console.log(`${i} can not be placed on other ship. Please reassign`)
  }
  //! START BUTTON
  
  function startGame() {
    console.log('start')
    document.querySelectorAll('.selector').forEach(i => i.removeEventListener('click',selectionShips))
    squaresPlayer.forEach(i => i.removeEventListener('click',clickOnBoard))
    playersMoves()
  }

  

  function playersMoves() {
    squaresCompetitor.forEach((i) => i.addEventListener('click', clickCompetitor))
    
  }
//! WORKING HERE
  function clickCompetitor(e) {
    const clickInd = squaresCompetitor.indexOf(e.target)
    const shipHit = Object.keys(shipObject).reduce((a,i) => (shipObject[i].computerPlaying.indexOf(clickInd) > -1) ? a = i : a,null)
    if (gameSelections.player.indexOf(clickInd) > -1) {
      console.log('already hit') // IGNORE ALREADY HIT
    } else {
      gameSelections.player.push(clickInd)
      if (shipHit) {
        shipObject[shipHit].computerPlaying.splice(shipObject[shipHit].computerPlaying.indexOf(clickInd),1)
        if (shipObject[shipHit].computerPlaying.length < 1) {
          console.log(`${shipHit} has sunk`)
          console.log(shipObject[shipHit].computerPlaying.length)
          if (Object.keys(shipObject).every(i => (shipObject[i].computerPlaying.length) === 0)) {
            console.log('All ships destroyed. You win')
          }        
        }
      }
    }
  }

  window.addEventListener('keydown', e => {
    if (e.keyCode.toString().match(/32|37|39/)) sideDirection = !sideDirection
    console.log(sideDirection)
  })

  //? Test button, can remove after production
  btnTest.addEventListener('click',playersMoves)
  
}

window.addEventListener('DOMContentLoaded', init)


