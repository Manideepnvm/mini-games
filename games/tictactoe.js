let board;
let currentPlayer;
let gameOver;

function start() {
  initGame();
  drawBoard();
}

function initGame() {
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  currentPlayer = 'X';
  gameOver = false;
  canvas.addEventListener('click', handleClick);
}

function drawBoard() {
  clearCanvas();

  // Draw grid lines
  ctx.strokeStyle = "#fff";
  const w = canvas.width;
  const h = canvas.height;
  const cellW = w / 3;
  const cellH = h / 3;

  for (let i = 1; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellW, 0);
    ctx.lineTo(i * cellW, h);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * cellH);
    ctx.lineTo(w, i * cellH);
    ctx.stroke();
  }

  // Draw Xs and Os
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const x = col * cellW + cellW / 2;
      const y = row * cellH + cellH / 2;
      if (board[row][col] === 'X') {
        drawX(x, y, cellW / 2 - 10);
      } else if (board[row][col] === 'O') {
        drawO(x, y, cellW / 2 - 10);
      }
    }
  }
}

function drawX(x, y, size) {
  ctx.strokeStyle = "cyan";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - size, y - size);
  ctx.lineTo(x + size, y + size);
  ctx.moveTo(x + size, y - size);
  ctx.lineTo(x - size, y + size);
  ctx.stroke();
}

function drawO(x, y, radius) {
  ctx.strokeStyle = "magenta";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function handleClick(e) {
  if (gameOver) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const cellW = canvas.width / 3;
  const cellH = canvas.height / 3;

  const row = Math.floor(y / cellH);
  const col = Math.floor(x / cellW);

  if (board[row][col] !== '') return;

  board[row][col] = currentPlayer;

  if (checkWin(row, col)) {
    gameOver = true;
    setTimeout(() => alert(`🎉 Player ${currentPlayer} wins!`), 10);
    showMenu();
  } else if (isDraw()) {
    gameOver = true;
    setTimeout(() => alert("🤝 It's a draw!"), 10);
    showMenu();
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }

  drawBoard();
}

function checkWin(row, col) {
  const current = board[row][col];

  // Check row
  if (board[row].every(cell => cell === current)) return true;

  // Check column
  for (let i = 0; i < 3; i++) {
    if (board[i][col] !== current) break;
    if (i === 2) return true;
  }

  // Check diagonal \
  if (row === col) {
    let win = true;
    for (let i = 0; i < 3; i++) {
      if (board[i][i] !== current) {
        win = false;
        break;
      }
    }
    if (win) return true;
  }

  // Check diagonal /
  if (row + col === 2) {
    let win = true;
    for (let i = 0; i < 3; i++) {
      if (board[i][2 - i] !== current) {
        win = false;
        break;
      }
    }
    if (win) return true;
  }

  return false;
}

function isDraw() {
  return board.every(row => row.every(cell => cell !== ''));
}

function showMenu() {
  document.getElementById("menu").style.display = "block";
}