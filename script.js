// Constant variables
const POMODORO_TIME = 60 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 10 * 60;

// Global variables
let timeLeft = POMODORO_TIME; // seconds
let timerInterval;
let currentInterval = 'pomodoro';
let pomodoroCount = 0;
let endTime = null;
let backgroundColor = '#F1F1EF'; // Default background color
let fontColor = '#37352F'; // Default font color

// DOM elements
const timeLeftEl = document.getElementById('time-left');
const startStopBtn = document.getElementById('start-stop-btn');
const resetBtn = document.getElementById('reset-btn');
const pomodoroIntervalBtn = document.getElementById('pomodoro-interval-btn');
const shortBreakIntervalBtn = document.getElementById('short-break-interval-btn');
const longBreakIntervalBtn = document.getElementById('long-break-interval-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeModalBtn = document.querySelector('.close-btn');
const backgroundColorSelect = document.getElementById('background-color');
const fontColorSelect = document.getElementById('font-color');
const saveBtn = document.getElementById('save-btn');

// Event listeners for interval buttons
pomodoroIntervalBtn.addEventListener('click', () => {
  currentInterval = 'pomodoro';
  pomodoroCount = 0;
  timeLeft = POMODORO_TIME;
  updateTimeLeftTextContent();
});

shortBreakIntervalBtn.addEventListener('click', () => {
  currentInterval = 'short-break';
  timeLeft = SHORT_BREAK_TIME;
  updateTimeLeftTextContent();
});

longBreakIntervalBtn.addEventListener('click', () => {
  currentInterval = 'long-break';
  timeLeft = LONG_BREAK_TIME;
  updateTimeLeftTextContent();
});

// Event listener for start/stop button
startStopBtn.addEventListener('click', () => {
  if (startStopBtn.textContent === 'Start') {
    startTimer();
    startStopBtn.textContent = 'Stop';
  } else {
    stopTimer();
  }
});

// Event listener for reset button
resetBtn.addEventListener('click', () => {
  stopTimer();
  if (currentInterval === 'pomodoro') {
    timeLeft = POMODORO_TIME;
  } else if (currentInterval === 'short-break') {
    timeLeft = SHORT_BREAK_TIME;
  } else {
    timeLeft = LONG_BREAK_TIME;
  }
  updateTimeLeftTextContent();
  startStopBtn.textContent = 'Start';
});

// Event listener for settings button
settingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'flex';
});

// Event listener for close button in the settings modal
closeModalBtn.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

// Event listener for save button in the settings modal
saveBtn.addEventListener('click', () => {
  const newBackgroundColor = backgroundColorSelect.value;
  const newFontColor = fontColorSelect.value;

  // Save preferences to localStorage
  localStorage.setItem('backgroundColor', newBackgroundColor);
  localStorage.setItem('fontColor', newFontColor);

  // Apply the new saved preferences
  applyUserPreferences();

  // Close the modal after saving preferences
  settingsModal.style.display = 'none';
});

// Function to show notifications
function showNotification(title, body) {
  if (
    document.visibilityState === 'hidden' &&
    "Notification" in window && 
    Notification.permission === "granted"
  ) {
    new Notification(title, {
      body: body,
      icon: "favicon.ico" // optional
    });
  }
}

// Function to start the timer
function startTimer() {
  endTime = Date.now() + timeLeft * 1000;
  
  timerInterval = setInterval(() => {
    const remaining = Math.ceil((endTime - Date.now()) / 1000);
    
    timeLeft = Math.max(0, remaining);
    updateTimeLeftTextContent();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);

      if (currentInterval === 'pomodoro') {

        pomodoroCount++;

        if (pomodoroCount % 2 === 1) {
          showNotification('🎉 Pomodoro Finished!','Time for a short break.');

          timeLeft = SHORT_BREAK_TIME;
          currentInterval = 'short-break';
          
        } else {
          showNotification('🎉 Pomodoro Finished!','Time for a long break ☕');

          timeLeft = LONG_BREAK_TIME;
          currentInterval = 'long-break';
        }

        updateTimeLeftTextContent();
        startTimer();

      } else {
        showNotification('🎉 Break Finished!','Time for another Pomodoro 🚀');

        timeLeft = POMODORO_TIME;
        currentInterval = 'pomodoro';
        
        updateTimeLeftTextContent();
        startTimer();
      }
    }
  }, 250); // check 4 times/sec for accuracy
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timerInterval);
  startStopBtn.textContent = 'Start';
}

// Function to update the time left text content
function updateTimeLeftTextContent() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeLeftEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to apply the user's saved preferences
function applyUserPreferences() {
  // Retrieve user preferences from localStorage
  const savedBackgroundColor = localStorage.getItem('backgroundColor');
  const savedFontColor = localStorage.getItem('fontColor');

  // Apply the preferences if they exist in localStorage
  if (savedBackgroundColor) {
    backgroundColor = savedBackgroundColor;
  }

  if (savedFontColor) {
    fontColor = savedFontColor;
  }

  // Apply the preferences to the Pomodoro Timer widget
  document.body.style.backgroundColor = backgroundColor;
  document.body.style.color = fontColor;
  timeLeftEl.style.color = fontColor;
  // Update the buttons' font and background color
  const buttons = document.querySelectorAll('.interval-btn, #start-stop-btn, #reset-btn, #settings-btn');
  buttons.forEach((button) => {
    button.style.color = fontColor;
    button.style.backgroundColor = backgroundColor;
    button.style.borderColor = fontColor;
  });
}

// Request notification permission
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Apply user preferences on page load
applyUserPreferences();
updateTimeLeftTextContent();
