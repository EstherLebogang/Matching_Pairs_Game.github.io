const emojiThemes = {
  Animals: ['🐶','🐱','🐰','🦊','🐼','🐵','🐸','🐷'],
  Fruits:  ['🍎','🍌','🍇','🍓','🥝','🍒','🍍','🍉'],
  Flags:   ['🇺🇸','🇬🇧','🇿🇦','🇯🇵','🇨🇳','🇫🇷','🇧🇷','🇩🇪'],
  Sports:  ['⚽','🏀','🏈','⚾','🎾','🏐','🥊','🎳']
};

let flippedCards = [];
let matchedCount = 0;
let moveCount = 0;
let lockBoard = false;
let currentDifficulty = 'Medium';
let currentTheme = 'Flags';

const board = document.getElementById('game-board');
const diffSelect = document.getElementById('difficulty');
const themeSelect = document.getElementById('icon-set');
const movesSpan = document.getElementById('move-count');
const matchSpan = document.getElementById('match-count');
const newBtn = document.getElementById('new-game');
const resetBtn = document.getElementById('reset-game');
const victoryMsg = document.getElementById('victory-message');

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function createCard(symbol) {
  const card = document.createElement('div');
  card.className = 'card';

  const inner = document.createElement('div');
  inner.className = 'card-inner';

  const front = document.createElement('div');
  front.className = 'card-front';
  front.textContent = symbol;

  const back = document.createElement('div');
  back.className = 'card-back';
  back.textContent = '❓';

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  card.dataset.symbol = symbol;
  card.addEventListener('click', () => handleCardClick(card));

  return card;
}

function initializeGame() {
  victoryMsg.classList.add('hidden');
  board.innerHTML = '';
  moveCount = 0;
  matchedCount = 0;
  flippedCards = [];
  lockBoard = false;

  const fullSet = emojiThemes[currentTheme];
  const pairCount = currentDifficulty === 'Easy' ? 4 : currentDifficulty === 'Medium' ? 6 : 8;
  const emojis = fullSet.slice(0, pairCount);
  const pairs = shuffle([...emojis, ...emojis]);

  pairs.forEach(symbol => board.appendChild(createCard(symbol)));

  const columns = Math.ceil(Math.sqrt(pairs.length));
  board.style.gridTemplateColumns = `repeat(${columns}, minmax(80px, 1fr))`;

  movesSpan.textContent = '0';
  matchSpan.textContent = `0/${pairCount}`;
}

function handleCardClick(card) {
  if (lockBoard || card.classList.contains('flipped')) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    lockBoard = true;
    moveCount++;
    movesSpan.textContent = moveCount;

    const [first, second] = flippedCards;

    if (first.dataset.symbol === second.dataset.symbol) {
      matchedCount++;
      matchSpan.textContent = `${matchedCount}/${(currentDifficulty === 'Easy' ? 4 : currentDifficulty === 'Medium' ? 6 : 8)}`;
      flippedCards = [];
      lockBoard = false;

      if (matchedCount === (currentDifficulty === 'Easy' ? 4 : currentDifficulty === 'Medium' ? 6 : 8)) {
        showVictory();
      }
    } else {
      setTimeout(() => {
        first.classList.remove('flipped');
        second.classList.remove('flipped');
        flippedCards = [];
        lockBoard = false;
      }, 800);
    }
  }
}

function showVictory() {
  victoryMsg.classList.remove('hidden');
  confetti({
    particleCount: 150,
    spread: 90,
    origin: { y: 0.6 }
  });
}

diffSelect.addEventListener('change', e => {
  currentDifficulty = e.target.value;
  initializeGame();
});

themeSelect.addEventListener('change', e => {
  currentTheme = e.target.value;
  initializeGame();
});

newBtn.addEventListener('click', initializeGame);

resetBtn.addEventListener('click', () => {
  document.querySelectorAll('.card').forEach(c => c.classList.remove('flipped'));
  flippedCards = [];
  matchedCount = 0;
  moveCount = 0;
  movesSpan.textContent = '0';
  matchSpan.textContent = `0/${(currentDifficulty === 'Easy' ? 4 : currentDifficulty === 'Medium' ? 6 : 8)}`;
  victoryMsg.classList.add('hidden');
});

initializeGame();
