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
            if(board[row][col] == "") {
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
            if(board[row][0] === board[row][1] && board[row][1] === board[row][2]) return board[row][0];
        }
        for(let col = 0; col < 3; col++) {
            if(board[0][col] === board[1][col] && board[1][col] === board[2][col]) return board[0][col];
        }

        //check diagonal
        if(board[0][0] === board[1][1] === board[2][2]) return board[1][1];
        if(board[0][2] === board[1][1] === board[2][0]) return board[1][1];
        return null;
    }

    return { resetBoard, makeMove, isValidMove, getResult, getBoard};
})();

const game =  (() => {
    const isOver = () => {
        return gameBoard.getResult() != null;
    }
    return {isOver}
})();

function test () {
    gameBoard.makeMove('X', 0, 1);
    gameBoard.makeMove('X', 0, 2);
    gameBoard.makeMove('X', 0, 0);
    console.log('gameBoard.isValidMove(0, 0):', gameBoard.isValidMove(0, 0));
    console.log('gameBoard.isValidMove(1, 1):', gameBoard.isValidMove(1, 1));
    console.log(gameBoard.getBoard());
    console.log(gameBoard.getResult());
    console.log('game.isOver(): ', game.isOver());
}