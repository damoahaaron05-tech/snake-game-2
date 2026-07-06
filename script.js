const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;

let snake;
let food;
let direction;
let score;
let level;
let gameSpeed; // Tracks how fast the game runs (lower is faster)
let game;      // Tracks the loop interval

// Load the high score from browser memory, default to 0 if empty
let highScore = localStorage.getItem("snakeHighScore") || 0;
document.getElementById("highScore").innerHTML = highScore;

// Start the game for the first time
resetGame();

// Listen for keyboard presses across the entire window
window.addEventListener("keydown", changeDirection);

function resetGame() {
    snake = [
        {x: 200, y: 200}
    ];
    
    food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
    
    direction = "";
    score = 0;
    level = 1;
    gameSpeed = 150; // Starting speed (150ms per frame)

    document.getElementById("score").innerHTML = score;
    document.getElementById("level").innerHTML = level;

    // Restart the loop interval with the fresh speed
    clearInterval(game);
    game = setInterval(draw, gameSpeed);
}

function changeDirection(event) {
    const key = event.key.toLowerCase(); 

    if ((key === "arrowleft" || key === "a") && direction !== "RIGHT") {
        direction = "LEFT";
    }
    else if ((key === "arrowup" || key === "w") && direction !== "DOWN") {
        direction = "UP";
    }
    else if ((key === "arrowright" || key === "d") && direction !== "LEFT") {
        direction = "RIGHT";
    }
    else if ((key === "arrowdown" || key === "s") && direction !== "UP") {
        direction = "DOWN";
    }
}

function draw() {
    // Clear background to solid black
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 400);

    // Draw snake body blocks
    for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "limegreen" : "lime"; // Darker green for the head
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "black";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw the food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Get current head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Move snake based on direction
    if(direction === "LEFT") snakeX -= box;
    if(direction === "UP") snakeY -= box;
    if(direction === "RIGHT") snakeX += box; 
    if(direction === "DOWN") snakeY += box;

    // Check if snake eats the food
    if(snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById("score").innerHTML = score;

        // HIGH SCORE FEATURE: Check and update high score instantly
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
            document.getElementById("highScore").innerHTML = highScore;
        }

        // LEVEL FEATURE: Level up every 5 points and make it move faster!
        if (score % 5 === 0) {
            level++;
            document.getElementById("level").innerHTML = level;
            
            // Speed up the interval loop by decreasing milliseconds factor
            gameSpeed = Math.max(50, gameSpeed - 20); 
            clearInterval(game);
            game = setInterval(draw, gameSpeed);
        }

        // Spawn new food
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } else {
        snake.pop();
    }

    // Define the coordinates for the new head position
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // Game over walls check
    if(snakeX < 0 || snakeY < 0 || snakeX >= 400 || snakeY >= 400) {
        clearInterval(game);
        alert("Game Over! Your score: " + score);
        resetGame(); 
        return;
    }

    // SELF-COLLISION FEATURE: Check if snake head bumps into its own body
    for(let i = 0; i < snake.length; i++) {
        if(newHead.x === snake[i].x && newHead.y === snake[i].y && direction !== "") {
            clearInterval(game);
            alert("Game Over! You bit your tail! Your score: " + score);
            resetGame();
            return;
        }
    }

    // Add the new head to the front of the body array
    snake.unshift(newHead);
}