const Player = (name, symbol) => {
    return { name , symbol};
}

const gameBoard = (() => {
    let board = [
        ["","",""],
        ["","",""],
        ["","",""],
    ];

    //REMOVE after done testing
    const getBoard = () => {
        return board;
    };

    const resetBoard = () => {
        board = [
            ["","",""],
            ["","",""],
            ["","",""],
        ];
    }

    const isValidMove = (row, col) => {
        if(row >= 0 && row < 3 && col >= 0 && col < 3) {
            if(!board[row][col]) {
                return true;
            }
        }
        return false;
    }

    //precondition: isValidMove == true
    const makeMove = (symbol, row, col) => {
        board[row][col] = symbol;
    }

    const getResult = () => {
        for(let row = 0; row < 3; row++) {
            if(board[row][0] && board[row][0] === board[row][1] && board[row][1] === board[row][2]) return board[row][0];
        }
        for(let col = 0; col < 3; col++) {
            if(board[0][col] && board[0][col] === board[1][col] && board[1][col] === board[2][col]) return board[0][col];
        }

        //check diagonal
        if(board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return board[1][1];
        if(board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return board[1][1];

        let numEmptySquares = 0;
        for(let row = 0; row < 3; row++) {
            for(let col = 0; col < 3; col++) {
                if(board[row][col] == "")
                    numEmptySquares++;
            }
        }
        if(numEmptySquares > 0) return "Tie";
        return null;
    }

    return { resetBoard, makeMove, isValidMove, getResult, getBoard};
})();

const displayController =  (() => {
    const player1 = Player('Player 1', 'X');
    const player2 = Player('Player 2', 'O');
    let currentPlayer = player1;

    const isOver = () => {
        return gameBoard.getResult() != null;
    }

    //replace names if not null
    const changePlayerNames = (nameArr) => {
        if(nameArr[0]) player1.name = nameArr[0];
        if(nameArr[1]) player2.name = nameArr[1];
    }

    const nextTurn = () => {
        currentPlayer = currentPlayer == player1 ? player2 : player1;
    }

    const cellPressed = (e) => {
        const row = e.target.dataset.row;
        const col = e.target.dataset.col;
        if(gameBoard.isValidMove(row, col)) {
            gameBoard.makeMove(currentPlayer.symbol, row, col);
            e.target.innerHTML = currentPlayer.symbol;
            nextTurn();
        }
    }

    return {
        isOver,
        changePlayerNames,
        cellPressed,
    }
})();

function test () {
    gameBoard.makeMove('X', 0, 1);
    gameBoard.makeMove('X', 0, 2);
    gameBoard.makeMove('X', 0, 0);
    console.log('gameBoard.isValidMove(0, 0):', gameBoard.isValidMove(0, 0));
    console.log('gameBoard.isValidMove(1, 1):', gameBoard.isValidMove(1, 1));
    console.log(gameBoard.getBoard());
    console.log(gameBoard.getResult());
    console.log('displayController.isOver(): ', displayController.isOver());
}

function createDOMGrid() {
    const board = document.getElementById('board');
    for(let i = 0; i < 3; i++) {
        const row = document.createElement('div');
        row.classList.add('row');

        for(let j = 0; j < 3; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', displayController.cellPressed)

            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

createDOMGrid();