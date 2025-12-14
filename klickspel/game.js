// Audio Context for sound effects
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Sound Effects using Web Audio API
const sounds = {
    click: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 800 + Math.random() * 200;
        osc.type = 'square';
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialDecayTo?.(0.01, audioCtx.currentTime + 0.05) || 
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    },
    
    countdown: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 440;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    },
    
    go: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 880;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
    },
    
    powerup: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    },
    
    obstacle: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    },
    
    victory: () => {
        if (!audioCtx) return;
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.3);
            }, i * 100);
        });
    },
    
    freeze: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
    },
    
    warning: () => {
        if (!audioCtx) return;
        // Urgent beeping sound
        [0, 150, 300].forEach(delay => {
            setTimeout(() => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.value = 600;
                osc.type = 'square';
                gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.1);
            }, delay);
        });
    },
    
    dodge: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
        osc.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    }
};

// Power-ups and Obstacles
const powerUpTypes = [
    { 
        id: 'double', 
        name: '2X CLICKS', 
        icon: '⚡', 
        color: '#ffff00',
        duration: 2000,
        effect: 'multiplier',
        value: 2
    },
    { 
        id: 'triple', 
        name: '3X CLICKS', 
        icon: '🔥', 
        color: '#ff6600',
        duration: 1500,
        effect: 'multiplier',
        value: 3
    },
    { 
        id: 'bonus', 
        name: '+10 CLICKS', 
        icon: '🎁', 
        color: '#00ff88',
        duration: 0,
        effect: 'bonus',
        value: 10
    },
    { 
        id: 'timefreeze', 
        name: 'TIME FREEZE', 
        icon: '⏸️', 
        color: '#00ffff',
        duration: 1500,
        effect: 'freeze',
        value: 0
    }
];

const obstacleTypes = [
    { 
        id: 'stun', 
        name: 'STUNNED!', 
        icon: '💫', 
        color: '#ff0080',
        duration: 1000,
        effect: 'stun',
        value: 0
    },
    { 
        id: 'reverse', 
        name: 'REVERSE!', 
        icon: '🔄', 
        color: '#ff0000',
        duration: 1500,
        effect: 'reverse',
        value: -1
    },
    { 
        id: 'half', 
        name: 'HALF CLICKS', 
        icon: '📉', 
        color: '#aa00ff',
        duration: 2000,
        effect: 'multiplier',
        value: 0.5
    },
    { 
        id: 'minus', 
        name: '-5 CLICKS', 
        icon: '💀', 
        color: '#880000',
        duration: 0,
        effect: 'penalty',
        value: -5
    }
];

// Game State
const state = {
    mode: null,
    isPlaying: false,
    timeLeft: 10,
    timeFrozen: false,
    soloScore: 0,
    p1Score: 0,
    p2Score: 0,
    highScore: parseInt(localStorage.getItem('klickspel-highscore')) || 0,
    timerInterval: null,
    eventInterval: null,
    lastMode: null,
    // Active effects
    soloMultiplier: 1,
    soloStunned: false,
    p1Multiplier: 1,
    p1Stunned: false,
    p2Multiplier: 1,
    p2Stunned: false,
    activeEffects: [],
    // Dodge system
    pendingObstacle: null, // { event, target, timeout }
    canDodge: { solo: false, p1: false, p2: false }
};

// DOM Elements
const screens = {
    menu: document.getElementById('menu-screen'),
    solo: document.getElementById('solo-screen'),
    versus: document.getElementById('versus-screen'),
    result: document.getElementById('result-screen')
};

const elements = {
    highScoreDisplay: document.getElementById('high-score-display'),
    soloTimer: document.getElementById('solo-timer'),
    soloTimerRing: document.getElementById('solo-timer-ring'),
    soloScore: document.getElementById('solo-score'),
    soloKey: document.getElementById('solo-key'),
    versusTimer: document.getElementById('versus-timer'),
    versusTimerRing: document.getElementById('versus-timer-ring'),
    p1Score: document.getElementById('p1-score'),
    p2Score: document.getElementById('p2-score'),
    p1Bar: document.getElementById('p1-bar'),
    p2Bar: document.getElementById('p2-bar'),
    countdownOverlay: document.getElementById('countdown-overlay'),
    countdownNumber: document.getElementById('countdown-number'),
    resultTitle: document.getElementById('result-title'),
    resultStats: document.getElementById('result-stats')
};

// Initialize
function init() {
    elements.highScoreDisplay.textContent = state.highScore;
    
    // Menu buttons - also init audio on first interaction
    document.getElementById('solo-btn').addEventListener('click', () => {
        initAudio();
        startGame('solo');
    });
    document.getElementById('versus-btn').addEventListener('click', () => {
        initAudio();
        startGame('versus');
    });
    
    // Back buttons
    document.getElementById('solo-back').addEventListener('click', goToMenu);
    document.getElementById('versus-back').addEventListener('click', goToMenu);
    
    // Result buttons
    document.getElementById('play-again').addEventListener('click', playAgain);
    document.getElementById('main-menu').addEventListener('click', goToMenu);
    
    // Key handlers
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

// Screen Management
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    screens[screenName].classList.remove('hidden');
}

function goToMenu() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    if (state.eventInterval) clearInterval(state.eventInterval);
    state.isPlaying = false;
    clearAllEffects();
    showScreen('menu');
}

// Game Flow
function startGame(mode) {
    state.mode = mode;
    state.lastMode = mode;
    resetScores();
    showScreen(mode);
    startCountdown();
}

function resetScores() {
    state.soloScore = 0;
    state.p1Score = 0;
    state.p2Score = 0;
    state.timeLeft = 10;
    state.timeFrozen = false;
    state.soloMultiplier = 1;
    state.soloStunned = false;
    state.p1Multiplier = 1;
    state.p1Stunned = false;
    state.p2Multiplier = 1;
    state.p2Stunned = false;
    
    elements.soloScore.textContent = '0';
    elements.p1Score.textContent = '0';
    elements.p2Score.textContent = '0';
    elements.p1Bar.style.width = '0%';
    elements.p2Bar.style.width = '0%';
    
    // Clear any existing event popups
    document.querySelectorAll('.event-popup').forEach(el => el.remove());
    document.querySelectorAll('.effect-indicator').forEach(el => el.remove());
    
    updateTimerDisplay();
}

function clearAllEffects() {
    state.activeEffects.forEach(effect => {
        if (effect.timeout) clearTimeout(effect.timeout);
    });
    state.activeEffects = [];
    state.canDodge = { solo: false, p1: false, p2: false };
    if (state.pendingObstacle) {
        clearTimeout(state.pendingObstacle.timeout);
        state.pendingObstacle = null;
    }
    document.querySelectorAll('.event-popup').forEach(el => el.remove());
    document.querySelectorAll('.effect-indicator').forEach(el => el.remove());
    document.querySelectorAll('.obstacle-warning').forEach(el => el.remove());
    document.querySelectorAll('.dodge-popup').forEach(el => el.remove());
}

function startCountdown() {
    elements.countdownOverlay.classList.remove('hidden');
    let count = 3;
    elements.countdownNumber.textContent = count;
    elements.countdownNumber.style.animation = 'none';
    void elements.countdownNumber.offsetWidth;
    elements.countdownNumber.style.animation = 'countdownPulse 1s ease-in-out';
    sounds.countdown();
    
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            elements.countdownNumber.textContent = count;
            elements.countdownNumber.style.animation = 'none';
            void elements.countdownNumber.offsetWidth;
            elements.countdownNumber.style.animation = 'countdownPulse 1s ease-in-out';
            sounds.countdown();
        } else if (count === 0) {
            elements.countdownNumber.textContent = 'GO!';
            elements.countdownNumber.style.color = '#39ff14';
            elements.countdownNumber.style.animation = 'none';
            void elements.countdownNumber.offsetWidth;
            elements.countdownNumber.style.animation = 'countdownPulse 1s ease-in-out';
            sounds.go();
        } else {
            clearInterval(countdownInterval);
            elements.countdownOverlay.classList.add('hidden');
            elements.countdownNumber.style.color = '#00fff7';
            beginPlay();
        }
    }, 1000);
}

function beginPlay() {
    state.isPlaying = true;
    state.timeLeft = 10;
    updateTimerDisplay();
    
    state.timerInterval = setInterval(() => {
        if (!state.timeFrozen) {
            state.timeLeft -= 0.1;
        }
        if (state.timeLeft <= 0) {
            state.timeLeft = 0;
            endGame();
        }
        updateTimerDisplay();
    }, 100);
    
    // Random events (power-ups and obstacles)
    scheduleNextEvent();
}

function scheduleNextEvent() {
    if (!state.isPlaying) return;
    
    const delay = 1500 + Math.random() * 2000; // 1.5-3.5 seconds
    
    state.eventInterval = setTimeout(() => {
        if (!state.isPlaying || state.timeLeft < 1) return;
        
        // 50% power-up, 50% obstacle
        const isPowerUp = Math.random() > 0.5;
        const eventList = isPowerUp ? powerUpTypes : obstacleTypes;
        const event = eventList[Math.floor(Math.random() * eventList.length)];
        
        if (state.mode === 'solo') {
            triggerEvent(event, 'solo');
        } else {
            // In versus mode, target a random player
            const target = Math.random() > 0.5 ? 'p1' : 'p2';
            triggerEvent(event, target);
        }
        
        scheduleNextEvent();
    }, delay);
}

function triggerEvent(event, target) {
    // Power-ups apply immediately
    if (powerUpTypes.includes(event)) {
        sounds.powerup();
        showEventPopup(event, target);
        applyEffect(event, target);
    } else {
        // Obstacles show a warning first - player can dodge!
        showObstacleWarning(event, target);
    }
}

function showObstacleWarning(event, target) {
    sounds.warning();
    state.canDodge[target] = true;
    
    // Get dodge key based on target
    let dodgeKey = 'SPACE';
    if (target === 'p1') dodgeKey = 'W';
    if (target === 'p2') dodgeKey = 'O';
    
    // Show warning popup
    const warning = document.createElement('div');
    warning.className = 'obstacle-warning';
    warning.innerHTML = `
        <div class="warning-icon">⚠️</div>
        <div class="warning-text">INCOMING!</div>
        <div class="warning-obstacle">${event.icon} ${event.name}</div>
        <div class="warning-dodge">Press <span class="dodge-key">${dodgeKey}</span> to DODGE!</div>
        <div class="warning-timer"></div>
    `;
    
    let container;
    if (target === 'solo') {
        container = screens.solo;
    } else if (target === 'p1') {
        container = document.querySelector('.player1');
    } else {
        container = document.querySelector('.player2');
    }
    
    container.appendChild(warning);
    
    // Store pending obstacle
    const obstacleTimeout = setTimeout(() => {
        // Player didn't dodge in time!
        state.canDodge[target] = false;
        warning.remove();
        sounds.obstacle();
        showEventPopup(event, target);
        applyEffect(event, target);
        state.pendingObstacle = null;
    }, 1200); // 1.2 seconds to dodge
    
    state.pendingObstacle = { event, target, timeout: obstacleTimeout, warning };
}

function attemptDodge(target) {
    if (!state.canDodge[target] || !state.pendingObstacle) return false;
    if (state.pendingObstacle.target !== target) return false;
    
    // Successful dodge!
    clearTimeout(state.pendingObstacle.timeout);
    state.pendingObstacle.warning.remove();
    state.canDodge[target] = false;
    
    sounds.dodge();
    showDodgeSuccess(target);
    
    state.pendingObstacle = null;
    return true;
}

function showDodgeSuccess(target) {
    const popup = document.createElement('div');
    popup.className = 'dodge-popup';
    popup.innerHTML = `<span class="dodge-icon">🛡️</span><span class="dodge-text">DODGED!</span>`;
    
    let container;
    if (target === 'solo') {
        container = screens.solo;
    } else if (target === 'p1') {
        container = document.querySelector('.player1');
    } else {
        container = document.querySelector('.player2');
    }
    
    container.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
}

function showEventPopup(event, target) {
    const popup = document.createElement('div');
    popup.className = 'event-popup';
    popup.innerHTML = `<span class="event-icon">${event.icon}</span><span class="event-name">${event.name}</span>`;
    popup.style.color = event.color;
    popup.style.textShadow = `0 0 20px ${event.color}`;
    
    let container;
    if (target === 'solo') {
        container = screens.solo;
    } else if (target === 'p1') {
        container = document.querySelector('.player1');
    } else {
        container = document.querySelector('.player2');
    }
    
    container.appendChild(popup);
    
    // Remove popup after animation
    setTimeout(() => popup.remove(), 1500);
}

function applyEffect(event, target) {
    switch (event.effect) {
        case 'multiplier':
            setMultiplier(target, event.value, event.duration);
            break;
        case 'bonus':
            addScore(target, event.value);
            break;
        case 'penalty':
            addScore(target, event.value);
            break;
        case 'stun':
            setStunned(target, true, event.duration);
            break;
        case 'reverse':
            setMultiplier(target, event.value, event.duration);
            break;
        case 'freeze':
            freezeTime(event.duration);
            break;
    }
    
    // Show effect indicator for duration-based effects
    if (event.duration > 0) {
        showEffectIndicator(event, target);
    }
}

function setMultiplier(target, value, duration) {
    if (target === 'solo') {
        state.soloMultiplier = value;
        setTimeout(() => { if (state.isPlaying) state.soloMultiplier = 1; }, duration);
    } else if (target === 'p1') {
        state.p1Multiplier = value;
        setTimeout(() => { if (state.isPlaying) state.p1Multiplier = 1; }, duration);
    } else {
        state.p2Multiplier = value;
        setTimeout(() => { if (state.isPlaying) state.p2Multiplier = 1; }, duration);
    }
}

function setStunned(target, stunned, duration) {
    if (target === 'solo') {
        state.soloStunned = stunned;
        elements.soloKey.classList.add('stunned');
        sounds.freeze();
        setTimeout(() => { 
            if (state.isPlaying) {
                state.soloStunned = false;
                elements.soloKey.classList.remove('stunned');
            }
        }, duration);
    } else if (target === 'p1') {
        state.p1Stunned = stunned;
        document.querySelector('.player1 .player-key').classList.add('stunned');
        sounds.freeze();
        setTimeout(() => { 
            if (state.isPlaying) {
                state.p1Stunned = false;
                document.querySelector('.player1 .player-key').classList.remove('stunned');
            }
        }, duration);
    } else {
        state.p2Stunned = stunned;
        document.querySelector('.player2 .player-key').classList.add('stunned');
        sounds.freeze();
        setTimeout(() => { 
            if (state.isPlaying) {
                state.p2Stunned = false;
                document.querySelector('.player2 .player-key').classList.remove('stunned');
            }
        }, duration);
    }
}

function freezeTime(duration) {
    state.timeFrozen = true;
    sounds.freeze();
    
    // Visual effect on timer
    const timerRing = state.mode === 'solo' ? elements.soloTimerRing : elements.versusTimerRing;
    timerRing.style.stroke = '#00ffff';
    
    setTimeout(() => {
        if (state.isPlaying) {
            state.timeFrozen = false;
            timerRing.style.stroke = '';
        }
    }, duration);
}

function addScore(target, value) {
    if (target === 'solo') {
        state.soloScore = Math.max(0, state.soloScore + value);
        elements.soloScore.textContent = state.soloScore;
    } else if (target === 'p1') {
        state.p1Score = Math.max(0, state.p1Score + value);
        elements.p1Score.textContent = state.p1Score;
    } else {
        state.p2Score = Math.max(0, state.p2Score + value);
        elements.p2Score.textContent = state.p2Score;
    }
}

function showEffectIndicator(event, target) {
    const indicator = document.createElement('div');
    indicator.className = 'effect-indicator';
    indicator.textContent = event.icon;
    indicator.style.color = event.color;
    
    let container;
    if (target === 'solo') {
        container = document.querySelector('.score-display.solo');
    } else if (target === 'p1') {
        container = document.querySelector('.player1');
    } else {
        container = document.querySelector('.player2');
    }
    
    container.appendChild(indicator);
    
    setTimeout(() => indicator.remove(), event.duration);
}

function updateTimerDisplay() {
    const displayTime = Math.ceil(state.timeLeft);
    const progress = (state.timeLeft / 10) * 283;
    
    if (state.mode === 'solo') {
        elements.soloTimer.textContent = displayTime;
        elements.soloTimerRing.style.strokeDashoffset = 283 - progress;
    } else {
        elements.versusTimer.textContent = displayTime;
        elements.versusTimerRing.style.strokeDashoffset = 283 - progress;
    }
}

function endGame() {
    state.isPlaying = false;
    clearInterval(state.timerInterval);
    clearTimeout(state.eventInterval);
    clearAllEffects();
    
    sounds.victory();
    showResults();
}

function showResults() {
    showScreen('result');
    
    if (state.mode === 'solo') {
        const isNewRecord = state.soloScore > state.highScore;
        if (isNewRecord) {
            state.highScore = state.soloScore;
            localStorage.setItem('klickspel-highscore', state.highScore);
            elements.highScoreDisplay.textContent = state.highScore;
        }
        
        elements.resultTitle.textContent = isNewRecord ? '🎉 NEW RECORD!' : 'GAME OVER';
        elements.resultTitle.style.color = '#ffd700';
        elements.resultStats.innerHTML = `
            <div class="result-stat">
                <span class="label">YOUR SCORE:</span>
                <span class="value ${isNewRecord ? 'new-record' : ''}">${state.soloScore}</span>
            </div>
            <div class="result-stat">
                <span class="label">HIGH SCORE:</span>
                <span class="value">${state.highScore}</span>
            </div>
            <div class="result-stat">
                <span class="label">CLICKS/SEC:</span>
                <span class="value">${(state.soloScore / 10).toFixed(1)}</span>
            </div>
        `;
    } else {
        let winner = '';
        if (state.p1Score > state.p2Score) {
            winner = 'PLAYER 1 WINS!';
            elements.resultTitle.style.color = '#00fff7';
        } else if (state.p2Score > state.p1Score) {
            winner = 'PLAYER 2 WINS!';
            elements.resultTitle.style.color = '#ff0080';
        } else {
            winner = "IT'S A TIE!";
            elements.resultTitle.style.color = '#ffd700';
        }
        
        elements.resultTitle.textContent = winner;
        elements.resultStats.innerHTML = `
            <div class="result-stat">
                <span class="label" style="color: #00fff7;">P1:</span>
                <span class="value" style="color: #00fff7;">${state.p1Score}</span>
                <span class="label" style="margin-left: 1rem;">vs</span>
                <span class="label" style="color: #ff0080; margin-left: 1rem;">P2:</span>
                <span class="value" style="color: #ff0080;">${state.p2Score}</span>
            </div>
            <div class="result-stat">
                <span class="label">DIFFERENCE:</span>
                <span class="value">${Math.abs(state.p1Score - state.p2Score)}</span>
            </div>
        `;
    }
}

function playAgain() {
    startGame(state.lastMode);
}

// Input Handling
function handleKeyDown(e) {
    if (!state.isPlaying) return;
    
    // Dodge keys
    if (state.mode === 'solo' && e.key === ' ') {
        e.preventDefault();
        attemptDodge('solo');
        return;
    }
    
    if (state.mode === 'versus') {
        if (e.key === 'w' || e.key === 'W') {
            e.preventDefault();
            attemptDodge('p1');
            return;
        }
        if (e.key === 'o' || e.key === 'O') {
            e.preventDefault();
            attemptDodge('p2');
            return;
        }
    }
    
    if (state.mode === 'solo' && e.key === 'Enter') {
        e.preventDefault();
        
        if (state.soloStunned) {
            // Visual feedback that we're stunned
            elements.soloKey.classList.add('shake');
            setTimeout(() => elements.soloKey.classList.remove('shake'), 100);
            return;
        }
        
        const points = Math.round(1 * state.soloMultiplier);
        state.soloScore = Math.max(0, state.soloScore + points);
        elements.soloScore.textContent = state.soloScore;
        elements.soloKey.classList.add('pressed');
        
        sounds.click();
        
        // Visual feedback
        elements.soloScore.style.transform = 'scale(1.1)';
        setTimeout(() => {
            elements.soloScore.style.transform = 'scale(1)';
        }, 50);
        
        // Show multiplier effect
        if (state.soloMultiplier !== 1) {
            showClickEffect(points, state.soloMultiplier > 1 ? '#ffff00' : '#ff0000');
        }
    }
    
    if (state.mode === 'versus') {
        if (e.key === 'q' || e.key === 'Q') {
            e.preventDefault();
            
            if (state.p1Stunned) {
                document.querySelector('.player1 .player-key').classList.add('shake');
                setTimeout(() => document.querySelector('.player1 .player-key').classList.remove('shake'), 100);
                return;
            }
            
            const points = Math.round(1 * state.p1Multiplier);
            state.p1Score = Math.max(0, state.p1Score + points);
            elements.p1Score.textContent = state.p1Score;
            document.querySelector('.player1 .player-key').classList.add('pressed');
            updateVersusBars();
            sounds.click();
        }
        if (e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            
            if (state.p2Stunned) {
                document.querySelector('.player2 .player-key').classList.add('shake');
                setTimeout(() => document.querySelector('.player2 .player-key').classList.remove('shake'), 100);
                return;
            }
            
            const points = Math.round(1 * state.p2Multiplier);
            state.p2Score = Math.max(0, state.p2Score + points);
            elements.p2Score.textContent = state.p2Score;
            document.querySelector('.player2 .player-key').classList.add('pressed');
            updateVersusBars();
            sounds.click();
        }
    }
}

function showClickEffect(points, color) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.textContent = points > 0 ? `+${points}` : points;
    effect.style.color = color;
    
    const scoreEl = elements.soloScore;
    const rect = scoreEl.getBoundingClientRect();
    effect.style.left = rect.left + rect.width / 2 + 'px';
    effect.style.top = rect.top + 'px';
    
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 500);
}

function handleKeyUp(e) {
    if (e.key === 'Enter') {
        elements.soloKey.classList.remove('pressed');
    }
    if (e.key === 'q' || e.key === 'Q') {
        document.querySelector('.player1 .player-key')?.classList.remove('pressed');
    }
    if (e.key === 'p' || e.key === 'P') {
        document.querySelector('.player2 .player-key')?.classList.remove('pressed');
    }
}

function updateVersusBars() {
    const maxScore = Math.max(state.p1Score, state.p2Score, 1);
    elements.p1Bar.style.width = `${(state.p1Score / maxScore) * 100}%`;
    elements.p2Bar.style.width = `${(state.p2Score / maxScore) * 100}%`;
}

// Start the game
init();
