const GAME_WIDTH = 1600;
const GAME_HEIGHT = 900;

let player;
let playerIdle, playerRunning, playerJump1, playerJump2, playerDamage, playerDefeat;
let playerAttackIdle, playerAttackJump1, playerAttackJump2, playerAttackRunning;
let speed = 18;
let gravity = 0.8;
let jumpForce = -22;
let velocityY = 0;
let onGround = false;
let playerHealth = 10;
let isPlayerInvulnerable = false;
let invulnerabilityTimer = 0;

let isAttacking = false;
let attackCooldown = false;
let attackCooldownTime = 15;
let attackCooldownCounter = 0;
let attackDuration = 8;
let attackFrameCounter = 0;

let score = 0;

let pLife0, pLife1, pLife2, pLife3, pLife4, pLife5, pLife6, pLife7, pLife8, pLife9, pLife10;
let pLife0Img, pLife1Img, pLife2Img, pLife3Img, pLife4Img, pLife5Img, pLife6Img, pLife7Img, pLife8Img, pLife9Img, pLife10Img;
let currentLifeSprite;

let enemy1, enemy1Group;
let enemy1Idle, enemy1Running, enemy1PreAttack, enemy1Attack, enemy1Defeat;

let enemy2, enemy2Group;
let enemy2Walk, enemy2PreAttack, enemy2Attack, enemy2Damage, enemy2Defeat;

let enemy3, enemy3Group;
let enemy3Idle, enemy3Defeat;

let ground, groundImg;
let roof, roofImg;
let wall1, wall2;
let invWall1, invWall2;
let platform1, platform2, platform3, platform4, platformImg;
let miniPlatform1, miniPlatform2, miniPlatformImg;

let logo, logoImg;

let backgroundImg;

let menuMusic, battleMusic;
let currentMusic = null;
let musicStarted = false;

const STATE = { START: 1, WAVE1: 2, WAVE2: 3, WAVE3: 4, END: 5, PAUSED: 6 };
let gameState = STATE.START;
let previousState = null;

let wave2ScoreThreshold = 7;
let wave2Started = false;

let wave3ScoreThreshold = 20;
let wave3Started = false;

let playerWon = false;

let dashAvailable = true;
let dashCooldown = 0;
let dashCooldownFrames = 360;
let dashDistance = 250;
let isDashing = false;
let dashDirection = 0;
let dashSpeed = 36;
let dashFrames = 0;
let maxDashFrames = 7;

let enemy1SpawnCounter = 0;
let enemy2SpawnCounter = 0;
let enemy3SpawnCounter = 0;

let playerDamageHitbox, playerAttackHitbox;
let showHitboxes = false; //debug

function preload() {
    playerIdle = loadAnimation("./assets/player/playerIdle.png");
    playerRunning = loadAnimation("./assets/player/playerRunning1.png","./assets/player/playerRunning2.png");
    playerJump1 = loadAnimation("./assets/player/playerJump1.png");
    playerJump2 = loadAnimation("./assets/player/playerJump2.png");
    playerAttackIdle = loadAnimation("./assets/player/playerAttackIdle.png");
    playerAttackJump1 = loadAnimation("./assets/player/playerAttackJump1.png");
    playerAttackJump2 = loadAnimation("./assets/player/playerAttackJump2.png");
    playerAttackRunning = loadAnimation("./assets/player/playerAttackRunning1.png", "./assets/player/playerAttackRunning2.png");
    playerDamage = loadAnimation("./assets/player/playerDamage.png");
    playerDefeat = loadAnimation("./assets/player/playerDefeat.png");

    pLife10Img = loadImage("./assets/playerLife/10hp.png");
    pLife9Img = loadImage("./assets/playerLife/9hp.png");
    pLife8Img = loadImage("./assets/playerLife/8hp.png");
    pLife7Img = loadImage("./assets/playerLife/7hp.png");
    pLife6Img = loadImage("./assets/playerLife/6hp.png");
    pLife5Img = loadImage("./assets/playerLife/5hp.png");
    pLife4Img = loadImage("./assets/playerLife/4hp.png");
    pLife3Img = loadImage("./assets/playerLife/3hp.png");
    pLife2Img = loadImage("./assets/playerLife/2hp.png");
    pLife1Img = loadImage("./assets/playerLife/1hp.png");
    pLife0Img = loadImage("./assets/playerLife/0hp.png");

    enemy1Idle = loadAnimation("./assets/enemy1/enemy1Idle.png");
    enemy1Running = loadAnimation("./assets/enemy1/enemy1Running1.png", "./assets/enemy1/enemy1Running1.png", "./assets/enemy1/enemy1Running2.png");
    enemy1PreAttack = loadAnimation("./assets/enemy1/enemy1PreAttack.png");
    enemy1Attack = loadAnimation("./assets/enemy1/enemy1Attack.png");
    enemy1Defeat = loadAnimation("./assets/enemy1/enemy1Defeat.png");

    enemy2Walk = loadAnimation("./assets/enemy2/enemy2Walk1.png", "./assets/enemy2/enemy2Walk1.png", "./assets/enemy2/enemy2Walk2.png", "./assets/enemy2/enemy2Walk2.png");
    enemy2PreAttack = loadAnimation("./assets/enemy2/enemy2PreAttack.png");
    enemy2Attack = loadAnimation("./assets/enemy2/enemy2Attack.png");
    enemy2Damage = loadAnimation("./assets/enemy2/enemy2Damage.png");
    enemy2Defeat = loadAnimation("./assets/enemy2/enemy2Defeat.png");

    enemy3Idle = loadAnimation("./assets/enemy3/enemy3Idle1.png", "./assets/enemy3/enemy3Idle2.png", "./assets/enemy3/enemy3Idle1.png", "./assets/enemy3/enemy3Idle2.png");
    enemy3Defeat = loadAnimation("./assets/enemy3/enemy3Defeat.png");

    groundImg = loadImage("./assets/ground.png");
    roofImg = loadImage("./assets/ground.png");
    platformImg = loadImage("./assets/platform.png");
    miniPlatformImg = loadImage("./assets/miniPlatform.png");

    logoImg = loadImage("./assets/logo.png");

    menuMusic = loadSound("./assets/audio/menu.mp3");
    battleMusic = loadSound("./assets/audio/battle.ogg");
    if (menuMusic) menuMusic.setLoop(true);
    if (battleMusic) battleMusic.setLoop(true);

    backgroundImg = loadImage("./assets/background.png");
}

function setup() {
    let canvas = createCanvas(GAME_WIDTH, GAME_HEIGHT);
    canvas.parent('game-container');
    textFont('Pixelify Sans');

    player = createSprite(400, 400);
    player.addAnimation("p-idle", playerIdle);
    player.addAnimation("p-running", playerRunning);
    player.addAnimation("p-jump1", playerJump1);
    player.addAnimation("p-jump2", playerJump2);
    player.addAnimation("p-attack-idle", playerAttackIdle);
    player.addAnimation("p-attack-jump1", playerAttackJump1);
    player.addAnimation("p-attack-jump2", playerAttackJump2);
    player.addAnimation("p-attack-running", playerAttackRunning);
    player.addAnimation("p-damage", playerDamage);
    player.addAnimation("p-defeat", playerDefeat);
    player.changeAnimation("p-idle");
    player.scale = 0.8;
    player.setCollider("rectangle", 0, 0, 70, 90);

    playerDamageHitbox = createSprite(player.position.x, player.position.y, 40, 60);
    playerDamageHitbox.visible = showHitboxes;
    playerDamageHitbox.shapeColor = color(255, 0, 0, 150);

    playerAttackHitbox = createSprite(player.position.x, player.position.y, 40, 60);
    playerAttackHitbox.visible = false;
    playerAttackHitbox.shapeColor = color(0, 255, 0, 150);

    ground = createSprite(764, 900);
    ground.addImage("ground", groundImg);
    ground.scale = 2;
    ground.immovable = true;

    roof = createSprite(764, -10);
    roof.addImage("roof", roofImg);
    roof.scale = 2;
    roof.immovable = true;

    wall1 = createSprite(-70, GAME_HEIGHT/2, 100, GAME_HEIGHT);
    wall1.immovable = true;
    wall2 = createSprite(GAME_WIDTH + 70, GAME_HEIGHT/2, 100, GAME_HEIGHT);
    wall2.immovable = true;

    invWall1 = createSprite(650,450, 50,150);
    invWall1.immovable = true;
    invWall1.visible = false;
    invWall2 = createSprite(1150,450, 50,150);
    invWall2.immovable = true;
    invWall2.visible = false;

    platform1 = createSprite(1550, 600);
    platform1.addImage("platform", platformImg);
    platform1.immovable = true;
    platform1.scale = 0.9;

    platform2 = createSprite(250, 600);
    platform2.addImage("platform", platformImg);
    platform2.immovable = true;
    platform2.scale = 0.9;

    platform3 = createSprite(1300, 315);
    platform3.addImage("platform", platformImg);
    platform3.immovable = true;
    platform3.scale = 0.9;

    platform4 = createSprite(1, 315);
    platform4.addImage("platform", platformImg);
    platform4.immovable = true;
    platform4.scale = 0.9;

    miniPlatform1 = createSprite(900,600);
    miniPlatform1.addImage("mini-platform", miniPlatformImg);
    miniPlatform1.immovable = true;
    miniPlatform1.scale = 0.9;

    miniPlatform2 = createSprite(650,315);
    miniPlatform2.addImage("mini-platform", miniPlatformImg);
    miniPlatform2.immovable = true;
    miniPlatform2.scale = 0.9;

    pLife0 = createSprite(70, 70); pLife0.addImage("pLife0", pLife0Img); pLife0.visible = false;
    pLife1 = createSprite(70, 70); pLife1.addImage("pLife1", pLife1Img); pLife1.visible = false;
    pLife2 = createSprite(70, 70); pLife2.addImage("pLife2", pLife2Img); pLife2.visible = false;
    pLife3 = createSprite(70, 70); pLife3.addImage("pLife3", pLife3Img); pLife3.visible = false;
    pLife4 = createSprite(70, 70); pLife4.addImage("pLife4", pLife4Img); pLife4.visible = false;
    pLife5 = createSprite(70, 70); pLife5.addImage("pLife5", pLife5Img); pLife5.visible = false;
    pLife6 = createSprite(70, 70); pLife6.addImage("pLife6", pLife6Img); pLife6.visible = false;
    pLife7 = createSprite(70, 70); pLife7.addImage("pLife7", pLife7Img); pLife7.visible = false;
    pLife8 = createSprite(70, 70); pLife8.addImage("pLife8", pLife8Img); pLife8.visible = false;
    pLife9 = createSprite(70, 70); pLife9.addImage("pLife9", pLife9Img); pLife9.visible = false;
    pLife10 = createSprite(70, 70); pLife10.addImage("pLife10", pLife10Img); pLife10.visible = true;
    currentLifeSprite = pLife10;

    logo = createSprite(GAME_WIDTH/2, GAME_HEIGHT/2 - 40);
    logo.addImage("logo", logoImg);

    if (menuMusic && !musicStarted) {
        playMusic(menuMusic, 0.25);
    }

    enemy1Group = new Group();
    enemy2Group = new Group();
    enemy3Group = new Group();

    frameRate(30);

    windowResized();
}

function draw() {
    updatePlayerHitboxes();

    switch (gameState) {
        case STATE.START:
            handleStartState();
            break;
        case STATE.WAVE1:
        case STATE.WAVE2:
        case STATE.WAVE3:
            handleGameplayState();
            break;
        case STATE.END:
            handleEndState();
            break;
        case STATE.PAUSED:
            handlePausedState();
            break;
    }

    drawSprites();

    if (gameState === STATE.WAVE1 || gameState === STATE.WAVE2 || gameState === STATE.WAVE3) {
        drawHUD();
    }

    if (gameState === STATE.END) {
        textAlign(CENTER, CENTER);
        if (playerWon) {
            fill(0, 255, 0);
            textSize(72);
            text("VOCÊ VENCEU", GAME_WIDTH/2, GAME_HEIGHT/2);
        } else {
            fill(255, 0, 0);
            textSize(72);
            text("VOCÊ PERDEU", GAME_WIDTH/2, GAME_HEIGHT/2);
        }
    }
}

function handleStartState() {
    background("#fdefefff");

    if (currentMusic !== menuMusic && menuMusic) {
        playMusic(menuMusic, 0.25);
    }

    logo.visible = true;
    player.visible = false;
    playerDamageHitbox.visible = false;
    playerAttackHitbox.visible = false;
    currentLifeSprite.visible = false;
    ground.visible = false;
    roof.visible = false;
    platform1.visible = false;
    platform2.visible = false;
    platform3.visible = false;
    platform4.visible = false;
    miniPlatform1.visible = false;
    miniPlatform2.visible = false;

    fill(0);
    textSize(28);
    textAlign(CENTER, CENTER);
    text("Pressione ESPAÇO para começar", GAME_WIDTH/2, GAME_HEIGHT - 150);
    
    textSize(20);
    text("Controles:\nSetas: mover / pular\nEspaço: atacar\nSHIFT: dash (com vida baixa)\nESC: pausar", GAME_WIDTH/2, GAME_HEIGHT - 70);

    if (keyWentDown("space") || keyWentDown(" ")) {
        gameState = STATE.WAVE1;
        playMusic(battleMusic, 0.25);
    }
}

function handleGameplayState() {
    image(backgroundImg, 0, 0, GAME_WIDTH, GAME_HEIGHT);

    if (currentMusic !== battleMusic && battleMusic) {
        playMusic(battleMusic, 0.25);
    }

    logo.visible = false;
    player.visible = true;
    playerDamageHitbox.visible = showHitboxes;
    currentLifeSprite.visible = true;
    ground.visible = true;
    roof.visible = true;
    platform1.visible = true;
    platform2.visible = true;
    platform3.visible = true;
    platform4.visible = true;
    miniPlatform1.visible = true;
    miniPlatform2.visible = true;

    manageAttackState();
    handlePlayerInvulnerability();
    handlePlayerMovement();
    handlePlayerAnimation();
    handleDash();

    enemy1Spawn();
    updateEnemies();
    checkCollisions();

    if (gameState === STATE.WAVE1 && score >= wave2ScoreThreshold && !wave2Started) {
        gameState = STATE.WAVE2;
        wave2Started = true;
    }

    if (gameState === STATE.WAVE2) {
        enemy2Spawn();
        updateEnemies2();
        checkCollisions2();
    }

    if (gameState === STATE.WAVE3) {
        enemy2Spawn();
        enemy3Spawn();
        updateEnemies2();
        updateEnemies3();
        checkCollisions2();
        checkCollisions3();
    }

    if (gameState === STATE.WAVE2 && score >= wave3ScoreThreshold && !wave3Started) {
        gameState = STATE.WAVE3;
        wave3Started = true;
    }

    checkEndGameConditions();
}

function handleEndState() {
    image(backgroundImg, 0, 0, GAME_WIDTH, GAME_HEIGHT);

    player.visible = true;
    playerDamageHitbox.visible = false;
    playerAttackHitbox.visible = false;
    currentLifeSprite.visible = true;
    ground.visible = true;
    roof.visible = true;
    platform1.visible = true;
    platform2.visible = true;
    platform3.visible = true;
    platform4.visible = true;
    miniPlatform1.visible = true;
    miniPlatform2.visible = true;

    if (currentMusic && currentMusic.isPlaying()) {
        currentMusic.stop();
    }

     if (!playerWon) {
        player.changeAnimation("p-defeat");
    }
}

function handlePausedState() {
    image(backgroundImg, 0, 0, GAME_WIDTH, GAME_HEIGHT);
    fill(0, 0, 0, 150);
    rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    fill(255);
    textSize(64);
    textAlign(CENTER, CENTER);
    text("PAUSADO", GAME_WIDTH/2, GAME_HEIGHT/2);
    textSize(28);
    text("Pressione P para continuar", GAME_WIDTH/2, GAME_HEIGHT/2 + 60);
}

function drawHUD() {
    fill(0, 0, 0, 100);
    noStroke();
    rect(GAME_WIDTH - 260, 10, 250, 80, 10);

    fill(255);
    textSize(22);
    textAlign(LEFT, TOP);
    text("Score: " + score, GAME_WIDTH - 240, 25);
    text("Wave: " + (gameState === STATE.WAVE1 ? 1 : gameState === STATE.WAVE2 ? 2 : 3), GAME_WIDTH - 240, 55);
}

function updatePlayerHitboxes() {
    playerDamageHitbox.position.x = player.position.x;
    playerDamageHitbox.position.y = player.position.y;

    let attackOffset = player.mirrorX() === 1 ? 30 : -30;
    playerAttackHitbox.position.x = player.position.x + attackOffset;
    playerAttackHitbox.position.y = player.position.y;

    playerAttackHitbox.visible = isAttacking && showHitboxes;
}

function handlePlayerInvulnerability() {
    if (isPlayerInvulnerable) {
        invulnerabilityTimer++;
        if (invulnerabilityTimer > 60) {
            isPlayerInvulnerable = false;
            invulnerabilityTimer = 0;
            player.visible = true;
            playerDamageHitbox.visible = showHitboxes;
        } else {
            player.visible = (invulnerabilityTimer % 10 < 5);
            playerDamageHitbox.visible = player.visible && showHitboxes;
        }
    }
}

function handlePlayerMovement() {
    let moving = false;
    checkMovementCollisions();

    if (keyDown(LEFT_ARROW)) {
        player.position.x -= speed;
        player.mirrorX(-1);
        moving = true;
    }
    if (keyDown(RIGHT_ARROW)) {
        player.position.x += speed;
        player.mirrorX(1);
        moving = true;
    }

    if (player.collide(wall1)) {
        player.position.x = wall1.position.x + wall1.width/2 + player.width/2;
        moving = false;
    }
    if (player.collide(wall2)) {
        player.position.x = wall2.position.x - wall2.width/2 - player.width/2;
        moving = false;
    }

    velocityY += gravity;
    player.position.y += velocityY;

    if (player.collide(ground) || player.collide(roof) ||
        player.collide(platform1) || player.collide(platform2) ||
        player.collide(platform3) || player.collide(platform4) ||
        player.collide(miniPlatform1) || player.collide(miniPlatform2)) {
        velocityY = 0;
        onGround = true;
    } else {
        onGround = false;
    }

    if (keyWentDown(UP_ARROW) && onGround) {
        velocityY = jumpForce;
    }
}

function handlePlayerAnimation() {
    let moving = keyDown(LEFT_ARROW) || keyDown(RIGHT_ARROW);

    if (isAttacking) {
        if (!onGround) {
            player.changeAnimation(velocityY < 0 ? "p-attack-jump1" : "p-attack-jump2");
        } else if (moving) {
            player.changeAnimation("p-attack-running");
        } else {
            player.changeAnimation("p-attack-idle");
        }
    } else if (!onGround) {
        player.changeAnimation(velocityY < 0 ? "p-jump1" : "p-jump2");
    } else if (moving) {
        player.changeAnimation("p-running");
    } else {
        player.changeAnimation("p-idle");
    }
}

function handleDash() {
    if (keyWentDown(SHIFT) && dashAvailable && playerHealth <= 3 && !isDashing) {
        activateDash();
    }

    if (isDashing) {
        player.position.x += dashDirection * dashSpeed;
        checkDashHit();
        dashFrames--;
        if (dashFrames <= 0) {
            isDashing = false;
        }
    }

    if (!dashAvailable) {
        dashCooldown--;
        if (dashCooldown <= 0) {
            dashAvailable = true;
        }
    }
}

function manageAttackState() {
    if (keyWentDown(' ') && !isAttacking && !attackCooldown) {
        isAttacking = true;
        attackFrameCounter = 0;
        attackCooldown = true;
        attackCooldownCounter = 0;
    }

    if (isAttacking) {
        attackFrameCounter++;
        checkAttackHit();
        if (attackFrameCounter >= attackDuration) {
            isAttacking = false;
            resetEnemyHitFlags();
        }
    }

    if (attackCooldown) {
        attackCooldownCounter++;
        if (attackCooldownCounter >= attackCooldownTime) {
            attackCooldown = false;
        }
    }
}

function resetEnemyHitFlags() {
    [enemy1Group, enemy2Group, enemy3Group].forEach(group => {
        for (let e of group) {
            if (!e.defeated) e.hitByCurrentAttack = false;
        }
    });
}

function resetDashHitFlags() {
    [enemy1Group, enemy2Group, enemy3Group].forEach(group => {
        for (let e of group) e.hitByDash = false;
    });
}

function enemy1Spawn() {
    if (gameState === STATE.END) return;
    enemy1SpawnCounter++;
    if (enemy1SpawnCounter >= 150) {
        let side = random() > 0.5 ? 1 : -1;
        let x = side > 0 ? 50 : GAME_WIDTH - 100;
        let y = GAME_HEIGHT - 80;
        enemy1 = createSprite(x, y);
        enemy1.addAnimation("e1-idle", enemy1Idle);
        enemy1.addAnimation("e1-running", enemy1Running);
        enemy1.addAnimation("e1-preAttack", enemy1PreAttack);
        enemy1.addAnimation("e1-attack", enemy1Attack);
        enemy1.addAnimation("e1-defeat", enemy1Defeat);
        enemy1.changeAnimation("e1-running");
        enemy1.scale = 0.5;
        enemy1.setCollider("rectangle", 0, 0, 145*0.8, 182*0.8);
        enemy1.mirrorX(side);
        enemy1.speed = 25 * side;
        enemy1.health = 1;
        enemy1.isAttacking = false;
        enemy1.isInPreAttack = false;
        enemy1.preAttackTimer = 0;
        enemy1.attackCooldown = 0;
        enemy1.defeated = false;
        enemy1.hitByCurrentAttack = false;
        enemy1.hitByDash = false;
        enemy1.lifetime = null;

        enemy1.damageHitbox = createSprite(enemy1.position.x, enemy1.position.y, 110, 120);
        enemy1.damageHitbox.visible = showHitboxes;
        enemy1.damageHitbox.shapeColor = color(255,0,0,150);
        enemy1.attackHitbox = createSprite(enemy1.position.x, enemy1.position.y, 70, 100);
        enemy1.attackHitbox.visible = false;
        enemy1.attackHitbox.shapeColor = color(0,255,0,150);
        enemy1.detectionRange = 100;
        enemy1.preAttackRange = createSprite(enemy1.position.x, enemy1.position.y, enemy1.detectionRange*2, enemy1.detectionRange*2);
        enemy1.preAttackRange.visible = showHitboxes;
        enemy1.preAttackRange.shapeColor = color(255,255,0,100);

        enemy1Group.add(enemy1);
        enemy1SpawnCounter = 0;
    }
}

function updateEnemies() {
    for (let i = enemy1Group.size()-1; i >= 0; i--) {
        let enemy = enemy1Group[i];
        if (enemy.defeated) {
            if (enemy.lifetime !== undefined && enemy.lifetime !== null) {
                enemy.lifetime--;
                if (enemy.lifetime <= 0) {
                    enemy.remove();
                    enemy.damageHitbox.remove();
                    enemy.attackHitbox.remove();
                    enemy.preAttackRange.remove();
                    enemy1Group.remove(i);
                }
            }
            continue;
        }

        enemy.damageHitbox.position.x = enemy.position.x;
        enemy.damageHitbox.position.y = enemy.position.y;
        let attackOffset = enemy.mirrorX() === 1 ? 60 : -60;
        enemy.attackHitbox.position.x = enemy.position.x + attackOffset;
        enemy.attackHitbox.position.y = enemy.position.y;
        enemy.preAttackRange.position.x = enemy.position.x;
        enemy.preAttackRange.position.y = enemy.position.y;

        let distanceToPlayer = dist(enemy.position.x, enemy.position.y, player.position.x, player.position.y);

        if (!enemy.isAttacking && !enemy.isInPreAttack && distanceToPlayer < enemy.detectionRange) {
            enemy.isInPreAttack = true;
            enemy.preAttackTimer = 10;
            enemy.changeAnimation("e1-preAttack");
            enemy.speed = 0;
            enemy.mirrorX(player.position.x > enemy.position.x ? 1 : -1);
            enemy.preAttackRange.shapeColor = color(255,165,0,150);
        }

        if (enemy.isInPreAttack) {
            enemy.preAttackTimer--;
            if (enemy.preAttackTimer <= 0) {
                enemy.isInPreAttack = false;
                enemy.isAttacking = true;
                enemy.attackCooldown = 15;
                enemy.changeAnimation("e1-attack");
                enemy.attackHitbox.visible = showHitboxes;
                enemy.preAttackRange.shapeColor = color(255,0,0,150);
            }
        }

        if (enemy.isAttacking) {
            enemy.attackCooldown--;
            if (enemy.attackCooldown <= 0) {
                enemy.isAttacking = false;
                enemy.attackHitbox.visible = false;
                enemy.changeAnimation("e1-running");
                enemy.speed = 25 * (enemy.mirrorX() === 1 ? 1 : -1);
                enemy.preAttackRange.shapeColor = color(255,255,0,100);
            }
        } else if (!enemy.isInPreAttack) {
            enemy.position.x += enemy.speed;
            if (enemy.position.x < 50 || enemy.position.x > GAME_WIDTH - 50) {
                enemy.speed *= -1;
                enemy.mirrorX(enemy.speed > 0 ? 1 : -1);
            }
        }
    }
}

function checkCollisions() {
    for (let enemy of enemy1Group) {
        if (enemy.defeated) continue;
        if (enemy.isAttacking && enemy.attackHitbox.overlap(playerDamageHitbox) && !isPlayerInvulnerable) {
            playerHealth -= 1;
            updateHealthDisplay();
            isPlayerInvulnerable = true;
            invulnerabilityTimer = 0;
            player.position.x += (player.position.x < enemy.position.x ? -1 : 1) * 30;
            player.changeAnimation("p-damage");
        }
    }
}

function enemy2Spawn() {
    if (gameState === STATE.END) return;
    enemy2SpawnCounter++;
    if (enemy2SpawnCounter >= 100 && (gameState === STATE.WAVE2 || gameState === STATE.WAVE3)) {
        let side = random() > 0.5 ? 1 : -1;
        let x = side > 0 ? -100 : GAME_WIDTH + 100;
        let y = GAME_HEIGHT - 377;
        let enemy = createSprite(x, y);
        enemy.addAnimation("e2-walk", enemy2Walk);
        enemy.addAnimation("e2-preAttack", enemy2PreAttack);
        enemy.addAnimation("e2-attack", enemy2Attack);
        enemy.addAnimation("e2-damage", enemy2Damage);
        enemy.addAnimation("e2-defeat", enemy2Defeat);
        enemy.changeAnimation("e2-walk");
        enemy.scale = 0.5;
        enemy.setCollider("rectangle", 0, 0, 142*0.8, 159*0.8);
        enemy.mirrorX(side);
        enemy.speed = 5 * side;
        enemy.health = 2;
        enemy.isAttacking = false;
        enemy.isInPreAttack = false;
        enemy.preAttackTimer = 0;
        enemy.attackCooldown = 0;
        enemy.defeated = false;
        enemy.damageTimer = null;
        enemy.hitByCurrentAttack = false;
        enemy.hitByDash = false;

        enemy.damageHitbox = createSprite(enemy.position.x, enemy.position.y, 120, 70);
        enemy.damageHitbox.visible = showHitboxes;
        enemy.damageHitbox.shapeColor = color(255,0,0,150);
        enemy.attackHitbox = createSprite(enemy.position.x, enemy.position.y, 90, 100);
        enemy.attackHitbox.visible = false;
        enemy.attackHitbox.shapeColor = color(0,255,0,150);
        enemy.detectionRange = 110;
        enemy.preAttackRange = createSprite(enemy.position.x, enemy.position.y, enemy.detectionRange*2, enemy.detectionRange*2);
        enemy.preAttackRange.visible = showHitboxes;
        enemy.preAttackRange.shapeColor = color(255,255,0,100);

        enemy2Group.add(enemy);
        enemy2SpawnCounter = 0;
    }
}

function updateEnemies2() {
    for (let i = enemy2Group.size()-1; i >= 0; i--) {
        let enemy = enemy2Group[i];
        if (enemy.defeated) {
            if (enemy.lifetime !== undefined && enemy.lifetime !== null) {
                enemy.lifetime--;
                if (enemy.lifetime <= 0) {
                    enemy.remove();
                    enemy.damageHitbox.remove();
                    enemy.attackHitbox.remove();
                    enemy.preAttackRange.remove();
                    enemy2Group.remove(i);
                }
            }
            continue;
        }

        enemy.damageHitbox.position.x = enemy.position.x;
        enemy.damageHitbox.position.y = enemy.position.y + 40;
        let attackOffset = enemy.mirrorX() === 1 ? 50 : -50;
        enemy.attackHitbox.position.x = enemy.position.x + attackOffset;
        enemy.attackHitbox.position.y = enemy.position.y;
        enemy.preAttackRange.position.x = enemy.position.x;
        enemy.preAttackRange.position.y = enemy.position.y;

        if (enemy.damageTimer && enemy.damageTimer > 0) {
            enemy.damageTimer--;
            if (enemy.damageTimer <= 0) {
                enemy.changeAnimation("e2-walk");
                enemy.damageTimer = null;
            }
            continue;
        }

        if (enemy.getAnimationLabel() === "e2-damage") continue;

        let distanceToPlayer = dist(enemy.position.x, enemy.position.y, player.position.x, player.position.y);
        if (!enemy.isAttacking && !enemy.isInPreAttack && distanceToPlayer < enemy.detectionRange) {
            enemy.isInPreAttack = true;
            enemy.preAttackTimer = 10;
            enemy.changeAnimation("e2-preAttack");
            enemy.speed = 0;
            enemy.mirrorX(player.position.x > enemy.position.x ? 1 : -1);
            enemy.preAttackRange.shapeColor = color(255,165,0,150);
        }

        if (enemy.isInPreAttack) {
            enemy.preAttackTimer--;
            if (enemy.preAttackTimer <= 0) {
                enemy.isInPreAttack = false;
                enemy.isAttacking = true;
                enemy.attackCooldown = 20;
                enemy.changeAnimation("e2-attack");
                enemy.attackHitbox.visible = showHitboxes;
                enemy.preAttackRange.shapeColor = color(255,0,0,150);
            }
        }

        if (enemy.isAttacking) {
            enemy.attackCooldown--;
            if (enemy.attackCooldown <= 0) {
                enemy.isAttacking = false;
                enemy.attackHitbox.visible = false;
                enemy.changeAnimation("e2-walk");
                enemy.speed = 8 * (enemy.mirrorX() === 1 ? 1 : -1);
                enemy.preAttackRange.shapeColor = color(255,255,0,100);
            }
        } else if (!enemy.isInPreAttack) {
            enemy.position.x += enemy.speed;
            if (enemy.collide(invWall1) || enemy.collide(invWall2)) {
                enemy.speed *= -1;
                enemy.mirrorX(enemy.speed > 0 ? 1 : -1);
            }
        }
    }
}

function checkCollisions2() {
    for (let enemy of enemy2Group) {
        if (enemy.defeated) continue;
        if (enemy.isAttacking && enemy.getAnimationLabel() === "e2-attack" &&
            enemy.attackHitbox.overlap(playerDamageHitbox) && !isPlayerInvulnerable) {
            playerHealth -= 1;
            updateHealthDisplay();
            isPlayerInvulnerable = true;
            invulnerabilityTimer = 0;
            player.position.x += (player.position.x < enemy.position.x ? -1 : 1) * 30;
            player.changeAnimation("p-damage");
        }
    }
}

function enemy3Spawn() {
    if (gameState === STATE.END) return;
    enemy3SpawnCounter++;
    if (enemy3SpawnCounter >= 100 && gameState === STATE.WAVE3) {
        let x = random(100, GAME_WIDTH - 100);
        let y = -100;
        let enemy = createSprite(x, y);
        enemy.addAnimation("e3-idle", enemy3Idle);
        enemy.addAnimation("e3-defeat", enemy3Defeat);
        enemy.changeAnimation("e3-idle");
        enemy.scale = 0.5;
        enemy.setCollider("rectangle", 0, 0, 142*0.8, 159*0.8);
        enemy.health = 1;
        enemy.isAttacking = false;
        enemy.attackCooldown = 0;
        enemy.defeated = false;
        enemy.speed = speed/3;
        enemy.originalSpeed = speed/3;
        enemy.isFlying = true;
        enemy.isInAttackRecovery = false;
        enemy.attackRecoveryTime = 0;
        enemy.hitByCurrentAttack = false;
        enemy.hitByDash = false;
        enemy.damageTimer = null;
        enemy.lifetime = null;

        enemy.damageHitbox = createSprite(enemy.position.x, enemy.position.y, 125, 150);
        enemy.damageHitbox.visible = showHitboxes;
        enemy.damageHitbox.shapeColor = color(255,0,0,150);
        let spriteHeight = 159 * enemy.scale;
        enemy.attackHitbox = createSprite(enemy.position.x, enemy.position.y + spriteHeight/2 - 10, 80, 80);
        enemy.attackHitbox.visible = showHitboxes;
        enemy.attackHitbox.shapeColor = color(0,255,0,150);

        enemy3Group.add(enemy);
        enemy3SpawnCounter = 0;
    }
}

function updateEnemies3() {
    for (let i = enemy3Group.size()-1; i >= 0; i--) {
        let enemy = enemy3Group[i];
        if (enemy.defeated) {
            if (enemy.lifetime !== undefined && enemy.lifetime !== null) {
                enemy.lifetime--;
                if (enemy.lifetime <= 0) {
                    enemy.remove();
                    enemy.damageHitbox.remove();
                    enemy.attackHitbox.remove();
                    enemy3Group.remove(i);
                }
            }
            continue;
        }

        enemy.damageHitbox.position.x = enemy.position.x;
        enemy.damageHitbox.position.y = enemy.position.y;
        let spriteHeight = 200 * enemy.scale;
        enemy.attackHitbox.position.x = enemy.position.x;
        enemy.attackHitbox.position.y = enemy.position.y + spriteHeight/2 - 10;

        if (enemy.isInAttackRecovery) {
            enemy.attackRecoveryTime--;
            enemy.speed = 0;
            if (enemy.attackRecoveryTime <= 0) {
                enemy.isInAttackRecovery = false;
                enemy.changeAnimation("e3-idle");
                enemy.speed = speed/2;
            }
            continue;
        }

        if (enemy.damageTimer !== null && enemy.damageTimer > 0) {
            enemy.damageTimer--;
            enemy.speed = 0;
            if (enemy.damageTimer <= 0) {
                enemy.changeAnimation("e3-idle");
                enemy.damageTimer = null;
                enemy.speed = speed/2;
            }
            continue;
        }

        if (enemy.getAnimationLabel() === "e3-defeat") {
            enemy.speed = 0;
            continue;
        }

        let dx = player.position.x - enemy.position.x;
        let dy = player.position.y - enemy.position.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if (distance > 0) {
            enemy.position.x += (dx/distance) * enemy.speed;
            enemy.position.y += (dy/distance) * enemy.speed;
            enemy.mirrorX(dx > 0 ? 1 : -1);
        }
    }
}

function checkCollisions3() {
    for (let enemy of enemy3Group) {
        if (enemy.defeated) continue;
        if (enemy.getAnimationLabel() === "e3-damage" || enemy.damageTimer ||
            enemy.getAnimationLabel() === "e3-attack" || enemy.isInAttackRecovery) continue;

        if (enemy.attackHitbox.overlap(playerDamageHitbox) && !isPlayerInvulnerable) {
            enemy.changeAnimation("e3-idle");
            enemy.attackRecoveryTime = 30;
            enemy.isInAttackRecovery = true;
            playerHealth -= 2;
            updateHealthDisplay();
            isPlayerInvulnerable = true;
            invulnerabilityTimer = 0;
            player.position.x += (player.position.x < enemy.position.x ? -1 : 1) * 30;
            player.changeAnimation("p-damage");
        }
    }
}

function checkAttackHit() {
    checkAttackHitOnGroup(enemy1Group, 1);
    checkAttackHitOnGroup(enemy2Group, 3, 1, 30);
    checkAttackHitOnGroup(enemy3Group, 5, 1, 60);
}

function checkAttackHitOnGroup(group, scoreValue, healthDecrement = 1, damageTimer = 0) {
    for (let enemy of group) {
        if (enemy.defeated) continue;
        if (enemy.damageTimer && enemy.damageTimer > 0) continue;
        if (isAttacking && playerAttackHitbox.overlap(enemy.damageHitbox)) {
            let attackDir = player.mirrorX() === 1 ? 1 : -1;
            let enemyDir = Math.sign(enemy.position.x - player.position.x);
            if (attackDir === enemyDir && !enemy.hitByCurrentAttack) {
                enemy.health -= healthDecrement;
                enemy.hitByCurrentAttack = true;
                if (enemy.health <= 0) {
                    enemy.changeAnimation(enemy.getAnimationLabel().includes("e1") ? "e1-defeat" :
                                          enemy.getAnimationLabel().includes("e2") ? "e2-defeat" : "e3-defeat");
                    enemy.defeated = true;
                    enemy.lifetime = 60;
                    enemy.speed = 0;
                    enemy.attackHitbox.visible = false;
                    enemy.damageHitbox.visible = false;
                    if (enemy.preAttackRange) enemy.preAttackRange.visible = false;
                    score += scoreValue;
                } else if (damageTimer > 0) {
                    enemy.changeAnimation(enemy.getAnimationLabel().includes("e2") ? "e2-damage" : "e3-damage");
                    enemy.damageTimer = damageTimer;
                }
            }
        }
    }
}

function checkDashHit() {
    let dashRange = 80;
    checkDashHitOnGroup(enemy1Group, 1);
    checkDashHitOnGroup(enemy2Group, 3, 1, 30);
    checkDashHitOnGroup(enemy3Group, 5, 1, 60);
}

function checkDashHitOnGroup(group, scoreValue, healthDecrement = 1, damageTimer = 0) {
    for (let enemy of group) {
        if (enemy.defeated || enemy.hitByDash) continue;
        if (enemy.damageTimer && enemy.damageTimer > 0) continue;
        if (dist(player.position.x, player.position.y, enemy.position.x, enemy.position.y) < 80) {
            enemy.health -= healthDecrement;
            enemy.hitByDash = true;
            if (enemy.health <= 0) {
                enemy.changeAnimation(enemy.getAnimationLabel().includes("e1") ? "e1-defeat" :
                                      enemy.getAnimationLabel().includes("e2") ? "e2-defeat" : "e3-defeat");
                enemy.defeated = true;
                enemy.lifetime = 60;
                enemy.speed = 0;
                enemy.attackHitbox.visible = false;
                enemy.damageHitbox.visible = false;
                if (enemy.preAttackRange) enemy.preAttackRange.visible = false;
                score += scoreValue;
            } else if (damageTimer > 0) {
                enemy.changeAnimation(enemy.getAnimationLabel().includes("e2") ? "e2-damage" : "e3-damage");
                enemy.damageTimer = damageTimer;
            }
        }
    }
}

function checkMovementCollisions() {
    for (let group of [enemy1Group, enemy2Group]) {
        for (let enemy of group) {
            if (enemy.defeated) continue;
            if (player.collide(enemy.damageHitbox)) {
                player.position.x += (player.position.x < enemy.position.x ? -1 : 1) * 3;
            }
        }
    }
}

function updateHealthDisplay() {
    currentLifeSprite.visible = false;
    const lifeSprites = [pLife0, pLife1, pLife2, pLife3, pLife4, pLife5, pLife6, pLife7, pLife8, pLife9, pLife10];
    currentLifeSprite = lifeSprites[constrain(playerHealth, 0, 10)];
    currentLifeSprite.visible = true;
}

function checkEndGameConditions() {
    if (score >= 40) {
        playerWon = true;
        gameState = STATE.END;
    } else if (playerHealth <= 0) {
        playerWon = false;
        gameState = STATE.END;
    }
}

function playMusic(music, volume = 0.5) {
    if (currentMusic && currentMusic.isPlaying()) currentMusic.stop();
    if (music) {
        currentMusic = music;
        currentMusic.setVolume(volume);
        currentMusic.loop();
        musicStarted = true;
    }
}

function activateDash() {
    isDashing = true;
    dashAvailable = false;
    dashCooldown = dashCooldownFrames;
    dashFrames = maxDashFrames;
    dashDirection = player.mirrorX() === 1 ? -1 : 1;
    resetDashHitFlags();
}

function keyPressed() {
    if (key === '+' || key === '=') {
        if (currentMusic) currentMusic.setVolume(min(currentMusic.getVolume() + 0.1, 1.0));
    } else if (key === '-' || key === '_') {
        if (currentMusic) currentMusic.setVolume(max(currentMusic.getVolume() - 0.1, 0.0));
    }

    if (keyCode === ESCAPE) {
        return false;
    }

    if (key === 'p' || key === 'P') {
        if (gameState === STATE.WAVE1 || gameState === STATE.WAVE2 || gameState === STATE.WAVE3) {
            previousState = gameState;
            gameState = STATE.PAUSED;
        } else if (gameState === STATE.PAUSED) {
            gameState = previousState;
        }
        return false; 
    }
}

function windowResized() {
    let container = document.getElementById('game-container');
    if (!container) return;

    let scale = Math.min(windowWidth / GAME_WIDTH, windowHeight / GAME_HEIGHT);
    container.style.transform = `scale(${scale})`;

    let scaledWidth = GAME_WIDTH * scale;
    let scaledHeight = GAME_HEIGHT * scale;
    container.style.position = 'absolute';
    container.style.left = `${(windowWidth - scaledWidth) / 2}px`;
    container.style.top = `${(windowHeight - scaledHeight) / 2}px`;
}