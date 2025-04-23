//Well, most codes are suggested by my VSCode, Some by Youtube and then very little by my own head. I understand everything here and did not use any Ai so it would be easier to debug.
//variables for the canvas (that's the box where the game is played)
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
//variables for keys (four years in cmp if you dont know this KYS)
document.addEventListener("keydown", KeydownHandler, false);
document.addEventListener("keyup", KeyupHandler, false);
var rightPressed = false;
var leftPressed = false;
// variables for the ball
var ballX = canvas.width / 2;
var ballY = canvas.height / 2;
var radius = 10;
var dx = 3;
var dy = 3;
let ballcolor = "white";
//variables for the paddle
var paddleX = 550;
var paddleY = 580;
var paddleWidth = 100;
var paddleHeight = 10;
var paddleSpeed = 5;
//varibales for bricks
let bricks = [];

//varibles for score
var score = 0;
//variables for gameover
var gameEnded = false;
//variables for ball is stationary
var ballLaunched = false;
//variables for grid positioning of bricks 
let startX = 100;
let startY = 50;
let brickWidth = 50;
let brickHeight = 20;
// variables for game music
const gameAudio = new Audio("Gravity of  the  Fallen.mp3");
gameAudio.loop = true;

const backgroundImage = new Image();
backgroundImage.src = 'images/Background.png';


let brickLayout = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
  [0, 2, 0, 0, 2, 2, 2, 2, 2, 0, 2, 0, 0, 2, 0, 0, 2, 2, 2], 
  [0, 2, 0, 0, 2, 2, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 2, 2], 
  [0, 2, 3, 3, 2, 2, 3, 3, 3, 0, 2, 0, 0, 2, 0, 0, 2, 0, 2],  
  [0, 2, 3, 3, 2, 2, 3, 3, 3, 0, 2, 0, 0, 2, 0, 0, 2, 0, 2], 
  [0, 2, 0, 0, 2, 2, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 2, 2], 
  [0, 2, 0, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2],  
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  
];

var rowCount = brickLayout.length;
var columnCount = Math.max(...brickLayout.map(row => row.length));



//Class for the bricks
class Brick {
  constructor(x, y, color, hits) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 20;
    this.color = color;
    this.hits = hits; // Number of hits before disappearing
    this.destroyed = false;
  }

  draw(ctx) {
    if (!this.destroyed) {
      ctx.fillStyle = this.color; 
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeStyle = "white";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }

  hit() {
    this.hits--;
    if (this.hits <= 0) {
      this.destroyed = true;
    } else {
      // Update color based on remaining hits
      if (this.hits === 3) this.color = "purple";
      if (this.hits === 2) this.color = "blue";
      if (this.hits === 1) this.color = "green";
    }
  }
}

//Loop for bricks
for (let r = 0; r < brickLayout.length; r++) {
  bricks[r] = [];
  for (let c = 0; c < brickLayout[r].length; c++) {
    if (brickLayout[r][c] > 0) {
      let hits = brickLayout[r][c];
      let color = hits === 3 ? "purple" : hits === 2 ? "blue" : "green";
      bricks[r][c] = new Brick(startX + c * brickWidth, startY + r * brickHeight, color, hits);
    } else {
      bricks[r][c] = null;
    }
  }
}


//function to draw bricks
function drawBricks() {
  for (let r = 0; r < brickLayout.length; r++) {
    for (let c = 0; c < brickLayout[r].length; c++) {
      if (bricks[r][c]) { // Check if the brick exists
        bricks[r][c].draw(ctx);
      }
    }
  }
}


//function for the collision of the ball with the bricks
function checkBrickCollisions() {
  for (let r = 0; r < brickLayout.length; r++) {
    for (let c = 0; c < brickLayout[r].length; c++) {
      let brick = bricks[r][c];

      if (brick && !brick.destroyed) {
        if (
          ballX + radius > brick.x &&
          ballX - radius < brick.x + brick.width &&
          ballY + radius > brick.y &&
          ballY - radius < brick.y + brick.height
        ) {
          dy = -dy;
          score++;
          brick.hit();
        }
      }
    }
  }
}



//fuctioon for draw score
function drawScore() {
  ctx.font = "16px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "black";
  ctx.fillText("S c o r e: " + score, 8, 20);
}
//fuctions for the keys
function KeydownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  } else if (e.keyCode == 32 && !ballLaunched) { // Space key to start
    ballLaunched = true;
    dy = -3; // launch ball upwards
    gameAudio.play();


  }
}
function KeyupHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

//function for the movement of the paddle
function movement() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += paddleSpeed;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= paddleSpeed;
  }
}

//fuctions for the displaying of the paddle
function drawPaddle() {
  ctx.fillStyle = "brown";
  ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.strokeStyle = "white";
  ctx.strokeRect(paddleX, paddleY, paddleWidth, paddleHeight);
}
//fuctions for the displaying of the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, radius, 0, Math.PI * 2);
  ctx.fillStyle = ballcolor;
  ctx.stroke();
  ctx.strokeStyle = "green";
  ctx.fill();

}
//fuctions for the collison of the ball (basically game physics. LOL)
function collison() {
  if (ballX + radius > 1200 || ballX - radius < 0) {
    dx = -dx;
    if (dx < 0) {
      ballcolor = "blue";
    } else {
      ballcolor = "green";
    }
  }
  if (ballY + radius > 600 || ballY - radius < 0) {
    dy = -dy;
    ctx.strokeStyle = "red";
    if (ballY + radius > 600) {
      gameEnded = true;
    }
  }
  if (
    ballY + radius > paddleY &&
    ballX > paddleX &&
    ballX < paddleX + paddleWidth
  ) {
    dy = -dy;
  }
}
//fuctions for the game loop (basically the game itself plus YOUTUBE man said this is where you put evertything that you want to happen together)
function gameloop() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  if (!gameEnded) {
    drawPaddle();
    drawBricks();
    drawScore();

    if (!ballLaunched) {
      ballX = paddleX + paddleWidth / 2;
      ballY = paddleY - radius;

      // Display launch instructions
      ctx.font = "20px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "white";
      ctx.fillText("Press SPACE to launch ball", canvas.width / 2 - 100, canvas.height - 100);
    }

    drawBall();

    if (ballLaunched) {
      collison();
      ballX += dx;
      ballY += dy;
      checkBrickCollisions();
    }

  } else {
    ctx.font = "100px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText("Game Over", 50, 300);
    ctx.fillText("Final score of a loser: " + score, 50, 400);
    document.getElementById("restartButton").style.display = "block";
  }

  movement();

  
}
document.fonts.ready.then(() => {
  setInterval(gameloop, 10); // start game only after fonts are ready
});

function nextlevel() {
  window.location.href = 'LevelTwoByBelema.html';
  gameAudio.pause(); // Stop the music when navigating to the next level
  gameAudio.currentTime = 0; // Reset the audio to the beginning  
}