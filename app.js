/**
 * This Module is responsible of controlling * and storing the game board
 */
const gameBoard = (() => {
  const _board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => {
    return _board;
  };

  const playCell = (index, symbol) => {
    if (index < 9 && index >= 0) {
      _board[index] = symbol;
    }
    return this;
  };

  /**
   * return true if game is won by row combination
   * by the symbol
   * @param {String} symbol
   * @returns bool
   */
  const _checkForRows = (symbol) => {
    for (let row = 0; row < 3; row++) {
      const boardRow = _board.slice(row * 3, (row + 1) * 3);
      if (boardRow.every((el) => el === symbol)) {
        return true;
      }
    }
    return false;
  };

  /**
   * return true if game is won by row combination
   * by the symbol
   * @param {String} symbol
   * @returns bool
   */
  const _checkForColumns = (symbol) => {
    const columns = [
      [_board[0], _board[3], _board[6]],
      [_board[1], _board[4], _board[7]],
      [_board[2], _board[5], _board[8]],
    ];

    for (const col of columns) {
      if (col.every((el) => el === symbol)) {
        return true;
      }
    }

    return false;
  };

  /**
   * return true if game is won by row combination
   * by the symbol
   * @param {String} symbol
   * @returns bool
   */
  const _checkForDiagonals = (symbol) => {
    const diagonals = [
      [_board[0], _board[4], _board[8]],
      [_board[2], _board[4], _board[6]],
    ];

    for (const diagonal of diagonals) {
      if (diagonal.every((el) => el === symbol)) {
        return true;
      }
    }

    return false;
  };

  /**
   * return the winner player or empty string if no player has won
   * @returns "x" || "O" || ""
   */
  const checkForWin = () => {
    // for X
    if (
      _checkForRows("X") ||
      _checkForColumns("X") ||
      _checkForDiagonals("X")
    ) {
      return "X";
    }
    // for O
    if (
      _checkForRows("O") ||
      _checkForColumns("O") ||
      _checkForDiagonals("O")
    ) {
      return "O";
    }
    return "";
  };

  /**
   * checks if the game is tie or not
   * @returns Bool
   */
  const checkForTie = () => {
    const isBoardFull = _board.every((el) => el !== "");
    const isWon = checkForWin();

    return isBoardFull && !isWon;
  };

  /**
   * returns true if there is no possible move
   * @returns boolean
   */
  const isGameOver = () => {
    return checkForTie() || checkForWin() !== "";
  };

  /**
   * resets the board to ""
   */
  const resetBoard = () => {
    for (let i = 0; i < 9; i++) {
      _board[i] = "";
    }
  };

  /**
   * returns true if every element of the board is ""
   * @returns Bool
   */
  const isEmpty = () => {
    return _board.every((cell) => cell === "");
  };

  /**
   * returns the number of empty cells in the board
   * @returns NumOfEmptyCells
   */
  const EmptyCellsNumbers = () => {
    let count = 0;
    for (const cell of _board) {
      if (cell === "") {
        count++;
      }
    }
    return count;
  };

  /**
   * returns the possible moves
   * @returns Array of possible moves indices
   */
  const getLegalMoves = () => {
    const legalMoves = [];

    gameBoard.getBoard().forEach((cell, id) => {
      if (cell === "") {
        legalMoves.push(id);
      }
    });

    return legalMoves;
  };

  return {
    getBoard,
    playCell,
    checkForWin,
    checkForTie,
    resetBoard,
    getLegalMoves,
    isEmpty,
    EmptyCellsNumbers,
    isGameOver,
  };
})();

/**
 * This Module is responsible of rendering elements to the DOM
 * and getting inputs
 */
const displayController = (() => {
  /**
   * game Elements
   */
  const gameConfigElement = document.querySelector(".gameConfig");
  const boardEl = document.querySelector(".board");
  const resultElement = document.querySelector(".result");

  /**
   * managing items
   */
  const cells = boardEl.querySelectorAll(".cell");
  const board = gameBoard.getBoard();

  /**
   * updates the board UI with contents of gameBoard
   */
  const updateBoard = () => {
    cells.forEach((cell, index) => {
      if (board[index] === "X") {
        cell.classList.add("cell--x");
        cell.classList.remove("cell--o");
      } else if (board[index] === "O") {
        cell.classList.add("cell--o");
        cell.classList.remove("cell--x");
      } else if (board[index] === "") {
        cell.classList.remove("cell--x");
        cell.classList.remove("cell--o");
      }
    });
  };

  /**
   * show menu functions
   * they hide all menus expect one that is current
   */
  const showConfigMenu = () => {
    gameConfigElement.classList.remove("hidden");
    boardEl.classList.add("hidden");
    resultElement.classList.add("hidden");
  };

  const showBoard = () => {
    gameConfigElement.classList.add("hidden");
    boardEl.classList.remove("hidden");
    resultElement.classList.add("hidden");
  };

  const showResult = (msg) => {
    gameConfigElement.classList.add("hidden");
    boardEl.classList.add("hidden");
    resultElement.classList.remove("hidden");
    resultElement.querySelector("h2").textContent = msg;
  };

  /**
   * changes the turns in the display
   */
  const exchangeTurns = () => {
    boardEl.classList.toggle("x-turn");
    boardEl.classList.toggle("o-turn");
  };

  /**
   * attaches click events to the board
   */
  const attachCellEvents = () => {
    boardEl.addEventListener("click", (e) => {
      game.play(e);
    });
  };

  const attachBtnEvents = () => {
    document.querySelector("#startBtn").addEventListener("click", () => {
      game.startGame();
    });
    document.querySelector("#restart").addEventListener("click", () => {
      game.restartGame();
    });
  };

  return {
    updateBoard,
    showConfigMenu,
    showBoard,
    showResult,
    exchangeTurns,
    attachCellEvents,
    attachBtnEvents,
  };
})();

/**
 * This Factory is responsible of creating player objs
 * which control player info
 */
const createPlayer = (symbol, type) => {
  return {
    symbol,
    type,
  };
};

/**
 * this module is responsible of making other modules
 * comminute and managing the game on a high value
 */
const game = (() => {
  // players
  let player2;

  const boardEl = document.querySelector(".board");

  /**
   * attaches the events to the DOM
   */
  const init = () => {
    displayController.attachBtnEvents();
    displayController.attachCellEvents();
  };

  /**
   * sets the player and shows the board
   */
  const startGame = () => {
    // display part
    displayController.showBoard();

    // get type of player 2
    const player2Type = document.querySelector("#SelectPlayer").value;

    // create players
    player2 = createPlayer("O", player2Type);

    // update interface
    displayController.updateBoard();
  };

  /**
   * rests board and shows config Menu
   */
  const restartGame = () => {
    gameBoard.resetBoard();
    displayController.updateBoard();
    boardEl.classList.add("x-turn");
    boardEl.classList.remove("o-turn")
    displayController.showConfigMenu();
  };

  /**
   *
   * @param {Number} ms
   * @returns a sleep promise
   */
  const _sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  /**
   * this function marks the player mark in the board
   * it also exchanges turns and updates interface
   * Main Function of the game
   * called when user clicks on the board
   * @param {event} e
   * @returns
   */
  const play = async (e) => {
    const ID = e.target.dataset.cellid;

    if (gameBoard.getBoard()[ID] !== "") {
      return;
    }

    // chooses the type of game based on the player type
    if (player2.type === "human") {
      if (boardEl.classList.contains("x-turn")) {
        gameBoard.playCell(ID, "X");
      } else {
        gameBoard.playCell(ID, "O");
      }
      displayController.exchangeTurns();
    } else if (player2.type === "aiEasy") {
      gameBoard.playCell(ID, "X");
      displayController.exchangeTurns();
      gameBoard.playCell(_aiEasyMove(), "O");
      displayController.exchangeTurns();
    } else if (player2.type === "aiHard") {
      gameBoard.playCell(ID, "X");
      displayController.exchangeTurns();
      console.log(aiMadness.getBestMove(gameBoard.getBoard()));
      gameBoard.playCell(
        aiMadness.getBestMove(gameBoard.getBoard()).bestMove,
        "O"
      );
      displayController.exchangeTurns();
    }

    displayController.updateBoard();
    await _sleep(400);

    // check if the game has ended
    if (gameBoard.checkForWin() === "X") {
      displayController.showResult("X WON!!!");
    } else if (gameBoard.checkForWin() === "O") {
      displayController.showResult("O WON!!!");
    } else if (gameBoard.checkForTie()) {
      displayController.showResult("TIE!!!");
    }
  };

  // gets random move od the legal moves
  const _aiEasyMove = () => {
    const legalMoves = gameBoard.getLegalMoves();
    const randomNum = Math.floor(Math.random() * legalMoves.length);
    return legalMoves[randomNum];
  };

  return {
    play,
    startGame,
    restartGame,
    init,
  };
})();

const aiMadness = (() => {
  /**
   * runs minimax for each move and gets the move with the best score
   * @param {board} board - call it with gameBoard.getBoard()
   */
  const getBestMove = (board) => {
    let bestScore = +Infinity;
    let bestMove;

    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";

        const score = minimax(board, gameBoard.EmptyCellsNumbers(), true); // Next turn will be maximizing player

        // "O" is minimizing so we take the lowest score
        if (score < bestScore) {
          bestScore = score;
          bestMove = i;
        }

        board[i] = "";
      }
    }

    return { bestMove, bestScore };
  };

  /**
   * static evaluation of current position
   * @returns 0 || 1 || -1
   */
  const _evaluatePosition = () => {
    if (gameBoard.checkForTie()) {
      return 0;
    }
    if (gameBoard.checkForWin() === "X") {
      return 1;
    }
    if (gameBoard.checkForWin() === "O") {
      return -1;
    }
  };

  /**
   * returns the score of a move
   * @param {Board} board
   * @param {EmptyCellsNumbers} depth
   * @param {Boolean} maximizingPlayer
   */
  const minimax = (board, depth, maximizingPlayer) => {
    // if depth === 0 or game over in position
    if (depth === 0 || gameBoard.isGameOver()) {
      // return static evaluation of position
      return _evaluatePosition();
    }

    // if maximizingPlayer
    if (maximizingPlayer) {
      // maxEval = -infinity
      let maxEval = -Infinity;
      // for each child of position
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          // eval = minimax(child, depth -1, false)
          board[i] = "X";
          const evaluation = minimax(board, depth - 1, false);
          // undo
          board[i] = "";
          // maxEval = max(maxEval, eval)
          maxEval = Math.max(maxEval, evaluation);
        }
      }
      // return maxEval
      return maxEval;
    }

    // else
    else {
      // minEval = +infinity
      let minEval = +Infinity;
      // for each child of position
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          // eval = minimax(child, depth -1, true)
          board[i] = "O";
          const evaluation = minimax(board, depth - 1, true);
          // UNDO
          board[i] = "";
          // minEval = min(minEval, eval)
          minEval = Math.min(minEval, evaluation);
        }
      }

      // return minEval
      return minEval;
    }
  };

  return {
    getBestMove,
  };
})();

// start game
game.init();
