// script.js
const gameBoard = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const restartButton = document.getElementById('restartButton');

let cardValues = ['🍎', '🍌', '🍇', '🍒', '🍉', '🍓', '🍍', '🥝'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let timer = 0;
let intervalId;

// Initialize the game
function initGame() {
  cardValues = [...cardValues, ...cardValues];
  cardValues.sort(() => 0.5 - Math.random());

  gameBoard.innerHTML = '';
  cards = cardValues.map((value, index) => createCard(value, index));
  gameBoard.append(...cards);
  score = 0;
  matchedPairs = 0;
  timer = 0;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timer;
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    timer++;
    timerDisplay.textContent = timer;
  }, 1000);
}

function createCard(value, id) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.value = value;
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front"></div>
      <div class="card-back">${value}</div>
    </div>
  `;
  card.addEventListener('click', () => flipCard(card));
  return card;
}

function flipCard(card) {
  if (card.classList.contains('flipped') || flippedCards.length === 2) return;
  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const isMatch = card1.dataset.value === card2.dataset.value;
  if (isMatch) {
    matchedPairs++;
    score += 10;
    scoreDisplay.textContent = score;
    if (matchedPairs === cardValues.length / 2) {
      endGame();
    }
    flippedCards = [];
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
    }, 1000);
  }
}

function endGame() {
  clearInterval(intervalId);
  const bestScore = localStorage.getItem('bestScore');
  if (!bestScore || score > parseInt(bestScore, 10)) {
    localStorage.setItem('bestScore', score);
    alert(`New High Score: ${score}!`);
  } else {
    alert(`Game Over! Your score: ${score}`);
  }
}

restartButton.addEventListener('click', initGame);

window.addEventListener('load', initGame);
