// Variáveis para dimensionamento responsivo
let baseWidth = 1536;
let baseHeight = 864;
let scaleFactor = 1;

let player;
let playerIdle, playerRunning, playerJump1, playerJump2, playerAttack, playerDamage, playerDefeat;
let speed = 15;
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
let attackDuration = 15;
let attackFrameCounter = 0;

let score = 0;

let pLife0, pLife1, pLife2, pLife3, pLife4, pLife5, pLife6, pLife7, pLife8, pLife9, pLife10;
let pLife0Img, pLife1Img, pLife2Img, pLife3Img, pLife4Img, pLife5Img, pLife6Img, pLife7Img, pLife8Img, pLife9Img, pLife10Img;
let currentLifeSprite;

let enemy1, enemy1Group;
let enemy1Idle, enemy1Running, enemy1Attack, enemy1Defeat;

let enemy2, enemy2Group;
let enemy2Idle, enemy2Attack, enemy2Damage, enemy2Defeat;

let enemy3, enemy3Group;
let enemy3Idle, enemy3Attack, enemy3Damage, enemy3Defeat;

let ground, groundImg;
let roof, roofImg;
let wall1, wall2;
let platform1, platform2, platform3, platform4, platform5, platformImg;

let logo, logoImg;

let menuMusic, battleMusic;
let currentMusic = null;
let musicStarted = false;

const start = 1;
const wave1 = 2;
const wave2 = 3;
const wave3 = 4;
const end = 5;
let gameState = start;

let wave2ScoreThreshold = 7;
let wave2Started = false;

let wave3ScoreThreshold = 20;
let wave3Started = false;

let playerWon = false;

// Funções de utilidade para dimensionamento responsivo
function responsiveX(x) {
    return x * (width / baseWidth);
}

function responsiveY(y) {
    return y * (height / baseHeight);
}

function responsiveScale(scale) {
    return scale * min(width / baseWidth, height / baseHeight);
}

function responsiveValue(value) {
    return value * min(width / baseWidth, height / baseHeight);
}

function preload() {
    playerIdle = loadAnimation("./assets/player/playerIdle.png");
    playerRunning = loadAnimation("./assets/player/playerRunning1.png","./assets/player/playerRunning2.png");
    playerJump1 = loadAnimation("./assets/player/playerJump1.png");
    playerJump2 = loadAnimation("./assets/player/playerJump2.png");
    playerAttack = loadAnimation("./assets/player/playerAttack.png");
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
    enemy1Attack = loadAnimation("./assets/enemy1/enemy1Attack1.png", "./assets/enemy1/enemy1Attack2.png", "./assets/enemy1/enemy1Attack3.png");
    enemy1Defeat = loadAnimation("./assets/enemy1/enemy1Defeat.png");

    enemy2Idle = loadAnimation("./assets/enemy2/enemy2Idle1.png", "./assets/enemy2/enemy2Idle1.png", "./assets/enemy2/enemy2Idle2.png", "./assets/enemy2/enemy2Idle2.png");
    enemy2Attack = loadAnimation("./assets/enemy2/enemy2Attack1.png", "./assets/enemy2/enemy2Attack2.png", "./assets/enemy2/enemy2Attack3.png");
    enemy2Damage = loadAnimation("./assets/enemy2/enemy2Damage.png");
    enemy2Defeat = loadAnimation("./assets/enemy2/enemy2Defeat.png");

    enemy3Idle = loadAnimation("./assets/enemy3/enemy3Idle.png");
    enemy3Attack = loadAnimation("./assets/enemy3/enemy3Attack.png");
    enemy3Damage = loadAnimation("./assets/enemy3/enemy3Damage.png");
    enemy3Defeat = loadAnimation("./assets/enemy3/enemy3Defeat.png");

    groundImg = loadImage("./assets/ground.png");
    roofImg = loadImage("./assets/ground.png");
    platformImg = loadImage("./assets/platform.png");

    logoImg = loadImage("./assets/logo.png");

    menuMusic = loadSound("./assets/audio/menu.mp3");
    battleMusic = loadSound("./assets/audio/battle.ogg");

    if (menuMusic) menuMusic.setLoop(true);
    if (battleMusic) battleMusic.setLoop(true);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // Atualiza o fator de escala
    scaleFactor = min(width / baseWidth, height / baseHeight);
    
    // Ajusta valores de física para o tamanho da tela
    speed = responsiveValue(15);
    gravity = responsiveValue(0.8);
    jumpForce = responsiveValue(-22);

    player = createSprite(responsiveX(400), responsiveY(400));
    player.addAnimation("p-idle", playerIdle);
    player.addAnimation("p-running", playerRunning);
    player.addAnimation("p-jump1", playerJump1);
    player.addAnimation("p-jump2", playerJump2);
    player.addAnimation("p-attack", playerAttack);
    player.addAnimation("p-damage", playerDamage);
    player.addAnimation("p-defeat", playerDefeat);
    player.changeAnimation("p-idle");
    player.scale = responsiveScale(0.8);
    player.setCollider("rectangle", 0, 0, responsiveValue(70), responsiveValue(90));

    // Chão responsivo - mantém proporção e preenche a largura
    ground = createSprite(width / 2, height - responsiveY(43.5));
    ground.addImage("ground", groundImg);
    ground.scale.x = responsiveX(1076) / groundImg.width;
    ground.scale.y = responsiveY(87) / groundImg.height;
    ground.immovable = true;

    // Teto responsivo - mantém proporção e preenche a largura
    roof = createSprite(width / 2, responsiveY(43.5)); // Posiciona no topo com metade da altura
    roof.addImage("roof", roofImg);
    roof.scale.x = responsiveX(1076) / roofImg.width;
    roof.scale.y = responsiveY(87) / roofImg.height;
    roof.immovable = true;

    // Paredes responsivas
    wall1 = createSprite(-5, height/2, responsiveValue(10), height);
    wall1.immovable = true;
    wall2 = createSprite(width + 5, height/2, responsiveValue(10), height);
    wall2.immovable = true;

    const platforms = [
        {x: responsiveX(1213), y: responsiveY(500)},
        {x: responsiveX(316), y: responsiveY(500)},
        {x: width / 2, y: responsiveY(270)},
        {x: responsiveX(-100), y: responsiveY(270)},
        {x: width + responsiveX(100), y: responsiveY(270)}
    ];

    [platform1, platform2, platform3, platform4, platform5] = platforms.map(pos => {
        let platform = createSprite(pos.x, pos.y);
        platform.addImage("platform", platformImg);
        platform.scale.x = responsiveX(786) / platformImg.width;
        platform.scale.y = responsiveY(50) / platformImg.height;
        platform.immovable = true;
        return platform;
    });

    // Plataformas responsivas
    

    // Indicadores de vida responsivos
    pLife0 = createSprite(responsiveX(70), responsiveY(70));
    pLife0.addImage("pLife0", pLife0Img);
    pLife0.scale = responsiveScale(1.0);
    pLife0.visible = false;

    pLife1 = createSprite(responsiveX(70), responsiveY(70));
    pLife1.addImage("pLife1", pLife1Img);
    pLife1.scale = responsiveScale(1.0);
    pLife1.visible = false;

    pLife2 = createSprite(responsiveX(70), responsiveY(70));
    pLife2.addImage("pLife2", pLife2Img);
    pLife2.scale = responsiveScale(1.0);
    pLife2.visible = false;

    pLife3 = createSprite(responsiveX(70), responsiveY(70));
    pLife3.addImage("pLife3", pLife3Img);
    pLife3.scale = responsiveScale(1.0);
    pLife3.visible = false;

    pLife4 = createSprite(responsiveX(70), responsiveY(70));
    pLife4.addImage("pLife4", pLife4Img);
    pLife4.scale = responsiveScale(1.0);
    pLife4.visible = false;

    pLife5 = createSprite(responsiveX(70), responsiveY(70));
    pLife5.addImage("pLife5", pLife5Img);
    pLife5.scale = responsiveScale(1.0);
    pLife5.visible = false;

    pLife6 = createSprite(responsiveX(70), responsiveY(70));
    pLife6.addImage("pLife6", pLife6Img);
    pLife6.scale = responsiveScale(1.0);
    pLife6.visible = false;

    pLife7 = createSprite(responsiveX(70), responsiveY(70));
    pLife7.addImage("pLife7", pLife7Img);
    pLife7.scale = responsiveScale(1.0);
    pLife7.visible = false;

    pLife8 = createSprite(responsiveX(70), responsiveY(70));
    pLife8.addImage("pLife8", pLife8Img);
    pLife8.scale = responsiveScale(1.0);
    pLife8.visible = false;

    pLife9 = createSprite(responsiveX(70), responsiveY(70));
    pLife9.addImage("pLife9", pLife9Img);
    pLife9.scale = responsiveScale(1.0);
    pLife9.visible = false;

    pLife10 = createSprite(responsiveX(70), responsiveY(70));
    pLife10.addImage("pLife10", pLife10Img);
    pLife10.scale = responsiveScale(1.0);
    pLife10.visible = true;

    currentLifeSprite = pLife10;

    // Logo responsiva
    logo = createSprite(width / 2, height / 3);
    logo.addImage("logo", logoImg);
    logo.scale = responsiveScale(1.0);

    if (menuMusic && !musicStarted) {
        playMusic(menuMusic, 0.5);
    }

    enemy1Group = new Group();
    enemy2Group = new Group();
    enemy3Group = new Group();
}

function draw() {
    // Atualiza o fator de escala a cada frame para garantir responsividade contínua
    scaleFactor = min(width / baseWidth, height / baseHeight);
    
    if(gameState === start) {
        background("#fdefefff");

        if (currentMusic !== menuMusic && menuMusic) {
            playMusic(menuMusic, 0.5);
        }

        logo.visible = true;
        player.visible = false;
        currentLifeSprite.visible = false;
        ground.visible = false;
        roof.visible = false;
        platform1.visible = false;
        platform2.visible = false;
        platform3.visible = false;
        platform4.visible = false;
        platform5.visible = false;

        // Texto responsivo para a tela inicial
        textSize(responsiveValue(32));
        fill(50);
        textAlign(CENTER, CENTER);
        text("Pressione ESPAÇO para começar", width / 2, height / 2 + responsiveY(100));

        if(keyWentDown("space") || keyWentDown(" ")) {
            gameState = wave1;
            playMusic(battleMusic, 0.5);
        }
    }

    if(gameState === wave1) {
        background("#161616");

        if (currentMusic !== battleMusic && battleMusic) {
            playMusic(battleMusic, 0.5);
        }

        // Texto posicionado abaixo do teto
        textSize(responsiveValue(24));
        fill("white");
        textAlign(RIGHT, TOP);
        text("Score: " + score, width - responsiveX(50), responsiveY(100));
        text("Wave: 1", width - responsiveX(50), responsiveY(130));

        logo.visible = false;
        player.visible = true;
        currentLifeSprite.visible = true;
        ground.visible = true;
        roof.visible = true;
        platform1.visible = true;
        platform2.visible = true;
        platform3.visible = true;
        platform4.visible = true;
        platform5.visible = true;

        manageAttackState();

        if (isPlayerInvulnerable) {
            invulnerabilityTimer++;
            if (invulnerabilityTimer > 60) {
                isPlayerInvulnerable = false;
                invulnerabilityTimer = 0;
                player.visible = true;
            } else {
                if (invulnerabilityTimer % 10 < 5) {
                    player.visible = false;
                } else {
                    player.visible = true;
                }
            }
        }

        let moving = false;
        
        if (!isAttacking) {
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

        if(player.collide(ground) || player.collide(roof) || player.collide(platform1) || player.collide(platform2) || player.collide(platform3) || player.collide(platform4) || player.collide(platform5)) {
            velocityY = 0;
            onGround = true;
        } else {
            onGround = false;
        }

        if(keyWentDown(UP_ARROW) && onGround && !isAttacking) {
            velocityY = jumpForce;
        }

        if (isAttacking) {
            player.changeAnimation("p-attack");
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

        enemy1Spawn();
        updateEnemies();
        checkCollisions();

        if (score >= wave2ScoreThreshold && !wave2Started) {
            gameState = wave2;
            wave2Started = true;
        }
        
        checkEndGameConditions();
    }

    if(gameState === wave2) {
        background("#161616");

        if (currentMusic !== battleMusic && battleMusic) {
            playMusic(battleMusic, 0.5);
        }

        // Texto posicionado abaixo do teto
        textSize(responsiveValue(24));
        fill("white");
        textAlign(RIGHT, TOP);
        text("Score: " + score, width - responsiveX(50), responsiveY(100));
        text("Wave: 2", width - responsiveX(50), responsiveY(130));

        logo.visible = false;
        player.visible = true;
        currentLifeSprite.visible = true;
        ground.visible = true;
        roof.visible = true;
        platform1.visible = true;
        platform2.visible = true;
        platform3.visible = true;
        platform4.visible = true;
        platform5.visible = true;

        manageAttackState();

        if (isPlayerInvulnerable) {
            invulnerabilityTimer++;
            if (invulnerabilityTimer > 60) {
                isPlayerInvulnerable = false;
                invulnerabilityTimer = 0;
                player.visible = true;
            } else {
                if (invulnerabilityTimer % 10 < 5) {
                    player.visible = false;
                } else {
                    player.visible = true;
                }
            }
        }

        let moving = false;
            
        if (!isAttacking) {
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

        if(player.collide(ground) || player.collide(roof) || player.collide(platform1) || player.collide(platform2) || player.collide(platform3) || player.collide(platform4) || player.collide(platform5)) {
            velocityY = 0;
            onGround = true;
        } else {
            onGround = false;
        }

        if(keyWentDown(UP_ARROW) && onGround && !isAttacking) {
            velocityY = jumpForce;
        }

        if (isAttacking) {
            player.changeAnimation("p-attack");
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

        enemy1Spawn();
        enemy2Spawn();
        updateEnemies();
        updateEnemies2();
        checkCollisions();
        checkCollisions2();

        if (score >= wave3ScoreThreshold && !wave3Started) {
            gameState = wave3;
            wave3Started = true;
        }
        
        checkEndGameConditions();
    }

    if(gameState === wave3) {
        background("#161616");

        if (currentMusic !== battleMusic && battleMusic) {
            playMusic(battleMusic, 0.5);
        }

        // Texto posicionado abaixo do teto
        textSize(responsiveValue(24));
        fill("white");
        textAlign(RIGHT, TOP);
        text("Score: " + score, width - responsiveX(50), responsiveY(100));
        text("Wave: 3", width - responsiveX(50), responsiveY(130));

        logo.visible = false;
        player.visible = true;
        currentLifeSprite.visible = true;
        ground.visible = true;
        roof.visible = true;
        platform1.visible = true;
        platform2.visible = true;
        platform3.visible = true;
        platform4.visible = true;
        platform5.visible = true;

        manageAttackState();

        if (isPlayerInvulnerable) {
            invulnerabilityTimer++;
            if (invulnerabilityTimer > 60) {
                isPlayerInvulnerable = false;
                invulnerabilityTimer = 0;
                player.visible = true;
            } else {
                if (invulnerabilityTimer % 10 < 5) {
                    player.visible = false;
                } else {
                    player.visible = true;
                }
            }
        }

        let moving = false;
            
        if (!isAttacking) {
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

        if(player.collide(ground) || player.collide(roof) || player.collide(platform1) || player.collide(platform2) || player.collide(platform3) || player.collide(platform4) || player.collide(platform5)) {
            velocityY = 0;
            onGround = true;
        } else {
            onGround = false;
        }

        if(keyWentDown(UP_ARROW) && onGround && !isAttacking) {
            velocityY = jumpForce;
        }

        if (isAttacking) {
            player.changeAnimation("p-attack");
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

        enemy1Spawn();
        enemy2Spawn();
        enemy3Spawn();
        updateEnemies();
        updateEnemies2();
        updateEnemies3();
        checkCollisions();
        checkCollisions2();
        checkCollisions3();
        
        checkEndGameConditions();
    }

    if(gameState === end) {
        background("#161616");
        
        player.visible = true;
        currentLifeSprite.visible = true;
        ground.visible = true;
        roof.visible = true;
        platform1.visible = true;
        platform2.visible = true;
        platform3.visible = true;
        platform4.visible = true;
        platform5.visible = true;

        if (currentMusic && currentMusic.isPlaying()) {
            currentMusic.stop();
        }

        textSize(responsiveValue(72));
        textAlign(CENTER, CENTER);
        
        if (playerWon) {
            fill(0, 255, 0);
            text("VOCÊ VENCEU", width/2, height/2);
        } else {
            fill(255, 0, 0);
            text("VOCÊ PERDEU", width/2, height/2);

            player.changeAnimation("p-defeat");
        }
        
        textSize(responsiveValue(36));
        fill(255);
        text("Score: " + score, width/2, height/2 + responsiveY(80));
        
        // Botão para reiniciar
        textSize(responsiveValue(24));
        text("Pressione R para reiniciar", width/2, height/2 + responsiveY(150));
        
        if (keyWentDown('r') || keyWentDown('R')) {
            resetGame();
        }
    }

    drawSprites();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // Atualiza o fator de escala
    scaleFactor = min(width / baseWidth, height / baseHeight);
    
    // Reposiciona e redimensiona elementos de acordo com o novo tamanho
    if (ground) {
        ground.position.x = width / 2;
        ground.position.y = height - responsiveY(30);
        ground.scale = responsiveScale(1.45);
        ground.scale.x = width / groundImg.width * 1.1;
    }
    
    if (roof) {
        roof.position.x = width / 2;
        roof.position.y = responsiveY(30);
        roof.scale = responsiveScale(1.45);
        roof.scale.x = width / roofImg.width * 1.1;
    }
    
    if (wall2) wall2.position.x = width + 5;
    
    // Atualiza a posição e escala da logo
    if (logo) {
        logo.position.x = width / 2;
        logo.position.y = height / 3;
        logo.scale = responsiveScale(1.0);
    }
    
    // Atualiza a posição e escala do texto de vida
    if (currentLifeSprite) {
        currentLifeSprite.position.x = responsiveX(70);
        currentLifeSprite.position.y = responsiveY(70);
        currentLifeSprite.scale = responsiveScale(1.0);
    }
    
    // Atualiza plataformas
    platform1.position.x = responsiveX(1213);
    platform1.position.y = responsiveY(500);
    platform1.scale = responsiveScale(0.9);
    
    platform2.position.x = responsiveX(316);
    platform2.position.y = responsiveY(500);
    platform2.scale = responsiveScale(0.9);
    
    platform3.position.x = width / 2;
    platform3.position.y = responsiveY(270);
    platform3.scale = responsiveScale(0.9);
    
    platform4.position.x = responsiveX(-100);
    platform4.position.y = responsiveY(270);
    platform4.scale = responsiveScale(0.9);
    
    platform5.position.x = width + responsiveX(100);
    platform5.position.y = responsiveY(270);
    platform5.scale = responsiveScale(0.9);
    
    // Atualiza valores de física
    speed = responsiveValue(15);
    gravity = responsiveValue(0.8);
    jumpForce = responsiveValue(-22);
}

function resetGame() {
    // Reinicia todas as variáveis do jogo
    playerHealth = 10;
    score = 0;
    velocityY = 0;
    isPlayerInvulnerable = false;
    invulnerabilityTimer = 0;
    isAttacking = false;
    attackCooldown = false;
    wave2Started = false;
    wave3Started = false;
    playerWon = false;
    
    // Remove todos os inimigos
    enemy1Group.removeSprites();
    enemy2Group.removeSprites();
    enemy3Group.removeSprites();
    
    // Reposiciona o jogador
    player.position.x = width / 2;
    player.position.y = height / 2;
    player.changeAnimation("p-idle");
    
    // Atualiza a exibição de vida
    updateHealthDisplay();
    
    // Reinicia o estado do jogo
    gameState = start;
    
    // Reinicia a música
    if (menuMusic) {
        playMusic(menuMusic, 0.5);
    }
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

function manageAttackState() {
    if (keyWentDown(' ') && !isAttacking && !attackCooldown) {
        isAttacking = true;
        attackFrameCounter = 0;
        attackCooldown = true;
        attackCooldownCounter = 0;
        
        checkAttackHit();
    }

    if (isAttacking) {
        attackFrameCounter++;
        
        if (attackFrameCounter >= attackDuration) {
            isAttacking = false;
        }
    }

    if (attackCooldown) {
        attackCooldownCounter++;
        
        if (attackCooldownCounter >= attackCooldownTime) {
            attackCooldown = false;
        }
    }
}

function enemy1Spawn() {
    if (gameState === end) return;
    
    if (frameCount % 150 === 0) {
        let side = random() > 0.5 ? 1 : -1;
        let x = side > 0 ? responsiveX(50) : width - responsiveX(100);
        // Posição Y do enemy1 ajustada para não ficar dentro do chão
        let y = ground.position.y - ground.height/2 - responsiveValue(40);

        enemy1 = createSprite(x, y);
        enemy1.addAnimation("e1-running", enemy1Running);
        enemy1.addAnimation("e1-attack", enemy1Attack);
        enemy1.addAnimation("e1-defeat", enemy1Defeat);
        enemy1.changeAnimation("e1-running");
        enemy1.scale = responsiveScale(0.8);
        enemy1.setCollider("rectangle", 0, 0, responsiveValue(145 * 0.8), responsiveValue(182 * 0.8));
        enemy1.mirrorX(side);
        enemy1.speed = responsiveValue(20) * side;
        enemy1.health = 1;
        enemy1.isAttaking = false;
        enemy1.attackCooldown = 0;
        enemy1.defeated = false;

        enemy1Group.add(enemy1);
    }
}

function updateEnemies() {
    for (let i = 0; i < enemy1Group.size(); i++) {
        let enemy = enemy1Group[i];
        
        if (enemy.defeated) {
            if (enemy.lifetime) {
                enemy.lifetime--;
                if (enemy.lifetime <= 0) {
                    enemy.remove();
                }
            }
            continue;
        }

        enemy.velocityY += gravity;
        enemy.position.y += enemy.velocityY;
        
        // Colisão com o chão
        if (enemy.collide(ground)) {
            enemy.velocityY = 0;
            enemy.position.y = ground.position.y - ground.height/2 - enemy.height/2;
        }
        
        if (enemy.isAttacking) {
            enemy.attackCooldown--;
            if (enemy.attackCooldown <= 0) {
                enemy.isAttacking = false;
                enemy.changeAnimation("e1-running");
            }
        } else {
            enemy.position.x += enemy.speed;
            
            if (enemy.position.x < responsiveX(50) || enemy.position.x > width - responsiveX(50)) {
                enemy.speed *= -1;
                enemy.mirrorX(enemy.speed > 0 ? 1 : -1);
            }
        }
    }
}

function checkCollisions() {
    for (let i = 0; i < enemy1Group.size(); i++) {
        let enemy = enemy1Group[i];
        
        if (enemy.defeated) continue;
        
        if (enemy.overlap(player) && !isPlayerInvulnerable && !enemy.isAttacking) {
            enemy.isAttacking = true;
            enemy.attackCooldown = 30;
            enemy.changeAnimation("e1-attack");
            enemy.velocity.x = 0;
            
            playerHealth -= 1;
            updateHealthDisplay();
            
            isPlayerInvulnerable = true;
            invulnerabilityTimer = 0;
            
            let pushDirection = player.position.x < enemy.position.x ? -1 : 1;
            player.position.x += pushDirection * responsiveValue(30);
            
            player.changeAnimation("p-damage");
        }
    }
}

function checkAttackHit() {
    for (let i = 0; i < enemy1Group.size(); i++) {
        let enemy = enemy1Group[i];
        
        if (enemy.defeated) continue;
        
        let attackRange = responsiveValue(120);
        let distance = dist(player.position.x, player.position.y, enemy.position.x, enemy.position.y);
        
        if (distance < attackRange) {
            let attackDirection = player.mirrorX() === 1 ? 1 : -1;
            let enemyDirection = Math.sign(enemy.position.x - player.position.x);
            
            if (attackDirection === enemyDirection) {
                enemy.health -= 1;
                
                if (enemy.health <= 0) {
                    enemy.changeAnimation("e1-defeat");
                    enemy.defeated = true;
                    enemy.lifetime = 60;
                    enemy.velocity.x = 0;
                    score += 1;
                }
            }
        }
    }
    
    for (let i = 0; i < enemy2Group.size(); i++) {
        let enemy = enemy2Group[i];
        
        if (enemy.defeated) continue;
        
        let attackRange = responsiveValue(120);
        let distance = dist(player.position.x, player.position.y, enemy.position.x, enemy.position.y);
        
        if (distance < attackRange) {
            let attackDirection = player.mirrorX() === 1 ? 1 : -1;
            let enemyDirection = Math.sign(enemy.position.x - player.position.x);
            
            if (attackDirection === enemyDirection) {
                enemy.health -= 1;
                
                if (enemy.health <= 0) {
                    enemy.changeAnimation("e2-defeat");
                    enemy.defeated = true;
                    enemy.lifetime = 60;
                    enemy.velocity.x = 0;
                    score += 3;
                } else {
                    enemy.changeAnimation("e2-damage");
                }
            }
        }
    }

    for (let i = 0; i < enemy3Group.size(); i++) {
        let enemy = enemy3Group[i];
        
        if (enemy.defeated) continue;
        
        let attackRange = responsiveValue(120);
        let distance = dist(player.position.x, player.position.y, enemy.position.x, enemy.position.y);
        
        if (distance < attackRange) {
            let attackDirection = player.mirrorX() === 1 ? 1 : -1;
            let enemyDirection = Math.sign(enemy.position.x - player.position.x);
            
            if (attackDirection === enemyDirection) {
                enemy.health -= 1;
                
                if (enemy.health <= 0) {
                    enemy.changeAnimation("e3-defeat");
                    enemy.defeated = true;
                    enemy.lifetime = 60;
                    enemy.velocity.x = 0;
                    enemy.velocity.y = 0;
                    score += 5;
                } else {
                    enemy.changeAnimation("e3-damage");
                    enemy.velocity.x = 0;
                    enemy.velocity.y = 0;
                    
                    setTimeout(() => {
                        if (!enemy.defeated && enemy.getAnimationLabel() === "e3-damage") {
                            enemy.changeAnimation("e3-idle");
                        }
                    }, 1500);
                }
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
    
    if (frameCount % 180 === 0 && (gameState === wave2 || gameState === wave3)) {
        let side = random() > 0.5 ? 1 : -1;
        let x = side > 0 ? -responsiveX(100) : width + responsiveX(100);
        let y = height - responsiveY(320);

        let enemy = createSprite(x, y);
        enemy.addAnimation("e2-idle", enemy2Idle);
        enemy.addAnimation("e2-attack", enemy2Attack);
        enemy.addAnimation("e2-damage", enemy2Damage);
        enemy.addAnimation("e2-defeat", enemy2Defeat);
        enemy.changeAnimation("e2-idle");
        enemy.scale = responsiveScale(0.8);
        enemy.setCollider("rectangle", 0, 0, responsiveValue(142 * 0.8), responsiveValue(159 * 0.8));
        enemy.mirrorX(side);
        enemy.speed = responsiveValue(3) * side;
        enemy.health = 2;
        enemy.isAttacking = false;
        enemy.attackCooldown = 0;
        enemy.defeated = false;
        enemy.reachedPlatform = false;
        
        enemy.targetPlatform = random() > 0.5 ? platform1 : platform2;

        enemy2Group.add(enemy);
    }
}

function updateEnemies2() {
    for (let i = 0; i < enemy2Group.size(); i++) {
        let enemy = enemy2Group[i];
        
        if (enemy.defeated) {
            if (enemy.lifetime) {
                enemy.lifetime--;
                if (enemy.lifetime <= 0) {
                    enemy.remove();
                }
            }
            continue;
        }

        enemy.velocityY += gravity;
        enemy.position.y += enemy.velocityY;
        
        // Colisão com plataformas
        const platforms = [platform1, platform2, platform3, platform4, platform5];
        let onPlatform = false;
        
        for (let platform of platforms) {
            if (enemy.collide(platform)) {
                enemy.velocityY = 0;
                enemy.position.y = platform.position.y - platform.height/2 - enemy.height/2;
                onPlatform = true;
                break;
            }
        }

        if (!onPlatform && enemy.collide(ground)) {
            enemy.velocityY = 0;
            enemy.position.y = ground.position.y - ground.height/2 - enemy.height/2;
        }
        
        if (enemy.getAnimationLabel() === "e2-damage") {
            continue;
        }
        
        if (enemy.isAttacking) {
            enemy.attackCooldown--;
            if (enemy.attackCooldown <= 0) {
                enemy.isAttacking = false;
                enemy.changeAnimation("e2-idle");
            }
        } else {
            if (!enemy.reachedPlatform) {
                enemy.position.x += enemy.speed;
                
                let platform = enemy.targetPlatform;
                let platformLeft = platform.position.x - platform.width / 2;
                let platformRight = platform.position.x + platform.width / 2;
                
                let isAtPlatform = false;
                if (enemy.speed > 0) {
                    isAtPlatform = enemy.position.x >= platformLeft - responsiveValue(20);
                } else {
                    isAtPlatform = enemy.position.x <= platformRight + responsiveValue(20);
                }
                
                if (isAtPlatform) {
                    enemy.reachedPlatform = true;
                    enemy.speed = responsiveValue(3) * Math.sign(enemy.speed);
                    
                    enemy.platformBounds = {
                        left: platformLeft + responsiveValue(35),
                        right: platformRight - responsiveValue(35)
                    };
                    
                    enemy.position.y = platform.position.y - platform.height / 2 - responsiveValue(55);
                    
                    if (enemy.position.x < enemy.platformBounds.left) {
                        enemy.position.x = enemy.platformBounds.left;
                    } else if (enemy.position.x > enemy.platformBounds.right) {
                        enemy.position.x = enemy.platformBounds.right;
                    }
                }
            } else {
                enemy.position.x += enemy.speed;
                
                if (enemy.position.x <= enemy.platformBounds.left) {
                    enemy.position.x = enemy.platformBounds.left;
                    enemy.speed = Math.abs(enemy.speed);
                    enemy.mirrorX(1);
                } else if (enemy.position.x >= enemy.platformBounds.right) {
                    enemy.position.x = enemy.platformBounds.right;
                    enemy.speed = -Math.abs(enemy.speed);
                    enemy.mirrorX(-1);
                }
                
                enemy.position.y = enemy.targetPlatform.position.y - enemy.targetPlatform.height / 2 - responsiveValue(55);
            }
        }
    }
}

function checkCollisions2() {
    for (let i = 0; i < enemy2Group.size(); i++) {
        let enemy = enemy2Group[i];
        
        if (enemy.defeated) continue;
        
        if (enemy.overlap(player) && !isPlayerInvulnerable && !enemy.isAttacking) {
            enemy.isAttacking = true;
            enemy.attackCooldown = 40;
            enemy.changeAnimation("e2-attack");
            enemy.velocity.x = 0;
            
            playerHealth -= 1;
            updateHealthDisplay();
            
            isPlayerInvulnerable = true;
            invulnerabilityTimer = 0;
            
            let pushDirection = player.position.x < enemy.position.x ? -1 : 1;
            player.position.x += pushDirection * responsiveValue(30);
            
            player.changeAnimation("p-damage");
        }
    }
}

function enemy3Spawn() {
    if (gameState === end) return;
    
    if (frameCount % 120 === 0 && gameState === wave3) {
        if (!enemy3Idle || !enemy3Attack || !enemy3Damage || !enemy3Defeat) {
            console.error("Animações do enemy3 não carregadas!");
            return;
        }
        
        let x = random(responsiveX(100), width - responsiveX(100));
        let y = -responsiveY(100);

        let enemy = createSprite(x, y);
        enemy.addAnimation("e3-idle", enemy3Idle);
        enemy.addAnimation("e3-attack", enemy3Attack);
        enemy.addAnimation("e3-damage", enemy3Damage);
        enemy.addAnimation("e3-defeat", enemy3Defeat);
        enemy.changeAnimation("e3-idle");
        enemy.scale = responsiveScale(0.8);
        enemy.setCollider("rectangle", 0, 0, responsiveValue(142 * 0.8), responsiveValue(159 * 0.8));
        
        enemy.health = 2;
        enemy.isAttacking = false;
        enemy.attackCooldown = 0;
        enemy.defeated = false;
        enemy.speed = speed / 2;
        enemy.isFlying = true;
        enemy.isInAttackRecovery = false;
        enemy.attackRecoveryTime = 0;
        
        enemy3Group.add(enemy);
    }
}

function updateEnemies3() {
    for (let i = 0; i < enemy3Group.size(); i++) {
        let enemy = enemy3Group[i];
        
        if (enemy.defeated) {
            if (enemy.lifetime) {
                enemy.lifetime--;
                if (enemy.lifetime <= 0) {
                    enemy.remove();
                }
            }
            continue;
        }
        
        if (enemy.getAnimationLabel() === "e3-damage" || enemy.getAnimationLabel() === "e3-defeat" || enemy.getAnimationLabel() === "e3-attack") {
            enemy.velocity.x = 0;
            enemy.velocity.y = 0;
            continue;
        }
        
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
}

function checkCollisions3() {
    for (let i = 0; i < enemy3Group.size(); i++) {
        let enemy = enemy3Group[i];
        
        if (enemy.defeated) continue;
        
        if (enemy.overlap(player) && !isPlayerInvulnerable && enemy.getAnimationLabel() !== "e3-damage" && enemy.getAnimationLabel() !== "e3-defeat" && enemy.getAnimationLabel() !== "e3-attack") {
            enemy.changeAnimation("e3-attack");
            
            enemy.velocity.x = 0;
            enemy.velocity.y = 0;
            
            enemy.attackRecoveryTime = 60;
            enemy.isInAttackRecovery = true;
            
            playerHealth -= 1;
            updateHealthDisplay();
            
            isPlayerInvulnerable = true;
            invulnerabilityTimer = 0;
            
            let pushDirection = player.position.x < enemy.position.x ? -1 : 1;
            player.position.x += pushDirection * responsiveValue(30);
            
            player.changeAnimation("p-damage");
        }
        
        if (enemy.isInAttackRecovery) {
            enemy.attackRecoveryTime--;
            if (enemy.attackRecoveryTime <= 0) {
                enemy.isInAttackRecovery = false;
                enemy.changeAnimation("e3-idle");
            }
        }
    }
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