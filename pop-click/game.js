// Audio Context
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Sound Effects
const sounds = {
    pop: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    },
    
    bonus: () => {
        if (!audioCtx) return;
        [800, 1000, 1200].forEach((freq, i) => {
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
            }, i * 80);
        });
    },
    
    hit: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.2);
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    },
    
    powerup: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
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
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    },
    
    gameOver: () => {
        if (!audioCtx) return;
        [400, 350, 300, 250].forEach((freq, i) => {
            setTimeout(() => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.3);
            }, i * 150);
        });
    }
};

// Item Types
const itemTypes = {
    target: {
        icon: '🎯',
        points: 10,
        size: 60,
        lifetime: 2000
    },
    bonus: {
        icon: '⭐',
        points: 50,
        size: 50,
        lifetime: 1200
    },
    obstacle: {
        icon: '💣',
        points: -30,
        size: 55,
        lifetime: 2500
    }
};

// Power-up Types
const powerUpTypes = [
    { id: 'freeze', icon: '❄️', name: 'Freeze', duration: 3000 },
    { id: 'double', icon: '✨', name: '2x Points', duration: 5000 },
    { id: 'time', icon: '⏰', name: '+5 Seconds', duration: 0 },
    { id: 'shield', icon: '🛡️', name: 'Shield', duration: 4000 },
    { id: 'frenzy', icon: '🔥', name: 'Frenzy', duration: 3000 }
];

// Difficulty Settings
const difficulties = {
    easy: {
        gameDuration: 30,
        spawnInterval: 1000,
        targetChance: 0.65,
        bonusChance: 0.15,
        obstacleChance: 0.15,
        powerupChance: 0.05,
        maxItems: 5
    },
    medium: {
        gameDuration: 30,
        spawnInterval: 750,
        targetChance: 0.55,
        bonusChance: 0.15,
        obstacleChance: 0.22,
        powerupChance: 0.08,
        maxItems: 7
    },
    hard: {
        gameDuration: 30,
        spawnInterval: 500,
        targetChance: 0.45,
        bonusChance: 0.15,
        obstacleChance: 0.30,
        powerupChance: 0.10,
        maxItems: 10
    }
};

// Game State
const state = {
    isPlaying: false,
    difficulty: 'easy',
    score: 0,
    timeLeft: 30,
    combo: 1,
    maxCombo: 1,
    targetsHit: 0,
    totalClicks: 0,
    totalTargets: 0,
    highScore: parseInt(localStorage.getItem('popclick-highscore')) || 0,
    
    // Active power-ups
    doublePoints: false,
    frozen: false,
    shield: false,
    frenzy: false,
    
    // Timers
    timerInterval: null,
    spawnInterval: null,
    activeItems: []
};

// DOM Elements
const elements = {
    menuScreen: document.getElementById('menu-screen'),
    gameScreen: document.getElementById('game-screen'),
    resultScreen: document.getElementById('result-screen'),
    
    highScore: document.getElementById('high-score'),
    score: document.getElementById('score'),
    timer: document.getElementById('timer'),
    combo: document.getElementById('combo'),
    timerDisplay: document.querySelector('.timer-display'),
    
    gameArena: document.getElementById('game-arena'),
    activeEffects: document.getElementById('active-effects'),
    
    countdown: document.getElementById('countdown'),
    countdownNumber: document.getElementById('countdown-number'),
    
    resultIcon: document.getElementById('result-icon'),
    resultTitle: document.getElementById('result-title'),
    finalScore: document.getElementById('final-score'),
    targetsHit: document.getElementById('targets-hit'),
    maxCombo: document.getElementById('max-combo'),
    accuracy: document.getElementById('accuracy'),
    newRecord: document.getElementById('new-record'),
    
    startBtn: document.getElementById('start-btn'),
    playAgainBtn: document.getElementById('play-again-btn'),
    menuBtn: document.getElementById('menu-btn'),
    diffButtons: document.querySelectorAll('.diff-btn')
};

// Initialize
function init() {
    elements.highScore.textContent = state.highScore;
    
    // Event listeners
    elements.startBtn.addEventListener('click', startGame);
    elements.startBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        startGame();
    });
    
    elements.playAgainBtn.addEventListener('click', startGame);
    elements.playAgainBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        startGame();
    });
    
    elements.menuBtn.addEventListener('click', showMenu);
    elements.menuBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        showMenu();
    });
    
    elements.diffButtons.forEach(btn => {
        btn.addEventListener('click', () => selectDifficulty(btn.dataset.difficulty));
    });
    
    // Prevent zoom on double tap
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
}

let lastTouchEnd = 0;

function selectDifficulty(diff) {
    state.difficulty = diff;
    elements.diffButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.difficulty === diff);
    });
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
    const settings = difficulties[state.difficulty];
    
    state.isPlaying = false;
    state.score = 0;
    state.timeLeft = settings.gameDuration;
    state.combo = 1;
    state.maxCombo = 1;
    state.targetsHit = 0;
    state.totalClicks = 0;
    state.totalTargets = 0;
    state.doublePoints = false;
    state.frozen = false;
    state.shield = false;
    state.frenzy = false;
    state.activeItems = [];
    
    elements.score.textContent = '0';
    elements.timer.textContent = state.timeLeft;
    elements.combo.textContent = 'x1';
    elements.gameArena.innerHTML = '';
    elements.activeEffects.innerHTML = '';
    elements.timerDisplay.classList.remove('warning');
    elements.gameArena.classList.remove('frozen');
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
            elements.countdownNumber.textContent = 'GO!';
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
    const settings = difficulties[state.difficulty];
    
    // Start timer
    state.timerInterval = setInterval(() => {
        if (state.frozen) return;
        
        state.timeLeft -= 0.1;
        if (state.timeLeft <= 0) {
            state.timeLeft = 0;
            endGame();
        }
        elements.timer.textContent = Math.ceil(state.timeLeft);
        
        // Warning when low time
        if (state.timeLeft <= 5) {
            elements.timerDisplay.classList.add('warning');
        }
    }, 100);
    
    // Start spawning
    spawnItem();
    state.spawnInterval = setInterval(() => {
        if (!state.isPlaying) return;
        if (state.frozen) return;
        
        const currentMax = state.frenzy ? settings.maxItems + 5 : settings.maxItems;
        if (state.activeItems.length < currentMax) {
            spawnItem();
            if (state.frenzy && Math.random() > 0.5) {
                spawnItem(); // Extra spawns during frenzy
            }
        }
    }, state.frenzy ? settings.spawnInterval / 2 : settings.spawnInterval);
}

function spawnItem() {
    const settings = difficulties[state.difficulty];
    const rand = Math.random();
    
    let type, itemData;
    
    if (rand < settings.targetChance) {
        type = 'target';
        itemData = itemTypes.target;
    } else if (rand < settings.targetChance + settings.bonusChance) {
        type = 'bonus';
        itemData = itemTypes.bonus;
    } else if (rand < settings.targetChance + settings.bonusChance + settings.obstacleChance) {
        type = 'obstacle';
        itemData = itemTypes.obstacle;
    } else {
        type = 'powerup';
        itemData = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    }
    
    createItem(type, itemData);
}

function createItem(type, data) {
    const arena = elements.gameArena;
    const arenaRect = arena.getBoundingClientRect();
    
    const size = type === 'powerup' ? 55 : data.size;
    const padding = 10;
    
    // Random position
    const x = padding + Math.random() * (arenaRect.width - size - padding * 2);
    const y = padding + Math.random() * (arenaRect.height - size - padding * 2);
    
    const item = document.createElement('div');
    item.className = `item ${type}`;
    item.style.width = size + 'px';
    item.style.height = size + 'px';
    item.style.left = x + 'px';
    item.style.top = y + 'px';
    item.textContent = type === 'powerup' ? data.icon : data.icon;
    
    // Store item data
    const itemObj = {
        element: item,
        type: type,
        data: data,
        timeout: null
    };
    
    // Click/touch handler
    const handleTap = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleItemClick(itemObj);
    };
    
    item.addEventListener('click', handleTap);
    item.addEventListener('touchend', handleTap);
    
    arena.appendChild(item);
    state.activeItems.push(itemObj);
    
    if (type !== 'powerup') {
        state.totalTargets++;
    }
    
    // Auto-remove after lifetime
    const lifetime = type === 'powerup' ? 2500 : (state.frenzy ? data.lifetime * 0.7 : data.lifetime);
    itemObj.timeout = setTimeout(() => {
        if (state.activeItems.includes(itemObj)) {
            removeItem(itemObj, false);
        }
    }, lifetime);
}

function handleItemClick(itemObj) {
    if (!state.isPlaying) return;
    
    state.totalClicks++;
    
    const { type, data } = itemObj;
    const rect = itemObj.element.getBoundingClientRect();
    const arenaRect = elements.gameArena.getBoundingClientRect();
    
    if (type === 'target' || type === 'bonus') {
        // Hit a target
        let points = data.points * state.combo;
        if (state.doublePoints) points *= 2;
        
        state.score += points;
        state.targetsHit++;
        state.combo++;
        if (state.combo > state.maxCombo) state.maxCombo = state.combo;
        
        elements.score.textContent = state.score;
        elements.combo.textContent = 'x' + state.combo;
        
        showScorePopup(rect.left - arenaRect.left + rect.width / 2, rect.top - arenaRect.top, '+' + points, type === 'bonus' ? 'bonus' : 'positive');
        
        if (type === 'bonus') {
            sounds.bonus();
        } else {
            sounds.pop();
        }
        
        removeItem(itemObj, true);
        
    } else if (type === 'obstacle') {
        // Hit an obstacle
        if (state.shield) {
            // Shield protects
            state.shield = false;
            removeEffectBadge('shield');
            sounds.pop();
            showScorePopup(rect.left - arenaRect.left + rect.width / 2, rect.top - arenaRect.top, '🛡️ Blocked!', 'positive');
        } else {
            const points = data.points;
            state.score = Math.max(0, state.score + points);
            state.combo = 1;
            
            elements.score.textContent = state.score;
            elements.combo.textContent = 'x1';
            
            showScorePopup(rect.left - arenaRect.left + rect.width / 2, rect.top - arenaRect.top, points, 'negative');
            sounds.hit();
            
            // Screen shake
            elements.gameArena.classList.add('shake');
            setTimeout(() => elements.gameArena.classList.remove('shake'), 300);
        }
        
        removeItem(itemObj, true);
        
    } else if (type === 'powerup') {
        // Collect power-up
        sounds.powerup();
        activatePowerUp(data);
        removeItem(itemObj, true);
    }
}

function removeItem(itemObj, wasClicked) {
    clearTimeout(itemObj.timeout);
    
    const index = state.activeItems.indexOf(itemObj);
    if (index > -1) {
        state.activeItems.splice(index, 1);
    }
    
    if (wasClicked) {
        itemObj.element.classList.add('popping');
    } else {
        itemObj.element.classList.add('missed');
        // Reset combo on miss (only for targets)
        if (itemObj.type === 'target' || itemObj.type === 'bonus') {
            state.combo = 1;
            elements.combo.textContent = 'x1';
        }
    }
    
    setTimeout(() => {
        itemObj.element.remove();
    }, 300);
}

function showScorePopup(x, y, text, type) {
    const popup = document.createElement('div');
    popup.className = `score-popup ${type}`;
    popup.textContent = text;
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    
    elements.gameArena.appendChild(popup);
    
    setTimeout(() => popup.remove(), 800);
}

function activatePowerUp(powerUp) {
    switch (powerUp.id) {
        case 'freeze':
            state.frozen = true;
            elements.gameArena.classList.add('frozen');
            showEffectBadge('freeze', '❄️ Frozen');
            setTimeout(() => {
                state.frozen = false;
                elements.gameArena.classList.remove('frozen');
                removeEffectBadge('freeze');
            }, powerUp.duration);
            break;
            
        case 'double':
            state.doublePoints = true;
            showEffectBadge('double', '✨ 2x Points');
            setTimeout(() => {
                state.doublePoints = false;
                removeEffectBadge('double');
            }, powerUp.duration);
            break;
            
        case 'time':
            state.timeLeft = Math.min(state.timeLeft + 5, 60);
            elements.timer.textContent = Math.ceil(state.timeLeft);
            if (state.timeLeft > 5) {
                elements.timerDisplay.classList.remove('warning');
            }
            break;
            
        case 'shield':
            state.shield = true;
            showEffectBadge('shield', '🛡️ Shield');
            setTimeout(() => {
                if (state.shield) {
                    state.shield = false;
                    removeEffectBadge('shield');
                }
            }, powerUp.duration);
            break;
            
        case 'frenzy':
            state.frenzy = true;
            showEffectBadge('frenzy', '🔥 Frenzy');
            // Spawn extra items
            for (let i = 0; i < 3; i++) {
                setTimeout(() => spawnItem(), i * 200);
            }
            setTimeout(() => {
                state.frenzy = false;
                removeEffectBadge('frenzy');
            }, powerUp.duration);
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
    clearInterval(state.timerInterval);
    clearInterval(state.spawnInterval);
    
    // Clear remaining items
    state.activeItems.forEach(item => {
        clearTimeout(item.timeout);
        item.element.remove();
    });
    state.activeItems = [];
    
    sounds.gameOver();
    
    // Check high score
    const isNewRecord = state.score > state.highScore;
    if (isNewRecord) {
        state.highScore = state.score;
        localStorage.setItem('popclick-highscore', state.highScore);
        elements.highScore.textContent = state.highScore;
    }
    
    // Show results
    setTimeout(() => showResults(isNewRecord), 500);
}

function showResults(isNewRecord) {
    showScreen('result');
    
    const accuracy = state.totalClicks > 0 
        ? Math.round((state.targetsHit / state.totalClicks) * 100) 
        : 0;
    
    elements.finalScore.textContent = state.score;
    elements.targetsHit.textContent = state.targetsHit;
    elements.maxCombo.textContent = 'x' + state.maxCombo;
    elements.accuracy.textContent = accuracy + '%';
    
    if (isNewRecord) {
        elements.newRecord.classList.remove('hidden');
        elements.resultIcon.textContent = '🏆';
        elements.resultTitle.textContent = 'New Record!';
    } else if (state.score >= 500) {
        elements.newRecord.classList.add('hidden');
        elements.resultIcon.textContent = '🌟';
        elements.resultTitle.textContent = 'Amazing!';
    } else if (state.score >= 200) {
        elements.newRecord.classList.add('hidden');
        elements.resultIcon.textContent = '😎';
        elements.resultTitle.textContent = 'Great Job!';
    } else {
        elements.newRecord.classList.add('hidden');
        elements.resultIcon.textContent = '👍';
        elements.resultTitle.textContent = 'Good Try!';
    }
}

// Start
init();

