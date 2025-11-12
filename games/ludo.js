// ========================================
// LUDO GAME MODULE (4-Player)
// ========================================

window.ludoGame = (function() {
  let gameAPI = null;
  let gameConfig = null;
  let gameRunning = false;
  
  const PLAYER_COLORS = ['#00ff88', '#ff4444', '#ffaa00', '#00d4ff'];
  const TRACK_LENGTH = 40;
  let currentPlayerIndex = 0;
  let positions = [0, 0, 0, 0];
  let pathCoords = [];
  let scores = [0, 0, 0, 0];
  
  return {
    name: 'ludo',
    
    init(api) {
      gameAPI = api;
      gameConfig = api.gameInfo;
      console.log('🎲🏠 Ludo initialized');
    },
    
    start() {
      if (!gameAPI) {
        console.error('Ludo: Game API not initialized');
        return;
      }
      
      initGame();
      gameRunning = true;
      console.log('🎲🏠 Ludo started');
    },
    
    stop() {
      gameRunning = false;
      console.log('🎲🏠 Ludo stopped');
    },
    
    handleClick(x, y, event) {
      if (!gameRunning) return;
    },
    
    handleKeydown(event) {
      if (event.key === ' ') {
        rollDice();
      }
      if (event.key === 'Escape') {
        gameAPI.returnToMenu?.();
      }
    },
    
    handleMouseMove(x, y, event) {},
    
    handleResize() {
      drawBoard();
    }
  };
  
  function initGame() {
    positions = [0, 0, 0, 0];
    currentPlayerIndex = 0;
    generatePathCoords();
    drawBoard();
    gameAPI.updatePlayerTurn(1);
  }
  
  function generatePathCoords() {
    pathCoords = [];
    const centerX = gameAPI.canvas.width / 2;
    const centerY = gameAPI.canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 50;
    
    for (let i = 0; i < TRACK_LENGTH; i++) {
      const angle = (i * 2 * Math.PI) / TRACK_LENGTH - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      pathCoords[i] = { x, y };
    }
  }
  
  function drawBoard() {
    if (!gameAPI) return;
    
    const ctx = gameAPI.ctx;
    const canvas = gameAPI.canvas;
    
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw circular track
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 3;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 50;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw position markers
    ctx.fillStyle = '#444444';
    for (let i = 0; i < TRACK_LENGTH; i++) {
      const coord = pathCoords[i];
      ctx.beginPath();
      ctx.arc(coord.x, coord.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw player tokens
    for (let p = 0; p < 4; p++) {
      const coord = pathCoords[positions[p]];
      ctx.fillStyle = PLAYER_COLORS[p];
      ctx.beginPath();
      ctx.arc(coord.x, coord.y, 12, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // Draw current player and instructions
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Player ${currentPlayerIndex + 1}'s Turn`, canvas.width / 2, 30);
    
    ctx.font = '14px Arial';
    ctx.fillStyle = '#888888';
    ctx.fillText('Press SPACE to roll dice', canvas.width / 2, 60);
    
    // Draw scores
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = PLAYER_COLORS[i];
      ctx.fillText(`P${i + 1}: ${positions[i]}/40`, 20, 100 + i * 25);
    }
  }
  
  function rollDice() {
    if (!gameRunning) return;
    
    const roll = Math.floor(Math.random() * 6) + 1;
    positions[currentPlayerIndex] += roll;
    
    if (positions[currentPlayerIndex] >= TRACK_LENGTH) {
      scores[currentPlayerIndex]++;
      gameAPI.updateScore(scores);
      gameAPI.showToast(`🎉 Player ${currentPlayerIndex + 1} Finished!`);
      
      // Reset or end game
      if (scores.filter(s => s > 0).length === 4) {
        gameAPI.showToast('🎉 Game Complete!');
        gameRunning = false;
        setTimeout(() => gameAPI.returnToMenu?.(), 2000);
        return;
      }
      
      positions[currentPlayerIndex] = 0;
    }
    
    gameAPI.showToast(`🎲 Rolled ${roll}!`);
    currentPlayerIndex = (currentPlayerIndex + 1) % 4;
    gameAPI.updatePlayerTurn(currentPlayerIndex + 1);
    drawBoard();
  }
})();

console.log('🎲🏠 Ludo game module loaded successfully!');