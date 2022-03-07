const gameBoard = {
    gameBoard: new Array(9),
    gameBoardUI: Array.from(document.querySelectorAll('.cell')),
    render: function() {
        this.gameBoard.forEach((element,index) => {
            this.gameBoardUI[index].textContent = element;
        })
    }
}

const gameController = {
    winningCombinations: [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ],
    gameStart: function() {

    },
    gameEnd: function() {

    }
}

function player(name, mark) {
    const _name = name;
    const _mark = mark;
    let history = [];

    function makeMove() {
        let gameContainer = document.querySelector('.gameContainer');
        gameContainer.addEventListener('click', (e) => {
            let index = e.target.dataset['id'];
            gameBoard.gameBoard[index] = _mark;
            gameBoard.render();
            history.push(index);
        })
    }
    return {makeMove, history};
}



