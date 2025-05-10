// Game variables
let bike;
let gameContainer;
let score;
let obstacleInterval;
let obstacleSpeed = 5;
let obstacleCreationInterval = 800;
let gameStarted = false;
let currentObstacleSpeed = obstacleSpeed;
let gameContainerRect;
let touchMoveX = 0;
let moveIntervals = []; // To track all obstacle movement intervals

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  bike = document.getElementById('bike');
  gameContainer = document.querySelector('.game-container');
  const startButton = document.getElementById('start-button');
  
  startButton.addEventListener('click', startGame);
  
  // Pre-calculate game container dimensions
  gameContainerRect = gameContainer.getBoundingClientRect();
  
  // Recalculate on window resize
  window.addEventListener('resize', () => {
    gameContainerRect = gameContainer.getBoundingClientRect();
  });
});

function startGame() {
  if (gameStarted) {
    // If game is already running, stop it first
    stopGame();
  }
  
  gameStarted = true;
  score = 0;
  document.getElementById('score').textContent = 'Score: ' + score;
  
  // Clear any existing obstacles and intervals
  document.querySelectorAll('.obstacle').forEach(obs => obs.remove());
  moveIntervals.forEach(interval => clearInterval(interval));
  moveIntervals = [];
  
  // Reset bike position
  bike.style.left = '50%';
  bike.style.transform = 'translateX(-50%)';
  
  // Set up event listeners
  gameContainer.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('keydown', handleKeyDown);
  
  // For touch devices
  gameContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
  gameContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
  
  // Reset speeds
  obstacleSpeed = 5;
  currentObstacleSpeed = obstacleSpeed;
  obstacleCreationInterval = 800;
  
  // Start obstacle generation
  obstacleInterval = setInterval(createObstacle, obstacleCreationInterval);
  
  // Update start button text
  document.getElementById('start-button').textContent = 'Restart Game';
}

function stopGame() {
  clearInterval(obstacleInterval);
  gameStarted = false;
  
  // Clear all obstacle movement intervals
  moveIntervals.forEach(interval => clearInterval(interval));
  moveIntervals = [];
  
  // Remove event listeners
  gameContainer.removeEventListener('touchstart', handleTouchStart);
  gameContainer.removeEventListener('touchmove', handleTouchMove);
  gameContainer.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('keydown', handleKeyDown);
}

// Touch event handlers
function handleTouchStart(event) {
  event.preventDefault();
  touchMoveX = event.touches[0].clientX;
  moveBike();
}

function handleTouchMove(event) {
  event.preventDefault();
  touchMoveX = event.touches[0].clientX;
  moveBike();
}

// Mouse movement handler
function handleMouseMove(event) {
  touchMoveX = event.clientX;
  moveBike();
}

// Keyboard controls
function handleKeyDown(event) {
  if (!gameStarted) return;
  
  const bikeX = parseInt(bike.style.left) || gameContainer.offsetWidth / 2 - bike.offsetWidth / 2;
  
  if (event.key === 'ArrowLeft') {
    bike.style.left = Math.max(0, bikeX - 20) + 'px';
  } else if (event.key === 'ArrowRight') {
    bike.style.left = Math.min(gameContainer.offsetWidth - bike.offsetWidth, bikeX + 20) + 'px';
  }
}

// Main bike movement function
function moveBike() {
  if (!gameStarted) return;
  
  const bikeWidth = bike.offsetWidth;
  const containerWidth = gameContainer.offsetWidth;
  const containerLeft = gameContainerRect.left;
  
  // Calculate new bike position
  let bikeX = touchMoveX - containerLeft - bikeWidth / 2;
  bikeX = Math.max(0, Math.min(containerWidth - bikeWidth, bikeX));
  
  bike.style.left = bikeX + 'px';
}

// Obstacle creation and movement
function createObstacle() {
  const obstacle = document.createElement('div');
  obstacle.className = 'obstacle';
  obstacle.style.left = Math.random() * (gameContainer.offsetWidth - 40) + 'px';
  obstacle.style.top = '0px';
  gameContainer.appendChild(obstacle);
  
  moveObstacle(obstacle);
  
  // Gradually increase difficulty
  currentObstacleSpeed += 0.02;
  obstacleCreationInterval = Math.max(300, obstacleCreationInterval - 1);
}

function moveObstacle(obstacle) {
  const gameHeight = gameContainer.offsetHeight;
  let obstaclePosition = 0;
  
  const moveInterval = setInterval(() => {
    if (!gameStarted) {
      clearInterval(moveInterval);
      return;
    }
    
    obstaclePosition += currentObstacleSpeed;
    obstacle.style.top = obstaclePosition + 'px';
    
    // Check for collision
    if (checkCollision(obstacle)) {
      stopGame();
      document.getElementById('score').textContent = `Game Over! Score: ${score}`;
      setTimeout(() => {
        alert(`Game Over!\nYour Score: ${score}`);
      }, 100);
      clearInterval(moveInterval);
      return;
    }
    
    // Check if obstacle passed the bottom
    if (obstaclePosition > gameHeight) {
      obstacle.remove();
      clearInterval(moveInterval);
      moveIntervals = moveIntervals.filter(i => i !== moveInterval);
      // Increase score only when obstacle passes safely
      score += 1;
      document.getElementById('score').textContent = 'Score: ' + score;
    }
  }, 16); // ~60fps
  
  moveIntervals.push(moveInterval);
}

// Collision detection
function checkCollision(obstacle) {
  const bikeRect = bike.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();
  
  return (
    bikeRect.left < obstacleRect.right &&
    bikeRect.right > obstacleRect.left &&
    bikeRect.top < obstacleRect.bottom &&
    bikeRect.bottom > obstacleRect.top
  );
}
