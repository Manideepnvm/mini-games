// ========================================
// CHECKERS GAME MODULE
// ========================================

window.checkersGame = (function() {
  // Game state
  let gameAPI = null;
  let gameConfig = null;
  let gameRunning = false;
  
  // Game variables
  const BOARD_SIZE = 8;
  let board = [];
  let currentPlayerC = 1;
  let selectedPiece = null;
  let highlightedMoves = [];
  let mustCapture = false;
  let captureSequence = [];
  let scores = [0, 0]; // [player1, player2]
  
  // Public API
  return {
    name: 'checkers',
    
    init(api) {
      gameAPI = api;
      gameConfig = api.gameInfo;
      console.log('🔴 Checkers initialized');
    },
    
    start() {
      if (!gameAPI) {
        console.error('Checkers: Game API not initialized');
        return;
      }
      
      initGameC();
      gameRunning = true;
      console.log('🔴 Checkers started');
    },
    
    stop() {
      gameRunning = false;
      console.log('🔴 Checkers stopped');
    },
    
    handleClick(x, y, event) {
      if (!gameRunning) return;
      handleClickC(x, y);
    },
    
    handleKeydown(event) {
      if (!gameRunning) return;
      
      // Press 'H' to show possible moves
      if (event.key.toLowerCase() === 'h') {
        showAllPossibleMoves();
      }
      
      // Press 'ESC' to deselect piece
      if (event.key === 'Escape' && selectedPiece) {
        selectedPiece = null;
        highlightedMoves = [];
        drawGame();
      }
    },
    
    handleMouseMove(x, y, event) {
      if (!gameRunning) return;
      // Could add hover effects here
    }
  };
  
  // Initialize game
  function initGameC() {
    board = createBoard();
    currentPlayerC = 1;
    selectedPiece = null;
    highlightedMoves = [];
    mustCapture = false;
    captureSequence = [];
    scores = [12, 12]; // Each player starts with 12 pieces
    
    gameAPI.updateStatus("Red pieces move first!");
    gameAPI.updateTurn(currentPlayerC);
    gameAPI.updateScore(scores);
    drawGame();
  }
  
  // Create initial board setup
  function createBoard() {
    const board = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      board[row] = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        // Only place pieces on dark squares (odd sum of coordinates)
        if ((row + col) % 2 === 1) {
          if (row < 3) {
            // Player 2 pieces (top)
            board[row][col] = { player: 2, king: false };
          } else if (row > 4) {
            // Player 1 pieces (bottom)
            board[row][col] = { player: 1, king: false };
          } else {
            // Empty middle rows
            board[row][col] = null;
          }
        } else {
          // Light squares are always empty
          board[row][col] = null;
        }
      }
    }
    
    return board;
  }
  
  // Main drawing function
  function drawGame() {
    gameAPI.clearCanvas();
    drawBoard();
    drawPieces();
    drawSelection();
    drawUI();
  }
  
  // Draw the checkerboard
  function drawBoard() {
    const cellSize = gameAPI.canvas.width / BOARD_SIZE;
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const x = col * cellSize;
        const y = row * cellSize;
        
        // Alternate colors for checkerboard pattern
        const isLight = (row + col) % 2 === 0;
        gameAPI.gameUtils.drawRect(
          x, y, cellSize, cellSize,
          isLight ? '#f0d9b5' : '#b58863', true
        );
        
        // Add subtle border
        gameAPI.gameUtils.drawRect(
          x, y, cellSize, cellSize,
          '#8b4513', false
        );
        
        // Draw coordinates
        if (row === 0) {
          gameAPI.gameUtils.drawText(
            String.fromCharCode(97 + col), // a, b, c...
            x + cellSize/2, y - 10, '12px Arial', '#666666'
          );
        }
        if (col === 0) {
          gameAPI.gameUtils.drawText(
            (8 - row).toString(), // 8, 7, 6...
            x - 15, y + cellSize/2, '12px Arial', '#666666'
          );
        }
      }
    }
  }
  
  // Draw all pieces
  function drawPieces() {
    const cellSize = gameAPI.canvas.width / BOARD_SIZE;
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = board[row][col];
        if (piece) {
          const x = col * cellSize + cellSize / 2;
          const y = row * cellSize + cellSize / 2;
          const radius = cellSize * 0.35;
          
          // Piece shadow
          gameAPI.gameUtils.drawCircle(x + 2, y + 2, radius, '#00000050', true);
          
          // Main piece
          const pieceColor = piece.player === 1 ? '#dc143c' : '#2f4f4f';
          gameAPI.gameUtils.drawCircle(x, y, radius, pieceColor, true);
          
          // Piece border
          gameAPI.gameUtils.drawCircle(x, y, radius, '#000000', false);
          
          // Inner circle for depth
          gameAPI.gameUtils.drawCircle(x, y, radius * 0.7, 
            piece.player === 1 ? '#ff6b6b' : '#5f8a8b', true);
          
          // King crown
          if (piece.king) {
            gameAPI.gameUtils.drawText('♔', x, y, '20px Arial', '#ffd700');
          }
          
          // Highlight selected piece
          if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col) {
            gameAPI.gameUtils.drawCircle(x, y, radius + 5, '#ffff00', false);
          }
        }
      }
    }
  }
  
  // Draw selection and possible moves
  function drawSelection() {
    const cellSize = gameAPI.canvas.width / BOARD_SIZE;
    
    // Highlight possible moves
    for (let move of highlightedMoves) {
      const x = move.col * cellSize;
      const y = move.row * cellSize;
      
      if (move.isCapture) {
        // Capture moves in red
        gameAPI.gameUtils.drawRect(x + 5, y + 5, cellSize - 10, cellSize - 10, '#ff000080', true);
      } else {
        // Regular moves in green
        gameAPI.gameUtils.drawRect(x + 5, y + 5, cellSize - 10, cellSize - 10, '#00ff0040', true);
      }
      
      // Draw move indicator
      gameAPI.gameUtils.drawCircle(
        x + cellSize/2, y + cellSize/2, 8,
        move.isCapture ? '#ff0000' : '#00ff00', true
      );
    }
  }
  
  // Draw UI elements
  function drawUI() {
    const canvasHeight = gameAPI.canvas.height;
    
    // Player turn indicator
    gameAPI.gameUtils.drawText(
      `${currentPlayerC === 1 ? 'Red' : 'Black'} Player's Turn`,
      gameAPI.canvas.width / 2, canvasHeight - 50,
      '20px Arial', currentPlayerC === 1 ? '#dc143c' : '#2f4f4f'
    );
    
    // Game instructions
    if (mustCapture) {
      gameAPI.gameUtils.drawText(
        'MUST CAPTURE! Continue jumping.',
        gameAPI.canvas.width / 2, canvasHeight - 25,
        '16px Arial', '#ff0000'
      );
    } else {
      gameAPI.gameUtils.drawText(
        'Click piece to select, then click destination',
        gameAPI.canvas.width / 2, canvasHeight - 25,
        '14px Arial', '#666666'
      );
    }
    
    // Piece count
    gameAPI.gameUtils.drawText(
      `Red: ${scores[0]} pieces`,
      100, canvasHeight - 75,
      '16px Arial', '#dc143c', 'left'
    );
    
    gameAPI.gameUtils.drawText(
      `Black: ${scores[1]} pieces`,
      gameAPI.canvas.width - 100, canvasHeight - 75,
      '16px Arial', '#2f4f4f', 'right'
    );
  }
  
  // Handle click events
  function handleClickC(x, y) {
    const cellSize = gameAPI.canvas.width / BOARD_SIZE;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);
    
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return;
    
    const piece = board[row][col];
    
    if (selectedPiece) {
      // Try to move selected piece
      const moveResult = attemptMove(selectedPiece, row, col);
      
      if (moveResult.success) {
        if (moveResult.isCapture) {
          // Check for additional captures
          const additionalCaptures = getPossibleCaptures(row, col);
          
          if (additionalCaptures.length > 0 && !moveResult.becameKing) {
            // Must continue capturing
            selectedPiece = { row, col };
            highlightedMoves = additionalCaptures;
            mustCapture = true;
            captureSequence.push({ row, col });
            
            gameAPI.showToast('Continue jumping!', 'success');
          } else {
            // Capture sequence complete
            finishTurn();
          }
        } else {
          // Regular move
          finishTurn();
        }
      } else {
        // Invalid move
        gameAPI.showToast('Invalid move!', 'error');
        
        // Try selecting new piece
        if (piece && piece.player === currentPlayerC) {
          selectPiece(row, col);
        } else {
          selectedPiece = null;
          highlightedMoves = [];
        }
      }
    } else {
      // Select piece
      if (piece && piece.player === currentPlayerC) {
        selectPiece(row, col);
      }
    }
    
    drawGame();
  }
  
  // Select a piece and highlight possible moves
  function selectPiece(row, col) {
    selectedPiece = { row, col };
    
    if (mustCapture) {
      // Only show capture moves during forced capture
      highlightedMoves = getPossibleCaptures(row, col);
    } else {
      // Show all possible moves
      highlightedMoves = getPossibleMoves(row, col);
      
      // Check if any captures are available for current player
      const allCaptures = getAllPossibleCaptures(currentPlayerC);
      if (allCaptures.length > 0) {
        // Must capture - only show capture moves
        highlightedMoves = highlightedMoves.filter(move => move.isCapture);
        if (highlightedMoves.length === 0) {
          // This piece has no captures, deselect
          selectedPiece = null;
          gameAPI.showToast('Must capture when possible!', 'error');
          return;
        }
      }
    }
    
    if (highlightedMoves.length === 0) {
      gameAPI.showToast('No valid moves for this piece!', 'error');
      selectedPiece = null;
    }
  }
  
  // Attempt to move a piece
  function attemptMove(from, toRow, toCol) {
    const validMoves = highlightedMoves;
    const targetMove = validMoves.find(move => move.row === toRow && move.col === toCol);
    
    if (!targetMove) {
      return { success: false };
    }
    
    const piece = board[from.row][from.col];
    const wasKing = piece.king;
    
    // Move the piece
    board[toRow][toCol] = piece;
    board[from.row][from.col] = null;
    
    let becameKing = false;
    
    // Check for king promotion
    if (!piece.king) {
      if ((piece.player === 1 && toRow === 0) || (piece.player === 2 && toRow === BOARD_SIZE - 1)) {
        piece.king = true;
        becameKing = true;
        gameAPI.showToast('Crowned King! ♔', 'success');
      }
    }
    
    // Handle capture
    if (targetMove.isCapture) {
      const capturedRow = targetMove.capturedRow;
      const capturedCol = targetMove.capturedCol;
      board[capturedRow][capturedCol] = null;
      
      // Update scores
      const opponent = currentPlayerC === 1 ? 2 : 1;
      scores[opponent - 1]--;
      gameAPI.updateScore(scores);
      
      gameAPI.showToast('Piece captured!', 'success');
    }
    
    return { 
      success: true, 
      isCapture: targetMove.isCapture, 
      becameKing: becameKing 
    };
  }
  
  // Get all possible moves for a piece
  function getPossibleMoves(row, col) {
    const piece = board[row][col];
    if (!piece) return [];
    
    const moves = [];
    const directions = piece.king ? 
      [[-1, -1], [-1, 1], [1, -1], [1, 1]] : // Kings move in all directions
      piece.player === 1 ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]]; // Regular pieces move forward
    
    for (let [dRow, dCol] of directions) {
      // Regular move
      const newRow = row + dRow;
      const newCol = col + dCol;
      
      if (isValidPosition(newRow, newCol) && !board[newRow][newCol]) {
        moves.push({ row: newRow, col: newCol, isCapture: false });
      }
      
      // Capture move
      const jumpRow = row + dRow * 2;
      const jumpCol = col + dCol * 2;
      
      if (isValidPosition(jumpRow, jumpCol) && !board[jumpRow][jumpCol]) {
        const capturedPiece = board[newRow][newCol];
        if (capturedPiece && capturedPiece.player !== piece.player) {
          moves.push({ 
            row: jumpRow, 
            col: jumpCol, 
            isCapture: true, 
            capturedRow: newRow, 
            capturedCol: newCol 
          });
        }
      }
    }
    
    return moves;
  }
  
  // Get only capture moves for a piece
  function getPossibleCaptures(row, col) {
    return getPossibleMoves(row, col).filter(move => move.isCapture);
  }
  
  // Get all possible captures for a player
  function getAllPossibleCaptures(player) {
    const captures = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = board[row][col];
        if (piece && piece.player === player) {
          captures.push(...getPossibleCaptures(row, col));
        }
      }
    }
    
    return captures;
  }
  
  // Check if position is valid
  function isValidPosition(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  }
  
  // Finish current turn
  function finishTurn() {
    selectedPiece = null;
    highlightedMoves = [];
    mustCapture = false;
    captureSequence = [];
    
    // Check for win condition
    if (checkWin()) {
      return;
    }
    
    // Switch players
    currentPlayerC = currentPlayerC === 1 ? 2 : 1;
    gameAPI.updateTurn(currentPlayerC);
    
    // Check if new player has any moves
    if (!hasValidMoves(currentPlayerC)) {
      endGame(currentPlayerC === 1 ? 2 : 1, 'No valid moves available!');
    }
  }
  
  // Check for win condition
  function checkWin() {
    const player1Pieces = countPieces(1);
    const player2Pieces = countPieces(2);
    
    if (player1Pieces === 0) {
      endGame(2, 'All red pieces captured!');
      return true;
    } else if (player2Pieces === 0) {
      endGame(1, 'All black pieces captured!');
      return true;
    }
    
    return false;
  }
  
  // Count pieces for a player
  function countPieces(player) {
    let count = 0;
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = board[row][col];
        if (piece && piece.player === player) {
          count++;
        }
      }
    }
    return count;
  }
  
  // Check if player has valid moves
  function hasValidMoves(player) {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = board[row][col];
        if (piece && piece.player === player) {
          const moves = getPossibleMoves(row, col);
          if (moves.length > 0) return true;
        }
      }
    }
    return false;
  }
  
  // Show all possible moves for current player
  function showAllPossibleMoves() {
    const allMoves = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = board[row][col];
        if (piece && piece.player === currentPlayerC) {
          allMoves.push(...getPossibleMoves(row, col));
        }
      }
    }
    
    highlightedMoves = allMoves;
    drawGame();
    
    setTimeout(() => {
      if (!selectedPiece) {
        highlightedMoves = [];
        drawGame();
      }
    }, 2000);
  }
  
  // End game
  function endGame(winner, reason) {
    gameRunning = false;
    gameAPI.clearCanvas();
    
    const winnerColor = winner === 1 ? 'Red' : 'Black';
    
    gameAPI.gameUtils.drawText(
      `🎉 ${winnerColor} Player Wins! 🎉`,
      gameAPI.canvas.width / 2, gameAPI.canvas.height / 2 - 50,
      '32px Arial', winner === 1 ? '#dc143c' : '#2f4f4f'
    );
    
    gameAPI.gameUtils.drawText(
      reason,
      gameAPI.canvas.width / 2, gameAPI.canvas.height / 2,
      '20px Arial', '#ffffff'
    );
    
    gameAPI.gameUtils.drawText(
      'Press ESC to return to menu',
      gameAPI.canvas.width / 2, gameAPI.canvas.height / 2 + 40,
      '16px Arial', '#cccccc'
    );
    
    gameAPI.updateStatus(`Game Over - ${winnerColor} Player wins!`);
    
    // Update scores
    const finalScores = [0, 0, 0, 0];
    finalScores[winner - 1] = 1;
    gameAPI.updateScore(finalScores);
  }
})();