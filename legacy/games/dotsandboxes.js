// ========================================
// DOTS AND BOXES GAME MODULE
// ========================================

const dotsandboxesGame = {
  name: 'dotsandboxes',
  
  // Game configuration
  DOT_RADIUS: 4,
  GRID_SIZE: 4, // 4x4 boxes = 5x5 dots
  
  // Game state
  currentPlayer: 1,
  lines: [],
  boxes: [],
  scores: [0, 0],
  gameEnded: false,
  
  // References from main controller
  canvas: null,
  ctx: null,
  gameState: null,
  updateStatus: null,
  updateTurn: null,
  updateScore: null,
  showToast: null,
  gameInfo: null,
  
  // Initialize game with main controller context
  init(context) {
    this.canvas = context.canvas;
    this.ctx = context.ctx;
    this.gameState = context.gameState;
    this.updateStatus = context.updateStatus;
    this.updateTurn = context.updateTurn;
    this.updateScore = context.updateScore;
    this.showToast = context.showToast;
    this.gameInfo = context.gameInfo;
    
    console.log('🎯 Dots and Boxes game initialized');
  },
  
  // Start/restart the game
  start() {
    this.initGame();
    this.updateUI();
    this.showToast('Draw lines between dots to create boxes!', 'success');
  },
  
  // Stop the game
  stop() {
    this.gameEnded = true;
    console.log('🛑 Dots and Boxes game stopped');
  },
  
  // Initialize game state
  initGame() {
    this.GRID_SIZE = 4;
    this.currentPlayer = 1;
    this.lines = [];
    this.boxes = this.createBoxes();
    this.scores = [0, 0];
    this.gameEnded = false;
    
    // Update main game state
    this.gameState.currentPlayer = this.currentPlayer;
    this.gameState.scores = [...this.scores, 0, 0]; // Pad for 4-player support
    this.gameState.isPlaying = true;
    
    this.clearCanvas();
    this.drawBoard();
  },
  
  // Create boxes array
  createBoxes() {
    const arr = [];
    for (let row = 0; row < this.GRID_SIZE; row++) {
      arr[row] = [];
      for (let col = 0; col < this.GRID_SIZE; col++) {
        arr[row][col] = { 
          top: false, 
          right: false, 
          bottom: false, 
          left: false, 
          owner: null 
        };
      }
    }
    return arr;
  },
  
  // Clear canvas with game-specific background
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Dark background
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  },
  
  // Draw the game board
  drawBoard() {
    const dotSpacing = Math.min(
      this.canvas.width / (this.GRID_SIZE + 2),
      this.canvas.height / (this.GRID_SIZE + 3)
    );
    
    const offsetX = (this.canvas.width - (this.GRID_SIZE * dotSpacing)) / 2;
    const offsetY = (this.canvas.height - (this.GRID_SIZE * dotSpacing)) / 2 - 20;
    
    // Draw dots
    this.ctx.fillStyle = "#ffffff";
    for (let row = 0; row <= this.GRID_SIZE; row++) {
      for (let col = 0; col <= this.GRID_SIZE; col++) {
        const x = offsetX + col * dotSpacing;
        const y = offsetY + row * dotSpacing;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.DOT_RADIUS, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
    
    // Draw lines
    this.ctx.lineWidth = 3;
    for (let line of this.lines) {
      this.ctx.strokeStyle = line.player === 1 ? "#00d4ff" : "#ff6b6b";
      this.ctx.beginPath();
      this.ctx.moveTo(offsetX + line.x1, offsetY + line.y1);
      this.ctx.lineTo(offsetX + line.x2, offsetY + line.y2);
      this.ctx.stroke();
    }
    
    // Draw filled boxes
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        const box = this.boxes[row][col];
        if (box.owner !== null) {
          const x = offsetX + (col + 0.5) * dotSpacing;
          const y = offsetY + (row + 0.5) * dotSpacing;
          
          // Box background
          this.ctx.fillStyle = box.owner === 1 ? "rgba(0,212,255,0.3)" : "rgba(255,107,107,0.3)";
          this.ctx.fillRect(
            x - dotSpacing / 2 + this.DOT_RADIUS,
            y - dotSpacing / 2 + this.DOT_RADIUS,
            dotSpacing - (this.DOT_RADIUS * 2),
            dotSpacing - (this.DOT_RADIUS * 2)
          );
          
          // Player number in box
          this.ctx.fillStyle = box.owner === 1 ? "#00d4ff" : "#ff6b6b";
          this.ctx.font = "bold 18px Arial";
          this.ctx.textAlign = "center";
          this.ctx.textBaseline = "middle";
          this.ctx.fillText(box.owner.toString(), x, y);
        }
      }
    }
    
    this.drawUI(dotSpacing, offsetX, offsetY);
  },
  
  // Draw UI elements
  drawUI(dotSpacing, offsetX, offsetY) {
    const uiY = offsetY + (this.GRID_SIZE + 1) * dotSpacing + 40;
    
    // Current player indicator
    if (!this.gameEnded) {
      this.ctx.fillStyle = this.currentPlayer === 1 ? "#00d4ff" : "#ff6b6b";
      this.ctx.font = "bold 24px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        `Player ${this.currentPlayer}'s Turn`,
        this.canvas.width / 2,
        uiY
      );
    }
    
    // Score display
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "20px Arial";
    this.ctx.textAlign = "left";
    this.ctx.fillText(`Player 1: ${this.scores[0]}`, 20, 30);
    this.ctx.fillText(`Player 2: ${this.scores[1]}`, 20, 60);
    
    // Game over message
    if (this.gameEnded) {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      const winner = this.scores[0] > this.scores[1] ? 1 : 
                     this.scores[1] > this.scores[0] ? 2 : 0;
      
      this.ctx.fillStyle = "#ffffff";
      this.ctx.font = "bold 36px Arial";
      this.ctx.textAlign = "center";
      
      if (winner === 0) {
        this.ctx.fillText("It's a Tie!", this.canvas.width / 2, this.canvas.height / 2 - 40);
      } else {
        this.ctx.fillStyle = winner === 1 ? "#00d4ff" : "#ff6b6b";
        this.ctx.fillText(`Player ${winner} Wins!`, this.canvas.width / 2, this.canvas.height / 2 - 40);
      }
      
      this.ctx.fillStyle = "#ffffff";
      this.ctx.font = "20px Arial";
      this.ctx.fillText(
        `Final Score: ${this.scores[0]} - ${this.scores[1]}`,
        this.canvas.width / 2,
        this.canvas.height / 2 + 10
      );
      
      this.ctx.fillText(
        "Press ESC to return to menu",
        this.canvas.width / 2,
        this.canvas.height / 2 + 50
      );
    }
  },
  
  // Handle mouse clicks
  handleClick(mouseX, mouseY) {
    if (this.gameEnded) return;
    
    const dotSpacing = Math.min(
      this.canvas.width / (this.GRID_SIZE + 2),
      this.canvas.height / (this.GRID_SIZE + 3)
    );
    
    const offsetX = (this.canvas.width - (this.GRID_SIZE * dotSpacing)) / 2;
    const offsetY = (this.canvas.height - (this.GRID_SIZE * dotSpacing)) / 2 - 20;
    
    // Adjust mouse coordinates
    const adjustedX = mouseX - offsetX;
    const adjustedY = mouseY - offsetY;
    
    let found = false;
    
    // Check horizontal lines
    for (let row = 0; row <= this.GRID_SIZE && !found; row++) {
      for (let col = 0; col < this.GRID_SIZE && !found; col++) {
        const y = row * dotSpacing;
        const x1 = col * dotSpacing;
        const x2 = x1 + dotSpacing;
        
        if (
          adjustedY >= y - 8 &&
          adjustedY <= y + 8 &&
          adjustedX >= x1 &&
          adjustedX <= x2
        ) {
          if (!this.isLinePresent(x1, y, x2, y)) {
            this.lines.push({ 
              x1, y1: y, x2, y2: y, 
              player: this.currentPlayer 
            });
            this.updateBoxStatus(row, col, "top");
            found = true;
          }
        }
      }
    }
    
    // Check vertical lines
    if (!found) {
      for (let col = 0; col <= this.GRID_SIZE && !found; col++) {
        for (let row = 0; row < this.GRID_SIZE && !found; row++) {
          const x = col * dotSpacing;
          const y1 = row * dotSpacing;
          const y2 = y1 + dotSpacing;
          
          if (
            adjustedX >= x - 8 &&
            adjustedX <= x + 8 &&
            adjustedY >= y1 &&
            adjustedY <= y2
          ) {
            if (!this.isLinePresent(x, y1, x, y2)) {
              this.lines.push({ 
                x1: x, y1, x2: x, y2, 
                player: this.currentPlayer 
              });
              this.updateBoxStatus(row, col, "left");
              found = true;
            }
          }
        }
      }
    }
    
    if (found) {
      const scored = this.checkAndScoreBoxes();
      if (!scored) {
        this.switchPlayer();
      }
      this.clearCanvas();
      this.drawBoard();
      this.updateUI();
      this.checkGameEnd();
    }
  },
  
  // Check if a line already exists
  isLinePresent(x1, y1, x2, y2) {
    for (let line of this.lines) {
      if (
        (line.x1 === x1 && line.y1 === y1 && line.x2 === x2 && line.y2 === y2) ||
        (line.x1 === x2 && line.y1 === y2 && line.x2 === x1 && line.y2 === y1)
      ) {
        return true;
      }
    }
    return false;
  },
  
  // Update box status when a line is drawn
  updateBoxStatus(row, col, side) {
    if (row < this.GRID_SIZE && col < this.GRID_SIZE && row >= 0 && col >= 0) {
      this.boxes[row][col][side] = true;
      
      // Update adjacent box
      if (side === "top" && row > 0) {
        this.boxes[row - 1][col]["bottom"] = true;
      } else if (side === "left" && col > 0) {
        this.boxes[row][col - 1]["right"] = true;
      } else if (side === "bottom" && row < this.GRID_SIZE - 1) {
        this.boxes[row + 1][col]["top"] = true;
      } else if (side === "right" && col < this.GRID_SIZE - 1) {
        this.boxes[row][col + 1]["left"] = true;
      }
    }
  },
  
  // Check and score completed boxes
  checkAndScoreBoxes() {
    let scored = false;
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        const box = this.boxes[row][col];
        if (
          box.top &&
          box.right &&
          box.bottom &&
          box.left &&
          box.owner === null
        ) {
          box.owner = this.currentPlayer;
          this.scores[this.currentPlayer - 1]++;
          scored = true;
        }
      }
    }
    return scored;
  },
  
  // Switch to the other player
  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    this.gameState.currentPlayer = this.currentPlayer;
  },
  
  // Update UI through main controller
  updateUI() {
    if (this.updateTurn) {
      this.updateTurn(this.currentPlayer);
    }
    
    if (this.updateScore) {
      const paddedScores = [...this.scores, 0, 0];
      this.updateScore(paddedScores);
      this.gameState.scores = paddedScores;
    }
    
    if (this.updateStatus && !this.gameEnded) {
      this.updateStatus(`Player ${this.currentPlayer}'s turn - Draw lines between dots!`);
    }
  },
  
  // Check if game has ended
  checkGameEnd() {
    const totalBoxes = this.GRID_SIZE * this.GRID_SIZE;
    const scoredBoxes = this.scores[0] + this.scores[1];
    
    if (scoredBoxes === totalBoxes) {
      this.gameEnded = true;
      this.gameState.isPlaying = false;
      
      const winner = this.scores[0] > this.scores[1] ? 1 : 
                     this.scores[1] > this.scores[0] ? 2 : 0;
      
      if (this.updateStatus) {
        if (winner === 0) {
          this.updateStatus("Game Over - It's a Tie!");
          this.showToast("It's a tie! Great game!", 'success');
        } else {
          this.updateStatus(`Game Over - Player ${winner} Wins!`);
          this.showToast(`Player ${winner} wins with ${this.scores[winner - 1]} boxes!`, 'success');
        }
      }
    }
  },
  
  // Handle keyboard input
  handleKeydown(event) {
    if (event.key === 'r' || event.key === 'R') {
      this.start(); // Restart game
      this.showToast('Game restarted!', 'success');
    }
  },
  
  // Handle window resize
  handleResize() {
    if (!this.gameEnded) {
      this.clearCanvas();
      this.drawBoard();
    }
  }
};

// Register the game with the global scope
window.dotsandboxesGame = dotsandboxesGame;

console.log("🎯 Dots and Boxes game module loaded successfully!");