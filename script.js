const Player = (name, symbol) => {
    const toString = () => {
        return name + ' (' + symbol +')';
    }
    return { name , symbol, toString};
}


const gameBoard = (() => {
    let board = [
        ["","",""],
        ["","",""],
        ["","",""],
    ];

    //for AI
    const getBoard = () => {
        return board;
    }

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

    const unmakeMove = (row, col) => {
        board[row][col] = "";
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

    const getWinningCells = () => {
        for(let row = 0; row < 3; row++) {
            if(board[row][0] === board[row][1] && board[row][1] === board[row][2]){
                return [{row, 'col':0}, {row, 'col':1}, {row, 'col': 2}];
            }
        }
        for(let col = 0; col < 3; col++) {
            if(board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
                return [{'row':0, col}, {'row':1, col}, {'row':2, col}];
            }
        }

        //check diagonal
        if(board[0][0] === board[1][1] && board[1][1] === board[2][2]){
            return [{'row':0,'col':0},{'row':1,'col':1},{'row':2,'col':2}];
        }
        if(board[0][2] === board[1][1] && board[1][1] === board[2][0]){
            return [{'row':0,'col':2},{'row':1,'col':1},{'row':2,'col':0}];
        }
    }

    return { 
        resetBoard,
        makeMove,
        isValidMove,
        getResult,
        unmakeMove,
        getWinningCells,
        getBoard,
    };
})();


const displayController =  (() => {
    let player1 = Player('Player 1', 'X');
    let player2 = Player('Computer', 'O');

    let currentPlayer = player1;
    let gameOver = false;



    //player move handlers
    const nextTurn = () => {
        currentPlayer = currentPlayer == player1 ? player2 : player1;
        if(currentPlayer.name == 'Computer') {
            setTimeout( () => { makeAIMove() }, 1000);
        }
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

    const cellPressed = (e) => {
        if(gameOver || currentPlayer.name == 'Computer') return;
        const row = e.target.dataset.row;
        const col = e.target.dataset.col;
        if(gameBoard.isValidMove(row, col)) {
            e.target.innerHTML = currentPlayer.symbol;
            makeMove(row, col);
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


    //game over handlers
    const isOver = () => {
        return gameBoard.getResult() != null;
    }
    
    const stringifyResult = (result) =>{
        if(result == 'Tie'){
            return 'Tie!';
        }
        else {
            return (currentPlayer.toString() +' Wins!');
        }
    }

    const displayResult = (result) => {
        const container = document.querySelector('body');
        const p = document.createElement('p');
        p.textContent = result;
        p.classList.add('result-display');
        container.appendChild(p);

        if(result.includes('Wins')) {
            const winningCells = gameBoard.getWinningCells();
            const displayCells = document.querySelectorAll('.cell');
            displayCells.forEach( (displayCell) => {
                winningCells.forEach( (winningCell) => {
                    if(displayCell.dataset.row == winningCell.row && displayCell.dataset.col == winningCell.col) {
                        displayCell.classList.add('winning-cell');
                    }
                });
            });
        }
    }


    //name change handlers
    const isLegalName = (name, isFirst) => {
        if(name.includes('Wins') || (name.includes('Computer') && isFirst)) {
            alert('Illegal name');
            return false;
        }
        return true;
    }

    const updatePlayerInfo = () => {
        const playerInfos = document.querySelectorAll('.player-info');
        playerInfos[0].textContent = player1.toString();
        playerInfos[1].textContent = player2.toString();
    }

    const toggleView = () => {
        const playerInfos = document.querySelectorAll('.player-info');
        playerInfos.forEach( (playerInfo) => {playerInfo.classList.toggle('hidden')});
        const playerInputs = document.querySelectorAll('.player-input');
        playerInputs.forEach( (playerInput) => {playerInput.classList.toggle('hidden')});
        document.querySelector('#submit-names').classList.toggle('hidden');
        document.querySelector('#change-players').classList.toggle('hidden');
    }

    const changePlayerNames = () => {
        toggleView();
        document.querySelector('#player1').focus();
    }

    const submitPlayerNames = () => {
        const player1Input = document.querySelector('#player1');
        const player1Name = player1Input.value;
        player1Input.value = "";
        const player2Input = document.querySelector('#player2');
        const player2Name = player2Input.value;
        player2Input.value = "";
        if(isLegalName(player1Name, true)) {
            player1= Player(player1Name ? player1Name : 'Player 1', 'X');
            if(isLegalName(player2Name, false)){
                player2 = Player(player2Name ? player2Name : 'Player 2', 'O');
                toggleView();
                reset();
                updatePlayerInfo();
            }
        }
    }


    //reset handlers
    const reset = () => {
        const cover = document.getElementById('board-cover');
        cover.classList.add('slide-in');
        cover.classList.remove('slide-out');
        cover.addEventListener('animationend', resetDisplay);
    }

    const resetDisplay = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach( cell => {
            cell.innerHTML = "";
            cell.classList.remove('winning-cell');
        });
        gameBoard.resetBoard();

        const endResult = document.querySelector('.result-display');
        if(endResult){
            endResult.parentElement.removeChild(endResult);
        }
        
        gameOver = false;
        currentPlayer = player1;

        const cover = document.getElementById('board-cover');
        cover.removeEventListener('animationend', resetDisplay);
        cover.classList.remove('slide-in');
        cover.classList.add('slide-out');
    }

    return {
        changePlayerNames,
        cellPressed,
        reset,
        updatePlayerInfo,
        submitPlayerNames,
    }
})();


const AI = (() => {
    let playerSymbol = 'X';
    let AISymbol = 'O';
    let tempBoard;
    let bestMove;

    const getMove = () => {
        tempBoard = gameBoard.getBoard();
        let nodeList = getEmptyNodes();
        minimax(nodeList, true, true);
        return bestMove;
    }

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

    return {
        getMove,
    }
})();

function createDOM() {
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
    document.getElementById('restart').addEventListener('click', displayController.reset);
    document.getElementById('change-players').addEventListener('click', displayController.changePlayerNames);
    document.getElementById('submit-names').addEventListener('click', displayController.submitPlayerNames);
    displayController.updatePlayerInfo();
}

createDOM();