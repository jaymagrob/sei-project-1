function init() {
  
  // DOM variables
  const domObj = {
    gridCompetitor: document.querySelector('.grid-competitor'),
    squaresCompetitor: [],
    gridPlayer: document.querySelector('.grid-player'),
    squaresPlayer: [],
    selectionPlayer: document.querySelector('.player-selection'),
    squaresSelection: [],
    btnTest: document.querySelector('button') //THIS IS FOR TESTING FUNCTIONS! Delete before commit,
  }

  

  // game variables
  const width = 12
  let complete = false
  let playerShipSelected = ''
  let sideDirection = true
  let whosTurn = ''
  const randomNumCompetitor1 = new Array(width * width).join(',').split(',').map((i,ind) => ind).filter(i => Math.floor(i / width) % 2 !== i % 2)
  const randomNumCompetitor2 = new Array(width * width).join(',').split(',').map((i,ind) => ind).filter(i => Math.floor(i / width) % 2 === i % 2)

  //Game Objects
  const shipObject = {
    carrier: {
      ship: ['t','m','m','m','b'],
      counter: 5,
      playerPlaying: [],
      computerPlaying: [],
      computerBorder: []
    },
    battleship: {
      ship: ['t','m','m','b'],
      counter: 9,
      playerPlaying: [],
      computerPlaying: [],
      computerBorder: []
    },
    cruiser: {
      ship: ['t','m','b'],
      counter: 12,
      playerPlaying: [],
      computerPlaying: [],
      computerBorder: []
    },
    submarine: {
      ship: ['t','m','b'],
      counter: 15,
      playerPlaying: [],
      computerPlaying: [],
      computerBorder: []
    },
    destroyer: {
      ship: ['t','b'],
      counter: 17,
      playerPlaying: [],
      computerPlaying: [],
      computerBorder: []
    }
  }

  const gameSelections = {
    player: [],
    competitor: [],
    chaseMode: false,
    chaseIndex: '',
    chaseHits: [],
    chaseArray: function() {
      return [this.chaseIndex + 1, this.chaseIndex - 1, this.chaseIndex + width, this.chaseIndex - width]
    },
    removeBoardArray: function() {
      return this.chaseArray()
        .filter(i => i >= 0)
        .filter(i => i < width * width)
        .filter(i => !(i % width === 0 && this.chaseIndex + 1 === i ))
        .filter(i => !(i % width === width - 1 && this.chaseIndex - 1 === i))
        .filter(i => this.competitor.indexOf(i) === -1)
        .sort((a,b) => Math.random() - Math.random())[0]
    },

    sortArea: function() {
      return this.chaseHits.sort((a,b) => a - b)
    },
    sideOrTop: function() {
      return (this.sortArea().length < 2) ? 0 : this.sortArea()[1] - this.sortArea()[0]
    },
    longattack: function() {
      return [Math.max(...this.chaseHits) + this.sideOrTop(),Math.min(...this.chaseHits) - this.sideOrTop()]
        .filter(i => typeof i === 'number')
        .filter(i => i >= 0)
        .filter(i => i < width * width)
        .filter(i => !(i % width === 0 && this.chaseIndex + 1 === i ))
        .filter(i => !(i % width === width - 1 && this.chaseIndex - 1 === i))
        .filter(i => this.competitor.indexOf(i) === -1)
        .sort((a,b) => Math.random() - Math.random())[0]
    }
    
  }
  
  
  function boardCreated() {
      //Function to create to game board. Parameters should receive competitor and player.
    function mainBoard(type){ 
      const lower = type.toLowerCase()
      const title = lower.slice(0,1).toUpperCase() + lower.slice(1)
      Array(width * width).join('.').split('.').forEach((i,index) => {
        const square = document.createElement('div')
        square.classList.add('grid-item-' + lower)
        square.innerHTML = index % width + '\n' + index
        domObj['squares' + title].push(square)
        domObj['grid' + title].appendChild(square)
      })

    }
    //Calling function to create game board
    mainBoard('competitor')
    mainBoard('player')


    //Creating the ships for the competitor board
    Object.keys(shipObject).forEach(i => {
      complete = false
      while (!complete) {
        createLoop(i)
        if (document.querySelectorAll('.ship').length === shipObject[i].counter && document.querySelectorAll('#border.ship').length === 0) {
          domObj.squaresCompetitor.forEach((item,ind) => (item.classList.contains(i)) ? shipObject[i].computerPlaying.push(ind) : '')
          shipObject[i].computerPlaying.forEach(item => shipObject[i].computerBorder.push(item + 1,item - 1,item + width,item - width))
          borderReduce(i).forEach(i => domObj.squaresCompetitor[i].id = 'border')
          complete = true
          
        } else {
          console.log('broke')
          document.querySelectorAll('.' + i).forEach(it => it.classList.remove(i))
          document.querySelectorAll('.ship').forEach(it => {
            if (it.classList.length <= 2) it.classList.remove('ship')
          })
        }  
      }
    })

    function borderReduce(shipIndex) {
      return shipObject[shipIndex].computerBorder
        .filter(i => i >= 0)
        .filter(i => i < width * width)
        .filter(i => shipObject[shipIndex].computerPlaying.indexOf(i) === -1)
        .filter(i => !(i % width === 0 && shipObject[shipIndex].computerPlaying.some(it => it + 1 === i )))
        .filter(i => !(i % width === width - 1 && shipObject[shipIndex].computerPlaying.some(it => it - 1 === i )))
    }

    //Function to select each ship for the competitor
    function createLoop(i) {
      let countArray = 0
      while (countArray < shipObject[i].ship.length) {
        const randomNum = Math.floor(Math.random() * (width * width))
        const horizontalVert = Math.random() > 0.5
        shipObject[i].ship.forEach((item,index) => {
          const indexHorizontal = randomNum + index
          const indexVert = randomNum + (width * index)
          if (!horizontalVert) {
            if (width - shipObject[i].ship.length > (randomNum % width)) {
              domObj.squaresCompetitor[indexHorizontal].classList.add(i)
              domObj.squaresCompetitor[indexHorizontal].classList.add('ship')
            } 
          } else {
            if (width - shipObject[i].ship.length > Math.floor(randomNum / width)) {
              domObj.squaresCompetitor[indexVert].classList.add(i)
              domObj.squaresCompetitor[indexVert].classList.add('ship')
            } 
          }
        })
        countArray = document.querySelectorAll('.' + i).length
      }
    }
  }

  boardCreated()
  hoverStuff()

  function hoverStuff() {
    // Function for user to selectShips. Parameter e is an event. Event triggered by start of game. Function runs when playShipSelected taken.
    Object.keys(shipObject).forEach(i => {
      const square = document.createElement('div')
      square.classList.add('select-' + i)
      square.classList.add('selector')
      square.innerHTML = i
      square.addEventListener('click',selectionShips)
      domObj.squaresSelection.push(i)
      domObj.selectionPlayer.appendChild(square)
    })
    
    function startGame() {
      console.log('start')
      document.querySelectorAll('.selector').forEach(i => i.removeEventListener('click',selectionShips))
      domObj.squaresPlayer.forEach(i => i.removeEventListener('click',clickOnBoard))
      playersMoves()
    }
    
    window.addEventListener('keydown', e => {
      if (e.keyCode.toString().match(/32|37|39/)) sideDirection = !sideDirection
      console.log(sideDirection)
    })
    
    function selectionShips(e) {
      playerShipSelected = e.target.innerHTML.toString()
      domObj.squaresPlayer.forEach(i => i.addEventListener('mouseenter',hoverTest))
      domObj.squaresPlayer.forEach(i => i.addEventListener('mouseleave',hoverTest2))
    }


    // Function for creating the hover effect when selecting ships
    function hoverTest() {
      const indexPlayer = domObj.squaresPlayer.indexOf(this)
      const shipLength = shipObject[playerShipSelected].ship.length
      if (sideDirection && indexPlayer % width + shipLength > width || !sideDirection && indexPlayer > (width * width - 1) - (shipLength * width) + width) {
        shipObject[playerShipSelected].ship.forEach((it,ind) => {
          if (sideDirection) {
            if (indexPlayer % width + ind >= width) return
            domObj.squaresPlayer[indexPlayer + ind].classList.add('error')
          } else {
            if (indexPlayer + width * ind >= width * width) return
            domObj.squaresPlayer[indexPlayer + width * ind].classList.add('error')
          }
        })
      } else {
        domObj.squaresPlayer.forEach(i => i.addEventListener('click',clickOnBoard))
        shipObject[playerShipSelected].ship.forEach((it,ind) => {
          if (sideDirection) {
            domObj.squaresPlayer[indexPlayer + ind].classList.add(playerShipSelected)
          } else {
            domObj.squaresPlayer[indexPlayer + width * ind].classList.add(playerShipSelected)
          }
        })
      }
    }
    
    // Function for removing hover effect when player selects ship.
    function hoverTest2() {
      domObj.squaresPlayer.forEach(i => i.removeEventListener('click',clickOnBoard))
      domObj.squaresPlayer.forEach(i => i.classList.remove(playerShipSelected))
      domObj.squaresPlayer.forEach(i => i.classList.remove('error'))
    }


    // Function for putting ship on board. //REFACTOR DOWN
    function clickOnBoard() {
      domObj.squaresPlayer.forEach(i => i.removeEventListener('mouseenter',hoverTest))
      domObj.squaresPlayer.forEach(i => i.removeEventListener('mouseleave',hoverTest2))
      const shipLocation = domObj.squaresPlayer.reduce((a,i,ind) => {
        (i.classList.contains(playerShipSelected)) ? a.push(ind) : a
        return a
      },[])
      shipObject[playerShipSelected].playerPlaying = shipLocation
      const allLocations = Object.keys(shipObject).reduce((a,i) => a += shipObject[i].playerPlaying + ',','').split(',').map(i => parseInt(i)).filter(i =>  (i))  
      const findDuplicates = new Set(allLocations).size
      if (allLocations.length !== findDuplicates) shipOnShip(playerShipSelected)
      if (allLocations.length === 17 && findDuplicates === 17) startGame()

    }
    

  }

  function shipOnShip(i) {
    console.log(`${i} can not be placed on other ship. Please reassign`)
  }  
  
  //Play playing game
  function playersMoves() {
    domObj.squaresCompetitor.forEach((i) => i.addEventListener('click', clickCompetitor))
  }

  //Player clicks a competitors grid //REFACTOR AND BREAK UP. REPEATING CODE FOR COMPUTER AND PLAYER
  function clickCompetitor(e) {
    const clickInd = domObj.squaresCompetitor.indexOf(e.target)
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


  function competitorsTurn() {
    console.log(gameSelections.chaseMode)
    if (gameSelections.chaseMode) {
      chaseModeFunction()
    } else {
      randomNumberCompetitor()
      
    }
  } 

  function chaseModeFunction() {
    const selection = (gameSelections.chaseHits.length >= 2) ? gameSelections.longattack() : gameSelections.removeBoardArray()
    domObj.squaresPlayer[selection].style.background = 'pink'
    gameSelections.competitor.push(selection)
    competitorHitShip(selection)
  }
    
  function randomNumberCompetitor() {
    randomNumCompetitor1.filter(i => gameSelections.competitor.indexOf(i) !== -1)
    if (randomNumCompetitor1.length === 0) {
      if (randomNumCompetitor2.length === 0) {
        console.log('no more picks')
        
      } else {
        const selection = randomNumCompetitor2[Math.floor(Math.random() * randomNumCompetitor2.length)]
        competitorHitShip(selection)
        domObj.squaresPlayer[selection].style.background = 'pink'
        randomNumCompetitor2.splice(randomNumCompetitor2.indexOf(selection),1)
        gameSelections.competitor.push(selection)
      }
    } else {
      const selection = randomNumCompetitor1[Math.floor(Math.random() * randomNumCompetitor1.length)]
      competitorHitShip(selection)
      domObj.squaresPlayer[selection].style.background = 'pink'
      randomNumCompetitor1.splice(randomNumCompetitor1.indexOf(selection),1)
      gameSelections.competitor.push(selection)
    }
    console.log(gameSelections.competitor)
  }

  function competitorHitShip(number) {
    let shipHit = ''
    Object.keys(shipObject).forEach(i => (shipObject[i].playerPlaying.indexOf(number) !== -1) ? shipHit = i : '')
    if (shipHit) {
      gameSelections.chaseMode = true
      gameSelections.chaseIndex = number
      gameSelections.chaseHits.push(number)
    }
    if (shipHit.length > 0) {
      shipObject[shipHit].playerPlaying.splice(shipObject[shipHit].playerPlaying.indexOf(number),1)      
      competitorSinkShip(shipHit)
    }
  }

  function competitorSinkShip(ship) {
    if (shipObject[ship].playerPlaying.length === 0) {
      console.log(`${ship} has sunk.`)
      gameSelections.chaseMode = false
      gameSelections.chaseIndex = ''
      gameSelections.chaseHits = []
      console.log(gameSelections.chaseMode)
    }
    gameWon()
  }

  function gameWon() {
    if (Object.keys(shipObject).every(i => (shipObject[i].playerPlaying.length) === 0)) {
      console.log('computer wins!')
      clearInterval(interval)
      reload()
      
    }
    
  }
    
  

  createPlayerBoard() //DELETE ONCE TESTING IS OVER
  
  
  //!THIS IS A TEST - REMOVE AFTER TESTING
  function createPlayerBoard() { 
    Object.keys(shipObject).forEach(i => shipObject[i].playerPlaying = shipObject[i].computerPlaying)
    Object.keys(shipObject).forEach(i => {
      shipObject[i].playerPlaying.forEach(item => domObj.squaresPlayer[item].classList.add(i))
    })
    
  }



  //? Test button, can remove after production
  domObj.btnTest.addEventListener('click', reload)
  var interval = setInterval(competitorsTurn,50)
  function reload() {
    location.reload(true)
  }
}

window.addEventListener('DOMContentLoaded', init)

