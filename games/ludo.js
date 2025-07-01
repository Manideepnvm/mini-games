const PLAYER_COLORS = ["cyan", "magenta", "yellow", "lime"];
let currentPlayerLudo = 0;
let positions = [0, 0, 0, 0]; // each player's position on the track (0 to 39)
let gameOverLudo = false;

// Simulated board positions in a circle
const TRACK_LENGTH = 40;
const PATH_COORDS = [];

function start() {
  initGameLudo();
}

function initGameLudo() {
  positions = [0, 0, 0, 0];
  currentPlayerLudo = 0;
  gameOverLudo = false;
  generatePathCoords();
  drawBoardLudo();
}

function generatePathCoords() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 50;

  for (let i = 0; i < TRACK_LENGTH; i++) {
    const angle = (i * 2 * Math.PI) / TRACK_LENGTH - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    PATH_COORDS[i] = { x, y };
  }
}

function drawBoardLudo() {
  clearCanvas();

  // Draw circular track
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 50;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Draw player tokens
  for (let p = 0; p < 4; p++) {
    const pos = PATH_COORDS[positions[p]];
    ctx.fillStyle = PLAYER_COLORS[p];
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  // Show current player
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText(`Player ${currentPlayerLudo + 1}'s Turn`, 200, 30);

  // Show roll button
  showRollButton();
}

function showRollButton() {
  removeButtons();

  const container = document.createElement("div");
  container.id = "ludo-buttons";
  container.style.marginTop = "20px";

  const btn = document.createElement("button");
  btn.textContent = "🎲 Roll Dice";
  btn.style.padding = "10px 20px";
  btn.style.fontSize = "18px";
  btn.style.cursor = "pointer";
  btn.onclick = rollDiceAndMove;
  container.appendChild(btn);

  document.body.appendChild(container);
}

function removeButtons() {
  const old = document.getElementById("ludo-buttons");
  if (old) old.remove();
}

function rollDiceAndMove() {
  if (gameOverLudo) return;

  const roll = Math.floor(Math.random() * 6) + 1;
  alert(`🎲 Player ${currentPlayerLudo + 1} rolled a ${roll}`);

  positions[currentPlayerLudo] += roll;

  if (positions[currentPlayerLudo] >= TRACK_LENGTH) {
    endGameLudo(currentPlayerLudo + 1);
    return;
  }

  currentPlayerLudo = (currentPlayerLudo + 1) % 4;
  drawBoardLudo();
}

function endGameLudo(winner) {
  gameOverLudo = true;
  removeButtons();
  clearCanvas();
  ctx.fillStyle = "#0f0";
  ctx.font = "30px Arial";
  ctx.fillText(`🎉 Player ${winner} Wins!`, 150, 200);
  showMenuAfterDelayLudo();
}

function showMenuAfterDelayLudo() {
  setTimeout(() => {
    document.getElementById("menu").style.display = "block";
  }, 3000);
}