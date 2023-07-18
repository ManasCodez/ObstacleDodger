var bike;
var gameContainer;
var score;
var obstacleInterval;
var obstacleSpeed = 5;
var obstacleCreationInterval = 800;
var gameStarted = false;
var currentObstacleSpeed = obstacleSpeed; // Track the current obstacle speed

var touchStartX = 0;
var touchMoveX = 0;

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    score = 0;
    document.getElementById('score').textContent = 'Score: ' + score;
    bike = document.getElementById('bike');
    gameContainer = document.querySelector('.game-container');
    gameContainer.addEventListener('touchstart', handleTouchStart);
    gameContainer.addEventListener('touchmove', handleTouchMove);
    gameContainer.addEventListener('touchend', handleTouchEnd);
    gameContainer.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    obstacleSpeed = 5; // Reset obstacle speed
    currentObstacleSpeed = obstacleSpeed; // Reset current obstacle speed
    obstacleInterval = setInterval(createObstacle, obstacleCreationInterval);
  }
}


function stopGame() {
  clearInterval(obstacleInterval);
  gameStarted = false;
  gameContainer.removeEventListener('touchstart', handleTouchStart);
  gameContainer.removeEventListener('touchmove', handleTouchMove);
  gameContainer.removeEventListener('touchend', handleTouchEnd);
  gameContainer.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('keydown', handleKeyDown);
}

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
}

function handleTouchMove(event) {
  event.preventDefault();
  touchMoveX = event.touches[0].clientX || event.clientX;
  moveBike();
}

function handleTouchEnd() {
  touchStartX = 0;
  touchMoveX = 0;
}

function handleMouseMove(event) {
  touchMoveX = event.clientX;
  moveBike();
}

function handleKeyDown(event) {
  if (event.code === 'ArrowLeft') {
    moveBikeLeft();
  } else if (event.code === 'ArrowRight') {
    moveBikeRight();
  }
}

function moveBike() {
  var containerRect = gameContainer.getBoundingClientRect();
  var containerWidth = containerRect.width;
  var bikeWidth = bike.offsetWidth;
  var containerLeft = containerRect.left;
  var bikeX = touchMoveX - containerLeft - bikeWidth / 2;
  var maxBikeX = containerWidth - bikeWidth;

  if (bikeX < 0) {
    bikeX = 0;
  } else if (bikeX > maxBikeX) {
    bikeX = maxBikeX;
  }

  bike.style.left = bikeX + 'px';
}

function moveBikeLeft() {
  var containerRect = gameContainer.getBoundingClientRect();
  var containerLeft = containerRect.left;
  var bikeX = parseInt(bike.style.left) || 0;

  if (bikeX > 0) {
    bike.style.left = (bikeX - 20) + 'px';
  }
}

function moveBikeRight() {
  var containerRect = gameContainer.getBoundingClientRect();
  var containerWidth = containerRect.width;
  var bikeWidth = bike.offsetWidth;
  var containerLeft = containerRect.left;
  var bikeX = parseInt(bike.style.left) || 0;

  if (bikeX < containerWidth - bikeWidth) {
    bike.style.left = (bikeX + 20) + 'px';
  }
}

function createObstacle() {
  var obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  obstacle.style.left = Math.random() * (gameContainer.offsetWidth - 40) + 'px';
  gameContainer.appendChild(obstacle);

  moveObstacle(obstacle);
  currentObstacleSpeed += 0.5; // Increase the current obstacle speed by a small value
}

function moveObstacle(obstacle) {
  var gameHeight = gameContainer.offsetHeight;

  var obstacleInterval = setInterval(function () {
    var obstacleBottom = obstacle.offsetTop + obstacle.offsetHeight;

    if (obstacleBottom > gameHeight) {
      if (checkCollision(obstacle)) {
        stopGame();
        alert('Game Over! Your Score: ' + score);
      }

      obstacle.remove();
      clearInterval(obstacleInterval);
    } else {
      obstacle.style.top = (obstacle.offsetTop + currentObstacleSpeed) + 'px';
      score += 1;
      document.getElementById('score').textContent = 'Score: ' + score;
    }
  }, 10);
}

function checkCollision(obstacle) {
  var bikeRect = bike.getBoundingClientRect();
  var obstacleRect = obstacle.getBoundingClientRect();

  return (
    bikeRect.top <= obstacleRect.bottom &&
    bikeRect.bottom >= obstacleRect.top &&
    bikeRect.left <= obstacleRect.right &&
    bikeRect.right >= obstacleRect.left
  );
}


