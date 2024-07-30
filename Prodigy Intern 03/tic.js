// Global variables
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let aiOpponent = false; // Variable to track game mode
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Function to handle user clicks on the game board
function handleCellClick(index) {
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        renderBoard();
        handleResultValidation();
        if (gameActive) {
            togglePlayer();
        }

        if (aiOpponent && currentPlayer === 'O' && gameActive) {
            // If AI's turn in AI opponent mode, make a move after a short delay
            setTimeout(() => {
                makeAIMove();
            }, 500);
        }
    }
}

// Function to toggle between players (X and O)
function togglePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('status-message').innerText = `It's Player ${currentPlayer}'s turn`;
}

// Function to render the game board
function renderBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.innerText = cell;
        cellElement.classList.add('cell');
        cellElement.addEventListener('click', () => handleCellClick(index));
        board.appendChild(cellElement);
    });
}

// Function to check for winning conditions after each move
function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        document.getElementById('status-message').innerText = `Player ${currentPlayer} has won!`;
        showModal(currentPlayer === 'X' ? 'Congratulations! You won!' : 'You lost!');
        return;
    }

    let roundDraw = !gameBoard.includes('');
    if (roundDraw) {
        gameActive = false;
        document.getElementById('status-message').innerText = "It's a draw!";
        showModal("It's a draw!");
        return;
    }
}

// Function to show the modal popup
function showModal(message) {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    modalMessage.innerText = message;
    modal.style.display = 'block';

    // Add event listener to the close button
    const closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });
}

// Event listener for clicks outside the modal to close it
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

// Function to make AI move
function makeAIMove() {
    if (!gameActive) return; // Ensure AI does not move if the game is inactive

    // Check for winning moves
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = currentPlayer;
            if (checkWinningMove()) {
                renderBoard();
                handleResultValidation();
                if (gameActive) {
                    togglePlayer();
                }
                return;
            }
            gameBoard[i] = '';
        }
    }

    // Check for opponent's winning moves and block them
    const opponent = currentPlayer === 'X' ? 'O' : 'X';
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = opponent;
            if (checkWinningMove()) {
                gameBoard[i] = currentPlayer;
                renderBoard();
                handleResultValidation();
                if (gameActive) {
                    togglePlayer();
                }
                return;
            }
            gameBoard[i] = '';
        }
    }

    // If no winning or blocking moves, choose a random empty cell
    const emptyCells = gameBoard.reduce((acc, cell, index) => {
        if (cell === '') {
            acc.push(index);
        }
        return acc;
    }, []);

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const moveIndex = emptyCells[randomIndex];
    gameBoard[moveIndex] = currentPlayer;
    renderBoard();
    handleResultValidation();
    if (gameActive) {
        togglePlayer();
    }
}

// Function to check for a winning move
function checkWinningMove() {
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return true;
        }
    }
    return false;
}

// Function to start a new game
function startNewGame(mode) {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    document.getElementById('status-message').innerText = `It's Player ${currentPlayer}'s turn`;
    renderBoard();

    // Update game logic based on selected mode
    aiOpponent = (mode === 'ai');
    document.getElementById('status-message').innerText += aiOpponent ? ' (AI Opponent)' : ' (Multiplayer)';
}

// Event listener for the "New Game (AI Opponent)" button
document.getElementById('new-game-btn').addEventListener('click', function() {
    startNewGame('ai');
});

// Event listener for the "Multiplayer" button
document.getElementById('multiplayer-mode-btn').addEventListener('click', function() {
    startNewGame('multiplayer');
});

// Initial rendering of the game board
renderBoard();
