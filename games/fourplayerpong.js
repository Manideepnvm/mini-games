let ball = { x: 300, y: 200, dx: 2, dy: 2 };
let paddlePositions = [0, 0, 0, 0]; // top, right, bottom, left
const PADDLE_HEIGHT = 80;
const PADDLE_WIDTH = 10;
let gameOverFP = false;

function start() {
  initGameFP();
  window.addEventListener('keydown', handleKeyFP);
  loopFP();
}

function stop() {
  gameOverFP = true;
  window.removeEventListener('keydown', handleKeyFP);
}

function initGameFP() {
  ball = { x: 300, y: 200, dx: 2, dy: 2 };
  paddlePositions = [0, 0, 0, 0];
  gameOverFP = false;
  clearCanvas();
}

function loopFP() {
  if (gameOverFP) return;

  setTimeout(() => {
    updateFP();
    drawFP();
    loopFP();
  }, 16);
}

function updateFP() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  const radius = 10;

  // Wall collision
  if (ball.x < radius || ball.x > canvas.width - radius) {
    ball.dx *= -1;
  }
  if (ball.y < radius || ball.y > canvas.height - radius) {
    ball.dy *= -1;
  }

  // Paddle collision
  if (ball.x <= PADDLE_WIDTH && Math.abs(ball.y - paddlePositions[3]) < PADDLE_HEIGHT) {
    ball.dx = Math.abs(ball.dx);
  } else if (ball.x >= canvas.width - PADDLE_WIDTH && Math.abs(ball.y - paddlePositions[1]) < PADDLE_HEIGHT) {
    ball.dx = -Math.abs(ball.dx);
  }

  if (ball.y <= PADDLE_HEIGHT && Math.abs(ball.x - paddlePositions[0]) < PADDLE_HEIGHT) {
    ball.dy = Math.abs(ball.dy);
  } else if (ball.y >= canvas.height - PADDLE_HEIGHT && Math.abs(ball.x - paddlePositions[2]) < PADDLE_HEIGHT) {
    ball.dy = -Math.abs(ball.dy);
  }

  // Score or out of bounds
  if (ball.x < 0 || ball.x > canvas.width || ball.y < 0 || ball.y > canvas.height) {
    endGameFP();
  }
}

function drawFP() {
  clearCanvas();
  ctx.fillStyle = "#fff";

  // Draw ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
  ctx.fill();

  // Draw paddles
  ctx.fillRect(0, paddlePositions[3], PADDLE_WIDTH, PADDLE_HEIGHT); // Left
  ctx.fillRect(canvas.width - PADDLE_WIDTH, paddlePositions[1], PADDLE_WIDTH, PADDLE_HEIGHT); // Right
  ctx.fillRect(paddlePositions[0], 0, PADDLE_HEIGHT, PADDLE_WIDTH); // Top
  ctx.fillRect(paddlePositions[2], canvas.height - PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_WIDTH); // Bottom
}

function handleKeyFP(e) {
  const step = 10;
  switch (e.key) {
    case 'a': // Player 1 (Left)
      paddlePositions[3] = clamp(paddlePositions[3] - step, 0, canvas.height - PADDLE_HEIGHT);
      break;
    case 'z':
      paddlePositions[3] = clamp(paddlePositions[3] + step, 0, canvas.height - PADDLE_HEIGHT);
      break;

    case 'i': // Player 2 (Right)
      paddlePositions[1] = clamp(paddlePositions[1] - step, 0, canvas.height - PADDLE_HEIGHT);
      break;
    case 'k':
      paddlePositions[1] = clamp(paddlePositions[1] + step, 0, canvas.height - PADDLE_HEIGHT);
      break;

    case 'j': // Player 3 (Top)
      paddlePositions[0] = clamp(paddlePositions[0] - step, 0, canvas.width - PADDLE_HEIGHT);
      break;
    case 'l':
      paddlePositions[0] = clamp(paddlePositions[0] + step, 0, canvas.width - PADDLE_HEIGHT);
      break;

    case 'd': // Player 4 (Bottom)
      paddlePositions[2] = clamp(paddlePositions[2] - step, 0, canvas.width - PADDLE_HEIGHT);
      break;
    case 'c':
      paddlePositions[2] = clamp(paddlePositions[2] + step, 0, canvas.width - PADDLE_HEIGHT);
      break;
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function endGameFP() {
  gameOverFP = true;
  clearCanvas();
  ctx.fillStyle = "#f00";
  ctx.font = "30px Arial";
  ctx.fillText("💥 Ball Out of Bounds!", 100, 200);
  ctx.fillText("🎉 Game Over", 170, 250);
  showMenuAfterDelayFP();
}

function showMenuAfterDelayFP() {
  setTimeout(() => {
    document.getElementById("menu").style.display = "block";
  }, 3000);
}