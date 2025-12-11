// ========================================
// TIC TAC TOE GAME MODULE
// ========================================

window.tictactoeGame = (function() {
  let gameAPI = null;
  let gameConfig = null;
  let gameRunning = false;
  
  let board;
  let currentPlayer;
  let gameOver;
  let scores = [0, 0];
  
  return {
    name: 'tictactoe',
    
    init(api) {
      gameAPI = api;
      gameConfig = api.gameInfo;
      console.log('❌⭕ Tic Tac Toe initialized');
    },
    
    start() {
      if (!gameAPI) {
        console.error('Tic Tac Toe: Game API not initialized');
        return;
      }
      
      initGame();
      gameRunning = true;
      console.log('❌⭕ Tic Tac Toe started');
    },
    
    stop() {
      gameRunning = false;
      console.log('❌⭕ Tic Tac Toe stopped');
    },
    
    handleClick(x, y, event) {
      if (!gameRunning || gameOver) return;
      
      const cellW = gameAPI.canvas.width / 3;
      const cellH = gameAPI.canvas.height / 3;
      
      const row = Math.floor(y / cellH);
      const col = Math.floor(x / cellW);
      
      if (row < 0 || row >= 3 || col < 0 || col >= 3) return;
      if (board[row][col] !== '') return;
      
      board[row][col] = currentPlayer;
      
      if (checkWin(row, col)) {
        gameOver = true;
        scores[currentPlayer === 'X' ? 0 : 1]++;
        gameAPI.updateScore(scores);
        gameAPI.showToast(`🎉 Player ${currentPlayer === 'X' ? 1 : 2} wins!`);
        setTimeout(() => initGame(), 2000);
      } else if (isDraw()) {
        gameOver = true;
        gameAPI.showToast("🤝 It's a draw!");
        setTimeout(() => initGame(), 2000);
      } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        gameAPI.updatePlayerTurn(currentPlayer === 'X' ? 1 : 2);
      }
      
      drawBoard();
    },
    
    handleKeydown(event) {
      if (event.key === 'Escape') {
        gameAPI.returnToMenu?.();
      }
    },
    
    handleMouseMove(x, y, event) {
      // Optional: Add visual feedback on hover
    },
    
    handleResize() {
      drawBoard();
    }
  };
  
  function initGame() {
    board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
    currentPlayer = 'X';
    gameOver = false;
    drawBoard();
    gameAPI.updatePlayerTurn(1);
  }
  
  function drawBoard() {
    if (!gameAPI) return;
    
    const ctx = gameAPI.ctx;
    const canvas = gameAPI.canvas;
    
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 3;
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
          drawX(x, y, cellW / 2 - 15);
        } else if (board[row][col] === 'O') {
          drawO(x, y, cellW / 2 - 15);
        }
      }
    }
  }
  
  function drawX(x, y, size) {
    const ctx = gameAPI.ctx;
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x - size, y - size);
    ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y - size);
    ctx.lineTo(x - size, y + size);
    ctx.stroke();
  }
  
  function drawO(x, y, radius) {
    const ctx = gameAPI.ctx;
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  function checkWin(row, col) {
    const current = board[row][col];
    
    // Check row
    if (board[row].every(cell => cell === current)) return true;
    
    // Check column
    let colWin = true;
    for (let i = 0; i < 3; i++) {
      if (board[i][col] !== current) {
        colWin = false;
        break;
      }
    }
    if (colWin) return true;
    
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
})();

console.log('❌⭕ Tic Tac Toe game module loaded successfully!');