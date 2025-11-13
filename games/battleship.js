// ========================================
// 🚢 BATTLESHIP GAME MODULE
// ========================================
// Naval strategy game for 2 players
// Place ships, fire shots, sink the fleet!
// ========================================

window.battleshipGame = (function() {
  'use strict';

  // ===== GAME STATE =====
  let gameAPI = null;
  let gameRunning = false;
  
  // Game variables
  let currentPlayer = 1;
  let gamePhase = 'placement'; // 'placement' or 'battle'
  let shipRotation = 'horizontal'; // 'horizontal' or 'vertical'
  
  const BOARD_SIZE = 8;
  const CELL_SIZE = 45;
  const BOARD_SPACING = 50;
  const LEFT_BOARD_X = 50;
  const RIGHT_BOARD_X = 450;
  const BOARD_Y = 100;
  
  // Ship definitions
  const SHIP_TYPES = [
    { name: 'Destroyer', length: 2, count: 2, icon: '🚢' },
    { name: 'Cruiser', length: 3, count: 1, icon: '🛳️' }
  ];
  
  // Player boards and ships
  let playerShips = [[], []]; // Ships for each player
  let playerShots = [[], []]; // Shots fired by each player
  let shipsToPlace = [
    JSON.parse(JSON.stringify(SHIP_TYPES)),
    JSON.parse(JSON.stringify(SHIP_TYPES))
  ];
  
  let previewPositions = null; // For ship placement preview

  // ===== PUBLIC API =====
  return {
    name: 'battleship',
    
    init(api) {
      gameAPI = api;
      console.log('🚢 Battleship initialized');
    },
    
    start() {
      if (!gameAPI) {
        console.error('❌ Battleship: Game API not initialized');
        return;
      }
      
      resetGame();
      gameRunning = true;
      updateStatus();
      render();
      console.log('🚢 Battleship started - Ship placement phase');
    },
    
    stop() {
      gameRunning = false;
      console.log('🚢 Battleship stopped');
    },
    
    handleClick(x, y, event) {
      if (!gameRunning) return;
      
      if (gamePhase === 'placement') {
        handlePlacementClick(x, y);
      } else if (gamePhase === 'battle') {
        handleBattleClick(x, y);
      }
    },
    
    handleKeydown(event) {
      if (!gameRunning || gamePhase !== 'placement') return;
      
      // Press R to rotate ship during placement
      if (event.key.toLowerCase() === 'r') {
        shipRotation = shipRotation === 'horizontal' ? 'vertical' : 'horizontal';
        render();
        console.log(`🔄 Ship rotation: ${shipRotation}`);
      }
      
      // ESC to return to menu
      if (event.key === 'Escape' && gameAPI.returnToMenu) {
        gameAPI.returnToMenu();
      }
    },
    
    handleMouseMove(x, y, event) {
      if (!gameRunning || gamePhase !== 'placement') return;
      
      const currentShip = getCurrentShipToPlace();
      if (!currentShip) return;
      
      // Calculate cell position on player's board
      const col = Math.floor((x - LEFT_BOARD_X) / CELL_SIZE);
      const row = Math.floor((y - BOARD_Y) / CELL_SIZE);
      
      if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
        previewPositions = calculateShipPositions(row, col, currentShip.length, shipRotation);
        render();
      } else {
        if (previewPositions) {
          previewPositions = null;
          render();
        }
      }
    },
    
    handleRightClick() {
      if (gamePhase === 'placement') {
        shipRotation = shipRotation === 'horizontal' ? 'vertical' : 'horizontal';
        render();
      }
    }
  };

  // ===== GAME LOGIC =====
  
  function resetGame() {
    currentPlayer = 1;
    gamePhase = 'placement';
    shipRotation = 'horizontal';
    playerShips = [[], []];
    playerShots = [[], []];
    shipsToPlace = [
      JSON.parse(JSON.stringify(SHIP_TYPES)),
      JSON.parse(JSON.stringify(SHIP_TYPES))
    ];
    previewPositions = null;
  }
  
  function updateStatus() {
    if (!gameAPI) return;
    
    let status = '';
    if (gamePhase === 'placement') {
      const currentShip = getCurrentShipToPlace();
      if (currentShip) {
        status = `🚢 Player ${currentPlayer}: Place ${currentShip.name} (${currentShip.length} cells) - Press R to rotate`;
      } else {
        status = `✅ Player ${currentPlayer}: All ships placed! Waiting for opponent...`;
      }
    } else {
      status = `⚓ Player ${currentPlayer}'s Turn - Click enemy board to fire!`;
    }
    
    if (gameAPI.updateGameStatus) {
      gameAPI.updateGameStatus(status);
    }
  }
  
  function getCurrentShipToPlace() {
    const playerIdx = currentPlayer - 1;
    for (let ship of shipsToPlace[playerIdx]) {
      if (ship.count > 0) return ship;
    }
    return null;
  }
  
  function calculateShipPositions(row, col, length, rotation) {
    const positions = [];
    
    for (let i = 0; i < length; i++) {
      if (rotation === 'horizontal') {
        if (col + i >= BOARD_SIZE) return null;
        positions.push({ row, col: col + i });
      } else {
        if (row + i >= BOARD_SIZE) return null;
        positions.push({ row: row + i, col });
      }
    }
    
    return positions;
  }
  
  function isValidPlacement(positions, playerIdx) {
    if (!positions) return false;
    
    // Check overlaps with existing ships
    for (let ship of playerShips[playerIdx]) {
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
  
  function handlePlacementClick(x, y) {
    const playerIdx = currentPlayer - 1;
    const currentShip = getCurrentShipToPlace();
    
    if (!currentShip) {
      // All ships placed for this player
      if (currentPlayer === 1) {
        currentPlayer = 2;
        shipRotation = 'horizontal';
        previewPositions = null;
        updateStatus();
        render();
        showMessage('Player 2: Place your ships!', 'info');
      } else {
        // Both players done, start battle
        startBattle();
      }
      return;
    }
    
    // Check if click is on player's board
    const col = Math.floor((x - LEFT_BOARD_X) / CELL_SIZE);
    const row = Math.floor((y - BOARD_Y) / CELL_SIZE);
    
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
      return;
    }
    
    const positions = calculateShipPositions(row, col, currentShip.length, shipRotation);
    
    if (isValidPlacement(positions, playerIdx)) {
      // Place the ship
      playerShips[playerIdx].push({
        name: currentShip.name,
        length: currentShip.length,
        positions: positions,
        hits: Array(currentShip.length).fill(false),
        sunk: false
      });
      
      currentShip.count--;
      previewPositions = null;
      
      showMessage(`${currentShip.name} placed!`, 'success');
      updateStatus();
      render();
    } else {
      showMessage('Invalid placement! Check for overlaps.', 'error');
    }
  }
  
  function startBattle() {
    gamePhase = 'battle';
    currentPlayer = 1;
    updateStatus();
    render();
    showMessage('⚓ Battle begins! Player 1, fire at will!', 'success');
  }
  
  function handleBattleClick(x, y) {
    const playerIdx = currentPlayer - 1;
    const opponentIdx = currentPlayer === 1 ? 1 : 0;
    
    // Check if click is on enemy board (right side)
    const col = Math.floor((x - RIGHT_BOARD_X) / CELL_SIZE);
    const row = Math.floor((y - BOARD_Y) / CELL_SIZE);
    
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
      return;
    }
    
    // Check if already shot here
    const alreadyShot = playerShots[playerIdx].some(
      shot => shot.row === row && shot.col === col
    );
    
    if (alreadyShot) {
      showMessage('Already fired here!', 'error');
      return;
    }
    
    // Check for hit
    let hit = false;
    let sunkShip = null;
    
    for (let ship of playerShips[opponentIdx]) {
      for (let i = 0; i < ship.positions.length; i++) {
        const pos = ship.positions[i];
        if (pos.row === row && pos.col === col) {
          hit = true;
          ship.hits[i] = true;
          
          // Check if ship is sunk
          if (ship.hits.every(h => h === true) && !ship.sunk) {
            ship.sunk = true;
            sunkShip = ship;
          }
          break;
        }
      }
      if (hit) break;
    }
    
    // Record the shot
    playerShots[playerIdx].push({ row, col, hit });
    
    if (hit) {
      if (sunkShip) {
        showMessage(`💥 HIT! ${sunkShip.name} SUNK!`, 'success');
      } else {
        showMessage('💥 HIT! Fire again!', 'success');
      }
      
      // Check for win
      if (checkWin(opponentIdx)) {
        endGame(currentPlayer);
        return;
      }
      
      // Keep turn on hit
    } else {
      showMessage('💦 MISS! Turn switches.', 'info');
      currentPlayer = currentPlayer === 1 ? 2 : 1;
    }
    
    updateStatus();
    render();
  }
  
  function checkWin(opponentIdx) {
    return playerShips[opponentIdx].every(ship => ship.sunk);
  }
  
  function endGame(winner) {
    gameRunning = false;
    gamePhase = 'gameover';
    render();
    
    const ctx = gameAPI.ctx;
    const centerX = gameAPI.canvas.width / 2;
    const centerY = gameAPI.canvas.height / 2;
    
    // Victory overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, gameAPI.canvas.width, gameAPI.canvas.height);
    
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`🎉 Player ${winner} Wins! 🎉`, centerX, centerY - 40);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText('All enemy ships destroyed!', centerX, centerY + 20);
    
    ctx.fillStyle = '#cccccc';
    ctx.font = '18px Arial';
    ctx.fillText('Press ESC or click Back to Menu', centerX, centerY + 60);
    
    showMessage(`Player ${winner} wins the battle!`, 'success');
    
    // Update scores if available
    if (gameAPI.updateScore) {
      const scores = [0, 0, 0, 0];
      scores[winner - 1] = 1;
      gameAPI.updateScore(scores);
    }
  }
  
  function showMessage(message, type = 'info') {
    if (gameAPI && gameAPI.showToast) {
      gameAPI.showToast(message, type);
    }
    console.log(`🚢 ${message}`);
  }

  // ===== RENDERING =====
  
  function render() {
    if (!gameAPI || !gameAPI.ctx) return;
    
    gameAPI.clearCanvas();
    
    const ctx = gameAPI.ctx;
    
    // Draw title
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🚢 BATTLESHIP ⚓', gameAPI.canvas.width / 2, 40);
    
    if (gamePhase === 'placement') {
      drawPlacementPhase(ctx);
    } else if (gamePhase === 'battle') {
      drawBattlePhase(ctx);
    }
  }
  
  function drawPlacementPhase(ctx) {
    const playerIdx = currentPlayer - 1;
    
    // Draw board labels
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Your Board (Click to Place)', LEFT_BOARD_X + (BOARD_SIZE * CELL_SIZE) / 2, BOARD_Y - 20);
    
    // Draw player's board
    drawBoard(ctx, LEFT_BOARD_X, BOARD_Y);
    drawPlayerShips(ctx, LEFT_BOARD_X, BOARD_Y, playerIdx);
    
    // Draw placement preview
    if (previewPositions && isValidPlacement(previewPositions, playerIdx)) {
      drawPreview(ctx, LEFT_BOARD_X, BOARD_Y, previewPositions, true);
    } else if (previewPositions) {
      drawPreview(ctx, LEFT_BOARD_X, BOARD_Y, previewPositions, false);
    }
    
    // Draw ships to place list
    drawShipsList(ctx, playerIdx);
  }
  
  function drawBattlePhase(ctx) {
    const playerIdx = currentPlayer - 1;
    const opponentIdx = currentPlayer === 1 ? 1 : 0;
    
    // Draw board labels
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Your Fleet', LEFT_BOARD_X + (BOARD_SIZE * CELL_SIZE) / 2, BOARD_Y - 20);
    ctx.fillText('Enemy Waters (Click to Fire)', RIGHT_BOARD_X + (BOARD_SIZE * CELL_SIZE) / 2, BOARD_Y - 20);
    
    // Draw both boards
    drawBoard(ctx, LEFT_BOARD_X, BOARD_Y);
    drawBoard(ctx, RIGHT_BOARD_X, BOARD_Y);
    
    // Draw player's ships (left board)
    drawPlayerShips(ctx, LEFT_BOARD_X, BOARD_Y, playerIdx);
    
    // Draw opponent's hits on player's ships
    drawOpponentShots(ctx, LEFT_BOARD_X, BOARD_Y, opponentIdx);
    
    // Draw player's shots on enemy board (right board)
    drawPlayerShotsOnBoard(ctx, RIGHT_BOARD_X, BOARD_Y, playerIdx, opponentIdx);
    
    // Draw statistics
    drawStatistics(ctx, playerIdx, opponentIdx);
  }
  
  function drawBoard(ctx, startX, startY) {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const x = startX + col * CELL_SIZE;
        const y = startY + row * CELL_SIZE;
        
        // Grid cell
        ctx.fillStyle = '#0a3a4a';
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
      }
    }
    
    // Draw coordinates
    ctx.fillStyle = '#888888';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < BOARD_SIZE; i++) {
      // Column labels (A-H)
      ctx.fillText(String.fromCharCode(65 + i), startX + i * CELL_SIZE + CELL_SIZE / 2, startY - 5);
      // Row labels (1-8)
      ctx.textAlign = 'right';
      ctx.fillText((i + 1).toString(), startX - 8, startY + i * CELL_SIZE + CELL_SIZE / 2 + 4);
      ctx.textAlign = 'center';
    }
  }
  
  function drawPlayerShips(ctx, startX, startY, playerIdx) {
    for (let ship of playerShips[playerIdx]) {
      for (let i = 0; i < ship.positions.length; i++) {
        const pos = ship.positions[i];
        const x = startX + pos.col * CELL_SIZE;
        const y = startY + pos.row * CELL_SIZE;
        
        if (ship.hits[i]) {
          // Hit part
          ctx.fillStyle = '#ff3333';
          ctx.fillRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        } else {
          // Intact part
          ctx.fillStyle = '#0066cc';
          ctx.fillRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        }
        
        ctx.strokeStyle = '#0088ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
      }
    }
  }
  
  function drawOpponentShots(ctx, startX, startY, opponentIdx) {
    for (let shot of playerShots[opponentIdx]) {
      const x = startX + shot.col * CELL_SIZE + CELL_SIZE / 2;
      const y = startY + shot.row * CELL_SIZE + CELL_SIZE / 2;
      
      if (shot.hit) {
        ctx.fillStyle = '#ff3333';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('X', x, y + 7);
      }
    }
  }
  
  function drawPlayerShotsOnBoard(ctx, startX, startY, playerIdx, opponentIdx) {
    for (let shot of playerShots[playerIdx]) {
      const x = startX + shot.col * CELL_SIZE + CELL_SIZE / 2;
      const y = startY + shot.row * CELL_SIZE + CELL_SIZE / 2;
      
      if (shot.hit) {
        // Hit marker
        ctx.fillStyle = '#ff3333';
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffff00';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('💥', x - 1, y + 8);
      } else {
        // Miss marker
        ctx.fillStyle = '#666666';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('○', x, y + 5);
      }
    }
  }
  
  function drawPreview(ctx, startX, startY, positions, valid) {
    ctx.fillStyle = valid ? 'rgba(102, 204, 102, 0.5)' : 'rgba(204, 102, 102, 0.5)';
    
    for (let pos of positions) {
      const x = startX + pos.col * CELL_SIZE;
      const y = startY + pos.row * CELL_SIZE;
      ctx.fillRect(x + 4, y + 4, CELL_SIZE - 8, CELL_SIZE - 8);
    }
  }
  
  function drawShipsList(ctx, playerIdx) {
    const startX = 50;
    const startY = 480;
    
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Ships to Place:', startX, startY);
    
    let yOffset = startY + 25;
    for (let ship of shipsToPlace[playerIdx]) {
      if (ship.count > 0) {
        ctx.fillStyle = '#cccccc';
        ctx.font = '14px Arial';
        ctx.fillText(`${ship.icon} ${ship.name} (${ship.length} cells) x${ship.count}`, startX, yOffset);
        yOffset += 20;
      }
    }
    
    ctx.fillStyle = '#888888';
    ctx.font = '12px Arial';
    ctx.fillText(`Rotation: ${shipRotation.toUpperCase()} (Press R to rotate)`, startX, yOffset + 10);
  }
  
  function drawStatistics(ctx, playerIdx, opponentIdx) {
    const startX = 50;
    const startY = 480;
    
    const playerShipsRemaining = playerShips[playerIdx].filter(s => !s.sunk).length;
    const opponentShipsRemaining = playerShips[opponentIdx].filter(s => !s.sunk).length;
    
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Battle Statistics:', startX, startY);
    
    ctx.fillStyle = '#00ff88';
    ctx.font = '14px Arial';
    ctx.fillText(`Your Ships: ${playerShipsRemaining} / ${playerShips[playerIdx].length}`, startX, startY + 25);
    
    ctx.fillStyle = '#ff4444';
    ctx.fillText(`Enemy Ships: ${opponentShipsRemaining} / ${playerShips[opponentIdx].length}`, startX, startY + 45);
    
    ctx.fillStyle = '#cccccc';
    ctx.fillText(`Shots Fired: ${playerShots[playerIdx].length}`, startX, startY + 65);
    
    const hits = playerShots[playerIdx].filter(s => s.hit).length;
    const accuracy = playerShots[playerIdx].length > 0 
      ? Math.round((hits / playerShots[playerIdx].length) * 100) 
      : 0;
    ctx.fillText(`Accuracy: ${accuracy}%`, startX, startY + 85);
  }

})();