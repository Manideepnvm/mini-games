// ========================================
// ROCK PAPER SCISSORS GAME MODULE
// ========================================

window.rockpaperscissorsGame = (function() {
  let gameAPI = null;
  let gameConfig = null;
  let gameRunning = false;
  
  let playerChoices = [null, null];
  let currentPlayerTurn = 0;
  let scores = [0, 0];
  let resultShown = false;
  
  return {
    name: 'rockpaperscissors',
    
    init(api) {
      gameAPI = api;
      gameConfig = api.gameInfo;
      console.log('✂️📄🗿 Rock Paper Scissors initialized');
    },
    
    start() {
      if (!gameAPI) {
        console.error('Rock Paper Scissors: Game API not initialized');
        return;
      }
      
      initGame();
      gameRunning = true;
      console.log('✂️📄🗿 Rock Paper Scissors started');
    },
    
    stop() {
      gameRunning = false;
      console.log('✂️📄🗿 Rock Paper Scissors stopped');
    },
    
    handleClick(x, y, event) {
      if (!gameRunning) return;
      
      const canvasWidth = gameAPI.canvas.width;
      const canvasHeight = gameAPI.canvas.height;
      
      // Check if clicking on choice buttons
      const buttonWidth = 100;
      const buttonHeight = 40;
      const gap = 20;
      const startX = (canvasWidth - (3 * buttonWidth + 2 * gap)) / 2;
      const startY = 300;
      
      const choices = ['rock', 'paper', 'scissors'];
      for (let i = 0; i < choices.length; i++) {
        const btnX = startX + i * (buttonWidth + gap);
        const btnY = startY;
        
        if (x >= btnX && x <= btnX + buttonWidth && y >= btnY && y <= btnY + buttonHeight) {
          handleChoice(choices[i]);
          break;
        }
      }
    },
    
    handleKeydown(event) {
      if (event.key === 'Escape') {
        gameAPI.returnToMenu?.();
      }
    },
    
    handleMouseMove(x, y, event) {
      // Optional: Add hover effect
    },
    
    handleResize() {
      drawGame();
    }
  };
  
  function initGame() {
    playerChoices = [null, null];
    currentPlayerTurn = 0;
    resultShown = false;
    drawGame();
    gameAPI.updatePlayerTurn(1);
  }
  
  function drawGame() {
    if (!gameAPI) return;
    
    const ctx = gameAPI.ctx;
    const canvas = gameAPI.canvas;
    
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw title
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Rock Paper Scissors', canvas.width / 2, 50);
    
    if (!resultShown) {
      // Draw instructions
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Arial';
      ctx.fillText(`Player ${currentPlayerTurn + 1}'s Turn`, canvas.width / 2, 120);
      ctx.fillText('Click your choice:', canvas.width / 2, 180);
      
      // Draw choice buttons
      drawChoiceButtons();
    } else {
      // Draw results
      drawResults();
    }
  }
  
  function drawChoiceButtons() {
    const ctx = gameAPI.ctx;
    const canvas = gameAPI.canvas;
    
    const buttonWidth = 100;
    const buttonHeight = 40;
    const gap = 20;
    const startX = (canvas.width - (3 * buttonWidth + 2 * gap)) / 2;
    const startY = 300;
    
    const choices = ['Rock', 'Paper', 'Scissors'];
    
    choices.forEach((choice, index) => {
      const x = startX + index * (buttonWidth + gap);
      const y = startY;
      
      ctx.fillStyle = '#667eea';
      ctx.fillRect(x, y, buttonWidth, buttonHeight);
      
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, buttonWidth, buttonHeight);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(choice, x + buttonWidth / 2, y + buttonHeight / 2);
    });
  }
  
  function handleChoice(choice) {
    playerChoices[currentPlayerTurn] = choice;
    
    if (currentPlayerTurn === 0) {
      currentPlayerTurn = 1;
      drawGame();
      gameAPI.updatePlayerTurn(2);
    } else {
      resultShown = true;
      showResults();
    }
  }
  
  function showResults() {
    const p1 = playerChoices[0];
    const p2 = playerChoices[1];
    
    const result = determineWinner(p1, p2);
    
    if (result === 'draw') {
      gameAPI.showToast("🤝 It's a Draw!");
    } else if (result === 1) {
      scores[0]++;
      gameAPI.showToast("🎉 Player 1 Wins!");
    } else {
      scores[1]++;
      gameAPI.showToast("🎉 Player 2 Wins!");
    }
    
    gameAPI.updateScore(scores);
    
    setTimeout(() => initGame(), 2000);
  }
  
  function drawResults() {
    const ctx = gameAPI.ctx;
    const canvas = gameAPI.canvas;
    const p1 = playerChoices[0];
    const p2 = playerChoices[1];
    
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Player 1: ${capitalize(p1)}`, canvas.width / 2, 150);
    
    ctx.fillStyle = '#ff4444';
    ctx.fillText(`Player 2: ${capitalize(p2)}`, canvas.width / 2, 250);
    
    const result = determineWinner(p1, p2);
    let resultText = '';
    
    if (result === 'draw') {
      resultText = "It's a Draw!";
      ctx.fillStyle = '#ffaa00';
    } else if (result === 1) {
      resultText = "🎉 Player 1 Wins!";
      ctx.fillStyle = '#00ff88';
    } else {
      resultText = "🎉 Player 2 Wins!";
      ctx.fillStyle = '#ff4444';
    }
    
    ctx.font = 'bold 28px Arial';
    ctx.fillText(resultText, canvas.width / 2, 350);
  }
  
  function determineWinner(p1, p2) {
    if (p1 === p2) return 'draw';
    if (
      (p1 === 'rock' && p2 === 'scissors') ||
      (p1 === 'scissors' && p2 === 'paper') ||
      (p1 === 'paper' && p2 === 'rock')
    ) {
      return 1;
    }
    return 2;
  }
  
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
})();

console.log('✂️📄🗿 Rock Paper Scissors game module loaded successfully!');