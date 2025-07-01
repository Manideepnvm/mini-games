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
  }
];

let currentQuestion = {};
let questionIndex = 0;
let scoresTS = [0, 0, 0, 0];
let currentPlayerTS = 0;
let answered = false;

function start() {
  initGameTS();
}

function initGameTS() {
  scoresTS = [0, 0, 0, 0];
  questionIndex = 0;
  nextQuestionTS();
}

function nextQuestionTS() {
  if (questionIndex >= QUESTIONS.length) {
    showResultsTS();
    return;
  }

  currentQuestion = QUESTIONS[questionIndex++];
  answered = false;
  clearCanvas();
  drawQuestionTS();
  document.addEventListener("keydown", handleKeyTS);
}

function drawQuestionTS() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";

  // Draw question
  ctx.fillText(currentQuestion.question, 50, 80);

  // Draw options
  currentQuestion.options.forEach((opt, i) => {
    ctx.fillText(`${i + 1}. ${opt}`, 70, 130 + i * 40);
  });

  // Show current player
  ctx.fillStyle = getPlayerColorTS(currentPlayerTS);
  ctx.fillText(`Player ${currentPlayerTS + 1}'s Turn`, 200, 30);

  // Show scores
  ctx.fillStyle = "#fff";
  for (let p = 0; p < 4; p++) {
    ctx.fillText(`Player ${p + 1}: ${scoresTS[p]}`, 400, 80 + p * 30);
  }

  ctx.fillText("Press 1-4 to answer", 200, 360);
}

function handleKeyTS(e) {
  if (answered) return;

  const key = e.key;
  const answerIndex = parseInt(key) - 1;

  if (answerIndex >= 0 && answerIndex <= 3) {
    answered = true;
    document.removeEventListener("keydown", handleKeyTS);

    if (answerIndex === currentQuestion.answer) {
      scoresTS[currentPlayerTS]++;
      ctx.fillStyle = "#0f0";
      ctx.fillText("✅ Correct!", 200, 300);
    } else {
      ctx.fillStyle = "#f00";
      ctx.fillText("❌ Wrong!", 200, 300);
    }

    setTimeout(() => {
      currentPlayerTS = (currentPlayerTS + 1) % 4;
      nextQuestionTS();
    }, 1500);
  }
}

function showResultsTS() {
  clearCanvas();
  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText("🎉 Final Scores:", 200, 50);

  let winner = 0;
  for (let p = 1; p < 4; p++) {
    if (scoresTS[p] > scoresTS[winner]) winner = p;
  }

  for (let p = 0; p < 4; p++) {
    ctx.fillStyle = getPlayerColorTS(p);
    ctx.fillText(`Player ${p + 1}: ${scoresTS[p]} points`, 200, 100 + p * 40);
  }

  ctx.fillStyle = "#0f0";
  ctx.fillText(`🏆 Winner: Player ${winner + 1}`, 200, 300);

  showMenuAfterDelayTS();
}

function showMenuAfterDelayTS() {
  setTimeout(() => {
    document.getElementById("menu").style.display = "block";
  }, 5000);
}

function getPlayerColorTS(player) {
  const colors = ["cyan", "magenta", "yellow", "lime"];
  return colors[player];
}