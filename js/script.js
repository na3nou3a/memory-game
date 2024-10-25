// =========================VARIABLES============================
const gridSizeBtns = document.querySelectorAll('.size-btn');
const playground = document.querySelector('.playground');
const modalBtn = document.querySelector('.modal-btn');
const restartBtn = document.querySelector('.restart-btn');
const timer = document.querySelector('.timer');
const minutesEl = timer.querySelector('.minutes');
const secondsEl = timer.querySelector('.seconds');

let gridSize = 16;
let correctPoints = 0;
let wrongPoints = 0;
let indices = [];
let isFirstClick = true;
let prevCard = null;
let intervalId = null;

// =========================EVENTS============================
window.addEventListener('load', playGame);
gridSizeBtns.forEach((btn) => btn.addEventListener('click', changeGridSize));
modalBtn.addEventListener('click', () => {
  hideModal();
  playGame();
});
restartBtn.addEventListener('click', playGame);

// =========================FUNCTIONS============================
function playGame() {
  stopTime();
  correctPoints = 0;
  wrongPoints = 0;
  isFirstClick = true;
  prevCard = null;
  resetHtmlTimer();
  createIndices();
  createCards();
  updatePlaygroundStyles();
  addEventsToCards();
  setTime();
}

function createCards() {
  const indices = shuffleIndices();
  playground.innerHTML = '';
  for (let i = 0; i < indices.length; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-index', indices[i] + 1);
    const icon = document.createElement('img');
    icon.className = 'icon';
    icon.src = `images/icon-${indices[i] + 1}.png`;
    card.appendChild(icon);
    playground.appendChild(card);
  }
}
function updatePlaygroundStyles() {
  const cells = Math.sqrt(gridSize);
  playground.style.gridTemplateColumns = `repeat(${cells}, 1fr)`;
  playground.style.gridTemplateRows = `repeat(${cells}, 1fr)`;
}
function addEventsToCards() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => card.addEventListener('click', handleClickCardEvent));
}
function disableCardClick(card) {
  card.removeEventListener('click', handleClickCardEvent);
}
function enableCardClick(card) {
  card.addEventListener('click', handleClickCardEvent);
}
function disableAllCardsClick() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => card.removeEventListener('click', handleClickCardEvent));
}
function handleClickCardEvent(e) {
  const card = e.currentTarget;
  card.classList.add('clicked');
  if (isFirstClick) {
    // console.log('first click');
    disableCardClick(card);
    prevCard = card;
    isFirstClick = !isFirstClick;
    return;
  }
  isFirstClick = !isFirstClick;
  disableAllCardsClick();
  if (card.dataset.index === prevCard.dataset.index) {
    // console.log('second click: correct');
    correctPoints++;
    let timeOutId = setTimeout(() => {
      addEventsToCards();
      disableCardClick(card);
      disableCardClick(prevCard);
      clearTimeout(timeOutId);
    }, 700);
    if (correctPoints === gridSize / 2) {
      gameOver();
      return;
    }
  } else {
    // console.log('second click: wrong');
    wrongPoints++;
    let timeOutId = setTimeout(() => {
      prevCard.classList.remove('clicked');
      card.classList.remove('clicked');
      addEventsToCards();
      clearTimeout(timeOutId);
    }, 700);
  }
}
function setTime() {
  let int = 1;
  intervalId = setInterval(() => {
    const seconds = int % 60;
    const minutes = Math.floor(int / 60);
    minutesEl.textContent = minutes > 9 ? minutes : `0${minutes}`;
    secondsEl.textContent = seconds > 9 ? seconds : `0${seconds}`;
    int++;
  }, 1000);
}
function stopTime() {
  clearInterval(intervalId);
}
function resetHtmlTimer() {
  minutesEl.textContent = '00';
  secondsEl.textContent = '00';
}
function gameOver() {
  stopTime();
  const modalTime = document.querySelector('.modal-time');
  const wrongAttempts = document.querySelector('.wrong');
  modalTime.innerHTML = `Time Spent: <span>${minutesEl.textContent}</span>min <span>${secondsEl.textContent}</span>sec`;
  wrongAttempts.textContent = wrongPoints;
  showModal();
}
function showModal() {
  const modal = document.querySelector('.modal');
  modal.classList.add('active');
}
function hideModal() {
  const modal = document.querySelector('.modal');
  modal.classList.remove('active');
}
function createIndices() {
  indices = [];
  const halfGridSize = gridSize / 2;
  for (let i = 0; i < halfGridSize; i++) {
    indices.push(i);
  }
  for (let i = halfGridSize; i > 0; i--) {
    indices.push(i - 1);
  }
}
function shuffleIndices() {
  return [...indices].sort(() => Math.random() - 0.5);
}
function changeGridSize(e) {
  const activeBtn = document.querySelector('.size-btn.active');
  const newActiveBtn = e.target;
  activeBtn.classList.remove('active');
  newActiveBtn.classList.add('active');
  gridSize = Number(newActiveBtn.textContent);
  playGame();
}
