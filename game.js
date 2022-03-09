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
    let gameBoard = new Array(9);
    let gameBoardUI = Array.from(document.querySelectorAll('.cell'));
    
    render();

    function render() {
        gameBoard.forEach((element,index) => {
            gameBoardUI[index].textContent = element;
        })
    };

    return {render, gameBoard};
})();

// controls the flow of the game
const gameController = (function() {
    const player1 = Player('John', 'X');

    let rounds = 0;
    let turn = 1;

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

    function gameStart() {
        player1.makeMove();
    };

    function checkIfGameOver(playerHistory) {
        winningCombinations.forEach((arr) => {
            let check = arr.every((num) => {
                return playerHistory.includes(num);
            })
        })
    };

    function gameEnd() {

    }
})();

// factory to create player objects
function Player(name, mark, turn) {
    const getName = () => {return name};
    const getMark = () => {return mark};

    function makeMove() {
        let gameContainer = document.querySelector('.gameContainer');
        gameContainer.addEventListener('click', (e) => {
            let index = e.target.dataset['id'];
            
            if (gameBoard.gameBoard[index] === undefined) {
                gameBoard.gameBoard[index] = mark;
                gameBoard.render();
                // console.log(typeof _history[0]);
            }
        })
    }

    return {makeMove, getName, getMark};
}