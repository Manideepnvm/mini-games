let players = [[], [], [], []];
let currentPlayerUNO = 0;
let discardPile = [];
const TOTAL_CARDS = 32; // 8 colors × numbers 0-3
const COLORS = ["red", "green", "blue", "yellow"];
let gameOverUNO = false;

function start() {
  initGameUNO();
}

function initGameUNO() {
  gameOverUNO = false;
  players = [[], [], [], []];
  discardPile = [];

  // Generate and shuffle deck
  let deck = generateDeckUNO();
  shuffleArray(deck);

  // Deal 5 cards to each player
  for (let i = 0; i < 5; i++) {
    for (let p = 0; p < 4; p++) {
      players[p].push(deck.pop());
    }
  }

  // Start with one card in discard pile
  discardPile.push(deck.pop());

  clearCanvas();
  drawGameUNO();
  addCardButtons();
}

function generateDeckUNO() {
  let deck = [];
  for (let color of COLORS) {
    for (let num = 0; num <= 3; num++) {
      for (let i = 0; i < 2; i++) { // two copies of each
        deck.push({ color, number: num });
      }
    }
  }
  return deck;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function drawGameUNO() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Arial";
  ctx.fillStyle = "#fff";

  // Show current player
  ctx.fillText(`Player ${currentPlayerUNO + 1}'s Turn`, 200, 30);

  // Show top of discard pile
  const topCard = discardPile[discardPile.length - 1];
  ctx.fillStyle = topCard.color;
  ctx.fillRect(250, 100, 60, 90);
  ctx.fillStyle = "#000";
  ctx.fillText(topCard.number, 275, 150);

  // Show how many cards each player has
  for (let p = 0; p < 4; p++) {
    ctx.fillStyle = "#fff";
    ctx.fillText(`Player ${p + 1}: ${players[p].length} cards`, 10, 300 + p * 20);
  }
}

function addCardButtons() {
  removeCardButtons();

  const container = document.createElement("div");
  container.id = "card-buttons";
  container.style.marginTop = "20px";

  const currentHand = players[currentPlayerUNO];

  currentHand.forEach((card, index) => {
    const btn = document.createElement("button");
    btn.textContent = `${card.color.toUpperCase()} ${card.number}`;
    btn.style.background = card.color;
    btn.style.color = getContrastColor(card.color);
    btn.style.padding = "10px 15px";
    btn.style.margin = "5px";
    btn.style.border = "none";
    btn.style.borderRadius = "5px";
    btn.style.cursor = "pointer";
    btn.onclick = () => playCard(index);
    container.appendChild(btn);
  });

  document.body.appendChild(container);
}

function removeCardButtons() {
  const old = document.getElementById("card-buttons");
  if (old) old.remove();
}

function playCard(index) {
  const playedCard = players[currentPlayerUNO][index];
  const topCard = discardPile[discardPile.length - 1];

  if (
    playedCard.color === topCard.color ||
    playedCard.number === topCard.number
  ) {
    discardPile.push(playedCard);
    players[currentPlayerUNO].splice(index, 1);

    if (players[currentPlayerUNO].length === 0) {
      endGameUNO(currentPlayerUNO + 1);
      return;
    }

    nextTurnUNO();
    clearCanvas();
    drawGameUNO();
    addCardButtons();
  } else {
    alert("Invalid move! Must match color or number.");
  }
}

function nextTurnUNO() {
  currentPlayerUNO = (currentPlayerUNO + 1) % 4;
}

function endGameUNO(winner) {
  gameOverUNO = true;
  removeCardButtons();
  clearCanvas();
  ctx.font = "30px Arial";
  ctx.fillStyle = "#0f0";
  ctx.fillText(`🎉 Player ${winner} Wins!`, 150, 200);
  showMenuAfterDelayUNO();
}

function showMenuAfterDelayUNO() {
  setTimeout(() => {
    document.getElementById("menu").style.display = "block";
  }, 3000);
}

function getContrastColor(bgColor) {
  const colors = {
    red: "#fff",
    green: "#fff",
    blue: "#fff",
    yellow: "#000"
  };
  return colors[bgColor] || "#fff";
}