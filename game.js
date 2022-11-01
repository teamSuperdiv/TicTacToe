'use strict'

/**
 * display module
 * controls all display functionalities which are not related to the gameboard
 */
const Display = (function () {
  const playerBtn = document.querySelector('#playerVsPlayer')
  const algoBtn = document.querySelector('#playerVsAlgo')
  const playerContainer = document.querySelector('.playerContainer')
  const algoContainer = document.querySelector('.algoContainer')
  const restartBtn = document.querySelector('.restartBtn')

  // displayContainer();
  // function displayContainer() {
  //     playerBtn.addEventListener('click', () => {
  //         playerContainer.hidden = false;
  //         algoContainer.hidden = true;
  //        })
  //        algoBtn.addEventListener('click', () => {
  //         playerContainer.hidden = true;
  //         algoContainer.hidden = false;
  //        })
  // }

  function displayWinner(player) {
    document.querySelector('.winnerContainer').textContent = `${player} wins!`
  }

  function displayTie() {
    document.querySelector('.winnerContainer').textContent = "It's a tie!"
  }

  function clearWinnerContainer() {
    document.querySelector('.winnerContainer').textContent = ''
  }

  return { displayWinner, displayTie, clearWinnerContainer, restartBtn }
})()

/**
 * board module
 * all DOM operations regarding the gameboard
 */
const Board = (function () {
  let gameBoard = []
  let gameBoardUI = Array.from(document.querySelectorAll('.cell'))

  // renders the content of our gameboard to the DOM gameboard
  function render() {
    gameBoard.forEach((element, index) => {
      gameBoardUI[index].textContent = element
    })
  }

  // clears the DOM gameboard
  function clearGameBoard() {
    gameBoardUI.forEach((el) => {
      el.classList.remove('winner')
      el.textContent = ''
    })
  }

  // displays the winning combination on the DOM
  function renderWinningCombination(arr) {
    arr.forEach((index) => {
      gameBoardUI[index].classList.add('winner')
    })
  }

  return { render, renderWinningCombination, clearGameBoard, gameBoard }
})()

/**
 * gamecontroller module
 * controls the flow of the game
 */
const GameController = (function () {
  // get player name DOM elements
  const displayPlayer1 = document.querySelector('#player1')
  const displayPlayer2 = document.querySelector('#player2')

  // create the players
  const player1 = Player('Player 1', 'X', false, true)
  const player2 = Player('Player 2', 'O', false, false)

  // set the DOM elements to player's names accordingly
  displayPlayer1.textContent = player1.getName()
  displayPlayer2.textContent = player2.getName()

  // all possibilities to win the game
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  // initial boolean to determine whether the game is running or not
  let gameRunning = false
  // global variable of winning combination
  let winnersCombination = []

  function gameStart() {
    let gameContainer = document.querySelector('.gameContainer')
    gameRunning = true
    gameContainer.addEventListener('click', (e) => {
      if (player1.turn && gameRunning) {
        player1.makeMove(e)
        player1.turn = false
        player2.turn = true
        gameEnd(player1.mark, player1.getName())
      } else if (player2.turn && gameRunning) {
        player2.makeMove(e)
        player2.turn = false
        player1.turn = true
        gameEnd(player2.mark, player2.getName())
      }
    })
  }

  /**
   * get array of indizes of a playermark
   * @param {*} playerMark
   * @returns arr
   */
  function getPlayerCombination(playerMark) {
    return Board.gameBoard.map((el, index) => {
      if (el === playerMark) return index
    })
    //   .filter((el) => {
    //     return typeof el == 'number'
    //   })
  }

  /**
   * checks whether the playercombination matches any of the winning combinations and
   * assigns winning combination to global variable
   * @param {*} playerMark
   * @returns boolean
   */
  function checkIfGameOver(playerMark) {
    let over = false
    winningCombinations.forEach((arr) => {
      let check = arr.every((num) => {
        return getPlayerCombination(playerMark).includes(num)
      })
      if (check) {
        over = true
        winnersCombination = arr
      }
    })
    return over
  }

  /**
   * check whether the array has empty elements or not
   * @param {*} board
   * @returns boolean
   */
  function checkIfBoardIsFilled(board) {
    return Object.values(board).length !== board.length
  }

  /**
   * function that gets called upon gameEnd to determine winner or tie
   * @param {*} playerMark
   * @param {*} playerName
   */
  function gameEnd(playerMark, playerName) {
    if (checkIfGameOver(playerMark)) {
      gameRunning = false
      Board.renderWinningCombination(winnersCombination)
      Display.displayWinner(playerName)
    } else if (!checkIfBoardIsFilled(Board.gameBoard)) {
      gameRunning = false
      Display.displayTie()
    }
  }

  function restart() {
    Board.clearGameBoard()
    Board.gameBoard.length = 0
    gameRunning = true
    Display.clearWinnerContainer()
  }

  // starts the game
  gameStart()

  // onclick event to restart the game
  Display.restartBtn.addEventListener('click', restart)
})()

/**
 * factory to create player objects
 * @param {*} name player name
 * @param {*} mark X or O
 * @param {*} robot is the player an algorithm or not?
 * @param {*} turn players turn
 * @returns
 */
function Player(name, mark, robot, turn) {
  const getName = () => {
    return name
  }

  function makeMove(e) {
    let index = e.target.dataset['id']
    if (Board.gameBoard[index] === undefined) {
      Board.gameBoard[index] = mark
      console.log(Board.gameBoard)
      Board.render()
    }
  }

  return { makeMove, getName, mark, robot, turn }
}
