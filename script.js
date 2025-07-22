const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const status = document.getElementById("status");
const turnIndicator = document.getElementById("turn-indicator");
const playerScoreEl = document.getElementById("playerScore");
const aiScoreEl = document.getElementById("aiScore");
const drawScoreEl = document.getElementById("drawScore");

let boardState = Array(9).fill("");
let player = "X";
let ai = "O";
let gameActive = false;
let playerScore = 0, aiScore = 0, drawScore = 0;

function startNewGame() {
  boardState = Array(9).fill("");
  gameActive = true;
  status.textContent = "";
  updateBoard();
  turnIndicator.textContent = "Your turn!";
}

function restartGame() {
  playerScore = aiScore = drawScore = 0;
  updateScore();
  startNewGame();
}

function updateBoard() {
  cells.forEach((cell, index) => {
    cell.textContent = boardState[index];
    cell.style.pointerEvents = boardState[index] === "" && gameActive ? "auto" : "none";
  });
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (boardState[index] || !gameActive) return;

  boardState[index] = player;
  updateBoard();

  if (checkWinner(boardState, player)) {
    endGame("You win!");
    playerScore++;
    updateScore();
    return;
  }

  if (isDraw(boardState)) {
    endGame("It's a draw!");
    drawScore++;
    updateScore();
    return;
  }

  turnIndicator.textContent = "AI is thinking...";
  setTimeout(() => {
    const bestMove = getBestMove(boardState);
    boardState[bestMove] = ai;
    updateBoard();

    if (checkWinner(boardState, ai)) {
      endGame("AI wins!");
      aiScore++;
      updateScore();
      return;
    }

    if (isDraw(boardState)) {
      endGame("It's a draw!");
      drawScore++;
      updateScore();
      return;
    }

    turnIndicator.textContent = "Your turn!";
  }, 400);
}

function endGame(message) {
  gameActive = false;
  status.textContent = message;
  turnIndicator.textContent = "";
  cells.forEach(cell => cell.style.pointerEvents = "none");
}

function updateScore() {
  playerScoreEl.textContent = playerScore;
  aiScoreEl.textContent = aiScore;
  drawScoreEl.textContent = drawScore;
}

function checkWinner(board, symbol) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return winPatterns.some(pattern => 
    pattern.every(index => board[index] === symbol)
  );
}

function isDraw(board) {
  return board.every(cell => cell !== "");
}

function getBestMove(board) {
  let bestScore = -Infinity;
  let move;
  board.forEach((cell, index) => {
    if (cell === "") {
      board[index] = ai;
      let score = minimax(board, 0, false);
      board[index] = "";
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });
  return move;
}

function minimax(board, depth, isMaximizing) {
  if (checkWinner(board, ai)) return 10 - depth;
  if (checkWinner(board, player)) return depth - 10;
  if (isDraw(board)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    board.forEach((cell, index) => {
      if (cell === "") {
        board[index] = ai;
        best = Math.max(best, minimax(board, depth + 1, false));
        board[index] = "";
      }
    });
    return best;
  } else {
    let best = Infinity;
    board.forEach((cell, index) => {
      if (cell === "") {
        board[index] = player;
        best = Math.min(best, minimax(board, depth + 1, true));
        board[index] = "";
      }
    });
    return best;
  }
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
startNewGame();
