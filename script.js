// Board
let board;
let boardWidth = 500;
let boardHeight = 500; // Square canvas
let context;

// Players
let playerWidth = 15;
let playerHeight = 100;
let playerVelocityY = 8;

let player1 = {
  x: 10,
  y: boardHeight / 2 - playerHeight / 2,
  width: playerWidth,
  height: playerHeight,
  velocityY: 0, // Fixed: Initial velocity should be 0
};

let player2 = {
  x: boardWidth - playerWidth - 10,
  y: boardHeight / 2 - playerHeight / 2,
  width: playerWidth,
  height: playerHeight,
  velocityY: 0, // AI controlled
};

// Ball
let ballWidth = 12;
let ballHeight = 12;

let ball = {
  x: boardWidth / 2 - ballWidth / 2,
  y: boardHeight / 2 - ballHeight / 2,
  width: ballWidth,
  height: ballHeight,
  velocityX: 3,
  velocityY: 3,
};

// Score
let player1Score = 0;
let player2Score = 0;
const maxScore = 20; // Game over limit

let gameRunning = true; // Track game state

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  requestAnimationFrame(update);
  document.addEventListener("keydown", movePlayer);
  document.addEventListener("keyup", stopPlayer);
  document.addEventListener("keydown", restartGame);
};

function update() {
  if (!gameRunning) return;

  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);

  // Player 1 Movement
  player1.y += player1.velocityY;
  player1.y = Math.max(0, Math.min(boardHeight - player1.height, player1.y));
  context.fillStyle = "skyblue";
  context.fillRect(player1.x, player1.y, player1.width, player1.height);

  // Player 2 AI (Improved AI)
  let aiSpeed = 2.2 + Math.random() * 1.2;
  if (ball.velocityX > 0) {
    if (ball.y < player2.y + player2.height / 2) {
      player2.y -= aiSpeed;
    } else if (ball.y > player2.y + player2.height / 2) {
      player2.y += aiSpeed;
    }
  }
  player2.y = Math.max(0, Math.min(boardHeight - player2.height, player2.y));
  context.fillStyle = "red";
  context.fillRect(player2.x, player2.y, player2.width, player2.height);

  // Ball movement
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
  context.fillStyle = "white";
  context.fillRect(ball.x, ball.y, ball.width, ball.height);

  // Ball collision with top/bottom
  if (ball.y <= 0 || ball.y + ball.height >= boardHeight) {
    ball.velocityY *= -1;
  }

  // Ball collision with players
  if (detectCollision(ball, player1) && ball.velocityX < 0) {
    ball.velocityX *= -1.05;
    ball.velocityY *= 1.02;
  } else if (detectCollision(ball, player2) && ball.velocityX > 0) {
    ball.velocityX *= -1.05;
    ball.velocityY *= 1.02;
  }

  // Score & Reset Ball
  if (ball.x < 0) {
    player2Score++;
    resetGame(1);
  } else if (ball.x + ballWidth > boardWidth) {
    player1Score++;
    resetGame(-1);
  }

  // Game Over Check
  if (player1Score >= maxScore || player2Score >= maxScore) {
    displayGameOver();
    return;
  }

  // Score display
  context.font = "45px sans-serif";
  context.fillStyle = "white";
  context.fillText(player1Score, boardWidth / 4, 50);
  context.fillText(player2Score, (boardWidth * 3) / 4, 50);

  // Center Line
  for (let i = 10; i < board.height; i += 25) {
    context.fillRect(boardWidth / 2 - 10, i, 5, 5);
  }
}

function movePlayer(e) {
  if (e.code == "KeyW") {
    player1.velocityY = -playerVelocityY;
  } else if (e.code == "KeyS") {
    player1.velocityY = playerVelocityY;
  }
}

function stopPlayer(e) {
  if (e.code == "KeyW" || e.code == "KeyS") {
    player1.velocityY = 0;
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function resetGame(direction) {
  if (player1Score >= maxScore || player2Score >= maxScore) {
    displayGameOver();
    return;
  }

  ball = {
    x: boardWidth / 2 - ballWidth / 2,
    y: boardHeight / 2 - ballHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: direction * 3,
    velocityY: 3,
  };
}

function displayGameOver() {
  gameRunning = false; // Stop game loop
  context.clearRect(0, 0, board.width, board.height);
  context.fillStyle = "white";
  context.font = "50px sans-serif";
  context.fillText("Game Over", boardWidth / 4, boardHeight / 2);
  context.font = "30px sans-serif";
  context.fillText(
    player1Score > player2Score ? "Player 1 Wins!" : "Player 2 Wins!",
    boardWidth / 4,
    boardHeight / 2 + 50
  );
  context.fillText("Press 'R' to Restart", boardWidth / 4, boardHeight / 2 + 100);
}

function restartGame(e) {
  if (e.code === "KeyR") {
    player1Score = 0;
    player2Score = 0;
    gameRunning = true; // Restart game loop
    resetGame(1);
    requestAnimationFrame(update);
  }
}
