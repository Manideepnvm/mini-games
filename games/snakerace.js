let snakes = [];
let directions = [];
const SNAKE_COLOR = ['cyan', 'magenta', 'yellow', 'lime'];
const GRID_SIZE = 20;
let gameOverSR = false;

function start() {
  initGameSR();
  window.addEventListener('keydown', handleKeySR);
  loopSR();
}

function stop() {
  gameOverSR = true;
  window.removeEventListener('keydown', handleKeySR);
}

function initGameSR() {
  canvas.width = 600;
  canvas.height = 400;
  const w = canvas.width;
  const h = canvas.height;
  const cellSize = Math.min(w, h) / GRID_SIZE;

  // Initialize snakes in corners
  snakes = [
    [{ x: 3, y: 3 }], // Player 1
    [{ x: GRID_SIZE - 4, y: 3 }], // Player 2
    [{ x: 3, y: GRID_SIZE - 4 }], // Player 3
    [{ x: GRID_SIZE - 4, y: GRID_SIZE - 4 }], // Player 4
  ];

  directions = [ { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 0 } ];
  gameOverSR = false;
  clearCanvas();
}

function loopSR() {
  if (gameOverSR) return;

  setTimeout(() => {
    updateSR();
    drawSR();
    loopSR();
  }, 150);
}

function updateSR() {
  for (let i = 0; i < 4; i++) {
    const head = { ...snakes[i][0] };
    head.x += directions[i].x;
    head.y += directions[i].y;

    // Wall collision
    if (head.x < 0 || head.y < 0 || head.x >= GRID_SIZE || head.y >= GRID_SIZE) {
      endGameSR(i + 1);
      return;
    }

    // Self collision
    for (let part of snakes[i]) {
      if (part.x === head.x && part.y === head.y) {
        endGameSR(i + 1);
        return;
      }
    }

    // Other snake collision
    for (let j = 0; j < 4; j++) {
      if (i === j) continue;
      for (let part of snakes[j]) {
        if (part.x === head.x && part.y === head.y) {
          endGameSR(i + 1);
          return;
        }
      }
    }

    snakes[i].unshift(head); // Add new head
    snakes[i].pop(); // Remove tail
  }
}

function drawSR() {
  clearCanvas();

  const cellSize = canvas.width / GRID_SIZE;

  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = SNAKE_COLOR[i];
    for (let segment of snakes[i]) {
      ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
    }
  }
}

function handleKeySR(e) {
  const key = e.key;
  const speed = 1;

  switch (key) {
    case "ArrowUp":
      if (directions[0].y === 0) directions[0] = { x: 0, y: -speed };
      break;
    case "ArrowDown":
      if (directions[0].y === 0) directions[0] = { x: 0, y: speed };
      break;
    case "ArrowLeft":
      if (directions[0].x === 0) directions[0] = { x: -speed, y: 0 };
      break;
    case "ArrowRight":
      if (directions[0].x === 0) directions[0] = { x: speed, y: 0 };
      break;

    case "w":
      if (directions[1].y === 0) directions[1] = { x: 0, y: -speed };
      break;
    case "s":
      if (directions[1].y === 0) directions[1] = { x: 0, y: speed };
      break;
    case "a":
      if (directions[1].x === 0) directions[1] = { x: -speed, y: 0 };
      break;
    case "d":
      if (directions[1].x === 0) directions[1] = { x: speed, y: 0 };
      break;

    case "i":
      if (directions[2].y === 0) directions[2] = { x: 0, y: -speed };
      break;
    case "k":
      if (directions[2].y === 0) directions[2] = { x: 0, y: speed };
      break;
    case "j":
      if (directions[2].x === 0) directions[2] = { x: -speed, y: 0 };
      break;
    case "l":
      if (directions[2].x === 0) directions[2] = { x: speed, y: 0 };
      break;

    case "t":
      if (directions[3].y === 0) directions[3] = { x: 0, y: -speed };
      break;
    case "g":
      if (directions[3].y === 0) directions[3] = { x: 0, y: speed };
      break;
    case "f":
      if (directions[3].x === 0) directions[3] = { x: -speed, y: 0 };
      break;
    case "h":
      if (directions[3].x === 0) directions[3] = { x: speed, y: 0 };
      break;
  }
}

function endGameSR(player) {
  gameOverSR = true;
  clearCanvas();
  ctx.fillStyle = "#f00";
  ctx.font = "30px Arial";
  ctx.fillText(`💥 Player ${player} Crashed!`, 100, 200);
  ctx.fillText(`🎉 Game Over`, 170, 250);
  showMenuAfterDelaySR();
}

function showMenuAfterDelaySR() {
  setTimeout(() => {
    document.getElementById("menu").style.display = "block";
  }, 3000);
}