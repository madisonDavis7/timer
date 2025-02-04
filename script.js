const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');

//themes
const cloudBtn = document.querySelector('.cloud-opt');
const rainBtn = document.querySelector('.rain-opt');
const pinkBtn = document.querySelector('.pink-opt');
const greenBtn = document.querySelector('.green-opt');
const nightBtn = document.querySelector('.night-opt');

let timerInterval;
let isRunning = false;


function padNumber(number) {
    return number.toString().padStart(2, '0');
}

function validateInput(input) {
    let value = input.value;

    // Remove any non-numeric characters
    value = value.replace(/[^\d]/g, '');

    // Always keep only the last two digits
    value = value.slice(-2);

    // Convert to number and validate range
    value = parseInt(value) || 0;
    if (value > 59) value = 59;

    // Add leading zero if needed
    input.value = padNumber(value);
}

function startTimer() {
    if (isRunning) return;

    let hours = parseInt(hoursInput.value) || 0;
    let minutes = parseInt(minutesInput.value) || 0;
    let seconds = parseInt(secondsInput.value) || 0;
    let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

    if (totalSeconds <= 0) return;

    isRunning = true;
    startButton.disabled = true;
    pauseButton.disabled = false;
    hoursInput.disabled = true;
    minutesInput.disabled = true;
    secondsInput.disabled = true;

    timerInterval = setInterval(() => {
        totalSeconds--;

        if (totalSeconds < 0) {
            clearInterval(timerInterval);
            isRunning = false;
            startButton.disabled = false;
            pauseButton.disabled = true;
            minutesInput.disabled = false;
            secondsInput.disabled = false;
            hoursInput.disabled = false;
            minutesInput.value = '00';
            secondsInput.value = '00';
            hoursInput.value = '00';
            alert('Time is up!');
            return;
        }

        const displayHours = Math.floor(totalSeconds / 3600);
        const remainingSeconds = totalSeconds % 3600;
        const displayMinutes = Math.floor(remainingSeconds / 60);
        const displaySeconds = remainingSeconds % 60;

        hoursInput.value = padNumber(displayHours);
        minutesInput.value = padNumber(displayMinutes);
        secondsInput.value = padNumber(displaySeconds);
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startButton.disabled = false;
    pauseButton.disabled = true;
}

function resetTimer() {
    clearInterval(timerInterval);
    hoursInput.value = '00';
    minutesInput.value = '00';
    secondsInput.value = '00';
    isRunning = false;
    startButton.disabled = false;
    pauseButton.disabled = true;
    hoursInput.disabled = false;
    minutesInput.disabled = false;
    secondsInput.disabled = false;
}

// Add event listeners
minutesInput.addEventListener('input', (e) => validateInput(e.target));
secondsInput.addEventListener('input', (e) => validateInput(e.target));
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

// Handle click to select all text
minutesInput.addEventListener('click', function () {
    this.select();
});
secondsInput.addEventListener('click', function () {
    this.select();
});

// Handle paste events
minutesInput.addEventListener('paste', (e) => {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    const numericOnly = pastedText.replace(/[^\d]/g, '').slice(-2);
    minutesInput.value = numericOnly;
    validateInput(minutesInput);
});

secondsInput.addEventListener('paste', (e) => {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    const numericOnly = pastedText.replace(/[^\d]/g, '').slice(-2);
    secondsInput.value = numericOnly;
    validateInput(secondsInput);
});

//section for themes/ backdrops based on button chosen
function removeAllThemes() {
    document.body.classList.remove(
        'cloud-theme',
        'rain-theme',
        'pink-theme',
        'green-theme',
        'night-theme'
    );
    // Hide stars when changing themes
    document.querySelector('.star-container').style.display = 'none';
}
//when clciked apply theme
cloudBtn.addEventListener('click', () => {
    removeAllThemes();
    document.body.classList.add('cloud-theme');
});

rainBtn.addEventListener('click', () => {
    removeAllThemes();
    document.body.classList.add('rain-theme');
});

pinkBtn.addEventListener('click', () => {
    removeAllThemes();
    document.body.classList.add('pink-theme');
});

greenBtn.addEventListener('click', () => {
    removeAllThemes();
    document.body.classList.add('green-theme');
});

nightBtn.addEventListener('click', () => {
    removeAllThemes();
    document.body.classList.add('night-theme');
    // Show stars only for night theme
    document.querySelector('.star-container').style.display = 'block';
});

// Modify the createStar function to add stars to a container div instead of body
function createStars() {
    // Create a container for stars
    const starContainer = document.createElement('div');
    starContainer.className = 'star-container';
    document.body.appendChild(starContainer);

    for (let i = 0; i < 1000; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.width = "5px";
        star.style.height = "5px";
        star.style.top = Math.random() * 100 + "%";
        star.style.left = Math.random() * 100 + "%";

        const duration = .5 + Math.random() * 8;
        const delay = Math.random() * 4;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `-${delay}s`;

        starContainer.appendChild(star);
    }
}

// Create stars once when page loads but hide them initially
createStars();