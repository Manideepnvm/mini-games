// ========================================
// 4-PLAYER PONG GAME MODULE
// ========================================

window.fourplayerpongGame = (function() {
  let gameAPI = null;
  let gameConfig = null;
  let gameRunning = false;
  
  let ball = { x: 400, y: 300, dx: 3, dy: 3 };
  let paddlePositions = [0, 0, 0, 0];
  const PADDLE_HEIGHT = 80;
  const PADDLE_WIDTH = 10;
  let gameLoop = null;
  let scores = [0, 0, 0, 0];
  const PADDLE_COLORS = ['#00ff88', '#ff4444', '#ffaa00', '#00d4ff'];
  
  return {
    name: 'fourplayerpong',
    
    init(api) {
      gameAPI = api;
      gameConfig = api.gameInfo;
      console.log('🏓⚡ 4-Player Pong initialized');
    },
    
    start() {
      if (!gameAPI) {
        console.error('4-Player Pong: Game API not initialized');
        return;
      }
      
      initGame();
      gameRunning = true;
      console.log('🏓⚡ 4-Player Pong started');
    },
    
    stop() {
      gameRunning = false;
      if (gameLoop) clearInterval(gameLoop);
      console.log('🏓⚡ 4-Player Pong stopped');
    },
    
    handleClick(x, y, event) {
      if (!gameRunning) return;
    },
    
    handleKeydown(event) {
      if (!gameRunning) return;
      
      const step = 15;
      const key = event.key.toLowerCase();
      
      // Player 1 (Left): A/Z
      if (key === 'a') paddlePositions[3] = Math.max(0, paddlePositions[3] - step);
      if (key === 'z') paddlePositions[3] = Math.min(gameAPI.canvas.height - PADDLE_HEIGHT, paddlePositions[3] + step);
      
      // Player 2 (Right): I/K
      if (key === 'i') paddlePositions[1] = Math.max(0, paddlePositions[1] - step);
      if (key === 'k') paddlePositions[1] = Math.min(gameAPI.canvas.height - PADDLE_HEIGHT, paddlePositions[1] + step);
      
      // Player 3 (Top): J/L
      if (key === 'j') paddlePositions[0] = Math.max(0, paddlePositions[0] - step);
      if (key === 'l') paddlePositions[0] = Math.min(gameAPI.canvas.width - PADDLE_HEIGHT, paddlePositions[0] + step);
      
      // Player 4 (Bottom): D/C
      if (key === 'd') paddlePositions[2] = Math.max(0, paddlePositions[2] - step);
      if (key === 'c') paddlePositions[2] = Math.min(gameAPI.canvas.width - PADDLE_HEIGHT, paddlePositions[2] + step);
      
      if (key === 'escape') {
        gameAPI.returnToMenu?.();
      }
    },
    
    handleMouseMove(x, y, event) {},
    
    handleResize() {
      drawGame();
    }
  };
  
  function initGame() {
    ball = { x: gameAPI.canvas.width / 2, y: gameAPI.canvas.height / 2, dx: 3, dy: 3 };
    paddlePositions = [0, 0, 0, 0];
    drawGame();
    startGameLoop();
  }
  
  function startGameLoop() {
    gameLoop = setInterval(() => {
      if (!gameRunning) {
        clearInterval(gameLoop);
        return;
      }
      
      updateGame();
      drawGame();
    }, 1000 / 60);
  }
  
  function updateGame() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    const radius = 8;
    const canvas = gameAPI.canvas;
    
    // Boundary collisions
    if (ball.x - radius < 0 || ball.x + radius > canvas.width) {
      ball.dx *= -1;
    }
    if (ball.y - radius < 0 || ball.y + radius > canvas.height) {
      ball.dy *= -1;
    }
    
    // Paddle collisions
    // Left paddle
    if (ball.x - radius <= PADDLE_WIDTH && 
        ball.y >= paddlePositions[3] && 
        ball.y <= paddlePositions[3] + PADDLE_HEIGHT) {
      ball.dx = Math.abs(ball.dx);
    }
    
    // Right paddle
    if (ball.x + radius >= canvas.width - PADDLE_WIDTH && 
        ball.y >= paddlePositions[1] && 
        ball.y <= paddlePositions[1] + PADDLE_HEIGHT) {
      ball.dx = -Math.abs(ball.dx);
    }
    
    // Top paddle
    if (ball.y - radius <= PADDLE_WIDTH && 
        ball.x >= paddlePositions[0] && 
        ball.x <= paddlePositions[0] + PADDLE_HEIGHT) {
      ball.dy = Math.abs(ball.dy);
    }
    
    // Bottom paddle
    if (ball.y + radius >= canvas.height - PADDLE_WIDTH && 
        ball.x >= paddlePositions[2] && 
        ball.x <= paddlePositions[2] + PADDLE_HEIGHT) {
      ball.dy = -Math.abs(ball.dy);
    }
    
    // Out of bounds check
    if (ball.x < 0 || ball.x > canvas.width || ball.y < 0 || ball.y > canvas.height) {
      resetBall();
    }
  }
  
  function resetBall() {
    const canvas = gameAPI.canvas;
    ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 3, dy: 3 };
  }
  
  function drawGame() {
    if (!gameAPI) return;
    
    const ctx = gameAPI.ctx;
    const canvas = gameAPI.canvas;
    
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw ball
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw paddles
    // Left paddle
    ctx.fillStyle = PADDLE_COLORS[0];
    ctx.fillRect(0, paddlePositions[3], PADDLE_WIDTH, PADDLE_HEIGHT);
    
    // Right paddle
    ctx.fillStyle = PADDLE_COLORS[1];
    ctx.fillRect(canvas.width - PADDLE_WIDTH, paddlePositions[1], PADDLE_WIDTH, PADDLE_HEIGHT);
    
    // Top paddle
    ctx.fillStyle = PADDLE_COLORS[2];
    ctx.fillRect(paddlePositions[0], 0, PADDLE_HEIGHT, PADDLE_WIDTH);
    
    // Bottom paddle
    ctx.fillStyle = PADDLE_COLORS[3];
    ctx.fillRect(paddlePositions[2], canvas.height - PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_WIDTH);
    
    // Draw controls info
    ctx.fillStyle = '#888888';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('P1: A/Z  P2: I/K  P3: J/L  P4: D/C', 10, 15);
  }
})();

console.log('🏓⚡ 4-Player Pong game module loaded successfully!');