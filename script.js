const nbDrop = 858;
let timerInterval;
let isRunning = false;

document.addEventListener('DOMContentLoaded', () => {
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


    function padNumber(number) {
        return number.toString().padStart(2, '0');
    }

    function validateInput(input) {
        let value = input.value;
        value = value.replace(/[^\d]/g, '');
        value = value.slice(-2);
        value = parseInt(value) || 0;
        if (value > 59) value = 59;
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

    // THEME BUTTONS
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
            const starContainer = document.querySelector('.star-container');
            if (starContainer) {
                starContainer.style.display = 'none';
            }
        }

        // Hide rain effect unless we are switching to rain theme
        const rainDiv = document.querySelector('.rain');
        if (rainDiv && !document.body.classList.contains('rain-theme')) {
            rainDiv.style.display = 'none';
        }
    }

    cloudBtn.addEventListener('click', () => {
        removeAllThemes();
        document.body.classList.add('cloud-theme');
    });

    rainBtn.addEventListener('click', () => {
        removeAllThemes();
        document.body.classList.add('rain-theme');
        createRain();
        const rainDiv = document.querySelector('.rain');
        if (rainDiv) {
            rainDiv.style.display = 'block';
        }
        // Make sure the other theme icons are visible
        const themeIcons = document.querySelectorAll('.icon');
        themeIcons.forEach(icon => icon.style.display = 'flex');
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
        createShootingStar();
    });

    // ICON SLIDER
    const iconContainer = document.querySelector('.icons-container');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const icons = document.querySelectorAll('.icon');
    let currentPosition = 0;

    // Initially hide all icons after the first 5
    icons.forEach((icon, index) => {
        if (index >= 5) {
            icon.style.display = 'none';
        }
    });

    function getVisibleIconCount() {
        const container = document.querySelector('.icons-container');
        const icon = container.querySelector('.icon');
        if (!icon) return 1;
        const iconStyle = window.getComputedStyle(icon);
        const iconWidth = icon.offsetWidth +
            parseFloat(iconStyle.marginLeft) +
            parseFloat(iconStyle.marginRight);
        const containerWidth = container.offsetWidth;
        return Math.floor(containerWidth / iconWidth);
    }

    function updateIconsContainerWidth() {
        const container = document.querySelector('.icons-container');
        const icons = container.querySelectorAll('.icon');
        if (!icons.length) return;
        // Temporarily show the first icon to measure it
        icons[0].style.display = 'flex';
        // Force reflow
        void icons[0].offsetWidth;
        const iconStyle = window.getComputedStyle(icons[0]);
        const iconWidth = icons[0].offsetWidth +
            parseFloat(iconStyle.marginLeft) +
            parseFloat(iconStyle.marginRight);
        const screenWidth = window.innerWidth;
        let iconsPerRow = 5;
        if (screenWidth < 600) {
            iconsPerRow = 2;
        } else if (screenWidth < 900) {
            iconsPerRow = 4;
        }
        container.style.width = (iconWidth * iconsPerRow) + "px";
    }

    function updateVisibleIcons(startIndex = 0) {
        const icons = document.querySelectorAll('.icons-container .icon');
        const visibleCount = getVisibleIconCount();
        icons.forEach((icon, i) => {
            icon.style.display = (i >= startIndex && i < startIndex + visibleCount) ? 'flex' : 'none';
        });
        // Store current index if needed for arrow navigation
        window.currentIconIndex = startIndex;
    }

    // Arrow button event listeners:
    document.querySelector('.next-btn').addEventListener('click', () => {
        const icons = document.querySelectorAll('.icons-container .icon');
        const visibleCount = getVisibleIconCount();
        let startIndex = window.currentIconIndex || 0;
        if (startIndex + visibleCount < icons.length) {
            updateVisibleIcons(startIndex + 1);
        }
    });
    document.querySelector('.prev-btn').addEventListener('click', () => {
        let startIndex = window.currentIconIndex || 0;
        if (startIndex > 0) {
            updateVisibleIcons(startIndex - 1);
        }
    });

    // On window resize, update visible icons:
    window.addEventListener('resize', () => {
        updateIconsContainerWidth();
        updateVisibleIcons(window.currentIconIndex || 0);
    });

    // On page load:
    updateIconsContainerWidth();
    updateVisibleIcons(0);

    // STAR EFFECTS
    function createStars() {
        let starContainer = document.querySelector('.star-container');
        if (!starContainer) {
            starContainer = document.createElement('div');
            starContainer.className = 'star-container';
            document.body.appendChild(starContainer);
        }
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
        starContainer.style.display = 'none';
    }
    createStars();

    function createShootingStar() {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        const randomTop = Math.random() * 100;
        const randomRight = Math.random() * 100;
        star.style.top = `${randomTop}%`;
        star.style.right = `${randomRight}%`;
        const starContainer = document.querySelector('.star-container');
        if (!starContainer) {
            console.error('Star container not found!');
            return;
        }
        starContainer.appendChild(star);
        setTimeout(() => {
            star.remove();
        }, 3000);
    }

    function createShootingStars() {
        const numberOfStars = Math.floor(Math.random() * 4) + 1;
        for (let i = 0; i < numberOfStars; i++) {
            createShootingStar();
        }
    }

    function startShootingStars() {
        setInterval(() => {
            if (document.body.classList.contains('night-theme')) {
                createShootingStars();
            }
        }, 5000);
    }
    startShootingStars();

    // RAIN EFFECT
    function randRange(minNum, maxNum) {
        return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    }
    function createRain() {
        let rainDiv = document.querySelector('.rain');
        if (!rainDiv) {
            rainDiv = document.createElement('div');
            rainDiv.classList.add('rain');
            document.body.appendChild(rainDiv);
        }
        rainDiv.innerHTML = '';
        for (let i = 0; i < nbDrop; i++) {
            const dropLeft = randRange(0, window.innerWidth);
            const dropTop = randRange(-1000, window.innerHeight);
            const drop = document.createElement('div');
            drop.classList.add('drop');
            drop.style.left = `${dropLeft}px`;
            drop.style.top = `${dropTop}px`;
            rainDiv.appendChild(drop);
        }
    }
});