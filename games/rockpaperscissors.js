let playerChoices = [null, null];
let playerTurn = 0; // 0 = Player 1, 1 = Player 2

function start() {
  initGame();
}

function initGame() {
  playerChoices = [null, null];
  playerTurn = 0;
  clearCanvas();
  drawInstructions();
  addChoiceButtons();
}

function drawInstructions() {
  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText("Player " + (playerTurn + 1) + "'s Turn", canvas.width / 2 - 130, 50);
}

function addChoiceButtons() {
  const buttonStyle = `
    padding: 10px 20px;
    font-size: 18px;
    margin: 10px;
    cursor: pointer;
    background-color: #444;
    color: white;
    border: 2px solid white;
    border-radius: 8px;
  `;

  const container = document.createElement('div');
  container.id = 'choice-buttons';
  container.style.marginTop = '20px';

  const choices = ['Rock', 'Paper', 'Scissors'];
  choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.textContent = choice;
    btn.style.cssText = buttonStyle;
    btn.onclick = () => handleChoice(choice.toLowerCase());
    container.appendChild(btn);
  });

  document.body.appendChild(container);
}

function handleChoice(choice) {
  playerChoices[playerTurn] = choice;

  if (playerTurn === 0) {
    playerTurn = 1;
    clearCanvas();
    drawInstructions();
  } else {
    clearCanvas();
    showResults();
    removeChoiceButtons();
  }
}

function showResults() {
  const p1 = playerChoices[0];
  const p2 = playerChoices[1];

  ctx.font = "24px Arial";
  ctx.fillStyle = "#0f0";
  ctx.fillText("Player 1 chose: " + capitalize(p1), 50, 100);
  ctx.fillText("Player 2 chose: " + capitalize(p2), 50, 150);

  let result = determineWinner(p1, p2);

  ctx.fillStyle = "#ff0";
  ctx.fillText(result, 50, 220);

  const playAgainBtn = document.createElement('button');
  playAgainBtn.textContent = "Play Again";
  playAgainBtn.style.padding = "10px 20px";
  playAgainBtn.style.fontSize = "18px";
  playAgainBtn.style.marginTop = "20px";
  playAgainBtn.style.cursor = "pointer";
  playAgainBtn.onclick = () => {
    document.getElementById("gameCanvas").getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    initGame();
    document.body.removeChild(playAgainBtn);
  };

  document.body.appendChild(playAgainBtn);
}

function determineWinner(p1, p2) {
  if (p1 === p2) return "It's a Draw!";
  if (
    (p1 === "rock" && p2 === "scissors") ||
    (p1 === "scissors" && p2 === "paper") ||
    (p1 === "paper" && p2 === "rock")
  ) {
    return "🎉 Player 1 Wins!";
  } else {
    return "🎉 Player 2 Wins!";
  }
}

function removeChoiceButtons() {
  const container = document.getElementById('choice-buttons');
  if (container) container.remove();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}