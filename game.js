const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 90;
const BALL_SIZE = 16;
const PADDLE_MARGIN = 20;
const PLAYER_COLOR = "#4CAF50";
const AI_COLOR = "#FF5722";
const BALL_COLOR = "#fff";

// Player paddle
const player = {
    x: PADDLE_MARGIN,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: PLAYER_COLOR,
    dy: 0
};

// AI paddle
const ai = {
    x: canvas.width - PADDLE_MARGIN - PADDLE_WIDTH,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: AI_COLOR,
    dy: 0
};

// Ball
const ball = {
    x: canvas.width / 2 - BALL_SIZE / 2,
    y: canvas.height / 2 - BALL_SIZE / 2,
    size: BALL_SIZE,
    speed: 5,
    dx: 5,
    dy: 3
};

// Score
let playerScore = 0;
let aiScore = 0;

// Game state
let isGameRunning = false;
let ballInPlay = false;
let speedUpInterval = null;
let ballSpeedStartTime = null;

// Add Start button dynamically above the canvas
function createStartButton() {
    let btn = document.createElement('button');
    btn.id = 'startBtn';
    btn.textContent = 'Start Game';
    btn.style.display = 'block';
    btn.style.margin = '16px auto';
    btn.style.fontSize = '20px';
    btn.style.padding = '8px 24px';
    btn.style.cursor = 'pointer';
    canvas.parentNode.insertBefore(btn, canvas);
    btn.addEventListener('click', startGame);
}
createStartButton();

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y) {
    ctx.fillStyle = "#fff";
    ctx.font = "32px Arial";
    ctx.fillText(text, x, y);
}

function drawNet() {
    ctx.strokeStyle = "#555";
    ctx.beginPath();
    for(let i = 0; i < canvas.height; i += 30) {
        ctx.moveTo(canvas.width/2, i);
        ctx.lineTo(canvas.width/2, i + 15);
    }
    ctx.stroke();
}

function render() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, "#111");

    // Net
    drawNet();

    // Player and AI paddles
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);

    // Ball
    if (ballInPlay) {
        drawCircle(ball.x + ball.size/2, ball.y + ball.size/2, ball.size/2, BALL_COLOR);
    } else {
        // Draw ball at center for reset
        drawCircle(canvas.width/2, canvas.height/2, ball.size/2, BALL_COLOR);
    }

    // Score
    drawText(playerScore, canvas.width / 2 - 50, 40);
    drawText(aiScore, canvas.width / 2 + 30, 40);

    // If not running, show instruction
    if (!isGameRunning) {
        ctx.fillStyle = "#fff";
        ctx.font = "28px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Click Start to play!", canvas.width/2, canvas.height/2 + 60);
        ctx.textAlign = "left";
    }
}

// Handle player paddle movement with mouse
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    // Center paddle on mouse
    player.y = mouseY - player.height/2;
    // Clamp to canvas
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height)
        player.y = canvas.height - player.height;
});

// Basic AI for right paddle
function aiMove() {
    // Move only if ball is moving toward AI
    let target = ball.y - (ai.height / 2 - ball.size / 2);
    if (ball.dx > 0) {
        // Track the ball smoothly
        if (ai.y < target) {
            ai.y += Math.min(5, target - ai.y);
        } else if (ai.y > target) {
            ai.y -= Math.min(5, ai.y - target);
        }
    }
    // Clamp to canvas
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height)
        ai.y = canvas.height - ai.height;
}

// Reset ball to center
function resetBall(direction = 1) {
    ball.x = canvas.width / 2 - ball.size / 2;
    ball.y = canvas.height / 2 - ball.size / 2;
    // Alternate direction
    ball.dx = ball.speed * direction;
    // Randomize vertical direction
    ball.dy = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 2);
    ballInPlay = true;
    ballSpeedStartTime = Date.now();
    startSpeedInterval();
}

// Collision detection
function collision(paddle, ball) {
    return (
        ball.x < paddle.x + paddle.width &&
        ball.x + ball.size > paddle.x &&
        ball.y < paddle.y + paddle.height &&
        ball.y + ball.size > paddle.y
    );
}

// Ball speed up logic
function startSpeedInterval() {
    if (speedUpInterval) clearInterval(speedUpInterval);
    speedUpInterval = setInterval(() => {
        // Only speed up if ball is in play
        if (ballInPlay) {
            // Increase speed, keep direction
            let currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
            let newSpeed = currentSpeed + 1;

            // Recalculate dx, dy maintaining direction
            let angle = Math.atan2(ball.dy, ball.dx);
            ball.dx = Math.cos(angle) * newSpeed;
            ball.dy = Math.sin(angle) * newSpeed;
            ball.speed = newSpeed;
        }
    }, 10000); // every 10 seconds
}

// Stop speed up interval
function stopSpeedInterval() {
    if (speedUpInterval) {
        clearInterval(speedUpInterval);
        speedUpInterval = null;
    }
}

// update and game logic
function update() {
    if (!isGameRunning || !ballInPlay) return;

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top and bottom collision
    if (ball.y <= 0 || ball.y + ball.size >= canvas.height) {
        ball.dy = -ball.dy;
        ball.y = ball.y <= 0 ? 0 : canvas.height - ball.size;
    }

    // Player collision
    if (collision(player, ball)) {
        ball.dx = Math.abs(ball.dx);
        // Add some paddle effect
        let collidePoint = ball.y + ball.size/2 - (player.y + player.height/2);
        collidePoint /= player.height/2;
        let angle = collidePoint * (Math.PI / 4); // Max 45deg
        let direction = 1;
        let currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        ball.dx = direction * currentSpeed * Math.cos(angle);
        ball.dy = currentSpeed * Math.sin(angle);
    }
    // AI collision
    if (collision(ai, ball)) {
        ball.dx = -Math.abs(ball.dx);
        let collidePoint = ball.y + ball.size/2 - (ai.y + ai.height/2);
        collidePoint /= ai.height/2;
        let angle = collidePoint * (Math.PI / 4);
        let direction = -1;
        let currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        ball.dx = direction * currentSpeed * Math.cos(angle);
        ball.dy = currentSpeed * Math.sin(angle);
    }

    // Left wall (AI scores)
    if (ball.x <= 0) {
        aiScore++;
        ballInPlay = false;
        stopSpeedInterval();
        setTimeout(() => {
            if (isGameRunning) resetBall(1);
        }, 1000);
    }

    // Right wall (Player scores)
    if (ball.x + ball.size >= canvas.width) {
        playerScore++;
        ballInPlay = false;
        stopSpeedInterval();
        setTimeout(() => {
            if (isGameRunning) resetBall(-1);
        }, 1000);
    }

    // AI movement
    aiMove();
}

// Game loop (animation frame)
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Start game logic
function startGame() {
    if (isGameRunning) return;
    // Reset
    playerScore = 0;
    aiScore = 0;
    ball.speed = 5;
    ball.dx = 5;
    ball.dy = 3;
    isGameRunning = true;
    ballInPlay = false;
    document.getElementById('startBtn').style.display = 'none';

    // Small delay before ball starts
    setTimeout(() => {
        resetBall(1);
    }, 800);
}

// Optionally, allow pressing Space to start next round if desired (not required)

// Stop game logic, if needed (e.g., on a future stop button)
// function stopGame() {...}

// Initial render
render();
gameLoop();