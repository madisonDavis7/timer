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
const glitterBtn = document.querySelector('.glitter-opt');

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
        'night-theme',
        'glitter-theme'
    );

    // Hide the PIXI canvas when switching themes
    const pixiCanvas = document.querySelector('canvas');
    if (pixiCanvas) {
        pixiCanvas.style.display = 'none';
    }

    // Only hide stars if we're not switching TO night theme
    if (!document.body.classList.contains('night-theme')) {
        document.querySelector('.star-container').style.display = 'none';
    }
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
glitterBtn.addEventListener('click', () => {
    removeAllThemes();
    document.body.classList.add('glitter-theme');

    // Show the PIXI canvas
    const pixiCanvas = document.querySelector('canvas');
    if (pixiCanvas) {
        pixiCanvas.style.position = 'fixed';
        pixiCanvas.style.top = '0';
        pixiCanvas.style.left = '0';
        pixiCanvas.style.width = '100%';
        pixiCanvas.style.height = '100%';
        pixiCanvas.style.zIndex = '0';
        pixiCanvas.style.display = 'block';
    }
});

nightBtn.addEventListener('click', () => {
    removeAllThemes();
    document.body.classList.add('night-theme');
    const starContainer = document.querySelector('.star-container');
    if (starContainer) {
        starContainer.style.display = 'block';
        console.log('Star container displayed'); // Debug log
    }
    createShootingStar(); // Create one immediately
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

function createShootingStar() {
    const star = document.createElement('div');
    star.className = 'shooting-star';

    // Random starting position
    const randomTop = Math.random() * 100; // Top 30% of screen
    const randomRight = Math.random() * 100; // Right 20% of screen

    star.style.top = `${randomTop}%`;
    star.style.right = `${randomRight}%`;

    const starContainer = document.querySelector('.star-container');
    if (!starContainer) {
        console.error('Star container not found!');
        return;
    }

    starContainer.appendChild(star);

    // Remove the star after animation completes
    setTimeout(() => {
        star.remove();
    }, 3000);
}

function createShootingStars() {
    // Generate random number between 1 and 4
    const numberOfStars = Math.floor(Math.random() * 4) + 1;

    // Create multiple stars
    for (let i = 0; i < numberOfStars; i++) {
        createShootingStar();
    }
}

function startShootingStars() {
    setInterval(() => {
        if (document.body.classList.contains('night-theme')) {
            createShootingStars();  // Create multiple stars instead of just one
        }
    }, 5000); // Every 5 seconds
}

startShootingStars();

document.addEventListener('DOMContentLoaded', () => {
    const iconContainer = document.querySelector('.icons-container');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const icons = document.querySelectorAll('.icon');
    const iconWidth = 4.5; // 4rem icon width + 0.5rem gap
    let currentPosition = 0;

    // Initially hide all icons after the first 5
    icons.forEach((icon, index) => {
        if (index >= 5) {
            icon.style.display = 'none';
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPosition < icons.length - 5) {
            // Hide the leftmost visible icon
            icons[currentPosition].style.display = 'none';
            // Show the next icon on the right
            icons[currentPosition + 5].style.display = 'flex';
            currentPosition++;
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentPosition > 0) {
            // Show the previous hidden icon on the left
            icons[currentPosition - 1].style.display = 'flex';
            // Hide the rightmost visible icon
            icons[currentPosition + 4].style.display = 'none';
            currentPosition--;
        }
    });
});