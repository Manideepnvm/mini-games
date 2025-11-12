// ========================================
// SNAKE RACE GAME MODULE (4-Player)
// ========================================

window.snkeraceGame = (function() {
  let gameAPI = null;
  let gameConfig = null;
  let gameRunning = false;
  
  let snakes = [];
  let directions = [];
  const SNAKE_COLOR = ['#00ff88', '#ff4444', '#ffaa00', '#00d4ff'];
  const GRID_SIZE = 20;
  let gameLoop = null;
  let scores = [0, 0, 0, 0];
  
  return {
    name: 'snakerace',
    
    init(api) {
      gameAPI = api;
      gameConfig = api.gameInfo;
      console.log('🐍🏁 Snake Race initialized');
    },
    
    start() {
      if (!gameAPI) {
        console.error('Snake Race: Game API not initialized');
        return;
      }
      
      initGame();
      gameRunning = true;
      console.log('🐍🏁 Snake Race started');
    },
    
    stop() {
      gameRunning = false;
      if (gameLoop) clearTimeout(gameLoop);
      console.log('🐍🏁 Snake Race stopped');
    },
    
    handleClick(x, y, event) {
      if (!gameRunning) return;
    },
    
    handleKeydown(event) {
      if (!gameRunning) return;
      
      const key = event.key.toLowerCase();
      const speed = 1;
      
      // Player 1: Arrow keys
      if (key === 'arrowup' && directions[0].y === 0) directions[0] = { x: 0, y: -speed };
      if (key === 'arrowdown' && directions[0].y === 0) directions[0] = { x: 0, y: speed };
      if (key === 'arrowleft' && directions[0].x === 0) directions[0] = { x: -speed, y: 0 };
      if (key === 'arrowright' && directions[0].x === 0) directions[0] = { x: speed, y: 0 };
      
      // Player 2: WASD
      if (key === 'w' && directions[1].y === 0) directions[1] = { x: 0, y: -speed };
      if (key === 's' && directions[1].y === 0) directions[1] = { x: 0, y: speed };
      if (key === 'a' && directions[1].x === 0) directions[1] = { x: -speed, y: 0 };
      if (key === 'd' && directions[1].x === 0) directions[1] = { x: speed, y: 0 };
      
      // Player 3: IJKL
      if (key === 'i' && directions[2].y === 0) directions[2] = { x: 0, y: -speed };
      if (key === 'k' && directions[2].y === 0) directions[2] = { x: 0, y: speed };
      if (key === 'j' && directions[2].x === 0) directions[2] = { x: -speed, y: 0 };
      if (key === 'l' && directions[2].x === 0) directions[2] = { x: speed, y: 0 };
      
      // Player 4: TFGH
      if (key === 't' && directions[3].y === 0) directions[3] = { x: 0, y: -speed };
      if (key === 'g' && directions[3].y === 0) directions[3] = { x: 0, y: speed };
      if (key === 'f' && directions[3].x === 0) directions[3] = { x: -speed, y: 0 };
      if (key === 'h' && directions[3].x === 0) directions[3] = { x: speed, y: 0 };
      
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
    snakes = [
      [{ x: 3, y: 3 }],
      [{ x: GRID_SIZE - 4, y: 3 }],
      [{ x: 3, y: GRID_SIZE - 4 }],
      [{ x: GRID_SIZE - 4, y: GRID_SIZE - 4 }]
    ];
    
    directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 0 }
    ];
    
    drawGame();
    gameAPI.updatePlayerTurn(1);
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
    }, 150);
  }
  
  function updateGame() {
    for (let i = 0; i < 4; i++) {
      const head = { ...snakes[i][0] };
      head.x += directions[i].x;
      head.y += directions[i].y;
      
      // Wall collision
      if (head.x < 0 || head.y < 0 || head.x >= GRID_SIZE || head.y >= GRID_SIZE) {
        endGame(i);
        return;
      }
      
      // Self collision
      for (let part of snakes[i]) {
        if (part.x === head.x && part.y === head.y) {
          endGame(i);
          return;
        }
      }
      
      // Other snake collision
      for (let j = 0; j < 4; j++) {
        if (i === j) continue;
        for (let part of snakes[j]) {
          if (part.x === head.x && part.y === head.y) {
            endGame(i);
            return;
          }
        }
      }
      
      snakes[i].unshift(head);
      snakes[i].pop();
    }
  }
  
  function drawGame() {
    if (!gameAPI) return;
    
    const ctx = gameAPI.ctx;
    const canvas = gameAPI.canvas;
    
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const cellSize = canvas.width / GRID_SIZE;
    
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = SNAKE_COLOR[i];
      for (let segment of snakes[i]) {
        ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize - 1, cellSize - 1);
      }
    }
    
    // Draw player indicators
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = SNAKE_COLOR[i];
      ctx.fillText(`P${i + 1}: ${snakes[i].length}`, 10, 20 + i * 20);
    }
  }
  
  function endGame(playerIndex) {
    gameRunning = false;
    clearInterval(gameLoop);
    
    gameAPI.showToast(`💥 Player ${playerIndex + 1} Crashed!`);
    setTimeout(() => gameAPI.returnToMenu?.(), 2000);
  }
})();

console.log('🐍🏁 Snake Race game module loaded successfully!');