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
backgroundImage.src = 'images/Background.png'; // Make sure this path is correct relative to LevelOne.html


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
var columnCount = Math.max(...brickLayout.map(row => row.length)); // This is fine, but not strictly needed for loops below


//Class for the bricks
class Brick {
  constructor(x, y, color, hits) {
    this.x = x;
    this.y = y;
    this.width = 50; // Should match brickWidth
    this.height = 20; // Should match brickHeight
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
      // No need for 'if (this.hits === 3)' here as it only gets called when hits > 0 after decrementing
      if (this.hits === 2) this.color = "blue";
      if (this.hits === 1) this.color = "green";
    }
  }
}

//Loop for bricks initialization
for (let r = 0; r < brickLayout.length; r++) {
  bricks[r] = [];
  for (let c = 0; c < brickLayout[r].length; c++) { // Use brickLayout[r].length for potentially uneven rows
    if (brickLayout[r][c] > 0) {
      let hits = brickLayout[r][c];
      let color = hits === 3 ? "purple" : hits === 2 ? "blue" : "green";
      // Use the global brickWidth and brickHeight for consistency
      bricks[r][c] = new Brick(startX + c * brickWidth, startY + r * brickHeight, color, hits);
    } else {
      bricks[r][c] = null;
    }
  }
}


//function to draw bricks
function drawBricks() {
  for (let r = 0; r < brickLayout.length; r++) {
    // Ensure the inner loop uses the correct length for potentially jagged arrays
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
    // Ensure the inner loop uses the correct length for potentially jagged arrays
    for (let c = 0; c < brickLayout[r].length; c++) {
      let brick = bricks[r][c];

      // Check if brick exists and is not destroyed BEFORE accessing its properties
      if (brick && !brick.destroyed) {
        // Collision detection logic
        if (
          ballX + radius > brick.x &&
          ballX - radius < brick.x + brick.width &&
          ballY + radius > brick.y &&
          ballY - radius < brick.y + brick.height
        ) {
          dy = -dy;
          score++;
          playBrickHitSound(brick.hits); // Play sound BEFORE hit() changes the hits value
          brick.hit();
        }
      }
    }
  }
}



//function for draw score
function drawScore() {
  ctx.font = "16px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "white"; // Changed to white for better visibility on dark background? Adjust if needed.
  ctx.fillText("S c o r e: " + score, 8, 20);
}
//fuctions for the keys
function KeydownHandler(e) {
  // Use KeyboardEvent.code for better consistency if possible, but keyCode is widely supported
  if (e.keyCode == 39) { // ArrowRight
    rightPressed = true;
  } else if (e.keyCode == 37) { // ArrowLeft
    leftPressed = true;
  } else if (e.keyCode == 32 && !ballLaunched) { // Space key to start
    ballLaunched = true;
    // dy = -3; // Initial ball direction is already set globally, maybe reset dy here? Or rely on initial value. Let's keep initial dy = 3, so first hit makes it -3.
    // Start Tone.js audio context on the first user interaction
    Tone.start().then(() => {
        console.log("Audio Context Started");
        // Optionally play game audio immediately after context starts
        if (!gameAudio.paused) { // Check if already playing from a previous attempt if page wasn't fully reloaded
             gameAudio.currentTime = 0;
        }
        gameAudio.play().catch(e => console.error("Error playing game audio:", e));
    }).catch(e => console.error("Error starting Tone.js:", e));
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
  ctx.fill(); // Fill first
  ctx.strokeStyle = "green"; // Then stroke
  ctx.stroke();
}
//fuctions for the collison of the ball (basically game physics. LOL)
function collison() {
  // --- Wall Collisions (Left/Right) ---
  if (ballX + dx > canvas.width - radius || ballX + dx < radius) {
      playWallHitSound(); // Play wall hit sound
      dx = -dx;
      // Optional color change based on direction
      ballcolor = dx < 0 ? "blue" : "green";
  }
 
  // --- Paddle Collision ---
  // Check if ball is moving down AND is going to intersect the paddle's top surface in the next frame
  if (dy > 0 && // Moving Downwards
      ballY + radius >= paddleY && // Current bottom edge is at or below paddle top (prevents triggering from above)
      ballY + radius + dy >= paddleY && // Next bottom edge position will be at or below paddle top
      ballX + radius > paddleX && // Ball's right edge is past paddle's left edge
      ballX - radius < paddleX + paddleWidth) // Ball's left edge is before paddle's right edge
  {
      playPaddleHitSound(); // Play paddle hit sound
      dy = -dy;
      // Optional: Force ball position slightly above paddle to prevent potential 'sticking' issues
      // ballY = paddleY - radius;
  }
  // --- Wall Collisions (Top/Bottom) ---
  else if (ballY + dy < radius) { // Top wall collision
      playWallHitSound();
      dy = -dy;
  } else if (ballY + dy > canvas.height - radius) { // Bottom wall collision (ONLY if paddle wasn't hit)
      // Ball hit the bottom - Game Over
      gameEnded = true;
      gameAudio.pause(); // Stop music on game over
      gameAudio.currentTime = 0;
  }

  // Old Paddle collision check (commented out in previous version, kept here for reference)
  /* This block might be less accurate than the check within the bottom wall collision
  if (
    ballY + radius > paddleY && // Ball is at paddle level
    ballY - radius < paddleY + paddleHeight && // Ball is not past paddle
    ballX + radius > paddleX && // Ball right edge past paddle left
    ballX - radius < paddleX + paddleWidth // Ball left edge before paddle right
  ) {
      // This might trigger even if the ball hits the side of the paddle slightly below the top surface
      // Let's rely on the check near the bottom wall condition
      // playPaddleHitSound();
      // dy = -dy;
  }
  */

}
//fuctions for the game loop (basically the game itself plus YOUTUBE man said this is where you put evertything that you want to happen together)
function gameloop() {
  // Clear canvas is often needed, but background image replaces it.
  // ctx.clearRect(0, 0, canvas.width, canvas.height); // Usually needed if no background image covers everything
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  if (!gameEnded) {
    drawPaddle();
    drawBricks();
    drawScore();
    drawBall(); // Draw ball regardless of launch state, just update position if launched

    if (!ballLaunched) {
      // Keep ball on paddle before launch
      ballX = paddleX + paddleWidth / 2;
      ballY = paddleY - radius;

      // Display launch instructions
      ctx.font = "20px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "white";
      ctx.textAlign = "center"; // Center the text
      ctx.fillText("Press SPACE to launch ball", canvas.width / 2, canvas.height - 100);
      ctx.textAlign = "left"; // Reset alignment
    } else {
      // Only update physics and check collisions if ball is launched
      collison(); // Check collisions (walls, paddle, bottom)
      checkBrickCollisions(); // Check brick collisions

      // Update ball position *after* collision checks
      ballX += dx;
      ballY += dy;
    }

    movement(); // Move paddle based on input

  } else {
    // Game Over Screen
    ctx.font = "70px 'Space Grotesk', sans-serif"; // Adjusted size slightly
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Game Over, KYS", canvas.width / 2, 250);
    ctx.font = "40px 'Space Grotesk', sans-serif";
    ctx.fillText("Final score: " + score, canvas.width / 2, 350); // Simpler text
    ctx.textAlign = "left"; // Reset alignment
    document.getElementById("restartButton").style.display = "block"; // Show restart button
    // Consider showing next level button only if score condition met? Or maybe not on game over.
    document.getElementById("nextLevelButton").style.display = "none"; // Hide next level on game over
  }

  // Check for win condition (all bricks destroyed)
  let remainingBricks = 0;
  for (let r = 0; r < bricks.length; r++) {
      for (let c = 0; c < bricks[r].length; c++) {
          if (bricks[r][c] && !bricks[r][c].destroyed) {
              remainingBricks++;
          }
      }
  }

  if (!gameEnded && remainingBricks === 0) {
      // Win Condition
      ctx.font = "70px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "yellow"; // Win color!
      ctx.textAlign = "center";
      ctx.fillText("YOU WIN!", canvas.width / 2, 250);
      ctx.font = "40px 'Space Grotesk', sans-serif";
      ctx.fillText("Score: " + score, canvas.width / 2, 350);
      ctx.textAlign = "left"; // Reset alignment

      document.getElementById("nextLevelButton").style.display = "block"; // Show next level button
      document.getElementById("restartButton").style.display = "block"; // Also allow restart
      ballLaunched = false; // Stop ball movement
      gameAudio.pause();
      // gameEnded = true; // Set gameEnded to stop ball updates etc.
  }


}

// Wait for fonts and DOM before starting the game loop
Promise.all([
    document.fonts.ready,
    new Promise(resolve => window.addEventListener('DOMContentLoaded', resolve))
]).then(() => {
    console.log("Fonts and DOM ready, starting game loop.");
    // Make sure background image has time to load (or handle onload)
    if (backgroundImage.complete) {
         setInterval(gameloop, 16); // Use ~60fps interval
    } else {
        backgroundImage.onload = () => {
            setInterval(gameloop, 16); // Use ~60fps interval
        };
        backgroundImage.onerror = () => {
            console.error("Background image failed to load!");
            // Decide how to proceed - maybe draw a solid color background?
            setInterval(gameloop, 16); // Start loop anyway
        }
    }
}).catch(e => console.error("Error during initialization:", e));


function nextlevel() {
  window.location.href = 'LevelTwoByBelema.html';
  gameAudio.pause(); // Stop the music when navigating to the next level
  gameAudio.currentTime = 0; // Reset the audio to the beginning
}

// --- Sound Effect Logic using Tone.js ---

// Create Synths (using square wave for 8-bit feel)
// Ensure Tone.js is loaded before these lines execute (it should be, based on HTML)
const wallHitSynth = new Tone.Synth({
    oscillator: { type: 'square' },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0.1, release: 0.1 }
}).toDestination();

const paddleHitSynth = new Tone.Synth({
    oscillator: { type: 'square' },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0.1, release: 0.1 }
}).toDestination();

const brickHitSynth = new Tone.Synth({
    oscillator: { type: 'square' },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0.1, release: 0.1 }
}).toDestination();

// Function to play wall hit sound
function playWallHitSound() {
    // Check if Tone.js context is running before playing sound
    if (Tone.context.state === 'running') {
        wallHitSynth.triggerAttackRelease("C3", "16n", Tone.now()); // Low pitch
    } else {
        console.log("Audio context not running, cannot play wall sound.");
    }
}

// Function to play paddle hit sound
function playPaddleHitSound() {
    if (Tone.context.state === 'running') {
        paddleHitSynth.triggerAttackRelease("C4", "16n", Tone.now()); // Medium pitch
    } else {
        console.log("Audio context not running, cannot play paddle sound.");
    }
}

// Function to play brick hit sound (varying pitch based on hits)
function playBrickHitSound(brickHits) {
    if (Tone.context.state === 'running') {
        let note = "G4"; // Default for 1-hit bricks (green)
        if (brickHits === 2) {
            note = "A4"; // Higher pitch for 2-hit bricks (blue)
        } else if (brickHits >= 3) { // >= 3 handles the initial state of 3-hit bricks (purple)
            note = "B4"; // Highest pitch for 3-hit bricks
        }
        brickHitSynth.triggerAttackRelease(note, "16n", Tone.now());
    } else {
        console.log("Audio context not running, cannot play brick sound.");
    }
}

// --- Restart Button Logic (from HTML, ensure it works with the JS) ---
// It's better to have this listener setup in the JS file after the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const restartButton = document.getElementById("restartButton");
    if (restartButton) {
        restartButton.addEventListener("click", function () {
            console.log("Restart button clicked");
            // Reset game variables
            gameEnded = false;
            ballLaunched = false;
            score = 0;
            // Reset ball position (e.g., center or back on paddle)
            // ballX = canvas.width / 2;
            // ballY = canvas.height / 2;
            paddleX = (canvas.width - paddleWidth) / 2; // Center paddle
            ballX = paddleX + paddleWidth / 2; // Place ball on centered paddle
            ballY = paddleY - radius;
            dx = 3; // Reset ball speed/direction
            dy = 3; // Reset ball speed/direction (will be flipped negative on first paddle hit if needed)

            // Reinitialize bricks
            bricks = []; // Clear existing bricks array
            for (let r = 0; r < brickLayout.length; r++) {
                bricks[r] = [];
                for (let c = 0; c < brickLayout[r].length; c++) {
                    if (brickLayout[r][c] > 0) {
                        let hits = brickLayout[r][c];
                        let color =
                            hits === 3 ? "purple" : hits === 2 ? "blue" : "green";
                        bricks[r][c] = new Brick(
                            startX + c * brickWidth,
                            startY + r * brickHeight,
                            color,
                            hits
                        );
                    } else {
                        bricks[r][c] = null;
                    }
                }
            }

            // Hide restart button and next level button
            restartButton.style.display = "none";
            const nextLevelButton = document.getElementById("nextLevelButton");
            if (nextLevelButton) {
                nextLevelButton.style.display = "none";
            }

            // Reset and potentially restart music? Optional.
            gameAudio.pause();
            gameAudio.currentTime = 0;
            // Don't auto-play music on restart, wait for space press again.

            // Ensure game loop continues if it was stopped by win/loss state
            // The main loop `setInterval` should still be running unless explicitly cleared.
        });
    } else {
        console.error("Restart button not found!");
    }

    // Next Level Button Listener (already in HTML, but good practice to have JS handlers in JS)
    const nextLevelButton = document.getElementById("nextLevelButton");
    if (nextLevelButton) {
         // The onclick="nextlevel();" in the HTML already handles this.
         // If you remove the onclick attribute, you'd add the listener here:
         // nextLevelButton.addEventListener("click", nextlevel);
    } else {
         console.error("Next Level button not found!");
    }
});
