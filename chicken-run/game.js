// Audio Context for sound effects
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Sound Effects
const sounds = {
    step: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 200 + Math.random() * 100;
        osc.type = 'triangle';
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
    },
    
    jump: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    },
    
    hit: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
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
    
    powerup: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
        osc.frequency.exponentialRampToValueAtTime(1500, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
    },
    
    shieldBlock: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'triangle';
        osc.frequency.value = 800;
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    }
};

// Obstacle types
const obstacleTypes = ['🪨', '🌵', '🪵', '📦', '🧱'];

// Power-up types
const powerUpTypes = [
    { id: 'speed', icon: '⚡', name: 'SPEED BOOST', color: '#FFD700', duration: 3000 },
    { id: 'shield', icon: '🛡️', name: 'SHIELD', color: '#00BFFF', duration: 5000 },
    { id: 'bonus', icon: '🌟', name: '+5 STEPS', color: '#FF69B4', duration: 0 },
    { id: 'time', icon: '⏰', name: '+2 SECONDS', color: '#32CD32', duration: 0 },
    { id: 'magnet', icon: '🧲', name: 'STEP MAGNET', color: '#FF4500', duration: 3000 }
];

// Game State
const state = {
    mode: null,
    isPlaying: false,
    timeLeft: 10,
    
    // Solo mode
    soloSteps: 0,
    soloPosition: 20,
    soloJumping: false,
    soloStunned: false,
    soloSpeedBoost: false,
    soloShield: false,
    soloMagnet: false,
    
    // Versus mode
    p1Steps: 0,
    p1Position: 20,
    p1Jumping: false,
    p1Stunned: false,
    p1SpeedBoost: false,
    p1Shield: false,
    p1Magnet: false,
    
    p2Steps: 0,
    p2Position: 20,
    p2Jumping: false,
    p2Stunned: false,
    p2SpeedBoost: false,
    p2Shield: false,
    p2Magnet: false,
    
    // Obstacles and power-ups
    obstacles: {
        solo: [],
        p1: [],
        p2: []
    },
    powerUps: {
        solo: [],
        p1: [],
        p2: []
    },
    
    highScore: parseInt(localStorage.getItem('chickenrun-highscore')) || 0,
    timerInterval: null,
    obstacleInterval: null,
    powerUpInterval: null,
    lastMode: null
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
    soloScore: document.getElementById('solo-score'),
    soloChicken: document.getElementById('solo-chicken'),
    soloObstacles: document.getElementById('solo-obstacles'),
    versusTimer: document.getElementById('versus-timer'),
    p1Chicken: document.getElementById('p1-chicken'),
    p2Chicken: document.getElementById('p2-chicken'),
    p1Steps: document.getElementById('p1-steps'),
    p2Steps: document.getElementById('p2-steps'),
    p1Obstacles: document.getElementById('p1-obstacles'),
    p2Obstacles: document.getElementById('p2-obstacles'),
    countdownOverlay: document.getElementById('countdown-overlay'),
    countdownNumber: document.getElementById('countdown-number'),
    resultTitle: document.getElementById('result-title'),
    resultStats: document.getElementById('result-stats'),
    resultChicken: document.getElementById('result-chicken')
};

// Initialize
function init() {
    elements.highScoreDisplay.textContent = state.highScore;
    
    document.getElementById('solo-btn').addEventListener('click', () => {
        initAudio();
        startGame('solo');
    });
    document.getElementById('versus-btn').addEventListener('click', () => {
        initAudio();
        startGame('versus');
    });
    
    document.getElementById('solo-back').addEventListener('click', goToMenu);
    document.getElementById('versus-back').addEventListener('click', goToMenu);
    document.getElementById('play-again').addEventListener('click', playAgain);
    document.getElementById('main-menu').addEventListener('click', goToMenu);
    
    document.addEventListener('keydown', handleKeyDown);
}

// Screen Management
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    screens[screenName].classList.remove('hidden');
}

function goToMenu() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    if (state.obstacleInterval) clearInterval(state.obstacleInterval);
    if (state.powerUpInterval) clearInterval(state.powerUpInterval);
    state.isPlaying = false;
    showScreen('menu');
}

// Game Flow
function startGame(mode) {
    state.mode = mode;
    state.lastMode = mode;
    resetGame();
    showScreen(mode);
    startCountdown();
}

function resetGame() {
    state.timeLeft = 10;
    state.soloSteps = 0;
    state.soloPosition = 20;
    state.soloJumping = false;
    state.soloStunned = false;
    state.soloSpeedBoost = false;
    state.soloShield = false;
    state.soloMagnet = false;
    state.p1Steps = 0;
    state.p1Position = 20;
    state.p1Jumping = false;
    state.p1Stunned = false;
    state.p1SpeedBoost = false;
    state.p1Shield = false;
    state.p1Magnet = false;
    state.p2Steps = 0;
    state.p2Position = 20;
    state.p2Jumping = false;
    state.p2Stunned = false;
    state.p2SpeedBoost = false;
    state.p2Shield = false;
    state.p2Magnet = false;
    state.obstacles = { solo: [], p1: [], p2: [] };
    state.powerUps = { solo: [], p1: [], p2: [] };
    
    // Reset UI
    elements.soloScore.textContent = '0';
    elements.p1Steps.textContent = '0';
    elements.p2Steps.textContent = '0';
    elements.soloChicken.style.left = '20px';
    elements.p1Chicken.style.left = '20px';
    elements.p2Chicken.style.left = '20px';
    elements.soloObstacles.innerHTML = '';
    elements.p1Obstacles.innerHTML = '';
    elements.p2Obstacles.innerHTML = '';
    
    // Clear power-up indicators
    document.querySelectorAll('.powerup-item').forEach(el => el.remove());
    document.querySelectorAll('.active-powerup').forEach(el => el.remove());
    document.querySelectorAll('.powerup-popup').forEach(el => el.remove());
    
    // Reset chicken effects
    elements.soloChicken.classList.remove('has-shield', 'has-speed', 'has-magnet');
    elements.p1Chicken.classList.remove('has-shield', 'has-speed', 'has-magnet');
    elements.p2Chicken.classList.remove('has-shield', 'has-speed', 'has-magnet');
    
    updateTimerDisplay();
}

function startCountdown() {
    elements.countdownOverlay.classList.remove('hidden');
    let count = 3;
    elements.countdownNumber.textContent = count;
    elements.countdownNumber.style.animation = 'none';
    void elements.countdownNumber.offsetWidth;
    elements.countdownNumber.style.animation = 'countdownPop 1s ease-out';
    sounds.countdown();
    
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            elements.countdownNumber.textContent = count;
            elements.countdownNumber.style.animation = 'none';
            void elements.countdownNumber.offsetWidth;
            elements.countdownNumber.style.animation = 'countdownPop 1s ease-out';
            sounds.countdown();
        } else if (count === 0) {
            elements.countdownNumber.textContent = 'GO!';
            elements.countdownNumber.style.animation = 'none';
            void elements.countdownNumber.offsetWidth;
            elements.countdownNumber.style.animation = 'countdownPop 1s ease-out';
            sounds.go();
        } else {
            clearInterval(countdownInterval);
            elements.countdownOverlay.classList.add('hidden');
            beginPlay();
        }
    }, 1000);
}

function beginPlay() {
    state.isPlaying = true;
    state.timeLeft = 10;
    updateTimerDisplay();
    
    state.timerInterval = setInterval(() => {
        state.timeLeft -= 0.1;
        if (state.timeLeft <= 0) {
            state.timeLeft = 0;
            endGame();
        }
        updateTimerDisplay();
    }, 100);
    
    // Spawn obstacles periodically
    state.obstacleInterval = setInterval(() => {
        if (!state.isPlaying) return;
        spawnObstacle();
    }, 1200);
    
    // Spawn power-ups periodically
    state.powerUpInterval = setInterval(() => {
        if (!state.isPlaying) return;
        if (Math.random() > 0.4) { // 60% chance each interval
            spawnPowerUp();
        }
    }, 2000);
    
    // Initial obstacle
    setTimeout(() => {
        if (state.isPlaying) spawnObstacle();
    }, 800);
    
    // Initial power-up
    setTimeout(() => {
        if (state.isPlaying) spawnPowerUp();
    }, 1500);
}

function updateTimerDisplay() {
    const displayTime = Math.ceil(state.timeLeft);
    if (state.mode === 'solo') {
        elements.soloTimer.textContent = displayTime;
    } else {
        elements.versusTimer.textContent = displayTime;
    }
}

function spawnObstacle() {
    const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    
    if (state.mode === 'solo') {
        createObstacle('solo', type);
    } else {
        // Random lane for versus
        if (Math.random() > 0.5) {
            createObstacle('p1', type);
        } else {
            createObstacle('p2', type);
        }
    }
}

function spawnPowerUp() {
    const powerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    
    if (state.mode === 'solo') {
        createPowerUp('solo', powerUp);
    } else {
        // Random lane for versus
        if (Math.random() > 0.5) {
            createPowerUp('p1', powerUp);
        } else {
            createPowerUp('p2', powerUp);
        }
    }
}

function createPowerUp(lane, powerUp) {
    const container = lane === 'solo' ? elements.soloObstacles : 
                      lane === 'p1' ? elements.p1Obstacles : elements.p2Obstacles;
    
    const powerUpEl = document.createElement('div');
    powerUpEl.className = 'powerup-item';
    powerUpEl.textContent = powerUp.icon;
    powerUpEl.style.right = '-50px';
    powerUpEl.style.setProperty('--powerup-color', powerUp.color);
    container.appendChild(powerUpEl);
    
    const powerUpData = {
        element: powerUpEl,
        position: 110,
        collected: false,
        type: powerUp
    };
    
    state.powerUps[lane].push(powerUpData);
    
    // Animate power-up moving left
    const moveInterval = setInterval(() => {
        if (!state.isPlaying) {
            clearInterval(moveInterval);
            return;
        }
        
        powerUpData.position -= 1.2; // Slightly slower than obstacles
        powerUpEl.style.right = 'auto';
        powerUpEl.style.left = powerUpData.position + '%';
        
        // Check collection
        checkPowerUpCollection(lane, powerUpData);
        
        // Remove when off screen
        if (powerUpData.position < -10) {
            clearInterval(moveInterval);
            powerUpEl.remove();
            const index = state.powerUps[lane].indexOf(powerUpData);
            if (index > -1) state.powerUps[lane].splice(index, 1);
        }
    }, 50);
}

function checkPowerUpCollection(lane, powerUp) {
    if (powerUp.collected) return;
    
    let chickenPos;
    
    if (lane === 'solo') {
        chickenPos = state.soloPosition;
    } else if (lane === 'p1') {
        chickenPos = state.p1Position;
    } else {
        chickenPos = state.p2Position;
    }
    
    const powerUpLeft = powerUp.position;
    const chickenRight = chickenPos + 8;
    const chickenLeft = chickenPos;
    
    // Check if power-up overlaps with chicken
    if (powerUpLeft < chickenRight && powerUpLeft > chickenLeft - 5) {
        collectPowerUp(lane, powerUp);
    }
}

function collectPowerUp(lane, powerUp) {
    powerUp.collected = true;
    powerUp.element.classList.add('collected');
    sounds.powerup();
    
    // Show popup
    showPowerUpPopup(lane, powerUp.type);
    
    // Apply effect
    applyPowerUp(lane, powerUp.type);
    
    // Remove element after animation
    setTimeout(() => {
        powerUp.element.remove();
        const index = state.powerUps[lane].indexOf(powerUp);
        if (index > -1) state.powerUps[lane].splice(index, 1);
    }, 300);
}

function showPowerUpPopup(lane, powerUp) {
    let container;
    if (lane === 'solo') {
        container = document.getElementById('solo-lane');
    } else if (lane === 'p1') {
        container = document.getElementById('p1-lane');
    } else {
        container = document.getElementById('p2-lane');
    }
    
    const popup = document.createElement('div');
    popup.className = 'powerup-popup';
    popup.innerHTML = `<span>${powerUp.icon}</span> ${powerUp.name}`;
    popup.style.color = powerUp.color;
    container.appendChild(popup);
    
    setTimeout(() => popup.remove(), 1000);
}

function applyPowerUp(lane, powerUp) {
    let chicken;
    if (lane === 'solo') {
        chicken = elements.soloChicken;
    } else if (lane === 'p1') {
        chicken = elements.p1Chicken;
    } else {
        chicken = elements.p2Chicken;
    }
    
    switch (powerUp.id) {
        case 'speed':
            if (lane === 'solo') {
                state.soloSpeedBoost = true;
                chicken.classList.add('has-speed');
                setTimeout(() => {
                    state.soloSpeedBoost = false;
                    chicken.classList.remove('has-speed');
                }, powerUp.duration);
            } else if (lane === 'p1') {
                state.p1SpeedBoost = true;
                chicken.classList.add('has-speed');
                setTimeout(() => {
                    state.p1SpeedBoost = false;
                    chicken.classList.remove('has-speed');
                }, powerUp.duration);
            } else {
                state.p2SpeedBoost = true;
                chicken.classList.add('has-speed');
                setTimeout(() => {
                    state.p2SpeedBoost = false;
                    chicken.classList.remove('has-speed');
                }, powerUp.duration);
            }
            showActiveEffect(lane, powerUp);
            break;
            
        case 'shield':
            if (lane === 'solo') {
                state.soloShield = true;
                chicken.classList.add('has-shield');
            } else if (lane === 'p1') {
                state.p1Shield = true;
                chicken.classList.add('has-shield');
            } else {
                state.p2Shield = true;
                chicken.classList.add('has-shield');
            }
            showActiveEffect(lane, powerUp);
            // Shield lasts until hit or timeout
            setTimeout(() => {
                if (lane === 'solo' && state.soloShield) {
                    state.soloShield = false;
                    chicken.classList.remove('has-shield');
                } else if (lane === 'p1' && state.p1Shield) {
                    state.p1Shield = false;
                    chicken.classList.remove('has-shield');
                } else if (lane === 'p2' && state.p2Shield) {
                    state.p2Shield = false;
                    chicken.classList.remove('has-shield');
                }
            }, powerUp.duration);
            break;
            
        case 'bonus':
            // Instant +5 steps
            if (lane === 'solo') {
                state.soloSteps += 5;
                state.soloPosition = Math.min(85, state.soloPosition + 5);
                elements.soloScore.textContent = state.soloSteps;
                elements.soloChicken.style.left = state.soloPosition + '%';
            } else if (lane === 'p1') {
                state.p1Steps += 5;
                state.p1Position = Math.min(75, state.p1Position + 5);
                elements.p1Steps.textContent = state.p1Steps;
                elements.p1Chicken.style.left = state.p1Position + '%';
            } else {
                state.p2Steps += 5;
                state.p2Position = Math.min(75, state.p2Position + 5);
                elements.p2Steps.textContent = state.p2Steps;
                elements.p2Chicken.style.left = state.p2Position + '%';
            }
            break;
            
        case 'time':
            // +2 seconds
            state.timeLeft = Math.min(15, state.timeLeft + 2);
            updateTimerDisplay();
            break;
            
        case 'magnet':
            if (lane === 'solo') {
                state.soloMagnet = true;
                chicken.classList.add('has-magnet');
                setTimeout(() => {
                    state.soloMagnet = false;
                    chicken.classList.remove('has-magnet');
                }, powerUp.duration);
            } else if (lane === 'p1') {
                state.p1Magnet = true;
                chicken.classList.add('has-magnet');
                setTimeout(() => {
                    state.p1Magnet = false;
                    chicken.classList.remove('has-magnet');
                }, powerUp.duration);
            } else {
                state.p2Magnet = true;
                chicken.classList.add('has-magnet');
                setTimeout(() => {
                    state.p2Magnet = false;
                    chicken.classList.remove('has-magnet');
                }, powerUp.duration);
            }
            showActiveEffect(lane, powerUp);
            break;
    }
}

function showActiveEffect(lane, powerUp) {
    let container;
    if (lane === 'solo') {
        container = document.getElementById('solo-lane');
    } else if (lane === 'p1') {
        container = document.getElementById('p1-lane');
    } else {
        container = document.getElementById('p2-lane');
    }
    
    const indicator = document.createElement('div');
    indicator.className = 'active-powerup';
    indicator.textContent = powerUp.icon;
    indicator.style.color = powerUp.color;
    container.appendChild(indicator);
    
    setTimeout(() => indicator.remove(), powerUp.duration);
}

function createObstacle(lane, type) {
    const container = lane === 'solo' ? elements.soloObstacles : 
                      lane === 'p1' ? elements.p1Obstacles : elements.p2Obstacles;
    
    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    obstacle.textContent = type;
    obstacle.style.right = '-50px';
    container.appendChild(obstacle);
    
    const obstacleData = {
        element: obstacle,
        position: 110, // Start off-screen right (percentage)
        passed: false,
        type: type
    };
    
    state.obstacles[lane].push(obstacleData);
    
    // Animate obstacle moving left
    const moveInterval = setInterval(() => {
        if (!state.isPlaying) {
            clearInterval(moveInterval);
            return;
        }
        
        obstacleData.position -= 1.5;
        obstacle.style.right = 'auto';
        obstacle.style.left = obstacleData.position + '%';
        
        // Check collision
        checkCollision(lane, obstacleData);
        
        // Remove when off screen
        if (obstacleData.position < -10) {
            clearInterval(moveInterval);
            obstacle.remove();
            const index = state.obstacles[lane].indexOf(obstacleData);
            if (index > -1) state.obstacles[lane].splice(index, 1);
        }
    }, 50);
}

function checkCollision(lane, obstacle) {
    if (obstacle.passed) return;
    
    let chickenPos, isJumping, isStunned;
    
    if (lane === 'solo') {
        chickenPos = state.soloPosition;
        isJumping = state.soloJumping;
        isStunned = state.soloStunned;
    } else if (lane === 'p1') {
        chickenPos = state.p1Position;
        isJumping = state.p1Jumping;
        isStunned = state.p1Stunned;
    } else {
        chickenPos = state.p2Position;
        isJumping = state.p2Jumping;
        isStunned = state.p2Stunned;
    }
    
    // Convert positions to comparable values
    const obstacleLeft = obstacle.position;
    const chickenRight = chickenPos + 8; // Chicken width ~8%
    const chickenLeft = chickenPos;
    
    // Check if obstacle overlaps with chicken
    if (obstacleLeft < chickenRight && obstacleLeft > chickenLeft - 5) {
        if (!isJumping && !isStunned) {
            // HIT!
            handleHit(lane);
            obstacle.passed = true;
            obstacle.element.classList.add('passed');
        } else if (isJumping) {
            // Jumped over!
            obstacle.passed = true;
            obstacle.element.classList.add('passed');
        }
    }
}

function handleHit(lane) {
    let hasShield = false;
    let chicken, laneElement;
    
    if (lane === 'solo') {
        hasShield = state.soloShield;
        chicken = elements.soloChicken;
        laneElement = document.getElementById('solo-lane');
    } else if (lane === 'p1') {
        hasShield = state.p1Shield;
        chicken = elements.p1Chicken;
        laneElement = document.getElementById('p1-lane');
    } else {
        hasShield = state.p2Shield;
        chicken = elements.p2Chicken;
        laneElement = document.getElementById('p2-lane');
    }
    
    // Shield blocks the hit!
    if (hasShield) {
        sounds.shieldBlock();
        if (lane === 'solo') {
            state.soloShield = false;
        } else if (lane === 'p1') {
            state.p1Shield = false;
        } else {
            state.p2Shield = false;
        }
        chicken.classList.remove('has-shield');
        
        // Show shield break effect
        const shieldBreak = document.createElement('div');
        shieldBreak.className = 'shield-break';
        shieldBreak.textContent = '🛡️💥';
        chicken.appendChild(shieldBreak);
        setTimeout(() => shieldBreak.remove(), 500);
        return;
    }
    
    sounds.hit();
    
    if (lane === 'solo') {
        state.soloStunned = true;
        state.soloSteps = Math.max(0, state.soloSteps - 3);
        state.soloPosition = Math.max(20, state.soloPosition - 10);
        elements.soloScore.textContent = state.soloSteps;
        elements.soloChicken.style.left = state.soloPosition + '%';
        setTimeout(() => state.soloStunned = false, 500);
    } else if (lane === 'p1') {
        state.p1Stunned = true;
        state.p1Steps = Math.max(0, state.p1Steps - 3);
        state.p1Position = Math.max(20, state.p1Position - 10);
        elements.p1Steps.textContent = state.p1Steps;
        elements.p1Chicken.style.left = state.p1Position + '%';
        setTimeout(() => state.p1Stunned = false, 500);
    } else {
        state.p2Stunned = true;
        state.p2Steps = Math.max(0, state.p2Steps - 3);
        state.p2Position = Math.max(20, state.p2Position - 10);
        elements.p2Steps.textContent = state.p2Steps;
        elements.p2Chicken.style.left = state.p2Position + '%';
        setTimeout(() => state.p2Stunned = false, 500);
    }
    
    chicken.classList.add('hit');
    laneElement.classList.add('hit-flash');
    setTimeout(() => {
        chicken.classList.remove('hit');
        laneElement.classList.remove('hit-flash');
    }, 500);
}

function doStep(lane) {
    if (!state.isPlaying) return;
    
    sounds.step();
    
    let stepBonus = 1;
    let posBonus = 1;
    
    if (lane === 'solo') {
        if (state.soloStunned) return;
        if (state.soloSpeedBoost) { stepBonus = 2; posBonus = 2; }
        if (state.soloMagnet) { stepBonus += 1; } // Magnet attracts bonus steps
        state.soloSteps += stepBonus;
        state.soloPosition = Math.min(85, state.soloPosition + posBonus);
        elements.soloScore.textContent = state.soloSteps;
        elements.soloChicken.style.left = state.soloPosition + '%';
        animateStep(elements.soloChicken);
    } else if (lane === 'p1') {
        if (state.p1Stunned) return;
        if (state.p1SpeedBoost) { stepBonus = 2; posBonus = 2; }
        if (state.p1Magnet) { stepBonus += 1; }
        state.p1Steps += stepBonus;
        state.p1Position = Math.min(75, state.p1Position + posBonus);
        elements.p1Steps.textContent = state.p1Steps;
        elements.p1Chicken.style.left = state.p1Position + '%';
        animateStep(elements.p1Chicken);
    } else {
        if (state.p2Stunned) return;
        if (state.p2SpeedBoost) { stepBonus = 2; posBonus = 2; }
        if (state.p2Magnet) { stepBonus += 1; }
        state.p2Steps += stepBonus;
        state.p2Position = Math.min(75, state.p2Position + posBonus);
        elements.p2Steps.textContent = state.p2Steps;
        elements.p2Chicken.style.left = state.p2Position + '%';
        animateStep(elements.p2Chicken);
    }
}

function animateStep(chicken) {
    chicken.classList.remove('stepping');
    void chicken.offsetWidth;
    chicken.classList.add('stepping');
    setTimeout(() => chicken.classList.remove('stepping'), 150);
}

function doJump(lane) {
    if (!state.isPlaying) return;
    
    let isJumping, isStunned, chicken;
    
    if (lane === 'solo') {
        isJumping = state.soloJumping;
        isStunned = state.soloStunned;
        chicken = elements.soloChicken;
    } else if (lane === 'p1') {
        isJumping = state.p1Jumping;
        isStunned = state.p1Stunned;
        chicken = elements.p1Chicken;
    } else {
        isJumping = state.p2Jumping;
        isStunned = state.p2Stunned;
        chicken = elements.p2Chicken;
    }
    
    if (isJumping || isStunned) return;
    
    sounds.jump();
    
    if (lane === 'solo') {
        state.soloJumping = true;
    } else if (lane === 'p1') {
        state.p1Jumping = true;
    } else {
        state.p2Jumping = true;
    }
    
    chicken.classList.add('jumping');
    
    // Show jump indicator
    const indicator = document.createElement('div');
    indicator.className = 'jump-indicator';
    indicator.textContent = '🪶 JUMP!';
    chicken.appendChild(indicator);
    
    setTimeout(() => {
        chicken.classList.remove('jumping');
        indicator.remove();
        
        if (lane === 'solo') {
            state.soloJumping = false;
        } else if (lane === 'p1') {
            state.p1Jumping = false;
        } else {
            state.p2Jumping = false;
        }
    }, 400);
}

function endGame() {
    state.isPlaying = false;
    clearInterval(state.timerInterval);
    clearInterval(state.obstacleInterval);
    clearInterval(state.powerUpInterval);
    
    sounds.victory();
    showResults();
}

function showResults() {
    showScreen('result');
    
    if (state.mode === 'solo') {
        const isNewRecord = state.soloSteps > state.highScore;
        if (isNewRecord) {
            state.highScore = state.soloSteps;
            localStorage.setItem('chickenrun-highscore', state.highScore);
            elements.highScoreDisplay.textContent = state.highScore;
        }
        
        elements.resultTitle.textContent = isNewRecord ? '🏆 NEW RECORD!' : 'RACE OVER!';
        elements.resultChicken.textContent = isNewRecord ? '🎉🐔🎉' : '🐔';
        elements.resultStats.innerHTML = `
            <div class="result-stat">
                <span>Distance:</span>
                <span class="value ${isNewRecord ? 'new-record' : ''}">${state.soloSteps} steps</span>
            </div>
            <div class="result-stat">
                <span>Best:</span>
                <span class="value">${state.highScore} steps</span>
            </div>
            <div class="result-stat">
                <span>Speed:</span>
                <span class="value">${(state.soloSteps / 10).toFixed(1)} steps/sec</span>
            </div>
        `;
    } else {
        let winner = '';
        if (state.p1Steps > state.p2Steps) {
            winner = '🐔 PLAYER 1 WINS!';
            elements.resultChicken.style.color = 'var(--p1-color)';
        } else if (state.p2Steps > state.p1Steps) {
            winner = '🐔 PLAYER 2 WINS!';
            elements.resultChicken.style.color = 'var(--p2-color)';
        } else {
            winner = "🐔 IT'S A TIE! 🐔";
        }
        
        elements.resultTitle.textContent = winner;
        elements.resultChicken.textContent = '🏆';
        elements.resultStats.innerHTML = `
            <div class="result-stat">
                <span style="color: var(--p1-color);">Player 1:</span>
                <span class="value" style="color: var(--p1-color);">${state.p1Steps} steps</span>
            </div>
            <div class="result-stat">
                <span style="color: var(--p2-color);">Player 2:</span>
                <span class="value" style="color: var(--p2-color);">${state.p2Steps} steps</span>
            </div>
            <div class="result-stat">
                <span>Difference:</span>
                <span class="value">${Math.abs(state.p1Steps - state.p2Steps)} steps</span>
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
    
    if (state.mode === 'solo') {
        if (e.key === 'Enter') {
            e.preventDefault();
            doStep('solo');
        }
        if (e.key === ' ') {
            e.preventDefault();
            doJump('solo');
        }
    }
    
    if (state.mode === 'versus') {
        // Player 1: Q to step, W to jump
        if (e.key === 'q' || e.key === 'Q') {
            e.preventDefault();
            doStep('p1');
        }
        if (e.key === 'w' || e.key === 'W') {
            e.preventDefault();
            doJump('p1');
        }
        
        // Player 2: P to step, O to jump
        if (e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            doStep('p2');
        }
        if (e.key === 'o' || e.key === 'O') {
            e.preventDefault();
            doJump('p2');
        }
    }
}

// Start the game
init();
