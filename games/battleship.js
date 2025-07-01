// ========================================
// BATTLESHIP GAME MODULE
// ========================================



window.battleshipGame = (function() {
  // Game state
  let gameAPI = null;
  let gameConfig = null;
  let gameRunning = false;
  
  // Game variables
  let currentPlayerBS = 1;
  let placingPhase = true;
  let shipPlaced = [false, false];
  let shipPositions = [[], []]; // [player1, player2]
  let shotsFired = [[], []];    // [player1, player2]
  let selectedShipPart = null;  // For ship placement feedback
  
  const BOARD_SIZE = 8;
  const SHIPS = [
    { name: 'Destroyer', length: 2, count: 2 },
    { name: 'Cruiser', length: 3, count: 1 }
  ];
  
  let shipsToPlace = [
    [...SHIPS], // Player 1 ships
    [...SHIPS]  // Player 2 ships
  ];
  let placedShips = [[], []]; // [player1, player2]
  
  // Public API
  return {
    name: 'battleship',
    
    init(api) {
      gameAPI = api;
      gameConfig = api.gameInfo;
      console.log('🚢 Battleship initialized');
    },
    
    start() {
      if (!gameAPI) {
        console.error('Battleship: Game API not initialized');
        return;
      }
      
      initGame();
      gameRunning = true;
      console.log('🚢 Battleship started');
    },
    
    stop() {
      gameRunning = false;
      // Remove event listeners if any were added
      console.log('🚢 Battleship stopped');
    },
    
    handleClick(x, y, event) {
      if (!gameRunning) return;
      
      const cellSize = gameAPI.canvas.width / BOARD_SIZE;
      const gridY = y - 60; // Offset for UI elements
      
      if (gridY < 0) return;
      
      const row = Math.floor(gridY / cellSize);
      const col = Math.floor(x / cellSize);
      
      if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return;
      
      if (placingPhase) {
        handleShipPlacement(row, col);
      } else {
        handleShot(row, col);
      }
    },
    
    handleKeydown(event) {
      if (!gameRunning) return;
      
      // Press R to rotate ship during placement
      if (event.key.toLowerCase() === 'r' && placingPhase) {
        // Ship rotation could be implemented here
        drawGame();
      }
    },
    
    handleMouseMove(x, y, event) {
      if (!gameRunning || !placingPhase) return;
      
      const cellSize = gameAPI.canvas.width / BOARD_SIZE;
      const col = Math.floor(x / cellSize);
      const row = Math.floor((y - 60) / cellSize);
      
      if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
        drawGame();
        // Draw preview of ship placement
        drawShipPreview(row, col);
      }
    }
  };
  
  // Initialize game
  function initGame() {
    currentPlayerBS = 1;
    placingPhase = true;
    shipPlaced = [false, false];
    shipPositions = [[], []];
    shotsFired = [[], []];
    selectedShipPart = null;
    
    // Reset ships to place
    shipsToPlace = [
      [...SHIPS.map(ship => ({...ship}))],
      [...SHIPS.map(ship => ({...ship}))]
    ];
    placedShips = [[], []];
    
    gameAPI.updateStatus("Ship placement phase - Place your fleet!");
    gameAPI.updateTurn(currentPlayerBS);
    drawGame();
  }
  
  // Main drawing function
  function drawGame() {
    gameAPI.clearCanvas();
    
    if (placingPhase) {
      drawPlacementPhase();
    } else {
      drawBattlePhase();
    }
  }
  
  // Draw placement phase
  function drawPlacementPhase() {
    const playerIdx = currentPlayerBS - 1;
    const currentShip = getCurrentShipToPlace();
    
    // Draw instructions
    gameAPI.gameUtils.drawText(
      `Player ${currentPlayerBS}: Place your ${currentShip ? currentShip.name : 'ships'}`,
      gameAPI.canvas.width / 2, 30, '20px Arial', '#ffffff'
    );
    
    if (currentShip) {
      gameAPI.gameUtils.drawText(
        `Length: ${currentShip.length} | Remaining: ${currentShip.count}`,
        gameAPI.canvas.width / 2, 50, '16px Arial', '#cccccc'
      );
    }
    
    drawGrid();
    drawPlacedShips(playerIdx, true);
    drawShipList();
  }
  
  // Draw battle phase
  function drawBattlePhase() {
    gameAPI.gameUtils.drawText(
      `Player ${currentPlayerBS}'s Turn - Fire!`,
      gameAPI.canvas.width / 2, 30, '20px Arial', '#ffffff'
    );
    
    gameAPI.gameUtils.drawText(
      'Your ships are hidden - Target enemy waters',
      gameAPI.canvas.width / 2, 50, '16px Arial', '#cccccc'
    );
    
    drawGrid();
    drawShots();
  }
  
  // Draw the game grid
  function drawGrid() {
    const cellSize = gameAPI.canvas.width / BOARD_SIZE;
    const startY = 60;
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const x = col * cellSize;
        const y = row * cellSize + startY;
        
        // Grid cell background
        gameAPI.gameUtils.drawRect(x, y, cellSize, cellSize, '#1a1a2e', true);
        gameAPI.gameUtils.drawRect(x, y, cellSize, cellSize, '#16213e', false);
        
        // Add coordinates for easier gameplay
        if (row === 0) {
          gameAPI.gameUtils.drawText(
            String.fromCharCode(65 + col), // A, B, C...
            x + cellSize/2, y - 10, '12px Arial', '#888888'
          );
        }
        if (col === 0) {
          gameAPI.gameUtils.drawText(
            (row + 1).toString(), // 1, 2, 3...
            x - 15, y + cellSize/2, '12px Arial', '#888888'
          );
        }
      }
    }
  }
  
  // Draw placed ships (only visible to the owner)
  function drawPlacedShips(playerIdx, visible = false) {
    if (!visible) return;
    
    const cellSize = gameAPI.canvas.width / BOARD_SIZE;
    const startY = 60;
    
    for (let ship of placedShips[playerIdx]) {
      for (let pos of ship.positions) {
        const x = pos.col * cellSize;
        const y = pos.row * cellSize + startY;
        
        gameAPI.gameUtils.drawRect(x + 2, y + 2, cellSize - 4, cellSize - 4, '#0066cc', true);
        gameAPI.gameUtils.drawRect(x + 2, y + 2, cellSize - 4, cellSize - 4, '#0088ff', false);
      }
    }
  }
  
  // Draw shots fired
  function drawShots() {
    const cellSize = gameAPI.canvas.width / BOARD_SIZE;
    const startY = 60;
    const currentPlayerIdx = getCurrentPlayerIndex();
    
    for (let shot of shotsFired[currentPlayerIdx]) {
      const x = shot.col * cellSize;
      const y = shot.row * cellSize + startY;
      
      if (shot.hit) {
        // Hit marker
        gameAPI.gameUtils.drawCircle(x + cellSize/2, y + cellSize/2, 8, '#ff3333', true);
        gameAPI.gameUtils.drawText('💥', x + cellSize/2, y + cellSize/2, '16px Arial');
      } else {
        // Miss marker
        gameAPI.gameUtils.drawCircle(x + cellSize/2, y + cellSize/2, 6, '#666666', true);
        gameAPI.gameUtils.drawText('•', x + cellSize/2, y + cellSize/2, '20px Arial', '#ffffff');
      }
    }
  }
  
  // Draw ship placement preview
  function drawShipPreview(row, col) {
    const currentShip = getCurrentShipToPlace();
    if (!currentShip) return;
    
    const cellSize = gameAPI.canvas.width / BOARD_SIZE;
    const startY = 60;
    
    // Try horizontal placement first
    const positions = [];
    for (let i = 0; i < currentShip.length; i++) {
      if (col + i < BOARD_SIZE) {
        positions.push({ row, col: col + i });
      }
    }
    
    if (positions.length === currentShip.length && isValidPlacement(positions, currentPlayerBS - 1)) {
      for (let pos of positions) {
        const x = pos.col * cellSize;
        const y = pos.row * cellSize + startY;
        gameAPI.gameUtils.drawRect(x + 4, y + 4, cellSize - 8, cellSize - 8, '#66cc66', true);
      }
    }
  }
  
  // Draw list of ships to place
  function drawShipList() {
    const playerIdx = currentPlayerBS - 1;
    let yOffset = gameAPI.canvas.height - 120;
    
    gameAPI.gameUtils.drawText('Ships to place:', 20, yOffset, '16px Arial', '#ffffff', 'left');
    yOffset += 25;
    
    for (let ship of shipsToPlace[playerIdx]) {
      if (ship.count > 0) {
        gameAPI.gameUtils.drawText(
          `${ship.name} (${ship.length}) x${ship.count}`,
          20, yOffset, '14px Arial', '#cccccc', 'left'
        );
        yOffset += 20;
      }
    }
  }
  
  // Handle ship placement
  function handleShipPlacement(row, col) {
    const playerIdx = currentPlayerBS - 1;
    const currentShip = getCurrentShipToPlace();
    
    if (!currentShip) {
      // All ships placed for this player
      if (currentPlayerBS === 1) {
        // Switch to player 2
        currentPlayerBS = 2;
        gameAPI.updateTurn(currentPlayerBS);
        gameAPI.updateStatus("Player 2: Place your fleet!");
        drawGame();
      } else {
        // Both players done, start battle
        startBattlePhase();
      }
      return;
    }
    
    // Try to place ship horizontally
    const positions = [];
    for (let i = 0; i < currentShip.length; i++) {
      if (col + i < BOARD_SIZE) {
        positions.push({ row, col: col + i });
      }
    }
    
    if (positions.length === currentShip.length && isValidPlacement(positions, playerIdx)) {
      // Place the ship
      placedShips[playerIdx].push({
        name: currentShip.name,
        positions: positions,
        hits: 0
      });
      
      // Update ship count
      currentShip.count--;
      if (currentShip.count === 0) {
        // Remove this ship type from the list
        shipsToPlace[playerIdx] = shipsToPlace[playerIdx].filter(s => s !== currentShip);
      }
      
      gameAPI.showToast(`${currentShip.name} placed!`, 'success');
      drawGame();
    } else {
      gameAPI.showToast('Invalid placement! Ships cannot overlap or go off board.', 'error');
    }
  }
  
  // Check if ship placement is valid
  function isValidPlacement(positions, playerIdx) {
    // Check if positions overlap with existing ships
    for (let ship of placedShips[playerIdx]) {
      for (let existingPos of ship.positions) {
        for (let newPos of positions) {
          if (existingPos.row === newPos.row && existingPos.col === newPos.col) {
            return false;
          }
        }
      }
    }
    return true;
  }
  
  // Get current ship to place
  function getCurrentShipToPlace() {
    const playerIdx = currentPlayerBS - 1;
    return shipsToPlace[playerIdx].find(ship => ship.count > 0);
  }
  
  // Start battle phase
  function startBattlePhase() {
    placingPhase = false;
    currentPlayerBS = 1;
    gameAPI.updateStatus("Battle begins! Player 1, take your shot!");
    gameAPI.updateTurn(currentPlayerBS);
    drawGame();
  }
  
  // Handle shots
  function handleShot(row, col) {
    const currentPlayerIdx = getCurrentPlayerIndex();
    const targetPlayerIdx = getOpponentIndex();
    
    // Check if already shot here
    const alreadyShot = shotsFired[currentPlayerIdx].some(
      shot => shot.row === row && shot.col === col
    );
    
    if (alreadyShot) {
      gameAPI.showToast('Already fired at this location!', 'error');
      return;
    }
    
    // Check for hit
    const hit = checkHit(row, col, targetPlayerIdx);
    
    // Record the shot
    shotsFired[currentPlayerIdx].push({ row, col, hit });
    
    if (hit) {
      gameAPI.showToast('HIT! 💥', 'success');
      
      // Check if ship is sunk
      const sunkShip = checkSunkShip(row, col, targetPlayerIdx, currentPlayerIdx);
      if (sunkShip) {
        gameAPI.showToast(`${sunkShip.name} SUNK! 🚢`, 'success');
      }
      
      // Check for win
      if (checkWin(targetPlayerIdx, currentPlayerIdx)) {
        endGame(currentPlayerBS);
        return;
      }
      
      // Hit = keep turn
      gameAPI.updateStatus(`Player ${currentPlayerBS} hit! Fire again!`);
    } else {
      gameAPI.showToast('Miss! 💦', 'error');
      
      // Miss = switch turns
      switchPlayer();
      gameAPI.updateStatus(`Player ${currentPlayerBS}'s turn`);
      gameAPI.updateTurn(currentPlayerBS);
    }
    
    drawGame();
  }
  
  // Check if shot hits a ship
  function checkHit(row, col, targetPlayerIdx) {
    for (let ship of placedShips[targetPlayerIdx]) {
      for (let pos of ship.positions) {
        if (pos.row === row && pos.col === col) {
          ship.hits++;
          return true;
        }
      }
    }
    return false;
  }
  
  // Check if a ship is completely sunk
  function checkSunkShip(row, col, targetPlayerIdx, attackerIdx) {
    for (let ship of placedShips[targetPlayerIdx]) {
      for (let pos of ship.positions) {
        if (pos.row === row && pos.col === col) {
          if (ship.hits >= ship.positions.length) {
            return ship;
          }
          break;
        }
      }
    }
    return null;
  }
  
  // Check for win condition
  function checkWin(targetPlayerIdx, attackerIdx) {
    return placedShips[targetPlayerIdx].every(ship => ship.hits >= ship.positions.length);
  }
  
  // End game
  function endGame(winner) {
    gameRunning = false;
    gameAPI.clearCanvas();
    
    gameAPI.gameUtils.drawText(
      `🎉 Player ${winner} Wins! 🎉`,
      gameAPI.canvas.width / 2, gameAPI.canvas.height / 2 - 50,
      '32px Arial', '#00ff00'
    );
    
    gameAPI.gameUtils.drawText(
      'All enemy ships destroyed!',
      gameAPI.canvas.width / 2, gameAPI.canvas.height / 2,
      '20px Arial', '#ffffff'
    );
    
    gameAPI.gameUtils.drawText(
      'Press ESC to return to menu',
      gameAPI.canvas.width / 2, gameAPI.canvas.height / 2 + 40,
      '16px Arial', '#cccccc'
    );
    
    gameAPI.updateStatus(`Game Over - Player ${winner} wins!`);
    
    // Update scores
    const scores = [0, 0, 0, 0];
    scores[winner - 1] = 1;
    gameAPI.updateScore(scores);
  }
  
  // Switch current player
  function switchPlayer() {
    currentPlayerBS = currentPlayerBS === 1 ? 2 : 1;
  }
  
  // Get current player index (0-based)
  function getCurrentPlayerIndex() {
    return currentPlayerBS - 1;
  }
  
  // Get opponent index (0-based)
  function getOpponentIndex() {
    return currentPlayerBS === 1 ? 1 : 0;
  }
})();