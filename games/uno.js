// ========================================
// UNO GAME MODULE (4-Player)
// ========================================

window.unoGame = (function() {
  let gameAPI = null;
  let gameConfig = null;
  let gameRunning = false;
  
  let players = [[], [], [], []];
  let currentPlayerIndex = 0;
  let discardPile = [];
  let gameDeck = [];
  const COLORS = ["red", "green", "blue", "yellow"];
  let scores = [0, 0, 0, 0];
  
  return {
    name: 'uno',
    
    init(api) {
      gameAPI = api;
      gameConfig = api.gameInfo;
      console.log('🃏🎨 Uno initialized');
    },
    
    start() {
      if (!gameAPI) {
        console.error('Uno: Game API not initialized');
        return;
      }
      
      initGame();
      gameRunning = true;
      console.log('🃏🎨 Uno started');
    },
    
    stop() {
      gameRunning = false;
      console.log('🃏🎨 Uno stopped');
    },
    
    handleClick(x, y, event) {
      if (!gameRunning) return;
      // Click handling for card buttons on canvas
    },
    
    handleKeydown(event) {
      if (event.key === 'Escape') {
        gameAPI.returnToMenu?.();
      }
    },
    
    handleMouseMove(x, y, event) {},
    
    handleResize() {
      drawGame();
    }
  };
  
  function initGame() {
    players = [[], [], [], []];
    currentPlayerIndex = 0;
    discardPile = [];
    gameDeck = generateDeck();
    shuffleArray(gameDeck);
    
    // Deal 7 cards to each player
    for (let i = 0; i < 7; i++) {
      for (let p = 0; p < 4; p++) {
        players[p].push(gameDeck.pop());
      }
    }
    
    // Start with one card in discard pile
    discardPile.push(gameDeck.pop());
    
    drawGame();
    gameAPI.updatePlayerTurn(currentPlayerIndex + 1);
  }
  
  function generateDeck() {
    let deck = [];
    for (let color of COLORS) {
      for (let num = 0; num <= 9; num++) {
        // Two copies of each card
        deck.push({ color, number: num });
        deck.push({ color, number: num });
      }
    }
    return deck;
  }
  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  function drawGame() {
    if (!gameAPI) return;
    
    const ctx = gameAPI.ctx;
    const canvas = gameAPI.canvas;
    
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('UNO - 4 Player', canvas.width / 2, 40);
    
    // Current player
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText(`Player ${currentPlayerIndex + 1}'s Turn`, canvas.width / 2, 80);
    
    // Discard pile
    const topCard = discardPile[discardPile.length - 1];
    drawCard(topCard, canvas.width / 2 - 60, 150, 120, 150);
    
    // Player hands info
    ctx.fillStyle = '#cccccc';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    for (let p = 0; p < 4; p++) {
      const color = COLORS[p];
      ctx.fillStyle = color;
      ctx.fillText(`Player ${p + 1}: ${players[p].length} cards`, 20, 350 + p * 25);
    }
    
    // Deck remaining
    ctx.fillStyle = '#888888';
    ctx.font = '14px Arial';
    ctx.fillText(`Deck: ${gameDeck.length} cards`, canvas.width - 150, 350);
  }
  
  function drawCard(card, x, y, width, height) {
    const ctx = gameAPI.ctx;
    ctx.fillStyle = card.color;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(card.number, x + width / 2, y + height / 2);
  }
  
  function playCard(cardIndex) {
    if (!gameRunning) return;
    
    const playedCard = players[currentPlayerIndex][cardIndex];
    const topCard = discardPile[discardPile.length - 1];
    
    if (playedCard.color === topCard.color || playedCard.number === topCard.number) {
      discardPile.push(playedCard);
      players[currentPlayerIndex].splice(cardIndex, 1);
      
      if (players[currentPlayerIndex].length === 0) {
        scores[currentPlayerIndex]++;
        gameAPI.updateScore(scores);
        gameAPI.showToast(`🎉 Player ${currentPlayerIndex + 1} Wins!`);
        setTimeout(() => initGame(), 2000);
        return;
      }
      
      nextTurn();
      drawGame();
      gameAPI.updatePlayerTurn(currentPlayerIndex + 1);
    } else {
      gameAPI.showToast('❌ Invalid move! Match color or number.', 'error');
    }
  }
  
  function nextTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % 4;
  }
})();

console.log('🃏� Uno game module loaded successfully!');