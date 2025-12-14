// Audio Context
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Sound Effects
const sounds = {
    launch: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    },
    
    hit: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    },
    
    destroy: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    },
    
    win: () => {
        if (!audioCtx) return;
        [523, 659, 784, 1047].forEach((freq, i) => {
            setTimeout(() => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.2);
            }, i * 100);
        });
    },
    
    lose: () => {
        if (!audioCtx) return;
        [300, 250, 200].forEach((freq, i) => {
            setTimeout(() => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.2);
            }, i * 150);
        });
    }
};

// Canvas setup
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Game constants
const GRAVITY = 0.3;
const FRICTION = 0.99;
const BOUNCE = 0.6;
const SLINGSHOT_POWER = 0.15;

// Level definitions
const levels = [
    {
        blocks: [
            { x: 0.7, y: 0.7, w: 0.08, h: 0.2, type: 'wood' },
            { x: 0.8, y: 0.7, w: 0.08, h: 0.2, type: 'wood' },
            { x: 0.75, y: 0.55, w: 0.2, h: 0.06, type: 'wood' },
            { x: 0.75, y: 0.48, w: 0.06, h: 0.06, type: 'target' }
        ],
        ammo: 3
    },
    {
        blocks: [
            { x: 0.65, y: 0.7, w: 0.06, h: 0.2, type: 'wood' },
            { x: 0.75, y: 0.7, w: 0.06, h: 0.2, type: 'wood' },
            { x: 0.85, y: 0.7, w: 0.06, h: 0.2, type: 'wood' },
            { x: 0.7, y: 0.55, w: 0.15, h: 0.05, type: 'wood' },
            { x: 0.8, y: 0.55, w: 0.15, h: 0.05, type: 'wood' },
            { x: 0.75, y: 0.45, w: 0.06, h: 0.08, type: 'stone' },
            { x: 0.75, y: 0.35, w: 0.06, h: 0.06, type: 'target' }
        ],
        ammo: 4
    },
    {
        blocks: [
            { x: 0.6, y: 0.7, w: 0.05, h: 0.2, type: 'stone' },
            { x: 0.7, y: 0.7, w: 0.05, h: 0.2, type: 'wood' },
            { x: 0.8, y: 0.7, w: 0.05, h: 0.2, type: 'wood' },
            { x: 0.9, y: 0.7, w: 0.05, h: 0.2, type: 'stone' },
            { x: 0.65, y: 0.55, w: 0.12, h: 0.04, type: 'wood' },
            { x: 0.85, y: 0.55, w: 0.12, h: 0.04, type: 'wood' },
            { x: 0.75, y: 0.55, w: 0.1, h: 0.04, type: 'stone' },
            { x: 0.65, y: 0.48, w: 0.05, h: 0.05, type: 'target' },
            { x: 0.85, y: 0.48, w: 0.05, h: 0.05, type: 'target' }
        ],
        ammo: 5
    },
    {
        blocks: [
            { x: 0.55, y: 0.7, w: 0.04, h: 0.2, type: 'wood' },
            { x: 0.65, y: 0.7, w: 0.04, h: 0.25, type: 'wood' },
            { x: 0.75, y: 0.7, w: 0.04, h: 0.3, type: 'stone' },
            { x: 0.85, y: 0.7, w: 0.04, h: 0.25, type: 'wood' },
            { x: 0.95, y: 0.7, w: 0.04, h: 0.2, type: 'wood' },
            { x: 0.6, y: 0.55, w: 0.1, h: 0.04, type: 'wood' },
            { x: 0.7, y: 0.48, w: 0.1, h: 0.04, type: 'wood' },
            { x: 0.8, y: 0.48, w: 0.1, h: 0.04, type: 'wood' },
            { x: 0.9, y: 0.55, w: 0.1, h: 0.04, type: 'wood' },
            { x: 0.75, y: 0.38, w: 0.06, h: 0.06, type: 'target' }
        ],
        ammo: 5
    },
    {
        blocks: [
            { x: 0.5, y: 0.7, w: 0.05, h: 0.2, type: 'stone' },
            { x: 0.6, y: 0.7, w: 0.05, h: 0.2, type: 'stone' },
            { x: 0.55, y: 0.55, w: 0.15, h: 0.05, type: 'stone' },
            { x: 0.55, y: 0.48, w: 0.05, h: 0.05, type: 'target' },
            { x: 0.8, y: 0.7, w: 0.05, h: 0.2, type: 'stone' },
            { x: 0.9, y: 0.7, w: 0.05, h: 0.2, type: 'stone' },
            { x: 0.85, y: 0.55, w: 0.15, h: 0.05, type: 'stone' },
            { x: 0.85, y: 0.48, w: 0.05, h: 0.05, type: 'target' },
            { x: 0.7, y: 0.7, w: 0.05, h: 0.15, type: 'wood' },
            { x: 0.7, y: 0.52, w: 0.05, h: 0.05, type: 'target' }
        ],
        ammo: 6
    }
];

// Game state
const state = {
    currentLevel: 0,
    score: 0,
    ammo: 3,
    shotsUsed: 0,
    blocksDestroyed: 0,
    
    // Slingshot
    slingshotX: 0,
    slingshotY: 0,
    isDragging: false,
    dragX: 0,
    dragY: 0,
    
    // Projectile
    projectile: null,
    projectileActive: false,
    
    // Blocks
    blocks: [],
    
    // Physics
    groundY: 0,
    
    // Animation
    animationId: null,
    settling: false,
    settleTimer: 0
};

// DOM Elements
const elements = {
    menuScreen: document.getElementById('menu-screen'),
    gameScreen: document.getElementById('game-screen'),
    resultScreen: document.getElementById('result-screen'),
    gameoverScreen: document.getElementById('gameover-screen'),
    
    levelNumber: document.getElementById('level-number'),
    ammoIcons: document.getElementById('ammo-icons'),
    score: document.getElementById('score'),
    gameMessage: document.getElementById('game-message'),
    messageText: document.getElementById('message-text'),
    
    finalScore: document.getElementById('final-score'),
    shotsUsed: document.getElementById('shots-used'),
    blocksDestroyed: document.getElementById('blocks-destroyed'),
    
    startBtn: document.getElementById('start-btn'),
    restartBtn: document.getElementById('restart-btn'),
    nextLevelBtn: document.getElementById('next-level-btn'),
    retryBtn: document.getElementById('retry-btn'),
    menuBtn: document.getElementById('menu-btn'),
    menuBtn2: document.getElementById('menu-btn-2')
};

// Initialize
function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Mouse events
    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseleave', handleEnd);
    
    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Buttons
    elements.startBtn.addEventListener('click', startGame);
    elements.restartBtn.addEventListener('click', restartLevel);
    elements.nextLevelBtn.addEventListener('click', nextLevel);
    elements.retryBtn.addEventListener('click', restartLevel);
    elements.menuBtn.addEventListener('click', showMenu);
    elements.menuBtn2.addEventListener('click', showMenu);
    
    // Prevent context menu
    canvas.addEventListener('contextmenu', e => e.preventDefault());
}

function resizeCanvas() {
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    const hudHeight = document.querySelector('.game-hud').offsetHeight;
    
    canvas.width = rect.width;
    canvas.height = rect.height - hudHeight;
    
    // Update ground position
    state.groundY = canvas.height * 0.85;
    
    // Update slingshot position
    state.slingshotX = canvas.width * 0.15;
    state.slingshotY = state.groundY - 20;
    
    // Recalculate block positions if game is active
    if (state.blocks.length > 0) {
        loadLevel(state.currentLevel);
    }
}

function showScreen(screenName) {
    elements.menuScreen.classList.add('hidden');
    elements.gameScreen.classList.add('hidden');
    elements.resultScreen.classList.add('hidden');
    elements.gameoverScreen.classList.add('hidden');
    
    if (screenName === 'menu') elements.menuScreen.classList.remove('hidden');
    if (screenName === 'game') elements.gameScreen.classList.remove('hidden');
    if (screenName === 'result') elements.resultScreen.classList.remove('hidden');
    if (screenName === 'gameover') elements.gameoverScreen.classList.remove('hidden');
}

function showMenu() {
    cancelAnimationFrame(state.animationId);
    showScreen('menu');
}

function startGame() {
    initAudio();
    state.currentLevel = 0;
    state.score = 0;
    loadLevel(0);
    showScreen('game');
    gameLoop();
}

function loadLevel(levelIndex) {
    const level = levels[levelIndex % levels.length];
    
    state.ammo = level.ammo;
    state.shotsUsed = 0;
    state.blocksDestroyed = 0;
    state.projectile = null;
    state.projectileActive = false;
    state.isDragging = false;
    state.settling = false;
    state.settleTimer = 0;
    
    // Create blocks
    state.blocks = level.blocks.map(b => ({
        x: b.x * canvas.width,
        y: b.y * canvas.height,
        w: b.w * canvas.width,
        h: b.h * canvas.height,
        type: b.type,
        vx: 0,
        vy: 0,
        health: b.type === 'stone' ? 3 : b.type === 'wood' ? 2 : 1,
        rotation: 0,
        rotationSpeed: 0,
        grounded: false
    }));
    
    updateUI();
    elements.gameMessage.classList.add('hidden');
}

function updateUI() {
    elements.levelNumber.textContent = state.currentLevel + 1;
    elements.score.textContent = state.score;
    
    let ammoStr = '';
    for (let i = 0; i < state.ammo; i++) {
        ammoStr += '🔴';
    }
    elements.ammoIcons.textContent = ammoStr || '💨';
}

// Input handlers
function handleStart(e) {
    if (state.projectileActive || state.settling || state.ammo <= 0) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const dist = Math.hypot(x - state.slingshotX, y - state.slingshotY);
    if (dist < 60) {
        state.isDragging = true;
        state.dragX = x;
        state.dragY = y;
    }
}

function handleMove(e) {
    if (!state.isDragging) return;
    
    const rect = canvas.getBoundingClientRect();
    state.dragX = e.clientX - rect.left;
    state.dragY = e.clientY - rect.top;
    
    // Limit drag distance
    const dx = state.dragX - state.slingshotX;
    const dy = state.dragY - state.slingshotY;
    const dist = Math.hypot(dx, dy);
    const maxDist = 100;
    
    if (dist > maxDist) {
        state.dragX = state.slingshotX + (dx / dist) * maxDist;
        state.dragY = state.slingshotY + (dy / dist) * maxDist;
    }
}

function handleEnd(e) {
    if (!state.isDragging) return;
    state.isDragging = false;
    
    const dx = state.slingshotX - state.dragX;
    const dy = state.slingshotY - state.dragY;
    const dist = Math.hypot(dx, dy);
    
    if (dist > 20) {
        launchProjectile(dx, dy);
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    if (e.touches.length > 0) {
        const touch = e.touches[0];
        handleStart({ clientX: touch.clientX, clientY: touch.clientY });
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    if (e.touches.length > 0) {
        const touch = e.touches[0];
        handleMove({ clientX: touch.clientX, clientY: touch.clientY });
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    handleEnd({});
}

function launchProjectile(dx, dy) {
    sounds.launch();
    
    state.ammo--;
    state.shotsUsed++;
    
    state.projectile = {
        x: state.slingshotX,
        y: state.slingshotY,
        vx: dx * SLINGSHOT_POWER,
        vy: dy * SLINGSHOT_POWER,
        radius: 15
    };
    
    state.projectileActive = true;
    updateUI();
}

function gameLoop() {
    update();
    render();
    state.animationId = requestAnimationFrame(gameLoop);
}

function update() {
    // Update projectile
    if (state.projectileActive && state.projectile) {
        state.projectile.vy += GRAVITY;
        state.projectile.x += state.projectile.vx;
        state.projectile.y += state.projectile.vy;
        
        // Ground collision
        if (state.projectile.y > state.groundY - state.projectile.radius) {
            state.projectile.y = state.groundY - state.projectile.radius;
            state.projectile.vy *= -BOUNCE;
            state.projectile.vx *= FRICTION;
            
            if (Math.abs(state.projectile.vy) < 1) {
                state.projectile.vy = 0;
            }
        }
        
        // Wall collisions
        if (state.projectile.x < state.projectile.radius) {
            state.projectile.x = state.projectile.radius;
            state.projectile.vx *= -BOUNCE;
        }
        if (state.projectile.x > canvas.width - state.projectile.radius) {
            state.projectile.x = canvas.width - state.projectile.radius;
            state.projectile.vx *= -BOUNCE;
        }
        
        // Block collisions
        for (let i = state.blocks.length - 1; i >= 0; i--) {
            const block = state.blocks[i];
            if (checkCollision(state.projectile, block)) {
                handleBlockHit(block, i);
            }
        }
        
        // Check if projectile stopped
        const speed = Math.hypot(state.projectile.vx, state.projectile.vy);
        if (speed < 0.5 && state.projectile.y >= state.groundY - state.projectile.radius - 5) {
            state.projectileActive = false;
            state.settling = true;
            state.settleTimer = 60;
        }
        
        // Out of bounds
        if (state.projectile.y > canvas.height + 100) {
            state.projectileActive = false;
            state.settling = true;
            state.settleTimer = 60;
        }
    }
    
    // Update blocks physics
    for (let i = state.blocks.length - 1; i >= 0; i--) {
        const block = state.blocks[i];
        
        // Apply gravity
        if (!block.grounded) {
            block.vy += GRAVITY * 0.5;
        }
        
        block.x += block.vx;
        block.y += block.vy;
        block.rotation += block.rotationSpeed;
        
        // Friction
        block.vx *= 0.98;
        block.vy *= 0.98;
        block.rotationSpeed *= 0.95;
        
        // Ground collision
        if (block.y + block.h / 2 > state.groundY) {
            block.y = state.groundY - block.h / 2;
            block.vy *= -0.3;
            block.vx *= 0.8;
            block.grounded = true;
            
            if (Math.abs(block.vy) < 1) {
                block.vy = 0;
            }
        }
        
        // Wall collision
        if (block.x - block.w / 2 < 0) {
            block.x = block.w / 2;
            block.vx *= -0.5;
        }
        if (block.x + block.w / 2 > canvas.width) {
            block.x = canvas.width - block.w / 2;
            block.vx *= -0.5;
        }
        
        // Block-block collision (simplified)
        for (let j = i + 1; j < state.blocks.length; j++) {
            const other = state.blocks[j];
            if (blocksOverlap(block, other)) {
                separateBlocks(block, other);
            }
        }
        
        // Check if block fell off screen
        if (block.y > canvas.height + 100) {
            destroyBlock(i);
        }
    }
    
    // Settling phase
    if (state.settling) {
        state.settleTimer--;
        if (state.settleTimer <= 0) {
            state.settling = false;
            checkWinLose();
        }
    }
}

function checkCollision(proj, block) {
    const closestX = Math.max(block.x - block.w / 2, Math.min(proj.x, block.x + block.w / 2));
    const closestY = Math.max(block.y - block.h / 2, Math.min(proj.y, block.y + block.h / 2));
    
    const dx = proj.x - closestX;
    const dy = proj.y - closestY;
    
    return (dx * dx + dy * dy) < (proj.radius * proj.radius);
}

function handleBlockHit(block, index) {
    sounds.hit();
    
    const impactForce = Math.hypot(state.projectile.vx, state.projectile.vy);
    
    // Apply force to block
    block.vx += state.projectile.vx * 0.5;
    block.vy += state.projectile.vy * 0.3;
    block.rotationSpeed += (Math.random() - 0.5) * 0.2;
    block.grounded = false;
    
    // Damage block
    block.health -= impactForce * 0.1;
    
    if (block.health <= 0) {
        destroyBlock(index);
    }
    
    // Bounce projectile
    state.projectile.vx *= -0.5;
    state.projectile.vy *= 0.5;
}

function destroyBlock(index) {
    const block = state.blocks[index];
    sounds.destroy();
    
    state.blocksDestroyed++;
    
    // Score based on type
    let points = 10;
    if (block.type === 'stone') points = 30;
    if (block.type === 'target') points = 100;
    
    state.score += points;
    elements.score.textContent = state.score;
    
    state.blocks.splice(index, 1);
}

function blocksOverlap(a, b) {
    return Math.abs(a.x - b.x) < (a.w + b.w) / 2 &&
           Math.abs(a.y - b.y) < (a.h + b.h) / 2;
}

function separateBlocks(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const overlapX = (a.w + b.w) / 2 - Math.abs(dx);
    const overlapY = (a.h + b.h) / 2 - Math.abs(dy);
    
    if (overlapX < overlapY) {
        const sign = dx > 0 ? 1 : -1;
        a.x += overlapX * sign * 0.5;
        b.x -= overlapX * sign * 0.5;
        const avgVx = (a.vx + b.vx) / 2;
        a.vx = avgVx + sign * 0.5;
        b.vx = avgVx - sign * 0.5;
    } else {
        const sign = dy > 0 ? 1 : -1;
        a.y += overlapY * sign * 0.5;
        b.y -= overlapY * sign * 0.5;
        const avgVy = (a.vy + b.vy) / 2;
        a.vy = avgVy + sign * 0.5;
        b.vy = avgVy - sign * 0.5;
        
        if (sign < 0) {
            a.grounded = false;
        } else {
            b.grounded = false;
        }
    }
}

function checkWinLose() {
    // Check if all targets destroyed
    const remainingTargets = state.blocks.filter(b => b.type === 'target');
    
    if (remainingTargets.length === 0) {
        // Win!
        sounds.win();
        showResult(true);
    } else if (state.ammo <= 0 && !state.projectileActive) {
        // Lose
        sounds.lose();
        showResult(false);
    }
}

function showResult(won) {
    if (won) {
        elements.finalScore.textContent = state.score;
        elements.shotsUsed.textContent = state.shotsUsed;
        elements.blocksDestroyed.textContent = state.blocksDestroyed;
        
        if (state.currentLevel >= levels.length - 1) {
            elements.nextLevelBtn.textContent = 'Play Again';
        } else {
            elements.nextLevelBtn.textContent = 'Next Level';
        }
        
        showScreen('result');
    } else {
        showScreen('gameover');
    }
}

function restartLevel() {
    loadLevel(state.currentLevel);
    showScreen('game');
}

function nextLevel() {
    state.currentLevel++;
    if (state.currentLevel >= levels.length) {
        state.currentLevel = 0;
        state.score = 0;
    }
    loadLevel(state.currentLevel);
    showScreen('game');
}

function render() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Sky gradient (already in CSS, but add clouds)
    drawClouds();
    
    // Ground
    ctx.fillStyle = '#7EC850';
    ctx.fillRect(0, state.groundY, canvas.width, canvas.height - state.groundY);
    
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(0, state.groundY + 10, canvas.width, canvas.height - state.groundY - 10);
    
    // Slingshot
    drawSlingshot();
    
    // Blocks
    for (const block of state.blocks) {
        drawBlock(block);
    }
    
    // Projectile
    if (state.projectile) {
        drawProjectile();
    }
    
    // Trajectory preview
    if (state.isDragging) {
        drawTrajectory();
    }
}

function drawClouds() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    // Simple cloud shapes
    const clouds = [
        { x: canvas.width * 0.2, y: 50 },
        { x: canvas.width * 0.5, y: 80 },
        { x: canvas.width * 0.8, y: 40 }
    ];
    
    for (const cloud of clouds) {
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, 30, 0, Math.PI * 2);
        ctx.arc(cloud.x + 25, cloud.y - 10, 25, 0, Math.PI * 2);
        ctx.arc(cloud.x + 50, cloud.y, 30, 0, Math.PI * 2);
        ctx.arc(cloud.x + 25, cloud.y + 10, 20, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawSlingshot() {
    const x = state.slingshotX;
    const y = state.slingshotY;
    
    // Slingshot base
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(x - 5, y - 40, 10, 50);
    
    // Slingshot Y shape
    ctx.beginPath();
    ctx.moveTo(x - 5, y - 40);
    ctx.lineTo(x - 20, y - 70);
    ctx.lineTo(x - 15, y - 70);
    ctx.lineTo(x, y - 50);
    ctx.lineTo(x + 15, y - 70);
    ctx.lineTo(x + 20, y - 70);
    ctx.lineTo(x + 5, y - 40);
    ctx.fill();
    
    // Rubber band
    if (state.isDragging) {
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x - 17, y - 65);
        ctx.lineTo(state.dragX, state.dragY);
        ctx.lineTo(x + 17, y - 65);
        ctx.stroke();
        
        // Projectile in sling
        ctx.beginPath();
        ctx.arc(state.dragX, state.dragY, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#E74C3C';
        ctx.fill();
        ctx.strokeStyle = '#C0392B';
        ctx.lineWidth = 3;
        ctx.stroke();
    } else if (!state.projectileActive && state.ammo > 0) {
        // Ready projectile
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x - 17, y - 65);
        ctx.lineTo(x, y - 55);
        ctx.lineTo(x + 17, y - 65);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(x, y - 55, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#E74C3C';
        ctx.fill();
        ctx.strokeStyle = '#C0392B';
        ctx.lineWidth = 3;
        ctx.stroke();
    } else {
        // No projectile
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x - 17, y - 65);
        ctx.lineTo(x + 17, y - 65);
        ctx.stroke();
    }
}

function drawBlock(block) {
    ctx.save();
    ctx.translate(block.x, block.y);
    ctx.rotate(block.rotation);
    
    let color, strokeColor;
    if (block.type === 'wood') {
        color = '#DEB887';
        strokeColor = '#8B7355';
    } else if (block.type === 'stone') {
        color = '#A0A0A0';
        strokeColor = '#707070';
    } else if (block.type === 'target') {
        color = '#FFD700';
        strokeColor = '#DAA520';
    }
    
    // Draw block
    ctx.fillStyle = color;
    ctx.fillRect(-block.w / 2, -block.h / 2, block.w, block.h);
    
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(-block.w / 2, -block.h / 2, block.w, block.h);
    
    // Add texture for wood
    if (block.type === 'wood') {
        ctx.strokeStyle = 'rgba(139, 115, 85, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            const y = -block.h / 2 + block.h * (i + 1) / 4;
            ctx.beginPath();
            ctx.moveTo(-block.w / 2, y);
            ctx.lineTo(block.w / 2, y);
            ctx.stroke();
        }
    }
    
    // Target icon
    if (block.type === 'target') {
        ctx.fillStyle = '#FF6B35';
        ctx.font = `${Math.min(block.w, block.h) * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🐷', 0, 0);
    }
    
    ctx.restore();
}

function drawProjectile() {
    const p = state.projectile;
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#E74C3C';
    ctx.fill();
    ctx.strokeStyle = '#C0392B';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Simple face
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(p.x - 4, p.y - 3, 3, 0, Math.PI * 2);
    ctx.arc(p.x + 4, p.y - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(p.x - 4, p.y - 3, 1.5, 0, Math.PI * 2);
    ctx.arc(p.x + 4, p.y - 3, 1.5, 0, Math.PI * 2);
    ctx.fill();
}

function drawTrajectory() {
    const dx = state.slingshotX - state.dragX;
    const dy = state.slingshotY - state.dragY;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    
    let x = state.slingshotX;
    let y = state.slingshotY;
    let vx = dx * SLINGSHOT_POWER;
    let vy = dy * SLINGSHOT_POWER;
    
    for (let i = 0; i < 30; i++) {
        vy += GRAVITY;
        x += vx;
        y += vy;
        
        if (y > state.groundY) break;
        
        const size = 4 - (i * 0.1);
        if (size > 0) {
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Start
init();

