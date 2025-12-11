// ========================================
// MINI MULTIPLAYER GAMES - MAIN CONTROLLER
// ========================================

// DOM Elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");
const gameArea = document.getElementById("gameArea");
const backButton = document.getElementById("backToMenu");
const currentGameTitle = document.getElementById("currentGameTitle");
const gameStatus = document.getElementById("gameStatus");
const playerTurn = document.getElementById("playerTurn");
const instructionText = document.getElementById("instructionText");
const scoreDisplay = document.getElementById("scoreDisplay");
const roundDisplay = document.getElementById("roundDisplay");

// Game State
let currentGame = null;
let gameState = {
  isPlaying: false,
  currentPlayer: 1,
  scores: [0, 0, 0, 0],
  round: 1,
  maxRounds: 3
};

// Game Definitions with metadata
const gameDefinitions = {
  tictactoe: {
    title: "Tic Tac Toe",
    players: 2,
    instructions: "Take turns placing X's and O's. Get 3 in a row to win!",
    controls: "Click on empty squares to place your mark."
  },
  rockpaperscissors: {
    title: "Rock Paper Scissors",
    players: 2,
    instructions: "Rock beats Scissors, Scissors beats Paper, Paper beats Rock!",
    controls: "Click your choice: Rock, Paper, or Scissors."
  },
  battleship: {
    title: "Battleship",
    players: 2,
    instructions: "Place your ships and try to sink your opponent's fleet!",
    controls: "Click to place ships, then click opponent's grid to attack."
  },
  checkers: {
    title: "Checkers",
    players: 2,
    instructions: "Move diagonally and capture opponent pieces by jumping over them.",
    controls: "Click a piece to select, then click destination to move."
  },
  dotsandboxes: {
    title: "Dots and Boxes",
    players: 2,
    instructions: "Draw lines between dots. Complete a box to score and play again!",
    controls: "Click between dots to draw lines."
  },
  uno: {
    title: "Uno",
    players: 4,
    instructions: "Match colors or numbers. Use action cards strategically. Say 'UNO' with one card left!",
    controls: "Click cards to play them. Draw from deck if no valid moves."
  },
  snakerace: {
    title: "Snake Race",
    players: 4,
    instructions: "Control your snake to eat food and grow. Don't hit walls or other snakes!",
    controls: "Use WASD, Arrow Keys, IJKL, or Numpad for different players."
  },
  ludo: {
    title: "Ludo",
    players: 4,
    instructions: "Race your pieces around the board to reach home first!",
    controls: "Roll dice and click pieces to move them."
  },
  fourplayerpong: {
    title: "4 Player Pong",
    players: 4,
    instructions: "Keep the ball in play! Each player controls one paddle.",
    controls: "Use assigned keys to move your paddle up and down."
  },
  triviashowdown: {
    title: "Trivia Showdown",
    players: 4,
    instructions: "Answer questions correctly to score points. First to target score wins!",
    controls: "Click your answer choice before time runs out."
  }
};

// Initialize the application
function initializeApp() {
  // Setup event listeners
  if (backButton) {
    backButton.addEventListener('click', returnToMenu);
  }

  // Setup canvas context properties
  ctx.imageSmoothingEnabled = true;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Add keyboard event listeners for games
  document.addEventListener('keydown', handleGlobalKeydown);
  document.addEventListener('keyup', handleGlobalKeyup);

  // Add window resize handler
  window.addEventListener('resize', handleResize);

  // Initialize UI
  updateGameStatus("Ready to play!");
  
  console.log("🎮 Mini Multiplayer Games initialized!");
}

// Main game starter function
window.startGame = function(gameName) {
  if (!gameDefinitions[gameName]) {
    showToast(`Game "${gameName}" not found!`, 'error');
    return;
  }

  const gameInfo = gameDefinitions[gameName];
  
  // Update UI
  menu.style.display = "none";
  gameArea.style.display = "block";
  currentGameTitle.textContent = gameInfo.title;
  instructionText.textContent = `${gameInfo.instructions} ${gameInfo.controls}`;
  
  // Reset game state
  resetGameState();
  
  // Clear canvas
  clearCanvas();
  
  // Stop current game if running
  if (currentGame && typeof currentGame.stop === "function") {
    currentGame.stop();
  }
  
  // Update status
  updateGameStatus("Loading game...");
  
  // Load game dynamically
  loadGame(gameName, gameInfo);
};

// Load game module
function loadGame(gameName, gameInfo) {
  // Since we can't use dynamic imports in this environment,
  // we'll call the game directly if it exists in global scope
  try {
    const gameModule = window[gameName + 'Game'];
    
    if (gameModule && typeof gameModule.start === 'function') {
      currentGame = gameModule;
      
      // Initialize game with context and state
      currentGame.init({
        canvas: canvas,
        ctx: ctx,
        gameState: gameState,
        updateStatus: updateGameStatus,
        updateTurn: updatePlayerTurn,
        updateScore: updateScore,
        showToast: showToast,
        gameInfo: gameInfo
      });
      
      // Start the game
      currentGame.start();
      updateGameStatus(`${gameInfo.title} started! ${gameInfo.players} players`);
      
      console.log(`🎮 Started ${gameInfo.title}`);
    } else {
      throw new Error(`Game module not found: ${gameName}`);
    }
  } catch (error) {
    console.error(`Error loading game ${gameName}:`, error);
    // Diagnostic: list matching globals that end with 'Game'
    try {
      const globals = Object.keys(window).filter(k => /Game$/.test(k));
      console.info('Available game-like globals:', globals);
    } catch (gErr) {
      console.info('Could not enumerate window globals', gErr);
    }
    // Show error message in toast for debugging (shortened)
    const msg = error && error.message ? error.message : 'Unknown error';
    showToast(`Could not load ${gameInfo.title}: ${msg}`, 'error');
    console.error(error && error.stack ? error.stack : error);
    returnToMenu();
  }
}

// Return to main menu
function returnToMenu() {
  // Stop current game
  if (currentGame && typeof currentGame.stop === "function") {
    currentGame.stop();
  }
  
  currentGame = null;
  
  // Clear canvas
  clearCanvas();
  
  // Reset UI
  gameArea.style.display = "none";
  menu.style.display = "block";
  
  // Reset game state
  resetGameState();
  
  updateGameStatus("Ready to play!");
  
  console.log("🏠 Returned to main menu");
}

// Game state management
function resetGameState() {
  gameState.isPlaying = false;
  gameState.currentPlayer = 1;
  gameState.scores = [0, 0, 0, 0];
  gameState.round = 1;
  updateScore();
  updatePlayerTurn();
}

function updateGameStatus(status) {
  if (gameStatus) {
    gameStatus.textContent = status;
  }
}

function updatePlayerTurn(player = null) {
  if (playerTurn) {
    if (player) {
      gameState.currentPlayer = player;
      playerTurn.textContent = `Player ${player}'s Turn`;
    } else {
      playerTurn.textContent = "";
    }
  }
}

function updateScore(scores = null) {
  if (scoreDisplay) {
    if (scores) {
      gameState.scores = scores;
    }
    
    // Format score display based on number of players
    if (currentGame && gameDefinitions[currentGame.name]) {
      const playerCount = gameDefinitions[currentGame.name].players;
      if (playerCount === 2) {
        scoreDisplay.textContent = `${gameState.scores[0]} - ${gameState.scores[1]}`;
      } else {
        scoreDisplay.textContent = gameState.scores.slice(0, playerCount).join(' - ');
      }
    } else {
      scoreDisplay.textContent = `${gameState.scores[0]} - ${gameState.scores[1]}`;
    }
  }
  
  if (roundDisplay) {
    roundDisplay.textContent = gameState.round;
  }
}

// Canvas utilities
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Add subtle background pattern
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add grid pattern
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1;
  const gridSize = 20;
  
  for (let x = 0; x <= canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  for (let y = 0; y <= canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// Input handling
function handleGlobalKeydown(event) {
  if (currentGame && typeof currentGame.handleKeydown === 'function') {
    currentGame.handleKeydown(event);
  }
  
  // Global shortcuts
  if (event.key === 'Escape') {
    returnToMenu();
  }
}

function handleGlobalKeyup(event) {
  if (currentGame && typeof currentGame.handleKeyup === 'function') {
    currentGame.handleKeyup(event);
  }
}

// Canvas click handling
canvas.addEventListener('click', function(event) {
  if (currentGame && typeof currentGame.handleClick === 'function') {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Scale coordinates if canvas is resized
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    currentGame.handleClick(x * scaleX, y * scaleY, event);
  }
});

// Canvas mouse movement handling
canvas.addEventListener('mousemove', function(event) {
  if (currentGame && typeof currentGame.handleMouseMove === 'function') {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    currentGame.handleMouseMove(x * scaleX, y * scaleY, event);
  }
});

// Window resize handler
function handleResize() {
  if (currentGame && typeof currentGame.handleResize === 'function') {
    currentGame.handleResize();
  }
}

// Toast notification system
function showToast(message, type = 'success') {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.toast');
  existingToasts.forEach(toast => toast.remove());
  
  // Create new toast
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 3000);
}

// Utility functions for games
window.gameAPI = {
  clearCanvas,
  updateGameStatus,
  updatePlayerTurn,
  updateScore,
  showToast,
  returnToMenu,
  gameState,
  canvas,
  ctx,
  gameInfo: null,
  gameUtils: {
    // Drawing utilities
    drawText(text, x, y, font = '20px Arial', color = '#ffffff', align = 'center') {
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.fillText(text, x, y);
    },
    
    drawRect(x, y, width, height, color = '#ffffff', filled = true) {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      
      if (filled) {
        ctx.fillRect(x, y, width, height);
      } else {
        ctx.strokeRect(x, y, width, height);
      }
    },
    
    drawCircle(x, y, radius, color = '#ffffff', filled = true) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      
      if (filled) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
    },
    
    drawLine(x1, y1, x2, y2, color = '#ffffff', width = 2) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    },
    
    // Game utilities
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    distance(x1, y1, x2, y2) {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },
    
    clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export for use in game modules
window.gameController = {
  startGame: window.startGame,
  returnToMenu,
  updateGameStatus,
  updatePlayerTurn,
  updateScore,
  showToast,
  gameState,
  gameAPI: window.gameAPI
};

console.log("🎮 Main game controller loaded successfully!");