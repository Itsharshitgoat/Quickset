const { ipcRenderer, shell } = require('electron');

// Timer state variables
let timerInterval = null;
let timeLeft = 0;
let totalTime = 0;

// DOM elements
const timeDisplay = document.querySelector('.time-remaining');
const timerDisplay = document.querySelector('.timer-display');
const startPauseBtn = document.querySelector('.start-pause');
const cancelBtn = document.querySelector('.cancel');
const presetButtons = document.querySelectorAll('.preset-btn');
const container = document.querySelector('.container');
const closeBtn = document.querySelector('.close-btn');
const aboutBtn = document.querySelector('.about-btn');

// Audio for button click sound
const clickSound = new Audio('assets/click.mp3');
// Audio for timer completion sound
const timerEndSound = new Audio('assets/sound.mp3');

// Play click sound function
function playClickSound() {
  clickSound.currentTime = 0; // Reset to start for rapid clicks
  clickSound.play().catch(error => {
    console.error('Error playing click sound:', error);
  });
}

// Play timer end sound function
function playTimerEndSound() {
  timerEndSound.currentTime = 0; // Reset to start
  timerEndSound.play().catch(error => {
    console.error('Error playing timer end sound:', error);
  });
}

// Format time as MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

// Create confetti effect on timer completion
function createConfetti() {
  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.width = '8px';
    confetti.style.height = '8px';
    confetti.style.background = ['#ff6b6b', '#c084fc', '#fb923c', '#2dd4bf'][Math.floor(Math.random() * 4)];
    confetti.style.borderRadius = '50%';
    const randomX = Math.random() * 350;
    const safeX = Math.min(Math.max(randomX, 10), 340); // Ensure confetti stays within container
    confetti.style.left = `${safeX}px`;
    confetti.style.top = '0';
    confetti.style.animation = `confetti 1.5s ease-out`;
    container.appendChild(confetti);
    setTimeout(() => confetti.remove(), 1500);
  }
}

// Show timer display with fade-in
function showTimer(seconds) {
  timeLeft = seconds;
  totalTime = seconds;
  timeDisplay.textContent = formatTime(seconds);
  timerDisplay.style.display = 'flex';
  setTimeout(() => timerDisplay.classList.add('visible'), 10); // Small delay to trigger transition
  startPauseBtn.textContent = 'Start'; // Set button text to Start
  container.classList.remove('timer-running');
}

// Start or pause the timer
function toggleTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    startPauseBtn.textContent = 'Start'; // Set button text to Start
    container.classList.remove('timer-running');
  } else if (timeLeft > 0) {
    timerInterval = setInterval(() => {
      timeLeft--;
      timeDisplay.textContent = formatTime(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        startPauseBtn.textContent = 'Start'; // Set button text to Start
        container.classList.remove('timer-running');
        timerDisplay.classList.remove('visible');
        setTimeout(() => {
          timerDisplay.style.display = 'none';
        }, 500); // Match fade-out duration
        createConfetti();
        playTimerEndSound(); // Play sound when timer finishes
      }
    }, 1000);
    startPauseBtn.textContent = 'Pause'; // Set button text to Pause
    container.classList.add('timer-running');
  }
}

// Cancel and reset the timer
function cancelTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timeLeft = 0;
  totalTime = 0;
  timeDisplay.textContent = '00:00';
  startPauseBtn.textContent = 'Start'; // Set button text to Start
  container.classList.remove('timer-running');
  timerDisplay.classList.remove('visible');
  setTimeout(() => {
    timerDisplay.style.display = 'none';
  }, 500); // Match fade-out duration
  presetButtons.forEach(btn => btn.classList.remove('active'));
}

// Set timer from preset buttons
presetButtons.forEach(button => {
  button.addEventListener('click', () => {
    playClickSound(); // Play sound on click
    presetButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const seconds = parseInt(button.dataset.time);
    showTimer(seconds);
  });
});

// Open About Creator link in default browser
aboutBtn.addEventListener('click', () => {
  playClickSound(); // Play sound on click
  shell.openExternal('https://itsharshitgoat.github.io/Website/');
});

// Close the app
closeBtn.addEventListener('click', () => {
  playClickSound(); // Play sound on click
  ipcRenderer.send('close-app');
});

// Event listeners for timer controls
startPauseBtn.addEventListener('click', () => {
  playClickSound(); // Play sound on click
  toggleTimer();
});

cancelBtn.addEventListener('click', () => {
  playClickSound(); // Play sound on click
  cancelTimer();
});