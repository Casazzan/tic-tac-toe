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
                if(board[row][col] == "") {
                    numEmptySquares++;
                }
            }
        }
        if(numEmptySquares == 0) return "Tie";
        return null;
    }

    const unmakeMove = (row, col) => {
        board[row][col] = "";
    }
    return { 
        resetBoard,
        makeMove,
        isValidMove,
        getResult,
        getBoard,
        unmakeMove,
    };
})();

const displayController =  (() => {
    const player1 = Player('Player', 'X');
    const player2 = Player('AI', 'O');

    let currentPlayer = player1;
    let gameOver = false;

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
        if(currentPlayer.name == 'AI') {
            setTimeout( () => { makeAIMove() }, 1500);
        }
    }

    const makeAIMove = () => {
        const move = AI.getMove();
        const cells = document.querySelectorAll('.cell');
        cells.forEach( (cell) => {
            if(cell.dataset.row == move.row && cell.dataset.col == move.col){
                cell.innerHTML = currentPlayer.symbol;
            }
        });
        makeMove(move.row, move.col);
    }

    const stringifyResult = (result) =>{
        if(result == 'Tie'){
            return 'Tie!';
        }
        else {
            const playername = currentPlayer.name == 'AI' ? 'Computer': currentPlayer.name;
            return (playername + '(' + currentPlayer.symbol + ') Wins!');
        }
    }

    const cellPressed = (e) => {
        if(gameOver || currentPlayer.name == 'AI') return;
        const row = e.target.dataset.row;
        const col = e.target.dataset.col;
        if(gameBoard.isValidMove(row, col)) {
            e.target.innerHTML = currentPlayer.symbol;
            makeMove(row, col);
        }
    }

    const displayResult = (result) => {
        const container = document.querySelector('body');
        const p = document.createElement('p');
        p.textContent = result;
        container.appendChild(p);
    }

    const makeMove = (row, col) => {
        gameBoard.makeMove(currentPlayer.symbol, row, col);
        if(isOver()) {
            const result = gameBoard.getResult();
            displayResult( stringifyResult(result) );
            gameOver = true;
        }
        else {
            nextTurn();
        }
    }

    const reset = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach( cell => {
            cell.innerHTML = "";
        });
        gameBoard.resetBoard();
        
        gameOver = false;
        currentPlayer = player1;
    }

    return {
        changePlayerNames,
        cellPressed,
        reset,
    }
})();

const AI = (() => {
    let playerSymbol = 'X';
    let AISymbol = 'O';
    let tempBoard;
    let bestMove;

    const getEmptyNodes = () => {
        let nodeList = [];
        for(let row = 0; row < 3; row++) {
            for(let col = 0; col < 3; col++) {
                if(tempBoard[row][col] == "") {
                    nodeList.push( {row, col} );
                }
            }
        }
        return nodeList;
    }

    const getHueristic = () => {
        let result = gameBoard.getResult();
        if(result == AISymbol) return 2;
        if(result == 'Tie') return 1;
        if(result == playerSymbol) return -1;
        return null;
    }


    const minimax = (nodeList, maximizingPlayer, isImmediateMove) => {
        if(getHueristic() !== null) return getHueristic();
        if(maximizingPlayer) {
            let value = -2;
            for(let i = 0; i < nodeList.length; i++) {
                const tempNode = nodeList.splice(i, 1)[0];
                gameBoard.makeMove(AISymbol, tempNode.row, tempNode.col);
                let tempValue = minimax(nodeList, false, false);
                if(tempValue > value) {
                    if(isImmediateMove) {
                        bestMove = tempNode;
                    }
                    value = tempValue;
                }
                gameBoard.unmakeMove(tempNode.row, tempNode.col);
                nodeList.splice(i, 0, tempNode);
            }
            return value;
        }
        else {
            let value = 3;
            for(let i = 0; i < nodeList.length; i++) {
                const tempNode = nodeList.splice(i, 1)[0];
                gameBoard.makeMove(playerSymbol, tempNode.row, tempNode.col);
                value = Math.min(value, minimax(nodeList, true, false));
                gameBoard.unmakeMove(tempNode.row, tempNode.col);
                nodeList.splice(i, 0, tempNode);
            }
            return value;
        }
    }

    const getMove = () => {
        tempBoard = gameBoard.getBoard();
        let nodeList = getEmptyNodes();
        minimax(nodeList, true, true);
        return bestMove;
    }

    return {
        getMove,
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
    document.getElementById('reset').addEventListener('click', displayController.reset);
}

createDOMGrid();