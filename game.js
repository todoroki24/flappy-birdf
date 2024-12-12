const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const GRAVITY = 0.6;
const FLAP_STRENGTH = -15;
const PIPE_WIDTH = 60;
const PIPE_SPACING = 200;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 40;

// Bird properties
let bird = {
  x: 100,
  y: canvas.height / 2,
  width: BIRD_WIDTH,
  height: BIRD_HEIGHT,
  velocity: 0,
  lift: FLAP_STRENGTH
};

// Pipe properties
let pipes = [];
let pipeInterval = 1000; // Milliseconds between pipe generation
let lastPipeTime = 0;

// Game state
let gameOver = false;
let score = 0;

// Draw the bird
function drawBird() {
  ctx.fillStyle = 'yellow';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

// Create pipes
function createPipes() {
  const gap = Math.floor(Math.random() * 150) + 100; // Random gap between pipes
  const topPipeHeight = Math.floor(Math.random() * (canvas.height - gap));
  const bottomPipeHeight = canvas.height - topPipeHeight - gap;

  const topPipe = { x: canvas.width, y: 0, width: PIPE_WIDTH, height: topPipeHeight };
  const bottomPipe = { x: canvas.width, y: topPipeHeight + gap, width: PIPE_WIDTH, height: bottomPipeHeight };

  pipes.push(topPipe, bottomPipe);
}

// Draw pipes
function drawPipes() {
  pipes.forEach(pipe => {
    ctx.fillStyle = 'green';
    ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
  });
}

// Update pipe positions
function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= 2; // Pipe speed
  });

  // Remove pipes that are off the screen
  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

  // Check for collision with pipes
  pipes.forEach(pipe => {
    if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipe.width &&
        (bird.y < pipe.height || bird.y + bird.height > pipe.y)) {
      gameOver = true;
    }
  });
}

// Draw score
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Score: ' + score, 10, 30);
}

// Update the bird's position and physics
function updateBird() {
  bird.velocity += GRAVITY;
  bird.y += bird.velocity;

  // Prevent bird from falling out of the canvas
  if (bird.y + bird.height > canvas.height) {
    bird.y = canvas.height - bird.height;
    gameOver = true;
  }
  if (bird.y < 0) {
    bird.y = 0;
  }
}

// Handle bird flap
function flap() {
  bird.velocity = bird.lift;
}

// Main game loop
function gameLoop(timestamp) {
  if (gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Timing for pipes
  if (timestamp - lastPipeTime > pipeInterval) {
    createPipes();
    lastPipeTime = timestamp;
  }

  // Update and draw
  updateBird();
  updatePipes();
  drawBird();
  drawPipes();
  drawScore();

  // Increment score
  pipes.forEach(pipe => {
    if (pipe.x + pipe.width < bird.x && !pipe.passed) {
      score++;
      pipe.passed = true;
    }
  });

  requestAnimationFrame(gameLoop);
}

// Start game loop
requestAnimationFrame(gameLoop);

// Listen for spacebar press to flap
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    flap();
  }
});
