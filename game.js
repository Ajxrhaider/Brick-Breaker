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
      var paddleX = 600;
      var paddleY = 580;
      var paddleWidth = 100;
      var paddleHeight = 10;
      var paddleSpeed = 4;
      //varibales for bricks
      let bricks = [];
      var rowCount = 5;
      var columnCount = 22;
      //varibles for score
      var score = 0;
      //variables for gameover
      var gameEnded = false;



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
          }
        }
      }
      

      //Loop for bricks
      for (let r = 0; r < rowCount; r++) {
        bricks[r] = [];
        for (let c = 0; c < columnCount; c++) {
          let startX = 50 + c * 50;
          let startY = 50 + r * 20;
      
          // Assign color and hit points
          let color, hits;
          if (r % 3 === 0) {
            color = "purple";
            hits = 3;
          } else if (r % 3 === 1) {
            color = "blue";
            hits = 2;
          } else {
            color = "green";
            hits = 1;
          }
      
          bricks[r][c] = new Brick(startX, startY, color, hits);
        }
      } 

      //function to draw bricks
      function drawBricks() {
        for (let r = 0; r < rowCount; r++) {
          for (let c = 0; c < columnCount; c++) {
            bricks[r][c].draw(ctx);
          }
        }
      }

      //function for the collision of the ball with the bricks
function checkBrickCollisions() {
  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < columnCount; c++) {
      let brick = bricks[r][c];

      if (!brick.destroyed) {
        if (
          ballX + radius > brick.x &&
          ballX - radius < brick.x + brick.width &&
          ballY + radius > brick.y &&
          ballY - radius < brick.y + brick.height
        ) {
          dy = -dy;
          score++;
          brick.hit();

          // Change color based on hits left
          if (brick.hits === 2) brick.color = "blue";
          if (brick.hits === 1) brick.color = "green";
        }
      }
    }
  }
}


      //fuctioon for draw score
      function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Score: " + score, 8, 20);
      }
      //fuctions for the keys
      function KeydownHandler(e) {
        if (e.keyCode == 39) {
          rightPressed = true;
        } else if (e.keyCode == 37) {
          leftPressed = true;
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
      //fuctions for the game loop (basically the game itself plus YOUTUBE man said this si where you put evertything that you want to happen together)
      function gameloop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if ((gameEnded === false)) {
          drawBall();
          collison();
          drawPaddle();
          drawBricks();
          drawScore();
          ballX += dx;
          ballY += dy;
          movement();
          checkBrickCollisions();
        } else {
          ctx.font = "100px Arial";
          ctx.fillStyle = "white";
          ctx.fillText("Game Over, KYS.", 100, 300);
          ctx.fillText("Final score of a loser: " + score, 100, 400);
        }
      }

      setInterval(gameloop, 10);
