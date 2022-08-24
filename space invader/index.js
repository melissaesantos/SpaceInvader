
const state = {
    numCells:(600/40) * (600/40),
    //total width of grid/width of cell
    cells: [],
    shipPosition: 217,
    alienPositions: [ 
        3,4,5,6,7,8,9,10,11,
        18,19,20, 21,22,23,24,25,26,
        33,34,35,36,37,38,39,40,41,
        48,49,50,51,52,53,54,55,56
    ],
    gameOver :false,
    score: 0,
   
}
const setupGame = (element) =>{
    state.element = element
    //do all the things needed to draw the game
    //draw the grid
    drawGrid()
    //draw the spaceship
    drawShip()
    //draw the aliens
    drawAliens()
    //add the instructions and score
    drawScoreboard()


}
const drawGrid = () =>{
    //create the containing element
    const grid = document.createElement('div')
    grid.classList.add('grid')
    //create a Lot of cells- 15x15(225)
    //append the cells to the element and the containing element to the app
    state.element.append(grid)
    for(let i =0; i<state.numCells;i++){
        //create a cell
        const cell = document.createElement('div')
        //append the cell to the grid
        grid.append(cell)
        //store the cell in the game state
        state.cells.push(cell)
    }

}
const drawShip = () => {
    state.cells[state.shipPosition].classList.add('spaceship')
    //find the bottom row,middle cell(from fame state), add a bg imafe
}

const controlShip= (event) =>{
    if(state.gameOver) return 
    //this prints out what current key/"event" is being pressed
   if (event.code === 'ArrowLeft'){
        moveShip('left')
   } else if (event.code === 'ArrowRight'){
        moveShip('right')
   }else if (event.code === 'Space'){
    fire()

   }
}

const moveShip = (direction) => {
    //remove image from current pos.
    //this is the element that currently has the ship 
    state.cells[state.shipPosition].classList.remove('spaceship')
    // the && makes it so that it stays on the same line even if we go tooo left
    if (direction === 'left' && state.shipPosition % 15 !== 0 ){
        state.shipPosition--
    }else if (direction === 'right'&& state.shipPosition % 15 !== 14 ){
        state.shipPosition++
    }
    //figure out the delta
    //add image to the new position
    state.cells[state.shipPosition].classList.add('spaceship')
}
const fire = () =>{
    //use an interval:run some code repeatedly each time after a specified time
    let interval;
    let laserPosition = state.shipPosition
    interval = setInterval(() =>{
        //laser starts at ship position
        state.cells[laserPosition].classList.remove('laser')
        //remove the laser image
        //decrease (move up arrow) the laser postion
        laserPosition -= 15
        //check if we are still in bounds of the grid
        if(laserPosition < 0){
            clearInterval(interval)
            return 
        }

        //if there is an alien BOOM!
        //clear the interval , remove the alien image, remove the alien from the alien positons,
        //add the BOOM image, set a time out to remove the BOOM image
        if(state.alienPositions.includes(laserPosition)){
            clearInterval(interval)
            state.alienPositions.splice(state.alienPositions.indexOf(laserPosition),1)
            state.cells[laserPosition].classList.remove('alien', 'laser')
            state.cells[laserPosition].classList.add('hit')
            state.score++
            state.scoreElement.innerText = state.score
            setTimeout(() =>{
                state.cells[laserPosition].classList.remove('hit')
            },200)
            return
        }
        //add the laser image
        state.cells[laserPosition].classList.add('laser')
    }, 100)
}
const drawAliens = () =>{
    //adding the aliens to the grid -> we need to store the positions of the aliens in our game state
    state.cells.forEach((cell,index) => {
        //remove any alien images 
        if(cell.classList.contains('alien')){
            cell.classList.remove('alien')
        }
        //add the image to the cell if the index is in the set of alien positions
        if(state.alienPositions.includes(index)){
            cell.classList.add('alien')
        }
    })
}
const play = () =>{
    //start the march of the aliens
   
    let interval
    let direction = 'right'
    interval = setInterval(() =>{
        if(direction === 'right'){
             //if right and at the edge, increase position by 15,decrease 1
            if(atEdge('right')){
                movement = 15-1
                direction = 'left'
            }else{
                //if right, increase the position by 1
                movement = 1
            }
        }else if (direction ==='left'){
            //if left and at edge, increase position by 15 ,increase 1
            if(atEdge('left')){
                movement = 15+1
                direction = 'right'
            }else{
                //if left, decrease the position by 1
                movement = -1
            }
        }
        //update the alien positions 
        state.alienPositions = state.alienPositions.map(position => position + movement)
    
       drawAliens()
       checkGamesState(interval)
    },400)
    //set up the ship controls 
   window.addEventListener('keydown', controlShip)


}
const atEdge = (side ) => {
    if (side === 'left'){
        return state.alienPositions.some(position => position % 15 ===0)
    } else if (side === 'right') {
        //are there any aliens in the right hand column?
        return state.alienPositions.some(position => position % 15 ===14)
    }
   
}
const checkGamesState = (interval) => {
    //has the aliens got to the bottom

    //are the aliens dead
    if(state.alienPositions.length ===0){
        //stop everything
        state.gameOver= true
        //stop the interval
        clearInterval(interval)
        drawMessage("HUMAN WINS!!!")
    }else if(state.alienPositions.some(position => position >= state.shipPosition)){
        clearInterval(interval)
        state.gameOver= true
        //make ship go boom 
        //remove the ship image, add the explosion image
        state.cells[state.shipPosition].classList.remove('spaceship')
        state.cells[state.shipPosition].classList.add('hit')
        drawMessage("GAME OVER!!!")
    }
}
const drawMessage = (message) =>{
    //create message
    //append to the app
    const messageElement = document.createElement('div')
    messageElement.classList.add('message')
    //create the heading text 
    const h1 = document.createElement('h1')
    h1.innerText = message
    messageElement.append(h1)


    state.element.append(messageElement)
}
// const startMessage = (start) =>{
//     const startM = document.createElement('div')
//     startM.classList.add('start')
//     //creating the heading text
//     const h2 = document.createElement('h2')
//     h2.innerText = start
//     startM.append(h2)

//     state.element.append(startM)
   
// }
const drawScoreboard = () => {
    const heading = document.createElement("h1")
    heading.innerText = 'Space Invaders'
    const paragraph1 = document.createElement("p")
    paragraph1.innerText = 'Press Up Arrow to START.'
    const paragraph2 = document.createElement("p")
    paragraph2.innerText = 'Press SPACE to SHOOT.'
    const paragraph3 = document.createElement("p")
    paragraph3.innerText = 'Press ← and → to move'
    const scoreboard = document.createElement('div')
    scoreboard.classList.add('scoreboard')
    const scoreElement = document.createElement('span')
    scoreElement.innerText = state.score
    const heading3 = document.createElement('h3')
    heading3.innerText = 'SCORE: '
    heading3.append(scoreElement)
    scoreboard.append(heading, paragraph1, paragraph2,paragraph3, heading3)
  
    state.scoreElement = scoreElement
    state.element.append(scoreboard)
  }


//query the page for the place to insert my game

const appElement = document.querySelector('.app')
//do all the things needed to draw the game
setupGame(appElement)

//play the game-start being able to move the ship, move aliens
const checkLetter = (event) =>{
    if(event.code === 'ArrowUp'){
        play()
    }

}

window.addEventListener('keydown', checkLetter)
// const startGame = () =>{
//      startMessage('Press Space to start')
//      checkLetter()
// }
// startGame()


