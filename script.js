const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let bird = {
    x: 80,
    y: 200,
    width: 30,
    height: 30,
    gravity: 0.4,
    lift: -8,
    velocity: 0
};

let pipes = [];
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let level = 1;
let gameOver = false;

document.getElementById("highScore").innerText = highScore;

function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function createPipe() {
    let gap = 140 - (level * 5);
    let topHeight = Math.random() * 250 + 50;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - topHeight - gap,
        width: 50
    });
}

function drawPipes() {
    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
    });
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= 2 + level;

        // Score increase
        if (pipe.x + pipe.width === bird.x) {
            score++;
            document.getElementById("score").innerText = score;

            if (score % 5 === 0) {
                level++;
                document.getElementById("level").innerText = level;
            }
        }

        // Collision
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
        ) {
            endGame();
        }
    });

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        endGame();
    }
}

function endGame() {
    gameOver = true;

    if (score > highScore) {
        localStorage.setItem("highScore", score);
    }

    alert("Game Over! Score: " + score);
}

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateBird();
    updatePipes();

    drawBird();
    drawPipes();

    requestAnimationFrame(gameLoop);
}

function startGame() {
    resetGame();
    gameLoop();
}

function resetGame() {
    bird.y = 200;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    level = 1;
    gameOver = false;

    document.getElementById("score").innerText = score;
    document.getElementById("level").innerText = level;
}

// Controls
document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
        bird.velocity = bird.lift;
    }
});

canvas.addEventListener("click", function () {
    bird.velocity = bird.lift;
});

// Pipe generator
setInterval(function () {
    if (!gameOver) {
        createPipe();
    }
}, 1500);
