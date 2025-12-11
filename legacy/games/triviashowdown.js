// ========================================
// TRIVIA SHOWDOWN GAME MODULE (4-Player)
// ========================================

const QUESTIONS = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    answer: 0
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: 1
  },
  {
    question: "How many sides does a triangle have?",
    options: ["2", "3", "4", "5"],
    answer: 1
  },
  {
    question: "Who wrote 'Harry Potter'?",
    options: ["J.R.R. Tolkien", "George R.R. Martin", "J.K. Rowling", "Stephen King"],
    answer: 2
  },
  {
    question: "What gas do plants absorb from the air?",
    options: ["Oxygen", "Hydrogen", "Carbon Dioxide", "Nitrogen"],
    answer: 2
  },
  {
    question: "Which country is home to the Great Wall?",
    options: ["India", "China", "Japan", "Vietnam"],
    answer: 1
  },
  {
    question: "What is the largest ocean?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    answer: 3
  },
  {
    question: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    answer: 2
  }
];

window.triviashowdownGame = (function() {
  let gameAPI = null;
  let gameConfig = null;
  let gameRunning = false;
  
  let currentQuestion = {};
  let questionIndex = 0;
  let scores = [0, 0, 0, 0];
  let currentPlayerIndex = 0;
  let answered = false;
  const PLAYER_COLORS = ['#00ff88', '#ff4444', '#ffaa00', '#00d4ff'];
  
  return {
    name: 'triviashowdown',
    
    init(api) {
      gameAPI = api;
      gameConfig = api.gameInfo;
      console.log('🧠❓ Trivia Showdown initialized');
    },
    
    start() {
      if (!gameAPI) {
        console.error('Trivia Showdown: Game API not initialized');
        return;
      }
      
      initGame();
      gameRunning = true;
      console.log('🧠❓ Trivia Showdown started');
    },
    
    stop() {
      gameRunning = false;
      console.log('🧠❓ Trivia Showdown stopped');
    },
    
    handleClick(x, y, event) {
      if (!gameRunning) return;
    },
    
    handleKeydown(event) {
      if (!gameRunning || answered) return;
      
      const key = event.key;
      const answerIndex = parseInt(key) - 1;
      
      if (answerIndex >= 0 && answerIndex <= 3) {
        answered = true;
        
        if (answerIndex === currentQuestion.answer) {
          scores[currentPlayerIndex]++;
          gameAPI.showToast(`✅ Player ${currentPlayerIndex + 1} Correct!`);
        } else {
          gameAPI.showToast(`❌ Player ${currentPlayerIndex + 1} Wrong!`);
        }
        
        gameAPI.updateScore(scores);
        
        setTimeout(() => {
          currentPlayerIndex = (currentPlayerIndex + 1) % 4;
          nextQuestion();
        }, 1500);
      }
      
      if (event.key === 'Escape') {
        gameAPI.returnToMenu?.();
      }
    },
    
    handleMouseMove(x, y, event) {},
    
    handleResize() {
      drawQuestion();
    }
  };
  
  function initGame() {
    scores = [0, 0, 0, 0];
    questionIndex = 0;
    currentPlayerIndex = 0;
    nextQuestion();
  }
  
  function nextQuestion() {
    if (questionIndex >= QUESTIONS.length) {
      showResults();
      return;
    }
    
    currentQuestion = QUESTIONS[questionIndex++];
    answered = false;
    drawQuestion();
    gameAPI.updatePlayerTurn(currentPlayerIndex + 1);
  }
  
  function drawQuestion() {
    if (!gameAPI) return;
    
    const ctx = gameAPI.ctx;
    const canvas = gameAPI.canvas;
    
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw progress
    ctx.fillStyle = '#888888';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Question ${questionIndex}/${QUESTIONS.length}`, canvas.width - 20, 20);
    
    // Draw current player
    ctx.fillStyle = PLAYER_COLORS[currentPlayerIndex];
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Player ${currentPlayerIndex + 1}'s Turn`, canvas.width / 2, 40);
    
    // Draw question
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(currentQuestion.question, canvas.width / 2, 100);
    
    // Draw options
    const startY = 150;
    const optionHeight = 60;
    currentQuestion.options.forEach((option, index) => {
      const y = startY + index * optionHeight;
      
      // Option background
      ctx.fillStyle = answered ? '#333333' : '#1a3a3a';
      ctx.fillRect(50, y, canvas.width - 100, 50);
      
      // Option border
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, y, canvas.width - 100, 50);
      
      // Option text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`${index + 1}. ${option}`, 70, y + 32);
    });
    
    // Draw instruction
    ctx.fillStyle = '#888888';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Press 1, 2, 3, or 4 to answer', canvas.width / 2, canvas.height - 30);
    
    // Draw scores
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = PLAYER_COLORS[i];
      ctx.fillText(`P${i + 1}: ${scores[i]}`, 20, canvas.height - 60 + i * 20);
    }
  }
  
  function showResults() {
    gameRunning = false;
    
    if (!gameAPI) return;
    
    const ctx = gameAPI.ctx;
    const canvas = gameAPI.canvas;
    
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw title
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎉 Final Results', canvas.width / 2, 60);
    
    // Find winner
    let maxScore = Math.max(...scores);
    let winners = [];
    scores.forEach((score, index) => {
      if (score === maxScore) winners.push(index);
    });
    
    // Draw scores
    const startY = 130;
    const scoreHeight = 60;
    scores.forEach((score, index) => {
      ctx.fillStyle = PLAYER_COLORS[index];
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Player ${index + 1}: ${score} points`, canvas.width / 2, startY + index * scoreHeight);
    });
    
    // Draw winner
    ctx.fillStyle = '#ffaa00';
    ctx.font = 'bold 28px Arial';
    if (winners.length === 1) {
      ctx.fillText(`🏆 Player ${winners[0] + 1} Wins!`, canvas.width / 2, 380);
    } else {
      ctx.fillText(`🏆 It's a Tie!`, canvas.width / 2, 380);
    }
    
    gameAPI.showToast(`🏆 Game Complete! Winner: Player ${winners[0] + 1}`);
    
    setTimeout(() => gameAPI.returnToMenu?.(), 3000);
  }
})();

console.log('🧠❓ Trivia Showdown game module loaded successfully!');