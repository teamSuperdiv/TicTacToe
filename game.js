"use strict";

// Controls the Overlay functionalities
// const overlay = (function() {
//     const playerBtn = document.querySelector('#playerVsPlayer');
//     const algoBtn = document.querySelector('#playerVsAlgo');
//     const playerContainer = document.querySelector('.playerContainer');
//     const algoContainer = document.querySelector('.algoContainer');

//     displayContainer();

//     function displayContainer() {
//         playerBtn.addEventListener('click', () => {
//             playerContainer.hidden = false;
//             algoContainer.hidden = true;
//            }) 
//            algoBtn.addEventListener('click', () => {
//             playerContainer.hidden = true;
//             algoContainer.hidden = false;
//            })
//     } 
// })();

/**
 * gameboard module
 * fills the gameboard with elements
 */
const gameBoard = (function() {
    let gameBoard = [];
    let gameBoardUI = Array.from(document.querySelectorAll('.cell'));
    
    render();

    function render() {
        gameBoard.forEach((element,index) => {
            gameBoardUI[index].textContent = element;
        })
    };

    function renderWinningCombination(arr) {
        arr.forEach((index) => {
            gameBoardUI[index].classList.add('winner');
        })
    }

    return {render, renderWinningCombination, gameBoard};
})();

/**
 * gamecontroller module
 * controls the flow of the game
 */
const gameController = (function() {
    const displayPlayer1 = document.querySelector('#player1');
    const displayPlayer2 = document.querySelector('#player2');

    const player1 = Player('Player 1', 'X', false, true);
    const player2 = Player('Player 2', 'O', false, false);

    displayPlayer1.textContent = player1.getName();
    displayPlayer2.textContent = player2.getName();

    let rounds = 0;

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

    gameStart();

    // function to start the game
    function gameStart() {
        let gameContainer = document.querySelector('.gameContainer');
        gameContainer.addEventListener('click', (e) => {
            if (player1.turn) {
                player1.makeMove(e);
                player1.turn = false;
                player2.turn = true;
                rounds++;
                console.log(getPlayerCombination(player1.mark));
                gameEnd(player1.mark, player1.getName());
            } else if (player2.turn) {
                player2.makeMove(e);
                player2.turn = false;
                player1.turn = true;
                rounds++;
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

    function gameEnd(playerMark, playerName) {
        if(checkIfGameOver(playerMark)) {
            console.log(`Game over! The winner is ${playerName}!`);
            gameBoard.renderWinningCombination(getPlayerCombination(playerMark));
        }
        
    }

    function restart() {
        gameBoard.gameBoard = [];
        gameBoard.render();
        gameStart();
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