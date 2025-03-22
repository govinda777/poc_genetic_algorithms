// Constants
const GRID_SIZE = 25;
const CELL_SIZE = 20;
const INITIAL_SNAKE_LENGTH = 3;
const INITIAL_ENERGY = 100;
const ENERGY_DECREASE_PER_STEP = 1;
const ENERGY_INCREASE_PER_FOOD = 50;
const GAME_SPEED = 150; // ms between steps

// Direction constants
const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

// Game state
let canvas, ctx;
let gameInterval;
let snake = [];
let food = {};
let direction = DIRECTIONS.RIGHT;
let nextDirection = DIRECTIONS.RIGHT;
let score = 0;
let energy = INITIAL_ENERGY;
let gameOver = false;
let aiMode = false;
let showSensors = false;
let sensorData = {};

// DOM elements
let startBtn, resetBtn, toggleSensorsBtn, toggleAiBtn;
let scoreDisplay, snakeSizeDisplay, energyDisplay, gameModeDisplay;
let sensorDisplay;

// Initialize the game
window.onload = function() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    // Get DOM elements
    startBtn = document.getElementById('start-btn');
    resetBtn = document.getElementById('reset-btn');
    toggleSensorsBtn = document.getElementById('toggle-sensors-btn');
    toggleAiBtn = document.getElementById('toggle-ai-btn');
    scoreDisplay = document.getElementById('score');
    snakeSizeDisplay = document.getElementById('snake-size');
    energyDisplay = document.getElementById('energy');
    gameModeDisplay = document.getElementById('game-mode');
    sensorDisplay = document.getElementById('sensor-display');
    
    // Add event listeners
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    toggleSensorsBtn.addEventListener('click', toggleSensors);
    toggleAiBtn.addEventListener('click', toggleAI);
    document.addEventListener('keydown', handleKeyPress);
    
    // Initialize game
    resetGame();
    drawGame();
};

// Start the game
function startGame() {
    if (gameInterval) return;
    
    gameInterval = setInterval(gameStep, GAME_SPEED);
    startBtn.textContent = 'Pausar Jogo';
    startBtn.removeEventListener('click', startGame);
    startBtn.addEventListener('click', pauseGame);
}

// Pause the game
function pauseGame() {
    if (!gameInterval) return;
    
    clearInterval(gameInterval);
    gameInterval = null;
    startBtn.textContent = 'Continuar Jogo';
    startBtn.removeEventListener('click', pauseGame);
    startBtn.addEventListener('click', startGame);
}

// Reset the game
function resetGame() {
    // Clear any existing game interval
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
    
    // Reset game state
    snake = [];
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
        snake.unshift({ x: Math.floor(GRID_SIZE / 2) - i, y: Math.floor(GRID_SIZE / 2) });
    }
    
    direction = DIRECTIONS.RIGHT;
    nextDirection = DIRECTIONS.RIGHT;
    score = 0;
    energy = INITIAL_ENERGY;
    gameOver = false;
    
    // Generate initial food
    generateFood();
    
    // Update displays
    updateDisplays();
    
    // Reset start button
    startBtn.textContent = 'Iniciar Jogo';
    startBtn.removeEventListener('click', pauseGame);
    startBtn.addEventListener('click', startGame);
    
    // Draw the initial state
    drawGame();
}

// Toggle sensors display
function toggleSensors() {
    showSensors = !showSensors;
    sensorDisplay.style.display = showSensors ? 'block' : 'none';
    drawGame();
}

// Toggle AI mode
function toggleAI() {
    aiMode = !aiMode;
    gameModeDisplay.textContent = aiMode ? 'IA' : 'Manual';
}

// Handle keyboard input
function handleKeyPress(event) {
    if (aiMode) return; // Ignore keyboard in AI mode
    
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== DIRECTIONS.DOWN) {
                nextDirection = DIRECTIONS.UP;
            }
            break;
        case 'ArrowDown':
            if (direction !== DIRECTIONS.UP) {
                nextDirection = DIRECTIONS.DOWN;
            }
            break;
        case 'ArrowLeft':
            if (direction !== DIRECTIONS.RIGHT) {
                nextDirection = DIRECTIONS.LEFT;
            }
            break;
        case 'ArrowRight':
            if (direction !== DIRECTIONS.LEFT) {
                nextDirection = DIRECTIONS.RIGHT;
            }
            break;
    }
}

// Generate food at a random position
function generateFood() {
    let validPosition = false;
    let newFood = {};
    
    while (!validPosition) {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        
        validPosition = true;
        
        // Check if food is on snake
        for (let segment of snake) {
            if (segment.x === newFood.x && segment.y === newFood.y) {
                validPosition = false;
                break;
            }
        }
    }
    
    food = newFood;
}

// Game step function - called on each interval
function gameStep() {
    if (gameOver) {
        pauseGame();
        return;
    }
    
    // Update sensor data
    updateSensors();
    
    // If in AI mode, get the next direction from the AI
    if (aiMode) {
        const state = getSnakeState();
        const action = getAIAction(state);
        applyAction(action);
    }
    
    // Apply the next direction
    direction = nextDirection;
    
    // Calculate new head position
    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;
    
    // Check for collisions
    if (checkCollision(head)) {
        gameOver = true;
        pauseGame();
        alert('Game Over! Score: ' + score);
        return;
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score++;
        energy += ENERGY_INCREASE_PER_FOOD;
        generateFood();
    } else {
        // Remove tail if no food was eaten
        snake.pop();
        
        // Decrease energy
        energy -= ENERGY_DECREASE_PER_STEP;
        if (energy <= 0) {
            gameOver = true;
            pauseGame();
            alert('Out of energy! Score: ' + score);
            return;
        }
    }
    
    // Update displays
    updateDisplays();
    
    // Redraw the game
    drawGame();
}

// Check if a position collides with walls or snake body
function checkCollision(position) {
    // Check wall collision
    if (position.x < 0 || position.x >= GRID_SIZE || 
        position.y < 0 || position.y >= GRID_SIZE) {
        return true;
    }
    
    // Check self collision (skip the tail as it will move)
    for (let i = 0; i < snake.length - 1; i++) {
        if (position.x === snake[i].x && position.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// Update game displays
function updateDisplays() {
    scoreDisplay.textContent = score;
    snakeSizeDisplay.textContent = snake.length;
    energyDisplay.textContent = energy;
}

// Draw the game on the canvas
function drawGame() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid (optional)
    drawGrid();
    
    // Draw snake
    drawSnake();
    
    // Draw food
    drawFood();
    
    // Draw sensors if enabled
    if (showSensors) {
        drawSensors();
    }
}

// Draw grid lines
function drawGrid() {
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i <= GRID_SIZE; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
        ctx.stroke();
        
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
        ctx.stroke();
    }
}

// Draw the snake
function drawSnake() {
    // Draw body
    ctx.fillStyle = '#4CAF50';
    for (let i = 1; i < snake.length; i++) {
        ctx.fillRect(
            snake[i].x * CELL_SIZE,
            snake[i].y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );
    }
    
    // Draw head (different color)
    ctx.fillStyle = '#388E3C';
    ctx.fillRect(
        snake[0].x * CELL_SIZE,
        snake[0].y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
    );
    
    // Draw eyes
    ctx.fillStyle = 'white';
    const eyeSize = CELL_SIZE / 5;
    const eyeOffset = CELL_SIZE / 4;
    
    // Position eyes based on direction
    let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
    
    if (direction === DIRECTIONS.RIGHT) {
        leftEyeX = snake[0].x * CELL_SIZE + CELL_SIZE - eyeOffset;
        leftEyeY = snake[0].y * CELL_SIZE + eyeOffset;
        rightEyeX = snake[0].x * CELL_SIZE + CELL_SIZE - eyeOffset;
        rightEyeY = snake[0].y * CELL_SIZE + CELL_SIZE - eyeOffset;
    } else if (direction === DIRECTIONS.LEFT) {
        leftEyeX = snake[0].x * CELL_SIZE + eyeOffset;
        leftEyeY = snake[0].y * CELL_SIZE + eyeOffset;
        rightEyeX = snake[0].x * CELL_SIZE + eyeOffset;
        rightEyeY = snake[0].y * CELL_SIZE + CELL_SIZE - eyeOffset;
    } else if (direction === DIRECTIONS.UP) {
        leftEyeX = snake[0].x * CELL_SIZE + eyeOffset;
        leftEyeY = snake[0].y * CELL_SIZE + eyeOffset;
        rightEyeX = snake[0].x * CELL_SIZE + CELL_SIZE - eyeOffset;
        rightEyeY = snake[0].y * CELL_SIZE + eyeOffset;
    } else if (direction === DIRECTIONS.DOWN) {
        leftEyeX = snake[0].x * CELL_SIZE + eyeOffset;
        leftEyeY = snake[0].y * CELL_SIZE + CELL_SIZE - eyeOffset;
        rightEyeX = snake[0].x * CELL_SIZE + CELL_SIZE - eyeOffset;
        rightEyeY = snake[0].y * CELL_SIZE + CELL_SIZE - eyeOffset;
    }
    
    ctx.beginPath();
    ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
}

// Draw the food
function drawFood() {
    ctx.fillStyle = '#F44336';
    ctx.beginPath();
    ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Update sensor data
function updateSensors() {
    const head = snake[0];
    
    // Initialize sensor data
    sensorData = {
        // Distance to walls
        wallDistance: {
            up: head.y,
            down: GRID_SIZE - 1 - head.y,
            left: head.x,
            right: GRID_SIZE - 1 - head.x
        },
        // Distance to food
        foodDistance: {
            x: food.x - head.x,
            y: food.y - head.y,
            euclidean: Math.sqrt(Math.pow(food.x - head.x, 2) + Math.pow(food.y - head.y, 2))
        },
        // Angle to food (in radians)
        foodAngle: Math.atan2(food.y - head.y, food.x - head.x),
        // Danger in each direction (true if moving in that direction would cause collision)
        danger: {
            up: checkCollision({ x: head.x, y: head.y - 1 }),
            down: checkCollision({ x: head.x, y: head.y + 1 }),
            left: checkCollision({ x: head.x - 1, y: head.y }),
            right: checkCollision({ x: head.x + 1, y: head.y })
        },
        // Vision in 8 directions (distance to obstacles)
        vision: calculateVision()
    };
    
    // Update sensor display
    if (showSensors) {
        updateSensorDisplay();
    }
}

// Calculate vision in 8 directions
function calculateVision() {
    const head = snake[0];
    const directions = [
        { x: 0, y: -1 }, // Up
        { x: 1, y: -1 }, // Up-Right
        { x: 1, y: 0 },  // Right
        { x: 1, y: 1 },  // Down-Right
        { x: 0, y: 1 },  // Down
        { x: -1, y: 1 }, // Down-Left
        { x: -1, y: 0 }, // Left
        { x: -1, y: -1 } // Up-Left
    ];
    
    const vision = [];
    
    for (let dir of directions) {
        let distance = 1;
        let x = head.x + dir.x;
        let y = head.y + dir.y;
        let foundObstacle = false;
        let foundFood = false;
        
        while (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE && !foundObstacle) {
            // Check for snake body
            for (let segment of snake) {
                if (segment.x === x && segment.y === y) {
                    foundObstacle = true;
                    break;
                }
            }
            
            // Check for food
            if (food.x === x && food.y === y) {
                foundFood = true;
            }
            
            if (!foundObstacle) {
                x += dir.x;
                y += dir.y;
                distance++;
            }
        }
        
        vision.push({
            distance: foundObstacle ? distance : distance - 1,
            foundFood: foundFood
        });
    }
    
    return vision;
}

// Update sensor display
function updateSensorDisplay() {
    let html = '<strong>Sensores:</strong><br>';
    html += `Distância para comida: ${sensorData.foodDistance.euclidean.toFixed(2)}<br>`;
    html += `Ângulo para comida: ${(sensorData.foodAngle * 180 / Math.PI).toFixed(2)}°<br>`;
    html += 'Perigo: ';
    html += sensorData.danger.up ? 'Cima ' : '';
    html += sensorData.danger.down ? 'Baixo ' : '';
    html += sensorData.danger.left ? 'Esquerda ' : '';
    html += sensorData.danger.right ? 'Direita ' : '';
    html += '<br>';
    
    sensorDisplay.innerHTML = html;
}

// Draw sensors
function drawSensors() {
    const head = snake[0];
    const headCenterX = head.x * CELL_SIZE + CELL_SIZE / 2;
    const headCenterY = head.y * CELL_SIZE + CELL_SIZE / 2;
    
    // Draw line to food
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(headCenterX, headCenterY);
    ctx.lineTo(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2
    );
    ctx.stroke();
    
    // Draw vision rays
    const directions = [
        { x: 0, y: -1 }, // Up
        { x: 1, y: -1 }, // Up-Right
        { x: 1, y: 0 },  // Right
        { x: 1, y: 1 },  // Down-Right
        { x: 0, y: 1 },  // Down
        { x: -1, y: 1 }, // Down-Left
        { x: -1, y: 0 }, // Left
        { x: -1, y: -1 } // Up-Left
    ];
    
    for (let i = 0; i < directions.length; i++) {
        const dir = directions[i];
        const vision = sensorData.vision[i];
        
        // Calculate end point
        const endX = headCenterX + dir.x * vision.distance * CELL_SIZE;
        const endY = headCenterY + dir.y * vision.distance * CELL_SIZE;
        
        // Draw ray
        ctx.strokeStyle = vision.foundFood ? 'rgba(0, 255, 0, 0.5)' : 'rgba(0, 0, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(headCenterX, headCenterY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
}

// Get the current state of the snake for AI
function getSnakeState() {
    return {
        snake: snake.slice(), // Copy of snake array
        food: { ...food },    // Copy of food object
        direction: { ...direction },
        energy: energy,
        score: score,
        sensors: { ...sensorData }
    };
}

// Apply an action to the snake
function applyAction(action) {
    // Action should be one of: 'up', 'down', 'left', 'right'
    switch (action) {
        case 'up':
            if (direction !== DIRECTIONS.DOWN) {
                nextDirection = DIRECTIONS.UP;
            }
            break;
        case 'down':
            if (direction !== DIRECTIONS.UP) {
                nextDirection = DIRECTIONS.DOWN;
            }
            break;
        case 'left':
            if (direction !== DIRECTIONS.RIGHT) {
                nextDirection = DIRECTIONS.LEFT;
            }
            break;
        case 'right':
            if (direction !== DIRECTIONS.LEFT) {
                nextDirection = DIRECTIONS.RIGHT;
            }
            break;
    }
}

// Placeholder for AI action function
// This will be replaced by the actual neural network in the genetic algorithm
function getAIAction(state) {
    // Simple placeholder AI that just tries to align with the food
    const head = state.snake[0];
    const food = state.food;
    
    // Determine the direction with the highest priority that doesn't lead to collision
    if (food.x < head.x && !state.sensors.danger.left) {
        return 'left';
    } else if (food.x > head.x && !state.sensors.danger.right) {
        return 'right';
    } else if (food.y < head.y && !state.sensors.danger.up) {
        return 'up';
    } else if (food.y > head.y && !state.sensors.danger.down) {
        return 'down';
    }
    
    // If no safe direction towards food, choose any safe direction
    if (!state.sensors.danger.up) return 'up';
    if (!state.sensors.danger.right) return 'right';
    if (!state.sensors.danger.down) return 'down';
    if (!state.sensors.danger.left) return 'left';
    
    // If all directions are dangerous, just continue in current direction
    if (direction === DIRECTIONS.UP) return 'up';
    if (direction === DIRECTIONS.RIGHT) return 'right';
    if (direction === DIRECTIONS.DOWN) return 'down';
    if (direction === DIRECTIONS.LEFT) return 'left';
    
    return 'right'; // Default
}

// Export functions for external use (e.g., by the genetic algorithm)
window.snakeGame = {
    getSnakeState: getSnakeState,
    applyAction: applyAction,
    step: gameStep,
    reset: resetGame
};