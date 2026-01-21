/* =========================
   VARIÁVEIS GLOBAIS
========================= */

const menu = document.getElementById("menu");
const game = document.getElementById("game");
const gameOverScreen = document.getElementById("gameOver");

const gameArea = document.getElementById("gameArea");
const playerCar = document.getElementById("playerCar");

const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("finalScore");

let score = 0;
let gameInterval = null;
let enemyInterval = null;
let gameSpeed = 5;
let enemySpawnRate = 1500;
let isGameRunning = false;

/* Faixas possíveis (exemplo: duas faixas) */
const lanes = [30, 100, 156, 200, 280]; // posições X das faixas
let currentLane = 1;

/* =========================
   FUNÇÕES DE TELA
========================= */

function showScreen(screen) {
  menu.classList.remove("ativa");
  game.classList.remove("ativa");
  gameOverScreen.classList.remove("ativa");

  screen.classList.add("ativa");
}

/* =========================
   CONTROLE DO JOGO
========================= */

function startGame() {
  resetGame();
  showScreen(game);
  isGameRunning = true;

  gameInterval = setInterval(gameLoop, 20);
  enemyInterval = setInterval(createEnemy, enemySpawnRate);
}

function endGame() {
  isGameRunning = false;

  clearInterval(gameInterval);
  clearInterval(enemyInterval);

  finalScoreSpan.textContent = score;
  showScreen(gameOverScreen);
}

function resetGame() {
  score = 0;
  gameSpeed = 5;
  scoreSpan.textContent = score;
  currentLane = 1;

  playerCar.style.left = lanes[currentLane] + "px";

  document.querySelectorAll(".enemy").forEach(enemy => enemy.remove());
}

/* =========================
   LOOP PRINCIPAL
========================= */

function gameLoop() {
  moveEnemies();
  checkCollisions();
}

/* =========================
   MOVIMENTO DO JOGADOR
========================= */

function moveLeft() {
  if (currentLane > 0) {
    currentLane--;
    playerCar.style.left = lanes[currentLane] + "px";
  }
}

function moveRight() {
  if (currentLane < lanes.length - 1) {
    currentLane++;
    playerCar.style.left = lanes[currentLane] + "px";
  }
}

/* =========================
   INIMIGOS
========================= */

function createEnemy() {
  if (!isGameRunning) return;

  const enemy = document.createElement("div");
  enemy.classList.add("enemy");

  const lane = Math.floor(Math.random() * lanes.length);
  enemy.style.left = lanes[lane] + "px";
  enemy.style.top = "-60px";

  gameArea.appendChild(enemy);
}

function moveEnemies() {
  const enemies = document.querySelectorAll(".enemy");

  enemies.forEach(enemy => {
    let top = enemy.offsetTop;
    enemy.style.top = top + gameSpeed + "px";

    if (top > gameArea.offsetHeight) {
      enemy.remove();
      score++;
      scoreSpan.textContent = score;

      increaseDifficulty();
    }
  });
}

/* =========================
   COLISÃO
========================= */

function checkCollisions() {
  const enemies = document.querySelectorAll(".enemy");
  const marginX = 18;
  const marginY = 20;

  enemies.forEach(enemy => {
    const playerRect = playerCar.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    if (
      playerRect.left + marginX < enemyRect.right - marginX &&
      playerRect.right - marginX > enemyRect.left + marginX &&
      playerRect.top + marginY < enemyRect.bottom - marginY &&
      playerRect.bottom - marginY > enemyRect.top + marginY
    ) {
      endGame();
    }
  });
}


function increaseDifficulty() {
  if (score % 5 === 0) {
    gameSpeed += 1;
  }
}

/* =========================
   EVENTOS DOS BOTÕES
========================= */

document.getElementById("easy").addEventListener("click", () => setDifficulty("easy"));
document.getElementById("medium").addEventListener("click", () => setDifficulty("medium"));
document.getElementById("hard").addEventListener("click", () => setDifficulty("hard"));

document.getElementById("btnStartMenu").addEventListener("click", startGame);
document.getElementById("btnStart").addEventListener("click", startGame);
document.getElementById("btnEnd").addEventListener("click", endGame);

document.getElementById("btnMenu").addEventListener("click", () => showScreen(menu));
document.getElementById("btnMenuOver").addEventListener("click", () => showScreen(menu));
document.getElementById("btnRestart").addEventListener("click", startGame);

document.getElementById("btnLeft").addEventListener("click", moveLeft);
document.getElementById("btnRight").addEventListener("click", moveRight);

document.addEventListener("keydown", (e) => {
  if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }

  if (!isGameRunning) return;

  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
});

function setDifficulty(level) {
  switch(level) {
    case "easy":
      gameSpeed = 4;
      enemySpawnRate = 2000;
      break;
    case "medium":
      gameSpeed = 5;
      enemySpawnRate = 1500;
      break;
    case "hard":
      gameSpeed = 7;
      enemySpawnRate = 600;
      break;
  }
}
