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
let attackCooldownTime = 20;
let attackCooldownCounter = 0;
let attackDuration = 12;
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

let menuMusic, battleMusic;
let currentMusic = null;
let musicStarted = false;

const start = 1;
const wave1 = 2;
const wave2 = 3;
const wave3 = 4;
const end = 5;
let gameState = wave3;

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

// Novas variáveis para hitboxes
let playerDamageHitbox, playerAttackHitbox;
let showHitboxes = true; // Mude para false para esconder as hitboxes

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
}

function setup() {
    createCanvas(windowWidth, windowHeight);

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

    // Hitbox de dano do player
    playerDamageHitbox = createSprite(player.position.x, player.position.y, 70, 80);
    playerDamageHitbox.visible = showHitboxes;
    playerDamageHitbox.shapeColor = color(255, 0, 0, 150); // Vermelho para hitbox de dano

    // Hitbox de ataque do player
    playerAttackHitbox = createSprite(player.position.x, player.position.y, 60, 80);
    playerAttackHitbox.visible = false;
    playerAttackHitbox.shapeColor = color(0, 255, 0, 150); // Verde para hitbox de ataque

    ground = createSprite(764, 740);
    ground.addImage("ground", groundImg);
    ground.scale = 2;
    ground.immovable = true;

    roof = createSprite(764, -10);
    roof.addImage("roof", roofImg);
    roof.scale = 2;
    roof.immovable = true;

    wall1 = createSprite(-70, height/2, 100, height);
    wall1.immovable = true;
    wall2 = createSprite(width + 70, height/2, 100, height);
    wall2.immovable = false;

    invWall1 = createSprite(650,450, 50,150);
    invWall1.immovable = true;
    invWall1.visible = false;
    invWall2 = createSprite(1150,450, 50,150);
    invWall2.immovable = true;
    invWall2.visible = false;

    platform1 = createSprite(1550, 500);
    platform1.addImage("platform", platformImg);
    platform1.immovable = true;
    platform1.scale = 0.9;

    platform2 = createSprite(250, 500);
    platform2.addImage("platform", platformImg);
    platform2.immovable = true;
    platform2.scale = 0.9;

    platform3 = createSprite(1300, 270);
    platform3.addImage("platform", platformImg);
    platform3.immovable = true;
    platform3.scale = 0.9;

    platform4 = createSprite(1, 270);
    platform4.addImage("platform", platformImg);
    platform4.immovable = true;
    platform4.scale = 0.9;

    miniPlatform1 = createSprite(900,500);
    miniPlatform1.addImage("mini-platform", miniPlatformImg);
    miniPlatform1.immovable = true;
    miniPlatform1.scale = 0.9;

    miniPlatform2 = createSprite(650,270);
    miniPlatform2.addImage("mini-platform", miniPlatformImg);
    miniPlatform2.immovable = true;
    miniPlatform2.scale = 0.9;

    pLife0 = createSprite(70, 70);
    pLife0.addImage("pLife0", pLife0Img);
    pLife0.visible = false;

    pLife1 = createSprite(70, 70);
    pLife1.addImage("pLife1", pLife1Img);
    pLife1.visible = false;

    pLife2 = createSprite(70, 70);
    pLife2.addImage("pLife2", pLife2Img);
    pLife2.visible = false;

    pLife3 = createSprite(70, 70);
    pLife3.addImage("pLife3", pLife3Img);
    pLife3.visible = false;

    pLife4 = createSprite(70, 70);
    pLife4.addImage("pLife4", pLife4Img);
    pLife4.visible = false;

    pLife5 = createSprite(70, 70);
    pLife5.addImage("pLife5", pLife5Img);
    pLife5.visible = false;

    pLife6 = createSprite(70, 70);
    pLife6.addImage("pLife6", pLife6Img);
    pLife6.visible = false;

    pLife7 = createSprite(70, 70);
    pLife7.addImage("pLife7", pLife7Img);
    pLife7.visible = false;

    pLife8 = createSprite(70, 70);
    pLife8.addImage("pLife8", pLife8Img);
    pLife8.visible = false;

    pLife9 = createSprite(70, 70);
    pLife9.addImage("pLife9", pLife9Img);
    pLife9.visible = false;

    pLife10 = createSprite(70, 70);
    pLife10.addImage("pLife10", pLife10Img);
    pLife10.visible = true;

    currentLifeSprite = pLife10;

    logo = createSprite(730, 360);
    logo.addImage("logo", logoImg);

    if (menuMusic && !musicStarted) {
        playMusic(menuMusic, 0.25);
    }

    enemy1Group = new Group();
    enemy2Group = new Group();
    enemy3Group = new Group();

    frameRate(30);
}

function draw() {
    // Atualizar hitboxes do player
    updatePlayerHitboxes();

    if(gameState === start) {
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

        if(keyWentDown("space") || keyWentDown(" ")) {
            gameState = wave1;
            playMusic(battleMusic, 0.25);
        }
    }

    if(gameState === wave1 || gameState === wave2 || gameState === wave3) {
        background("#161616");

        if (currentMusic !== battleMusic && battleMusic) {
            playMusic(battleMusic, 0.25);
        }

        textSize(24);
        fill("white");
        text("Score: " + score, 1400, 60);
        text("Wave: " + (gameState === wave1 ? 1 : gameState === wave2 ? 2 : 3), 1400, 90);

        if (playerHealth <= 3 && dashAvailable && !isDashing) {
            textSize(20);
            fill(255, 255, 255, 100);
            textAlign(CENTER, CENTER);
            text("Pressione SHIFT para dash para trás", width/2, height - 50);
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

        if (isPlayerInvulnerable) {
            invulnerabilityTimer++;
            if (invulnerabilityTimer > 60) {
                isPlayerInvulnerable = false;
                invulnerabilityTimer = 0;
                player.visible = true;
                playerDamageHitbox.visible = showHitboxes;
            } else {
                if (invulnerabilityTimer % 10 < 5) {
                    player.visible = false;
                    playerDamageHitbox.visible = false;
                } else {
                    player.visible = true;
                    playerDamageHitbox.visible = showHitboxes;
                }
            }
        }

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
        
        if(player.collide(wall1)) {
            player.position.x = wall1.position.x + wall1.width/2 + player.width/2;
            moving = false;
        }
        if(player.collide(wall2)) {
            player.position.x = wall2.position.x - wall2.width/2 - player.width/2;
            moving = false;
        }

        velocityY += gravity;
        player.position.y += velocityY;

        if(player.collide(ground) || player.collide(roof) || player.collide(platform1) || player.collide(platform2) || player.collide(platform3) || player.collide(platform4) || player.collide(miniPlatform1) || player.collide(miniPlatform2)) {
            velocityY = 0;
            onGround = true;
        } else {
            onGround = false;
        }

        if(keyWentDown(UP_ARROW) && onGround) {
            velocityY = jumpForce;
        }
 
        if (isAttacking) {
            if (!onGround) {
                if (velocityY < 0) {
                    player.changeAnimation("p-attack-jump1");
                } else {
                    player.changeAnimation("p-attack-jump2");
                }
            } else if (moving) {
                player.changeAnimation("p-attack-running");
            } else {
                player.changeAnimation("p-attack-idle");
            }
        } else if (!onGround) {
            if (velocityY < 0) {
                player.changeAnimation("p-jump1");
            } else {
                player.changeAnimation("p-jump2");
            }
        } else if (moving) {
            player.changeAnimation("p-running");
        } else {
            player.changeAnimation("p-idle");
        }

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

        // Spawn e update de inimigos baseado na wave
        enemy1Spawn();
        updateEnemies();
        checkCollisions();

        if (gameState === wave1 && score >= wave2ScoreThreshold && !wave2Started) {
            gameState = wave2;
            wave2Started = true;
        }

        if (gameState === wave2) {
            enemy2Spawn();
            updateEnemies2();
            checkCollisions2();
        }

        if (gameState === wave3) {
            enemy2Spawn();
            enemy3Spawn();
            updateEnemies2();
            updateEnemies3();
            checkCollisions2();
            checkCollisions3();
        }

        if (gameState === wave2 && score >= wave3ScoreThreshold && !wave3Started) {
            gameState = wave3;
            wave3Started = true;
        }
        
        checkEndGameConditions();
    }

    if(gameState === end) {
        background("#161616");
        
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

        textSize(72);
        textAlign(CENTER, CENTER);
        
        if (playerWon) {
            fill(0, 255, 0);
            text("VOCÊ VENCEU", width/2, height/2);
        } else {
            fill(255, 0, 0);
            text("VOCÊ PERDEU", width/2, height/2);

            player.changeAnimation("p-defeat");
        }
        
        textSize(36);
        fill(255);
        text("Score: " + score, width/2, height/2 + 80);
    }

    drawSprites();
}

function updatePlayerHitboxes() {
    // Atualizar posição das hitboxes do player
    playerDamageHitbox.position.x = player.position.x;
    playerDamageHitbox.position.y = player.position.y;
    
    let attackOffset = player.mirrorX() === 1 ? 40 : -40;
    playerAttackHitbox.position.x = player.position.x + attackOffset;
    playerAttackHitbox.position.y = player.position.y;
    
    // Mostrar hitbox de ataque apenas durante o ataque
    playerAttackHitbox.visible = isAttacking && showHitboxes;
}

function playMusic(music, volume = 0.5) {
    if (currentMusic && currentMusic.isPlaying()) {
        currentMusic.stop();
    }
    
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
    // DASH PARA TRÁS (direção oposta à que está olhando)
    dashDirection = player.mirrorX() === 1 ? -1 : 1;
    
    resetDashHitFlags();
}

function keyPressed() {
    if (key === '+' || key === '=') {
        if (currentMusic) {
            let currentVolume = currentMusic.getVolume();
            currentMusic.setVolume(min(currentVolume + 0.1, 1.0));
        }
    } else if (key === '-' || key === '_') {
        if (currentMusic) {
            let currentVolume = currentMusic.getVolume();
            currentMusic.setVolume(max(currentVolume - 0.1, 0.0));
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
    for (let i = 0; i < enemy1Group.size(); i++) {
        let enemy = enemy1Group[i];
        if (!enemy.defeated) {
            enemy.hitByCurrentAttack = false;
        }
    }
    for (let i = 0; i < enemy2Group.size(); i++) {
        let enemy = enemy2Group[i];
        if (!enemy.defeated) {
            enemy.hitByCurrentAttack = false;
        }
    }
    for (let i = 0; i < enemy3Group.size(); i++) {
        let enemy = enemy3Group[i];
        if (!enemy.defeated) {
            enemy.hitByCurrentAttack = false;
        }
    }
}

function resetDashHitFlags() {
    for (let i = 0; i < enemy1Group.size(); i++) {
        let enemy = enemy1Group[i];
        enemy.hitByDash = false;
    }
    for (let i = 0; i < enemy2Group.size(); i++) {
        let enemy = enemy2Group[i];
        enemy.hitByDash = false;
    }
    for (let i = 0; i < enemy3Group.size(); i++) {
        let enemy = enemy3Group[i];
        enemy.hitByDash = false;
    }
}

function enemy1Spawn() {
    if (gameState === end) return;
    
    enemy1SpawnCounter++;
    if (enemy1SpawnCounter >= 150) {
        let side = random() > 0.5 ? 1 : -1;
        let x = side > 0 ? 50 : width - 100;
        let y = height - 80;

        enemy1 = createSprite(x, y);
        enemy1.addAnimation("e1-idle", enemy1Idle);
        enemy1.addAnimation("e1-running", enemy1Running);
        enemy1.addAnimation("e1-preAttack", enemy1PreAttack);
        enemy1.addAnimation("e1-attack", enemy1Attack);
        enemy1.addAnimation("e1-defeat", enemy1Defeat);
        enemy1.changeAnimation("e1-running");
        enemy1.scale = 0.5;
        enemy1.setCollider("rectangle", 0, 0, 145 * 0.8, 182 * 0.8);
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

        // Hitboxes do enemy1
        enemy1.damageHitbox = createSprite(enemy1.position.x, enemy1.position.y, 110, 120);
        enemy1.damageHitbox.visible = showHitboxes;
        enemy1.damageHitbox.shapeColor = color(255, 0, 0, 150);
        
        enemy1.attackHitbox = createSprite(enemy1.position.x, enemy1.position.y, 70, 100);
        enemy1.attackHitbox.visible = false;
        enemy1.attackHitbox.shapeColor = color(0, 255, 0, 150);
        
        // Range de detecção para preAttack
        enemy1.detectionRange = 100;
        enemy1.preAttackRange = createSprite(enemy1.position.x, enemy1.position.y, enemy1.detectionRange * 2, enemy1.detectionRange * 2);
        enemy1.preAttackRange.visible = showHitboxes;
        enemy1.preAttackRange.shapeColor = color(255, 255, 0, 100); // Amarelo para range de detecção

        enemy1Group.add(enemy1);
        enemy1SpawnCounter = 0;
    }
}

function updateEnemies() {
    for (let i = 0; i < enemy1Group.size(); i++) {
        let enemy = enemy1Group[i];
        
        if (enemy.defeated) {
            if (enemy.lifetime !== undefined && enemy.lifetime !== null) {
                enemy.lifetime--;
                if (enemy.lifetime <= 0) {
                    enemy.remove();
                    enemy.damageHitbox.remove();
                    enemy.attackHitbox.remove();
                    enemy.preAttackRange.remove();
                }
            }
            continue;
        }
        
        // Atualizar hitboxes
        enemy.damageHitbox.position.x = enemy.position.x;
        enemy.damageHitbox.position.y = enemy.position.y;
        
        let attackOffset = enemy.mirrorX() === 1 ? 60 : -60;
        enemy.attackHitbox.position.x = enemy.position.x + attackOffset;
        enemy.attackHitbox.position.y = enemy.position.y;
        
        enemy.preAttackRange.position.x = enemy.position.x;
        enemy.preAttackRange.position.y = enemy.position.y;
        
        // Sistema de preAttack
        let distanceToPlayer = dist(enemy.position.x, enemy.position.y, player.position.x, player.position.y);
        
        if (!enemy.isAttacking && !enemy.isInPreAttack && distanceToPlayer < enemy.detectionRange) {
            // Iniciar preAttack
            enemy.isInPreAttack = true;
            enemy.preAttackTimer = 15; // REDUZIDO de 30 para 15
            enemy.changeAnimation("e1-preAttack");
            enemy.speed = 0;
            
            // VIRAR NA DIREÇÃO DO PLAYER
            if (player.position.x > enemy.position.x) {
                enemy.mirrorX(1);
            } else {
                enemy.mirrorX(-1);
            }
            
            enemy.preAttackRange.shapeColor = color(255, 165, 0, 150);
        }
        
        if (enemy.isInPreAttack) {
            enemy.preAttackTimer--;
            if (enemy.preAttackTimer <= 0) {
                enemy.isInPreAttack = false;
                enemy.isAttacking = true;
                enemy.attackCooldown = 15; // REDUZIDO de 30 para 15
                enemy.changeAnimation("e1-attack");
                enemy.attackHitbox.visible = showHitboxes;
                enemy.preAttackRange.shapeColor = color(255, 0, 0, 150);
            }
        }
        
        if (enemy.isAttacking) {
            enemy.attackCooldown--;
            if (enemy.attackCooldown <= 0) {
                enemy.isAttacking = false;
                enemy.attackHitbox.visible = false;
                enemy.changeAnimation("e1-running");
                enemy.speed = 25 * (enemy.mirrorX() === 1 ? 1 : -1);
                enemy.preAttackRange.shapeColor = color(255, 255, 0, 100);
            }
        } else if (!enemy.isInPreAttack) {
            // Movimento normal
            enemy.position.x += enemy.speed;
            
            if (enemy.position.x < 50 || enemy.position.x > width - 50) {
                enemy.speed *= -1;
                enemy.mirrorX(enemy.speed > 0 ? 1 : -1);
            }
        }
    }

    for (let i = enemy1Group.size() - 1; i >= 0; i--) {
        let enemy = enemy1Group[i];
        if (enemy.defeated && (enemy.lifetime === undefined || enemy.lifetime === null || enemy.lifetime <= 0)) {
            enemy1Group.remove(i);
        }
    }
}

function checkCollisions() {
    for (let i = 0; i < enemy1Group.size(); i++) {
        let enemy = enemy1Group[i];
        
        if (enemy.defeated) continue;
        
        let canTakeDamage = !isPlayerInvulnerable;
        
        // Verificar colisão com hitbox de ataque do inimigo
        if (enemy.isAttacking && enemy.attackHitbox.overlap(playerDamageHitbox) && canTakeDamage) {
            playerHealth -= 1;
            updateHealthDisplay();
            
            isPlayerInvulnerable = true;
            invulnerabilityTimer = 0;
            
            let pushDirection = player.position.x < enemy.position.x ? -1 : 1;
            player.position.x += pushDirection * 30;
            
            player.changeAnimation("p-damage");
        }
    }
}

function checkAttackHit() {
    for (let i = 0; i < enemy1Group.size(); i++) {
        let enemy = enemy1Group[i];
        
        if (enemy.defeated) continue;
        
        // Verificar se a hitbox de ataque do player atingiu a hitbox de dano do inimigo
        if (isAttacking && playerAttackHitbox.overlap(enemy.damageHitbox)) {
            let attackDirection = player.mirrorX() === 1 ? 1 : -1;
            let enemyDirection = Math.sign(enemy.position.x - player.position.x);
            
            if (attackDirection === enemyDirection) {
                if (!enemy.hitByCurrentAttack) {
                    enemy.health -= 1;
                    enemy.hitByCurrentAttack = true;
                    
                    if (enemy.health <= 0) {
                        enemy.changeAnimation("e1-defeat");
                        enemy.defeated = true;
                        enemy.lifetime = 60;
                        enemy.speed = 0;
                        enemy.attackHitbox.visible = false;
                        enemy.damageHitbox.visible = false;
                        enemy.preAttackRange.visible = false;
                        score += 1;
                    }
                }
            }
        }
    }
    
    for (let i = 0; i < enemy2Group.size(); i++) {
        let enemy = enemy2Group[i];
        
        if (enemy.defeated) continue;
        
        if (enemy.damageTimer && enemy.damageTimer > 0) continue;
        
        if (isAttacking && playerAttackHitbox.overlap(enemy.damageHitbox)) {
            let attackDirection = player.mirrorX() === 1 ? 1 : -1;
            let enemyDirection = Math.sign(enemy.position.x - player.position.x);
            
            if (attackDirection === enemyDirection) {
                if (!enemy.hitByCurrentAttack) {
                    enemy.health -= 1;
                    enemy.hitByCurrentAttack = true;
                    
                    if (enemy.health <= 0) {
                        enemy.changeAnimation("e2-defeat");
                        enemy.defeated = true;
                        enemy.lifetime = 60;
                        enemy.speed = 0;
                        enemy.attackHitbox.visible = false;
                        enemy.damageHitbox.visible = false;
                        enemy.preAttackRange.visible = false;
                        score += 3;
                    } else {
                        enemy.changeAnimation("e2-damage");
                        enemy.damageTimer = 30;
                    }
                }
            }
        }
    }

    for (let i = 0; i < enemy3Group.size(); i++) {
        let enemy = enemy3Group[i];
        
        if (enemy.defeated) continue;
        
        if (enemy.getAnimationLabel() === "e3-damage") continue;
        
        if (isAttacking && playerAttackHitbox.overlap(enemy.damageHitbox)) {
            let attackDirection = player.mirrorX() === 1 ? 1 : -1;
            let enemyDirection = Math.sign(enemy.position.x - player.position.x);
            
            if (attackDirection === enemyDirection) {
                if (!enemy.hitByCurrentAttack) {
                    enemy.health -= 1;
                    enemy.hitByCurrentAttack = true;
                    
                    if (enemy.health <= 0) {
                        enemy.changeAnimation("e3-defeat");
                        enemy.defeated = true;
                        enemy.lifetime = 60;
                        enemy.speed = 0;
                        enemy.attackHitbox.visible = false;
                        enemy.damageHitbox.visible = false;
                        score += 5;
                    } else {
                        enemy.changeAnimation("e3-damage");
                        enemy.speed = 0;
                        enemy.damageTimer = 60;
                    }
                }
            }
        }
    }
}

function checkDashHit() {
    let dashRange = 80; // Reduzido um pouco para ser mais preciso
    
    for (let i = 0; i < enemy1Group.size(); i++) {
        let enemy = enemy1Group[i];
        if (enemy.defeated || enemy.hitByDash) continue;
        
        let distance = dist(player.position.x, player.position.y, enemy.position.x, enemy.position.y);
        if (distance < dashRange) {
            // Causar 1 de dano (mesmo que o inimigo tenha mais vida)
            enemy.health -= 1;
            enemy.hitByDash = true;
            
            if (enemy.health <= 0) {
                enemy.changeAnimation("e1-defeat");
                enemy.defeated = true;
                enemy.lifetime = 60;
                enemy.speed = 0;
                enemy.attackHitbox.visible = false;
                enemy.damageHitbox.visible = false;
                enemy.preAttackRange.visible = false;
                score += 1;
            }
        }
    }
    
    for (let i = 0; i < enemy2Group.size(); i++) {
        let enemy = enemy2Group[i];
        if (enemy.defeated || enemy.hitByDash || (enemy.damageTimer && enemy.damageTimer > 0)) continue;
        
        let distance = dist(player.position.x, player.position.y, enemy.position.x, enemy.position.y);
        if (distance < dashRange) {
            // Causar 1 de dano
            enemy.health -= 1;
            enemy.hitByDash = true;
            
            if (enemy.health <= 0) {
                enemy.changeAnimation("e2-defeat");
                enemy.defeated = true;
                enemy.lifetime = 60;
                enemy.speed = 0;
                enemy.attackHitbox.visible = false;
                enemy.damageHitbox.visible = false;
                enemy.preAttackRange.visible = false;
                score += 3;
            } else {
                enemy.changeAnimation("e2-damage");
                enemy.damageTimer = 30;
            }
        }
    }

    for (let i = 0; i < enemy3Group.size(); i++) {
        let enemy = enemy3Group[i];
        if (enemy.defeated || enemy.hitByDash || enemy.getAnimationLabel() === "e3-damage") continue;
        
        let distance = dist(player.position.x, player.position.y, enemy.position.x, enemy.position.y);
        if (distance < dashRange) {
            // Causar 1 de dano no enemy3 também
            enemy.health -= 1;
            enemy.hitByDash = true;
            
            if (enemy.health <= 0) {
                enemy.changeAnimation("e3-defeat");
                enemy.defeated = true;
                enemy.lifetime = 60;
                enemy.speed = 0;
                enemy.attackHitbox.visible = false;
                enemy.damageHitbox.visible = false;
                score += 5;
            } else {
                enemy.changeAnimation("e3-damage");
                enemy.speed = 0;
                enemy.damageTimer = 60;
            }
        }
    }
}

function updateHealthDisplay() {
    currentLifeSprite.visible = false;
    
    switch(playerHealth) {
        case 0: currentLifeSprite = pLife0; break;
        case 1: currentLifeSprite = pLife1; break;
        case 2: currentLifeSprite = pLife2; break;
        case 3: currentLifeSprite = pLife3; break;
        case 4: currentLifeSprite = pLife4; break;
        case 5: currentLifeSprite = pLife5; break;
        case 6: currentLifeSprite = pLife6; break;
        case 7: currentLifeSprite = pLife7; break;
        case 8: currentLifeSprite = pLife8; break;
        case 9: currentLifeSprite = pLife9; break;
        case 10: currentLifeSprite = pLife10; break;
    }
    
    currentLifeSprite.visible = true;
}

function enemy2Spawn() {
    if (gameState === end) return;
    
    enemy2SpawnCounter++;
    if (enemy2SpawnCounter >= 100 && (gameState === wave2 || gameState === wave3)) {
        let side = random() > 0.5 ? 1 : -1;
        let x = side > 0 ? -100 : width + 100;
        let y = height - 320;

        let enemy = createSprite(x, y);
        enemy.addAnimation("e2-walk", enemy2Walk);
        enemy.addAnimation("e2-preAttack", enemy2PreAttack);
        enemy.addAnimation("e2-attack", enemy2Attack);
        enemy.addAnimation("e2-damage", enemy2Damage);
        enemy.addAnimation("e2-defeat", enemy2Defeat);
        enemy.changeAnimation("e2-walk");
        enemy.scale = 0.5;
        enemy.setCollider("rectangle", 0, 0, 142 * 0.8, 159 * 0.8);
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

        // Hitboxes do enemy2
        enemy.damageHitbox = createSprite(enemy.position.x, enemy.position.y, 120, 70);
        enemy.damageHitbox.visible = showHitboxes;
        enemy.damageHitbox.shapeColor = color(255, 0, 0, 150);
        
        enemy.attackHitbox = createSprite(enemy.position.x, enemy.position.y, 90, 100);
        enemy.attackHitbox.visible = false;
        enemy.attackHitbox.shapeColor = color(0, 255, 0, 150);
        
        // Range de detecção para preAttack
        enemy.detectionRange = 110;
        enemy.preAttackRange = createSprite(enemy.position.x, enemy.position.y, enemy.detectionRange * 2, enemy.detectionRange * 2);
        enemy.preAttackRange.visible = showHitboxes;
        enemy.preAttackRange.shapeColor = color(255, 255, 0, 100);

        enemy2Group.add(enemy);
        enemy2SpawnCounter = 0;
    }
}

function updateEnemies2() {
    for (let i = 0; i < enemy2Group.size(); i++) {
        let enemy = enemy2Group[i];
        
        if (enemy.defeated) {
            if (enemy.lifetime !== undefined && enemy.lifetime !== null) {
                enemy.lifetime--;
                if (enemy.lifetime <= 0) {
                    enemy.remove();
                    enemy.damageHitbox.remove();
                    enemy.attackHitbox.remove();
                    enemy.preAttackRange.remove();
                }
            }
            continue;
        }

        // Atualizar hitboxes
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
        
        if (enemy.getAnimationLabel() === "e2-damage") {
            continue;
        }
        
        // Sistema de preAttack
        let distanceToPlayer = dist(enemy.position.x, enemy.position.y, player.position.x, player.position.y);
        
        if (!enemy.isAttacking && !enemy.isInPreAttack && distanceToPlayer < enemy.detectionRange) {
            enemy.isInPreAttack = true;
            enemy.preAttackTimer = 15; // REDUZIDO de 30 para 15
            enemy.changeAnimation("e2-preAttack");
            enemy.speed = 0;
            
            // VIRAR NA DIREÇÃO DO PLAYER
            if (player.position.x > enemy.position.x) {
                enemy.mirrorX(1);
            } else {
                enemy.mirrorX(-1);
            }
            
            enemy.preAttackRange.shapeColor = color(255, 165, 0, 150);
        }
        
        if (enemy.isInPreAttack) {
            enemy.preAttackTimer--;
            if (enemy.preAttackTimer <= 0) {
                enemy.isInPreAttack = false;
                enemy.isAttacking = true;
                enemy.attackCooldown = 20; // REDUZIDO de 40 para 20
                enemy.changeAnimation("e2-attack");
                enemy.attackHitbox.visible = showHitboxes;
                enemy.preAttackRange.shapeColor = color(255, 0, 0, 150);
            }
        }
        
        if (enemy.isAttacking) {
            enemy.attackCooldown--;
            if (enemy.attackCooldown <= 0) {
                enemy.isAttacking = false;
                enemy.attackHitbox.visible = false;
                enemy.changeAnimation("e2-walk");
                enemy.speed = 8 * (enemy.mirrorX() === 1 ? 1 : -1);
                enemy.preAttackRange.shapeColor = color(255, 255, 0, 100);
            }
        } else if (!enemy.isInPreAttack) {
            enemy.position.x += enemy.speed;
            
            if (enemy.collide(invWall1) || enemy.collide(invWall2)) {
                enemy.speed *= -1;
                enemy.mirrorX(enemy.speed > 0 ? 1 : -1);
            }
        }
    }

    for (let i = enemy2Group.size() - 1; i >= 0; i--) {
        let enemy = enemy2Group[i];
        if (enemy.defeated && (enemy.lifetime === undefined || enemy.lifetime === null || enemy.lifetime <= 0)) {
            enemy2Group.remove(i);
        }
    }
}

function checkCollisions2() {
    for (let i = 0; i < enemy2Group.size(); i++) {
        let enemy = enemy2Group[i];
        
        if (enemy.defeated) continue;

        // A condição estava impedindo o ataque - corrigida
        if (enemy.isAttacking && enemy.getAnimationLabel() === "e2-attack") {
            let canTakeDamage = !isPlayerInvulnerable;
            
            if (enemy.attackHitbox.overlap(playerDamageHitbox) && canTakeDamage) {
                playerHealth -= 1;
                updateHealthDisplay();
                
                isPlayerInvulnerable = true;
                invulnerabilityTimer = 0;
                
                let pushDirection = player.position.x < enemy.position.x ? -1 : 1;
                player.position.x += pushDirection * 30;
                
                player.changeAnimation("p-damage");
            }
        }
    }
}

function enemy3Spawn() {
    if (gameState === end) return;
    
    enemy3SpawnCounter++;
    if (enemy3SpawnCounter >= 300 && gameState === wave3) {
        if (!enemy3Idle) {
            console.error("Animações do enemy3 não carregadas!");
            return;
        }
        
        let x = random(100, width - 100);
        let y = -100;

        let enemy = createSprite(x, y);
        enemy.addAnimation("e3-idle", enemy3Idle);
        enemy.addAnimation("e3-defeat", enemy3Defeat);
        enemy.changeAnimation("e3-idle");
        enemy.scale = 0.5;
        enemy.setCollider("rectangle", 0, 0, 142 * 0.8, 159 * 0.8);
        
        enemy.health = 1;
        enemy.isAttacking = false;
        enemy.attackCooldown = 0;
        enemy.defeated = false;
        enemy.speed = speed / 3;
        enemy.originalSpeed = speed / 3;
        enemy.isFlying = true;
        enemy.isInAttackRecovery = false;
        enemy.attackRecoveryTime = 0;
        enemy.hitByCurrentAttack = false;
        enemy.hitByDash = false;
        enemy.damageTimer = null;
        enemy.lifetime = null;
        
        // Hitbox de dano do enemy3 (apenas recebe dano)
        enemy.damageHitbox = createSprite(enemy.position.x, enemy.position.y, 125, 150);
        enemy.damageHitbox.visible = showHitboxes;
        enemy.damageHitbox.shapeColor = color(255, 0, 0, 150);

        // HITBOX DE ATAQUE (SERRA) - POSICIONADA MAIS PRECISAMENTE
        // Calcular a posição Y baseada na altura do sprite
        let spriteHeight = 159 * enemy.scale; // Altura aproximada do sprite escalado
        enemy.attackHitbox = createSprite(enemy.position.x, enemy.position.y + spriteHeight/2 - 10, 80, 80);
        enemy.attackHitbox.visible = showHitboxes;
        enemy.attackHitbox.shapeColor = color(0, 255, 0, 150);

        enemy3Group.add(enemy);
        enemy3SpawnCounter = 0;
    }
}

function updateEnemies3() {
    for (let i = 0; i < enemy3Group.size(); i++) {
        let enemy = enemy3Group[i];
        
        if (enemy.defeated) {
            if (enemy.lifetime !== undefined && enemy.lifetime !== null) {
                enemy.lifetime--;
                if (enemy.lifetime <= 0) {
                    enemy.remove();
                    enemy.damageHitbox.remove();
                    enemy.attackHitbox.remove();
                }
            }
            continue;
        }
        
        // Atualizar hitbox de dano
        enemy.damageHitbox.position.x = enemy.position.x;
        enemy.damageHitbox.position.y = enemy.position.y;
        
        // ATUALIZAR HITBOX DE ATAQUE COM POSICIONAMENTO CORRETO
        let spriteHeight = 200 * enemy.scale;
        enemy.attackHitbox.position.x = enemy.position.x;
        enemy.attackHitbox.position.y = enemy.position.y + spriteHeight/2 - 10;
        
        // CORREÇÃO: Garantir que o enemy3 volte a se mover após o recovery
        if (enemy.isInAttackRecovery) {
            enemy.attackRecoveryTime--;
            enemy.speed = 0; // Para durante o recovery
            
            if (enemy.attackRecoveryTime <= 0) {
                enemy.isInAttackRecovery = false;
                enemy.changeAnimation("e3-idle");
                enemy.speed = speed / 2; // RESTAURA A VELOCIDADE
            }
            continue;
        }
        
        if (enemy.damageTimer !== null && enemy.damageTimer > 0) {
            enemy.damageTimer--;
            enemy.speed = 0; // Para quando está tomando dano
            
            if (enemy.damageTimer <= 0) {
                enemy.changeAnimation("e3-idle");
                enemy.damageTimer = null;
                enemy.speed = speed / 2; // RESTAURA A VELOCIDADE
            }
            continue;
        }
        
        if (enemy.getAnimationLabel() === "e3-defeat") {
            enemy.speed = 0;
            continue;
        }
        
        // MOVIMENTO NORMAL - apenas se não estiver em nenhum estado especial
        let dx = player.position.x - enemy.position.x;
        let dy = player.position.y - enemy.position.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            enemy.position.x += (dx / distance) * enemy.speed;
            enemy.position.y += (dy / distance) * enemy.speed;
            
            if (dx > 0) {
                enemy.mirrorX(1);
            } else {
                enemy.mirrorX(-1);
            }
        }
    }

    for (let i = enemy3Group.size() - 1; i >= 0; i--) {
        let enemy = enemy3Group[i];
        if (enemy.defeated && (enemy.lifetime === undefined || enemy.lifetime === null || enemy.lifetime <= 0)) {
            enemy3Group.remove(i);
        }
    }
}

function checkCollisions3() {
    for (let i = 0; i < enemy3Group.size(); i++) {
        let enemy = enemy3Group[i];
        
        if (enemy.defeated) continue;
        
        if (enemy.getAnimationLabel() === "e3-damage" || enemy.damageTimer || 
            enemy.getAnimationLabel() === "e3-attack" || enemy.isInAttackRecovery) {
            continue;
        }
        
        let canTakeDamage = !isPlayerInvulnerable;
        
        // REMOVIDO: o dano causado pela hitbox de dano do enemy3 (agora só a serra causa dano)
        // if (enemy.damageHitbox.overlap(playerDamageHitbox) && canTakeDamage) {
            
        // AGORA: verificar colisão da hitbox de ataque (serra) do enemy3 com o player
        if (enemy.attackHitbox.overlap(playerDamageHitbox) && canTakeDamage) {
            enemy.changeAnimation("e3-idle");
            
            enemy.attackRecoveryTime = 30;
            enemy.isInAttackRecovery = true;
            
            // Causar 2 de dano (ao invés de 1)
            playerHealth -= 2;
            updateHealthDisplay();
            
            isPlayerInvulnerable = true;
            invulnerabilityTimer = 0;
            
            let pushDirection = player.position.x < enemy.position.x ? -1 : 1;
            player.position.x += pushDirection * 30;
            
            player.changeAnimation("p-damage");
        }
    }
}

function checkMovementCollisions() {
    // Colisão do player com enemy1
    for (let i = 0; i < enemy1Group.size(); i++) {
        let enemy = enemy1Group[i];
        if (enemy.defeated) continue;
        
        if (player.collide(enemy.damageHitbox)) {
            // Empurrar o player para fora do inimigo
            let pushDirection = player.position.x < enemy.position.x ? -1 : 1;
            player.position.x += pushDirection * 3;
        }
    }
    
    // Colisão do player com enemy2
    for (let i = 0; i < enemy2Group.size(); i++) {
        let enemy = enemy2Group[i];
        if (enemy.defeated) continue;
        
        if (player.collide(enemy.damageHitbox)) {
            // Empurrar o player para fora do inimigo
            let pushDirection = player.position.x < enemy.position.x ? -1 : 1;
            player.position.x += pushDirection * 3;
        }
    }
    
    // REMOVIDO: Colisão do player com enemy3
    // O player agora pode atravessar o enemy3 livremente
}

function checkEndGameConditions() {
    if (score >= 40) {
        playerWon = true;
        gameState = end;
        return;
    }
    
    if (playerHealth <= 0) {
        playerWon = false;
        gameState = end;
        return;
    }
}