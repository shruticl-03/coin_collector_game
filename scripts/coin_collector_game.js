const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const highScoreDisplay = document.getElementById('high-score');
const easyButton = document.getElementById('easy');
const mediumButton = document.getElementById('medium');
const hardButton = document.getElementById('hard');
const startButton = document.getElementById('start-button');

let score = 0;
let coins = [];
let coinSpeed = 5; // Default speed for coins
let coinSpawnRate = 0.02; // Default spawn rate for coins
let timeRemaining = 60; // Timer set to 60 seconds
let timerInterval;
let isGameActive = false;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
highScoreDisplay.textContent = `High Score: ${highScore}`;

// Set up player movement
const playerWidth = 100;
const gameAreaWidth = gameArea.clientWidth;

document.addEventListener('mousemove', (event) => {
    if (!isGameActive) return;

    const rect = gameArea.getBoundingClientRect();
    let x = event.clientX - rect.left - playerWidth / 2;

    if (x < 0) x = 0;
    if (x > gameAreaWidth - playerWidth) x = gameAreaWidth - playerWidth;

    player.style.left = `${x}px`;
});

// Function to create a coin
function createCoin() {
    const coin = document.createElement('div');
    coin.classList.add('coin');
    coin.style.left = `${Math.random() * (gameArea.clientWidth - 40)}px`;
    coin.style.top = `-40px`;
    gameArea.appendChild(coin);
    coins.push(coin);
}

// Update coin positions
function updateCoins() {
    coins.forEach((coin, index) => {
        let coinTop = parseFloat(coin.style.top);
        coinTop += coinSpeed;
        coin.style.top = `${coinTop}px`;

        // Check for collision with player
        const coinRect = coin.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (
            coinRect.top < playerRect.bottom &&
            coinRect.bottom > playerRect.top &&
            coinRect.left < playerRect.right &&
            coinRect.right > playerRect.left
        ) {
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            coin.remove();
            coins.splice(index, 1);
        } else if (coinTop > gameArea.clientHeight) {
            // Remove coin if it goes off the screen
            coin.remove();
            coins.splice(index, 1);
        }
    });
}

// Game loop
function gameLoop() {
    if (!isGameActive) return;

    if (Math.random() < coinSpawnRate) {
        createCoin();
    }

    updateCoins();
    requestAnimationFrame(gameLoop);
}

// Timer countdown
function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = `Time: ${timeRemaining}`;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

// End game logic
function endGame() {
    isGameActive = false;

    // Update high score if the current score is greater
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = `High Score: ${highScore}`;

        // Save the new high score in localStorage
        localStorage.setItem('highScore', highScore);
    }

    alert(`Time's up! Your score is ${score}`);

    // Reset game state
    coins.forEach(coin => coin.remove());
    coins = [];
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    timeRemaining = 60;
    timerDisplay.textContent = `Time: ${timeRemaining}`;
    startButton.style.display = 'block';
}

// Start game logic
startButton.addEventListener('click', () => {
    // Check if a difficulty has been selected
    if (!easyButton.classList.contains('selected') &&
        !mediumButton.classList.contains('selected') &&
        !hardButton.classList.contains('selected')) {
        alert("Please select the level!");
        return; // Stop the game from starting if no level is selected
    }

    isGameActive = true;
    startButton.style.display = 'none';
    startTimer();
    gameLoop();
});

// Difficulty settings
function highlightButton(button) {
    // Remove selected class from all buttons
    easyButton.classList.remove('selected');
    mediumButton.classList.remove('selected');
    hardButton.classList.remove('selected');

    // Add selected class to the clicked button
    button.classList.add('selected');
}

easyButton.addEventListener('click', () => {
    if (!isGameActive) {
        coinSpeed = 3;
        coinSpawnRate = 0.01;
        highlightButton(easyButton);
    }
});

mediumButton.addEventListener('click', () => {
    if (!isGameActive) {
        coinSpeed = 5;
        coinSpawnRate = 0.02;
        highlightButton(mediumButton);
    }
});

hardButton.addEventListener('click', () => {
    if (!isGameActive) {
        coinSpeed = 8;
        coinSpawnRate = 0.05;
        highlightButton(hardButton);
    }
});