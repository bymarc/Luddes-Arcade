// Audio Context
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Sound Effects
const sounds = {
    explosion: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    },
    
    impact: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    },
    
    powerup: () => {
        if (!audioCtx) return;
        [600, 800, 1000, 1200].forEach((freq, i) => {
            setTimeout(() => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.1);
            }, i * 50);
        });
    },
    
    countdown: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 440;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    },
    
    go: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 880;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    },
    
    gameOver: () => {
        if (!audioCtx) return;
        [300, 250, 200, 150, 100].forEach((freq, i) => {
            setTimeout(() => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.value = freq;
                osc.type = 'sawtooth';
                gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.3);
            }, i * 150);
        });
    },
    
    wave: () => {
        if (!audioCtx) return;
        [400, 500, 600, 800].forEach((freq, i) => {
            setTimeout(() => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.15);
            }, i * 100);
        });
    }
};

// Power-up Types
const powerUpTypes = [
    { id: 'shield', icon: '🛡️', name: 'Shield', duration: 8000 },
    { id: 'slowmo', icon: '⏰', name: 'Slow Motion', duration: 5000 },
    { id: 'repair', icon: '🔧', name: 'Repair', duration: 0 },
    { id: 'nuke', icon: '💥', name: 'Nuke', duration: 0 }
];

// Game State
const state = {
    isPlaying: false,
    health: 100,
    maxHealth: 100,
    survivalTime: 0,
    meteorsDestroyed: 0,
    totalClicks: 0,
    wave: 1,
    
    // Difficulty scaling
    meteorSpeed: 1,
    spawnRate: 2000,
    
    // Power-ups
    hasShield: false,
    slowMotion: false,
    
    // Records
    bestTime: parseInt(localStorage.getItem('meteor-besttime')) || 0,
    
    // Intervals
    gameLoop: null,
    spawnInterval: null,
    powerupInterval: null,
    
    // Active items
    meteors: [],
    powerups: []
};

// DOM Elements
const elements = {
    menuScreen: document.getElementById('menu-screen'),
    gameScreen: document.getElementById('game-screen'),
    resultScreen: document.getElementById('result-screen'),
    
    bestTime: document.getElementById('best-time'),
    survivalTime: document.getElementById('survival-time'),
    healthFill: document.getElementById('health-fill'),
    meteorsDestroyed: document.getElementById('meteors-destroyed'),
    
    gameArena: document.getElementById('game-arena'),
    spaceStation: document.getElementById('space-station'),
    stationShield: document.getElementById('station-shield'),
    waveIndicator: document.getElementById('wave-indicator'),
    waveNumber: document.getElementById('wave-number'),
    activeEffects: document.getElementById('active-effects'),
    
    countdown: document.getElementById('countdown'),
    countdownNumber: document.getElementById('countdown-number'),
    
    finalTime: document.getElementById('final-time'),
    finalDestroyed: document.getElementById('final-destroyed'),
    finalWaves: document.getElementById('final-waves'),
    finalAccuracy: document.getElementById('final-accuracy'),
    newRecord: document.getElementById('new-record'),
    
    startBtn: document.getElementById('start-btn'),
    playAgainBtn: document.getElementById('play-again-btn'),
    menuBtn: document.getElementById('menu-btn')
};

// Initialize
function init() {
    updateBestTimeDisplay();
    
    elements.startBtn.addEventListener('click', startGame);
    elements.startBtn.addEventListener('touchend', handleStartTouch);
    
    elements.playAgainBtn.addEventListener('click', startGame);
    elements.playAgainBtn.addEventListener('touchend', handleStartTouch);
    
    elements.menuBtn.addEventListener('click', showMenu);
    elements.menuBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        showMenu();
    });
    
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
}

function handleStartTouch(e) {
    e.preventDefault();
    startGame();
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateBestTimeDisplay() {
    elements.bestTime.textContent = formatTime(state.bestTime);
}

function showScreen(screenName) {
    elements.menuScreen.classList.add('hidden');
    elements.gameScreen.classList.add('hidden');
    elements.resultScreen.classList.add('hidden');
    
    if (screenName === 'menu') elements.menuScreen.classList.remove('hidden');
    if (screenName === 'game') elements.gameScreen.classList.remove('hidden');
    if (screenName === 'result') elements.resultScreen.classList.remove('hidden');
}

function showMenu() {
    showScreen('menu');
}

function startGame() {
    initAudio();
    resetState();
    showScreen('game');
    startCountdown();
}

function resetState() {
    state.isPlaying = false;
    state.health = 100;
    state.survivalTime = 0;
    state.meteorsDestroyed = 0;
    state.totalClicks = 0;
    state.wave = 1;
    state.meteorSpeed = 1;
    state.spawnRate = 2000;
    state.hasShield = false;
    state.slowMotion = false;
    state.meteors = [];
    state.powerups = [];
    
    elements.healthFill.style.width = '100%';
    elements.healthFill.className = 'health-fill';
    elements.survivalTime.textContent = '0:00';
    elements.meteorsDestroyed.textContent = '0';
    elements.gameArena.innerHTML = '';
    elements.activeEffects.innerHTML = '';
    elements.stationShield.classList.add('hidden');
    elements.waveIndicator.classList.add('hidden');
    
    // Re-add space station
    elements.gameArena.appendChild(elements.spaceStation);
}

function startCountdown() {
    elements.countdown.classList.remove('hidden');
    let count = 3;
    elements.countdownNumber.textContent = count;
    sounds.countdown();
    
    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            elements.countdownNumber.textContent = count;
            sounds.countdown();
        } else if (count === 0) {
            elements.countdownNumber.textContent = 'DEFEND!';
            sounds.go();
        } else {
            clearInterval(interval);
            elements.countdown.classList.add('hidden');
            beginGame();
        }
    }, 1000);
}

function beginGame() {
    state.isPlaying = true;
    
    // Main game loop
    state.gameLoop = setInterval(() => {
        if (!state.isPlaying) return;
        
        const timeIncrement = state.slowMotion ? 0.05 : 0.1;
        state.survivalTime += timeIncrement;
        elements.survivalTime.textContent = formatTime(state.survivalTime);
        
        // Check for wave progression
        const newWave = Math.floor(state.survivalTime / 15) + 1;
        if (newWave > state.wave) {
            state.wave = newWave;
            showWaveIndicator();
            increaseDifficulty();
        }
        
        // Move meteors
        updateMeteors();
    }, 100);
    
    // Spawn meteors
    scheduleNextMeteor();
    
    // Spawn power-ups occasionally
    state.powerupInterval = setInterval(() => {
        if (!state.isPlaying) return;
        if (Math.random() < 0.3) {
            spawnPowerup();
        }
    }, 8000);
    
    // Initial meteor
    setTimeout(() => spawnMeteor(), 1000);
}

function scheduleNextMeteor() {
    if (!state.isPlaying) return;
    
    const delay = state.slowMotion ? state.spawnRate * 2 : state.spawnRate;
    const variance = delay * 0.3;
    const actualDelay = delay + (Math.random() * variance * 2 - variance);
    
    state.spawnInterval = setTimeout(() => {
        if (state.isPlaying) {
            spawnMeteor();
            scheduleNextMeteor();
        }
    }, actualDelay);
}

function showWaveIndicator() {
    sounds.wave();
    elements.waveNumber.textContent = state.wave;
    elements.waveIndicator.classList.remove('hidden');
    setTimeout(() => {
        elements.waveIndicator.classList.add('hidden');
    }, 2000);
}

function increaseDifficulty() {
    state.meteorSpeed = Math.min(3, 1 + (state.wave - 1) * 0.2);
    state.spawnRate = Math.max(600, 2000 - (state.wave - 1) * 150);
}

function spawnMeteor() {
    const arena = elements.gameArena;
    const arenaRect = arena.getBoundingClientRect();
    
    // Determine meteor size
    const sizeRand = Math.random();
    let size = 'normal';
    let damage = 15;
    let points = 10;
    let speed = state.meteorSpeed;
    
    if (sizeRand < 0.15) {
        size = 'large';
        damage = 25;
        points = 25;
        speed *= 0.8;
    } else if (sizeRand > 0.7) {
        size = 'small';
        damage = 10;
        points = 5;
        speed *= 1.3;
    }
    
    // Random spawn position at edges
    let x, y, targetX, targetY;
    const edge = Math.floor(Math.random() * 3); // 0: top, 1: left, 2: right
    
    const stationX = arenaRect.width / 2;
    const stationY = arenaRect.height * 0.85;
    
    if (edge === 0) {
        // Top
        x = Math.random() * arenaRect.width;
        y = -50;
    } else if (edge === 1) {
        // Left
        x = -50;
        y = Math.random() * (arenaRect.height * 0.5);
    } else {
        // Right
        x = arenaRect.width + 50;
        y = Math.random() * (arenaRect.height * 0.5);
    }
    
    // Add some randomness to target
    targetX = stationX + (Math.random() * 100 - 50);
    targetY = stationY + (Math.random() * 40 - 20);
    
    const meteor = document.createElement('div');
    meteor.className = `meteor ${size}`;
    meteor.innerHTML = '<div class="meteor-body">☄️</div>';
    meteor.style.left = x + 'px';
    meteor.style.top = y + 'px';
    
    const meteorData = {
        element: meteor,
        x: x,
        y: y,
        targetX: targetX,
        targetY: targetY,
        speed: speed,
        damage: damage,
        points: points,
        size: size
    };
    
    // Click/touch handler
    const handleTap = (e) => {
        e.preventDefault();
        e.stopPropagation();
        destroyMeteor(meteorData);
    };
    
    meteor.addEventListener('click', handleTap);
    meteor.addEventListener('touchend', handleTap);
    
    arena.appendChild(meteor);
    state.meteors.push(meteorData);
}

function updateMeteors() {
    const arenaRect = elements.gameArena.getBoundingClientRect();
    const stationX = arenaRect.width / 2;
    const stationY = arenaRect.height * 0.85;
    
    for (let i = state.meteors.length - 1; i >= 0; i--) {
        const meteor = state.meteors[i];
        
        // Calculate direction
        const dx = meteor.targetX - meteor.x;
        const dy = meteor.targetY - meteor.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 50) {
            // Hit the station!
            meteorImpact(meteor);
            continue;
        }
        
        // Move toward target
        const moveSpeed = state.slowMotion ? meteor.speed * 0.4 : meteor.speed;
        const moveX = (dx / dist) * moveSpeed * 3;
        const moveY = (dy / dist) * moveSpeed * 3;
        
        meteor.x += moveX;
        meteor.y += moveY;
        
        meteor.element.style.left = meteor.x + 'px';
        meteor.element.style.top = meteor.y + 'px';
    }
}

function destroyMeteor(meteorData) {
    if (!state.isPlaying) return;
    
    state.totalClicks++;
    state.meteorsDestroyed++;
    elements.meteorsDestroyed.textContent = state.meteorsDestroyed;
    
    sounds.explosion();
    
    // Show explosion
    showExplosion(meteorData.x, meteorData.y);
    
    // Show score popup
    showScorePopup(meteorData.x, meteorData.y, '+' + meteorData.points, 'positive');
    
    // Remove meteor
    meteorData.element.classList.add('exploding');
    setTimeout(() => meteorData.element.remove(), 300);
    
    const index = state.meteors.indexOf(meteorData);
    if (index > -1) state.meteors.splice(index, 1);
}

function meteorImpact(meteorData) {
    // Check shield
    if (state.hasShield) {
        sounds.explosion();
        showExplosion(meteorData.x, meteorData.y);
        meteorData.element.classList.add('exploding');
        setTimeout(() => meteorData.element.remove(), 300);
        
        const index = state.meteors.indexOf(meteorData);
        if (index > -1) state.meteors.splice(index, 1);
        return;
    }
    
    sounds.impact();
    
    // Damage station
    state.health = Math.max(0, state.health - meteorData.damage);
    updateHealthDisplay();
    
    // Visual feedback
    elements.spaceStation.classList.add('hit');
    elements.gameArena.classList.add('shake');
    setTimeout(() => {
        elements.spaceStation.classList.remove('hit');
        elements.gameArena.classList.remove('shake');
    }, 300);
    
    // Show damage popup
    showScorePopup(meteorData.x, meteorData.y, '-' + meteorData.damage, 'negative');
    
    // Remove meteor
    meteorData.element.classList.add('impact');
    setTimeout(() => meteorData.element.remove(), 500);
    
    const index = state.meteors.indexOf(meteorData);
    if (index > -1) state.meteors.splice(index, 1);
    
    // Check game over
    if (state.health <= 0) {
        endGame();
    }
}

function updateHealthDisplay() {
    const percentage = (state.health / state.maxHealth) * 100;
    elements.healthFill.style.width = percentage + '%';
    
    elements.healthFill.classList.remove('warning', 'danger');
    if (percentage <= 25) {
        elements.healthFill.classList.add('danger');
    } else if (percentage <= 50) {
        elements.healthFill.classList.add('warning');
    }
}

function showExplosion(x, y) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.textContent = '💥';
    explosion.style.left = x + 'px';
    explosion.style.top = y + 'px';
    elements.gameArena.appendChild(explosion);
    
    setTimeout(() => explosion.remove(), 400);
}

function showScorePopup(x, y, text, type) {
    const popup = document.createElement('div');
    popup.className = `score-popup ${type}`;
    popup.textContent = text;
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    elements.gameArena.appendChild(popup);
    
    setTimeout(() => popup.remove(), 600);
}

function spawnPowerup() {
    const arena = elements.gameArena;
    const arenaRect = arena.getBoundingClientRect();
    
    const powerUpType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    
    const x = 50 + Math.random() * (arenaRect.width - 100);
    const y = 50 + Math.random() * (arenaRect.height * 0.5);
    
    const powerup = document.createElement('div');
    powerup.className = 'powerup';
    powerup.innerHTML = `<div class="powerup-body">${powerUpType.icon}</div>`;
    powerup.style.left = x + 'px';
    powerup.style.top = y + 'px';
    
    const powerupData = {
        element: powerup,
        type: powerUpType,
        x: x,
        y: y
    };
    
    const handleTap = (e) => {
        e.preventDefault();
        e.stopPropagation();
        collectPowerup(powerupData);
    };
    
    powerup.addEventListener('click', handleTap);
    powerup.addEventListener('touchend', handleTap);
    
    arena.appendChild(powerup);
    state.powerups.push(powerupData);
    
    // Auto-remove after time
    setTimeout(() => {
        if (state.powerups.includes(powerupData)) {
            powerup.remove();
            const index = state.powerups.indexOf(powerupData);
            if (index > -1) state.powerups.splice(index, 1);
        }
    }, 6000);
}

function collectPowerup(powerupData) {
    if (!state.isPlaying) return;
    
    sounds.powerup();
    
    powerupData.element.classList.add('collected');
    setTimeout(() => powerupData.element.remove(), 300);
    
    const index = state.powerups.indexOf(powerupData);
    if (index > -1) state.powerups.splice(index, 1);
    
    applyPowerup(powerupData.type);
}

function applyPowerup(powerUp) {
    showScorePopup(
        elements.gameArena.offsetWidth / 2, 
        elements.gameArena.offsetHeight / 2, 
        powerUp.name, 
        'powerup'
    );
    
    switch (powerUp.id) {
        case 'shield':
            state.hasShield = true;
            elements.stationShield.classList.remove('hidden');
            showEffectBadge('shield', '🛡️ Shield');
            setTimeout(() => {
                state.hasShield = false;
                elements.stationShield.classList.add('hidden');
                removeEffectBadge('shield');
            }, powerUp.duration);
            break;
            
        case 'slowmo':
            state.slowMotion = true;
            showEffectBadge('slowmo', '⏰ Slow-Mo');
            setTimeout(() => {
                state.slowMotion = false;
                removeEffectBadge('slowmo');
            }, powerUp.duration);
            break;
            
        case 'repair':
            state.health = Math.min(state.maxHealth, state.health + 30);
            updateHealthDisplay();
            break;
            
        case 'nuke':
            // Destroy all meteors
            state.meteors.forEach(meteor => {
                state.meteorsDestroyed++;
                showExplosion(meteor.x, meteor.y);
                meteor.element.classList.add('exploding');
                setTimeout(() => meteor.element.remove(), 300);
            });
            elements.meteorsDestroyed.textContent = state.meteorsDestroyed;
            state.meteors = [];
            sounds.explosion();
            break;
    }
}

function showEffectBadge(id, text) {
    const badge = document.createElement('div');
    badge.className = 'effect-badge';
    badge.id = 'effect-' + id;
    badge.textContent = text;
    elements.activeEffects.appendChild(badge);
}

function removeEffectBadge(id) {
    const badge = document.getElementById('effect-' + id);
    if (badge) badge.remove();
}

function endGame() {
    state.isPlaying = false;
    
    clearInterval(state.gameLoop);
    clearTimeout(state.spawnInterval);
    clearInterval(state.powerupInterval);
    
    sounds.gameOver();
    
    // Check record
    const isNewRecord = state.survivalTime > state.bestTime;
    if (isNewRecord) {
        state.bestTime = Math.floor(state.survivalTime);
        localStorage.setItem('meteor-besttime', state.bestTime);
        updateBestTimeDisplay();
    }
    
    setTimeout(() => showResults(isNewRecord), 500);
}

function showResults(isNewRecord) {
    showScreen('result');
    
    const accuracy = state.totalClicks > 0 
        ? Math.round((state.meteorsDestroyed / (state.meteorsDestroyed + Math.floor(state.survivalTime / 2))) * 100)
        : 0;
    
    elements.finalTime.textContent = formatTime(state.survivalTime);
    elements.finalDestroyed.textContent = state.meteorsDestroyed;
    elements.finalWaves.textContent = state.wave;
    elements.finalAccuracy.textContent = Math.min(100, accuracy) + '%';
    
    if (isNewRecord) {
        elements.newRecord.classList.remove('hidden');
    } else {
        elements.newRecord.classList.add('hidden');
    }
}

// Start
init();

