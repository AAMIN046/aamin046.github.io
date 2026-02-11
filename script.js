const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

/* BACKGROUND PARALLAX */
let bgX = 0;
let bgSpeed = 1;

/* SOUNDS */
const flapSound = new Audio("https://www.soundjay.com/button/sounds/button-16.mp3");
const hitSound = new Audio("https://www.soundjay.com/button/sounds/button-10.mp3");

/* MUSIC */
const bgMusic = new Audio("https://www.soundjay.com/free-music/midnight-ride-01.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;

/* BIRD */
let bird = {
  x: 60,
  y: 200,
  width: 35,
  height: 30,
  gravity: 0.25,
  lift: -8,
  velocity: 0
};

let pipes = [];
let pipeWidth = 60;
let pipeGap = 170;
let frame = 0;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let level = 1;
let speed = 2.5;
let gameOver = false;

/* CONTROLS */
function jump() {
  if (!gameOver) {
    bird.velocity = bird.lift;
    flapSound.play();
    bgMusic.play();
  }
}

document.addEventListener("click", jump);
document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});

/* DRAW */
function drawBackground() {
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  bgX -= bgSpeed;
  if (bgX <= -canvas.width) bgX = 0;
}

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height);
  });
}

function drawText() {
  ctx.fillStyle = "black";
  ctx.font = "18px Arial";
  ctx.fillText("Score: " + score, 10, 25);
  ctx.fillText("High: " + highScore, 10, 50);
  ctx.fillText("Level: " + level, 10, 75);

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", 90, 300);
  }
}

/* UPDATE */
function update() {
  if (gameOver) return;

  frame++;
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (frame % 100 === 0) {
    let top = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({
      x: canvas.width,
      top: top,
      bottom: top + pipeGap,
      passed: false
    });
  }

  pipes.forEach(pipe => {
    pipe.x -= speed;

    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      gameOver = true;
      hitSound.play();
    }

    if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
      score++;
      pipe.passed = true;

      if (score % 5 === 0) {
        level++;
        speed += 0.5;
        pipeGap -= 5;
      }
    }
  });

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
    hitSound.play();
  }

  if (gameOver && score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  if (score % 10 === 0 && score !== 0) {
    canvas.style.filter = "brightness(0.6)";
  } else {
    canvas.style.filter = "brightness(1)";
  }
}

/* LOOP */
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  update();
  drawBird();
  drawPipes();
  drawText();
  requestAnimationFrame(gameLoop);
}

gameLoop();

/* RESTART */
document.getElementById("restartBtn").addEventListener("click", () => {
  bird.y = 200;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  level = 1;
  speed = 2.5;
  pipeGap = 170;
  frame = 0;
  gameOver = false;
});
