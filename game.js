"use strict";

// Controls the Overlay functionalities
const overlay = (function() {
    const playerBtn = document.querySelector('#playerVsPlayer');
    const algoBtn = document.querySelector('#playerVsAlgo');
    const playerContainer = document.querySelector('.playerContainer');
    const algoContainer = document.querySelector('.algoContainer');
    
    // displayContainer();

    function displayContainer() {
        playerBtn.addEventListener('click', () => {
            playerContainer.hidden = false;
            algoContainer.hidden = true;
           }) 
           algoBtn.addEventListener('click', () => {
            playerContainer.hidden = true;
            algoContainer.hidden = false;
           })
    } 

    function displayWinner(player) {
        document.querySelector('.winnerContainer').textContent = `${player} wins!`;
    }

    function displayTie() {
        document.querySelector('.winnerContainer').textContent = "It's a tie!";
    }

    function clearWinnerContainer() {
        document.querySelector('.winnerContainer').textContent = '';
    }

    return {displayWinner, displayTie, clearWinnerContainer}

})();

/**
 * gameboard module
 * fills the gameboard with elements
 */
const gameBoard = (function() {
    let gameBoard = [];
    let gameBoardUI = Array.from(document.querySelectorAll('.cell'));
    
    // renders the content of our gameboard to the DOM gameboard
    function render() {
        gameBoard.forEach((element,index) => {
            gameBoardUI[index].textContent = element;
        })
    };

    // clears the DOM gameboard
    function clearGameBoard() {
        gameBoardUI.forEach((el) => {
           el.classList.remove('winner');
           el.textContent = '' ;
        })
    }

    // displays the winning combination on the DOM
    function renderWinningCombination(arr) {
        arr.forEach((index) => {
            gameBoardUI[index].classList.add('winner');
        })
    }

    return {render, renderWinningCombination, clearGameBoard, gameBoard};
})();

/**
 * gamecontroller module
 * controls the flow of the game
 */
const gameController = (function() {
    // get player name DOM elements
    const displayPlayer1 = document.querySelector('#player1');
    const displayPlayer2 = document.querySelector('#player2');

    // create the players
    const player1 = Player('Player 1', 'X', false, true);
    const player2 = Player('Player 2', 'O', false, false);

    // set the DOM elements to player's names accordingly
    displayPlayer1.textContent = player1.getName();
    displayPlayer2.textContent = player2.getName();

    // all possibilities to win the game
    const winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    // initial boolean to determine whether the game is running or not
    let gameRunning = false;

    // starts the game
    gameStart();

    // onclick event to restart the game
    document.querySelector('.restartBtn').addEventListener('click', restart);

    // function to start the gameloop
    function gameStart() {
        let gameContainer = document.querySelector('.gameContainer');
        gameRunning = true;
        gameContainer.addEventListener('click', (e) => {
            if (player1.turn && gameRunning) {
                player1.makeMove(e);
                player1.turn = false;
                player2.turn = true;
                // console.log(getPlayerCombination(player1.mark));
                gameEnd(player1.mark, player1.getName());
            } else if (player2.turn && gameRunning) {
                player2.makeMove(e);
                player2.turn = false;
                player1.turn = true;
                gameEnd(player2.mark, player2.getName());
            }
        }) 
    };
    
    // function to get an array of indizes of the players mark 
    // to compare against the gameBoard array
    function getPlayerCombination (playerMark) {
        return gameBoard.gameBoard.map((el, index) => {
            if (el === playerMark) return index;
        }).filter((el) => {return typeof(el) == 'number'});
    } 

    // function checks if game is over by going trough all winning combinations and
    // checking whether the player combination is one of them
    function checkIfGameOver(playerMark) {
        let over = null;
        winningCombinations.forEach((arr) => {
            let check = arr.every((num) => {
               return getPlayerCombination(playerMark).includes(num);
            })
            check ? over = true : false;
        })
        return over;
    };

    // calls functions to render the winning combination on DOM and to display the winner
    function gameEnd(playerMark, playerName) {
        if(checkIfGameOver(playerMark)) {
            gameRunning = false;
            gameBoard.renderWinningCombination(getPlayerCombination(playerMark));
            overlay.displayWinner(playerName);
        } else if (gameBoard.gameBoard.length == 9) {
            gameRunning = false;
            overlay.displayTie();
        }
    }

    // restart the game
    function restart() {
        gameBoard.clearGameBoard();
        gameBoard.gameBoard.length = 0;
        gameRunning = true;
        overlay.clearWinnerContainer();
    }
})();

/**
 * factory to create player objects
 * @param {*} name player name
 * @param {*} mark X or O
 * @param {*} algo is the player an algorithm or not?
 * @param {*} turn players turn
 * @returns 
 */
function Player(name, mark, algo, turn) {
    const getName = () => {return name};

    function makeMove(e) {
        let index = e.target.dataset['id'];
        if (gameBoard.gameBoard[index] === undefined) {
            gameBoard.gameBoard[index] = mark;
            gameBoard.render();
        }
    }

    return {makeMove, getName, mark, algo, turn};
}