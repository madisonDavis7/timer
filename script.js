const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');

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
    if (isRunning) {
        clearInterval(timerInterval);
        startButton.textContent = 'Start';
        isRunning = false;
        minutesInput.disabled = false;
        secondsInput.disabled = false;
        return;
    }

    let minutes = parseInt(minutesInput.value) || 0;
    let seconds = parseInt(secondsInput.value) || 0;
    let totalSeconds = (minutes * 60) + seconds;

    if (totalSeconds <= 0) return;

    startButton.textContent = 'Pause';
    isRunning = true;

    minutesInput.disabled = true;
    secondsInput.disabled = true;

    timerInterval = setInterval(() => {
        totalSeconds--;

        if (totalSeconds < 0) {
            clearInterval(timerInterval);
            startButton.textContent = 'Start';
            isRunning = false;
            minutesInput.disabled = false;
            secondsInput.disabled = false;
            minutesInput.value = '00';
            secondsInput.value = '00';
            alert('Time is up!');
            return;
        }

        const displayMinutes = Math.floor(totalSeconds / 60);
        const displaySeconds = totalSeconds % 60;

        minutesInput.value = padNumber(displayMinutes);
        secondsInput.value = padNumber(displaySeconds);
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    minutesInput.value = '00';
    secondsInput.value = '00';
    startButton.textContent = 'Start';
    isRunning = false;
    minutesInput.disabled = false;
    secondsInput.disabled = false;
}

// Add event listeners
minutesInput.addEventListener('input', (e) => validateInput(e.target));
secondsInput.addEventListener('input', (e) => validateInput(e.target));
startButton.addEventListener('click', startTimer);
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
