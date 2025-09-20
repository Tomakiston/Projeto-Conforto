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

// Variáveis para a mecânica de ataque
let isAttacking = false;
let attackCooldown = false;
let attackCooldownTime = 20;
let attackCooldownCounter = 0;
let attackDuration = 15;
let attackFrameCounter = 0;

let score = 0;

// Sprites de vida do jogador
let pLife0, pLife1, pLife2, pLife3, pLife4, pLife5, pLife6, pLife7, pLife8, pLife9, pLife10;
let pLife0Img, pLife1Img, pLife2Img, pLife3Img, pLife4Img, pLife5Img, pLife6Img, pLife7Img, pLife8Img, pLife9Img, pLife10Img;
let currentLifeSprite;

let enemy1, enemy1Group;
let enemy1Idle, enemy1Running, enemy1Attack, enemy1Defeat;

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
const end = 0;
let gameState = wave3;

let wave2ScoreThreshold = 7;
let wave2Started = false;

let wave3ScoreThreshold = 20; // Definindo o threshold para wave3
let wave3Started = false;

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
    try {
        bulletImgs = loadAnimation("./assets/enemy3/bullet1.png", "./assets/enemy3/bullet2.png");
    } catch (error) {
        console.error("Erro ao carregar animações de projétil:", error);
        // Criar animação fallback simples
        bulletImgs = loadAnimation(); // Animação vazia
    }

    enemy3Idle.onload = function() {
    console.log("enemy3Idle carregado");
    };
    enemy3Attack.onload = function() {
        console.log("enemy3Attack carregado");
    };
    enemy3Damage.onload = function() {
        console.log("enemy3Damage carregado");
    };
    enemy3Defeat.onload = function() {
        console.log("enemy3Defeat carregado");
    };
    bulletImgs.onload = function() {
        console.log("bulletImgs carregado");
    };

    groundImg = loadImage("./assets/ground.png");
    roofImg = loadImage("./assets/ground.png");
    platformImg = loadImage("./assets/platform.png");

    logoImg = loadImage("./assets/logo.png");

    menuMusic = loadSound("./assets/audio/menu.mp3");
    battleMusic = loadSound("./assets/audio/battle.ogg");

    if (menuMusic) menuMusic.setLoop(false);
    if (battleMusic) battleMusic.setLoop(false);

    enemy1Running.onload = function() {
        console.log("Animação enemy1Running carregada");
    };
    enemy1Running.onerror = function() {
        console.log("Erro ao carregar enemy1Running");
    };
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    player = createSprite(400, 400);
    player.addAnimation("p-idle", playerIdle);
    player.addAnimation("p-running", playerRunning);
    player.addAnimation("p-jump1", playerJump1);
    player.addAnimation("p-jump2", playerJump2);
    player.addAnimation("p-attack", playerAttack);
    player.addAnimation("p-damage", playerDamage);
    player.addAnimation("p-defeat", playerDefeat);
    player.changeAnimation("p-idle");
    player.scale = 0.8;
    player.setCollider("rectangle", 0, 0, 70, 90);

    ground = createSprite(764, 760);
    ground.addImage("ground", groundImg);
    ground.scale = 1.45;
    ground.immovable = true;

    roof = createSprite(764, -33);
    roof.addImage("roof", roofImg);
    roof.scale = 1.45;
    roof.immovable = true;

    wall1 = createSprite(-70, height/2, 100, height);
    wall1.immovable = true;
    wall2 = createSprite(width + 70, height/2, 100, height);
    wall2.immovable = true;

    platform1 = createSprite(1213, 500);
    platform1.addImage("platform", platformImg);
    platform1.immovable = true;
    platform1.scale = 0.9;

    platform2 = createSprite(316, 500);
    platform2.addImage("platform", platformImg);
    platform2.immovable = true;
    platform2.scale = 0.9;

    console.log("Platform1: ", platform1.position.x, platform1.position.y);
    console.log("Platform2: ", platform2.position.x, platform2.position.y);

    platform3 = createSprite(750, 270);
    platform3.addImage("platform", platformImg);
    platform3.immovable = true;
    platform3.scale = 0.9;

    platform4 = createSprite(-100, 270);
    platform4.addImage("platform", platformImg);
    platform4.immovable = true;
    platform4.scale = 0.9;

    platform5 = createSprite(1615, 270);
    platform5.addImage("platform", platformImg);
    platform5.immovable = true;
    platform5.scale = 0.9;

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
    pLife10.visible = true; // Vida inicial

    currentLifeSprite = pLife10;

    logo = createSprite(730, 360);
    logo.addImage("logo", logoImg);

    if (menuMusic && !musicStarted) {
        playMusic(menuMusic, 0.5);
    }

    enemy1Group = new Group();
    enemy2Group = new Group();
    enemy3Group = new Group();
    bulletsGroup = new Group();
}

function draw() {
    
    //"#262121ff"
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

        textSize(24);
        fill("white");
        text("Score: " + score, 1400, 60);
        text("Wave: 1", 1400, 90);

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

        // Gerenciar invulnerabilidade
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
                
        // Só permite movimento se não estiver atacando
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
        if(player.collide(wall1) || player.collide(wall2)) {
            player.position.x -= 0;
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

        if (score >= 7 && !wave2Started) {
            gameState = wave2;
            wave2Started = true;
            console.log("Wave 2 iniciada!");
        }
    }

    if(gameState === wave2) {
        background("#161616");

        // Manter a música de batalha
        if (currentMusic !== battleMusic && battleMusic) {
            if (currentMusic && currentMusic.isPlaying()) {
                currentMusic.stop();
            }
            battleMusic.loop();
            currentMusic = battleMusic;
        }

        textSize(24);
        fill("white");
        text("Score: " + score, 1400, 60);
        text("Wave: 2", 1400, 90); // Indicador de wave

        // Manter a visibilidade de todos os elementos
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

        // Gerenciar ataque e invulnerabilidade (mesmo código da wave1)
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

        // Movimento do jogador (mesmo código da wave1)
        let moving = false;
                    
        // Só permite movimento se não estiver atacando
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
        if(player.collide(wall1) || player.collide(wall2)) {
            player.position.x -= 0;
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

        // Spawn e atualização de inimigos
        enemy1Spawn();
        enemy2Spawn(); // Novo spawn para enemy2
        updateEnemies(); // Para enemy1 (já existe)
        updateEnemies2(); // Nova função para enemy2
        checkCollisions(); // Para enemy1 (já existe)
        checkCollisions2(); // Nova função para enemy2

        if (score >= wave3ScoreThreshold && !wave3Started) {
            gameState = wave3;
            wave3Started = true;
            console.log("Wave 3 iniciada!");
        }
    }

    if(gameState === wave3) {
        background("#161616");

        if (currentMusic !== battleMusic && battleMusic) {
            if (currentMusic && currentMusic.isPlaying()) {
                currentMusic.stop();
            }
            battleMusic.loop();
            currentMusic = battleMusic;
        }

        textSize(24);
        fill("white");
        text("Score: " + score, 1400, 60);
        text("Wave: 3", 1400, 90);

        // Manter a visibilidade de todos os elementos
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

        // Gerenciar ataque e invulnerabilidade
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

        // Movimento do jogador
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
        if(player.collide(wall1) || player.collide(wall2)) {
            player.position.x -= 0;
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

        fill("yellow");
        text("Enemy3: " + enemy3Group.size(), 1400, 120);
        
        // Verificar se as animações do enemy3 estão carregadas
        if (!enemy3Idle || !enemy3Idle.images || enemy3Idle.images.length === 0) {
            text("ERRO: Animações não carregadas!", 1400, 150);
            
            // Desenhar inimigos de fallback
            for (let i = 0; i < enemy3Group.size(); i++) {
                let enemy = enemy3Group[i];
                if (enemy && enemy.position) {
                    fill(255, 0, 0); // Vermelho
                    ellipse(enemy.position.x, enemy.position.y, 50, 50); // Círculo vermelho como fallback
                }
            }
        }

        // Inimigos da wave3
        enemy1Spawn();
        enemy2Spawn();
        enemy3Spawn(); // Spawn do enemy3 (voador)
        updateEnemies();
        updateEnemies2();
        updateEnemies3(); // Atualização do enemy3 (movimento em direção ao jogador)
        updateBullets(); // Atualização de projéteis
        checkCollisions();
        checkCollisions2();
        checkCollisions3(); // Colisões do enemy3 (ataque direto e projéteis)
    }

    console.log("GameState: " + gameState);

    drawSprites();
}

function playMusic(music, volume = 0.5) {
    // Parar música atual se estiver tocando
    if (currentMusic && currentMusic.isPlaying()) {
        currentMusic.stop();
    }
    
    // Tocar nova música
    if (music) {
        currentMusic = music;
        currentMusic.setVolume(volume);
        currentMusic.loop();
        musicStarted = true;
    }
}

function manageAttackState() {
           // Verificar se o jogador pressionou espaço para atacar
            if (keyWentDown(' ') && !isAttacking && !attackCooldown) {
                isAttacking = true;
                attackFrameCounter = 0;
                attackCooldown = true;
                attackCooldownCounter = 0;
                
                // Verificar se acertou algum inimigo
                checkAttackHit();
            }

            // Se estiver atacando, incrementar o contador de frames de ataque
            if (isAttacking) {
                attackFrameCounter++;
                
                // Se o tempo de ataque terminou, parar o ataque
                if (attackFrameCounter >= attackDuration) {
                    isAttacking = false;
                }
            }

            // Se estiver em cooldown, incrementar o contador de cooldown
            if (attackCooldown) {
                attackCooldownCounter++;
                
                // Se o tempo de cooldown terminou, resetar o cooldown
                if (attackCooldownCounter >= attackCooldownTime) {
                    attackCooldown = false;
                }
            }
        }

function enemy1Spawn() {
    //let rand = Math.floor(Math.random() * 150) + 110;

    if (frameCount % 150 === 0) {
        // Spawnar dentro da tela temporariamente para teste
        let side = random() > 0.5 ? 1 : -1;
        let x = side > 0 ? 50 : width - 100; // Dentro da tela para teste
        let y = height - 105; // Posição Y fixa para teste

        enemy1 = createSprite(x, y);
        enemy1.addAnimation("e1-running", enemy1Running);
        enemy1.addAnimation("e1-attack", enemy1Attack);
        enemy1.addAnimation("e1-defeat", enemy1Defeat);
        enemy1.changeAnimation("e1-running");
        enemy1.scale = 0.8;
        enemy1.setCollider("rectangle", 0, 0, 145 * 0.8, 182 * 0.8);
        enemy1.mirrorX(side);
        enemy1.speed = 20 * side;
        enemy1.health = 1;
        enemy1.isAttacking = false;
        enemy1.attackCooldown = 0;
        enemy1.defeated = false;
        //enemy1.lifetime = 1000; // Adicionar lifetime

        enemy1Group.add(enemy1);
        console.log("Inimigo spawnado em: " + x + ", " + y); // Debug
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
        
        if (enemy.isAttacking) {
            enemy.attackCooldown--;
            if (enemy.attackCooldown <= 0) {
                enemy.isAttacking = false;
                enemy.changeAnimation("e1-running");
            }
        } else {
            enemy.position.x += enemy.speed;
            
            // Verificar bordas da tela
            if (enemy.position.x < 50 || enemy.position.x > width - 50) {
                enemy.speed *= -1;
                enemy.mirrorX(enemy.speed > 0 ? 1 : -1);
            }
        }
    }
}

function checkCollisions() {
            for (let i = 0; i < enemy1Group.size(); i++) {
                let enemy = enemy1Group[i];
                
                // Pular inimigos derrotados
                if (enemy.defeated) continue;
                
                // Verificar se o inimigo está colidindo com o jogador
                if (enemy.overlap(player) && !isPlayerInvulnerable && !enemy.isAttacking) {
                    // Inimigo ataca o jogador
                    enemy.isAttacking = true;
                    enemy.attackCooldown = 30;
                    enemy.changeAnimation("e1-attack");
                    enemy.velocity.x = 0;
                    
                    // Causar dano ao jogador
                    playerHealth -= 1;
                    updateHealthDisplay();
                    
                    // Tornar jogador invulnerável temporariamente
                    isPlayerInvulnerable = true;
                    invulnerabilityTimer = 0;
                    
                    // Empurrar o jogador
                    let pushDirection = player.position.x < enemy.position.x ? -1 : 1;
                    player.position.x += pushDirection * 30;
                    
                    // Animação de dano do jogador
                    player.changeAnimation("p-damage");
                    
                    // Verificar se o jogador morreu
                    if (playerHealth <= 0) {
                        player.changeAnimation("p-defeat");
                        gameState = end;
                    }
                }
            }
        }

function checkAttackHit() {
    // Verificar colisão com enemy1 (código existente)
    for (let i = 0; i < enemy1Group.size(); i++) {
        let enemy = enemy1Group[i];
        
        // Pular inimigos derrotados
        if (enemy.defeated) continue;
        
        // Verificar se o inimigo está dentro do alcance de ataque
        let attackRange = 120;
        let distance = dist(player.position.x, player.position.y, enemy.position.x, enemy.position.y);
        
        if (distance < attackRange) {
            // Verificar se está na direção correta
            let attackDirection = player.mirrorX() === 1 ? 1 : -1;
            let enemyDirection = Math.sign(enemy.position.x - player.position.x);
            
            if (attackDirection === enemyDirection) {
                // Inimigo toma dano
                enemy.health -= 1;
                
                if (enemy.health <= 0) {
                    // Inimigo derrotado
                    enemy.changeAnimation("e1-defeat");
                    enemy.defeated = true;
                    enemy.lifetime = 60;
                    enemy.velocity.x = 0;
                    score += 1;
                }
            }
        }
    }
    
    // Verificar colisão com enemy2 (NOVO)
    for (let i = 0; i < enemy2Group.size(); i++) {
        let enemy = enemy2Group[i];
        
        if (enemy.defeated) continue;
        
        let attackRange = 120;
        let distance = dist(player.position.x, player.position.y, enemy.position.x, enemy.position.y);
        
        if (distance < attackRange) {
            let attackDirection = player.mirrorX() === 1 ? 1 : -1;
            let enemyDirection = Math.sign(enemy.position.x - player.position.x);
            
            if (attackDirection === enemyDirection) {
                // Inimigo toma dano
                enemy.health -= 1;
                
                if (enemy.health <= 0) {
                    // Inimigo derrotado - DAR 3 PONTOS
                    enemy.changeAnimation("e2-defeat");
                    enemy.defeated = true;
                    enemy.lifetime = 60;
                    enemy.velocity.x = 0;
                    score += 3; // Dar 3 pontos
                } else {
                    // Dano sem derrotar - animação de dano
                    enemy.changeAnimation("e2-damage");
                }
            }
        }
    }

    // Verificar colisão com enemy3
    for (let i = 0; i < enemy3Group.size(); i++) {
        let enemy = enemy3Group[i];
        
        if (enemy.defeated) continue;
        
        let attackRange = 120;
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
                    enemy.velocity.y = 0; // Parar completamente
                    score += 5; // Dar 5 pontos por matar o enemy3
                } else {
                    enemy.changeAnimation("e3-damage");
                    // Parar o movimento temporariamente ao levar dano
                    enemy.velocity.x = 0;
                    enemy.velocity.y = 0;
                    
                    // Aumentar o tempo de paralisação para 1.5 segundos (90 frames)
                    setTimeout(() => {
                        if (!enemy.defeated && enemy.getAnimationLabel() === "e3-damage") {
                            enemy.changeAnimation("e3-idle");
                        }
                    }, 1500); // 1.5 segundos (aumentado de 500 para 1500 ms)
                }
            }
        }
    }
}

function updateHealthDisplay() {
            // Esconder o sprite de vida atual
            currentLifeSprite.visible = false;
            
            // Mostrar o sprite correspondente à vida atual
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
    // Spawn a cada 3 segundos (180 frames) nas waves 2 e 3
    if (frameCount % 180 === 0 && (gameState === wave2 || gameState === wave3)) {
        // Spawnar fora da tela (esquerda ou direita) - SEMPRE nas bordas
        let side = random() > 0.5 ? 1 : -1;
        let x = side > 0 ? -100 : width + 100;
        
        // Posição Y igual à do enemy1 (sobre o chão)
        let y = height - 320;

        let enemy = createSprite(x, y);
        enemy.addAnimation("e2-idle", enemy2Idle);
        enemy.addAnimation("e2-attack", enemy2Attack);
        enemy.addAnimation("e2-damage", enemy2Damage);
        enemy.addAnimation("e2-defeat", enemy2Defeat);
        enemy.changeAnimation("e2-idle");
        enemy.scale = 0.8;
        enemy.setCollider("rectangle", 0, 0, 142 * 0.8, 159 * 0.8);
        enemy.mirrorX(side);
        enemy.speed = 3 * side;
        enemy.health = 2;
        enemy.isAttacking = false;
        enemy.attackCooldown = 0;
        enemy.defeated = false;
        enemy.reachedPlatform = false;
        
        // Escolher plataforma alvo aleatoriamente
        enemy.targetPlatform = random() > 0.5 ? platform1 : platform2;

        enemy2Group.add(enemy);
        console.log("Enemy2 spawnado na borda: " + x + ", " + y);
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
        
        // Verificar se está na animação de dano - se sim, não mover
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
                // Movimento em direção à plataforma
                enemy.position.x += enemy.speed;
                
                // Verificar se chegou perto da plataforma alvo
                let platform = enemy.targetPlatform;
                let platformLeft = platform.position.x - platform.width / 2;
                let platformRight = platform.position.x + platform.width / 2;
                
                // Verificar se chegou na plataforma
                let isAtPlatform = false;
                if (enemy.speed > 0) { // Movendo para a direita
                    isAtPlatform = enemy.position.x >= platformLeft - 20;
                } else { // Movendo para a esquerda
                    isAtPlatform = enemy.position.x <= platformRight + 20;
                }
                
                if (isAtPlatform) {
                    enemy.reachedPlatform = true;
                    console.log("Plataforma selecionada: ", enemy.targetPlatform === platform1 ? "Plataforma 1" : "Plataforma 2");
                    //console.log("Limites da plataforma: ", enemy.platformBounds.left, " - ", enemy.platformBounds.right);
                    console.log("Posição do inimigo: ", enemy.position.x);
                    enemy.speed = 3 * Math.sign(enemy.speed); // Velocidade reduzida para patrulha
                    
                    // Definir limites exatos da plataforma
                    enemy.platformBounds = {
                        left: platformLeft + 35,
                        right: platformRight - 35
                    };
                    
                    // Posicionar exatamente sobre a plataforma
                    enemy.position.y = platform.position.y - platform.height / 2 - 55;
                    
                    // Ajustar posição X para ficar dentro dos limites
                    if (enemy.position.x < enemy.platformBounds.left) {
                        enemy.position.x = enemy.platformBounds.left;
                    } else if (enemy.position.x > enemy.platformBounds.right) {
                        enemy.position.x = enemy.platformBounds.right;
                    }
                }
            } else {
                // Já está na plataforma - patrulhar
                enemy.position.x += enemy.speed;
                
                // Verificar limites da plataforma e inverter direção
                if (enemy.position.x <= enemy.platformBounds.left) {
                    enemy.position.x = enemy.platformBounds.left;
                    enemy.speed = Math.abs(enemy.speed); // Virar para direita
                    enemy.mirrorX(1);
                } else if (enemy.position.x >= enemy.platformBounds.right) {
                    enemy.position.x = enemy.platformBounds.right;
                    enemy.speed = -Math.abs(enemy.speed); // Virar para esquerda
                    enemy.mirrorX(-1);
                }
                
                // Manter o inimigo na altura correta da plataforma
                enemy.position.y = enemy.targetPlatform.position.y - enemy.targetPlatform.height / 2 - 55;
            }
        }
    }
}

function checkCollisions2() {
    for (let i = 0; i < enemy2Group.size(); i++) {
        let enemy = enemy2Group[i];
        
        if (enemy.defeated) continue;
        
        // Verificar se o inimigo está colidindo com o jogador
        if (enemy.overlap(player) && !isPlayerInvulnerable && !enemy.isAttacking) {
            // Inimigo ataca o jogador
            enemy.isAttacking = true;
            enemy.attackCooldown = 40;
            enemy.changeAnimation("e2-attack");
            enemy.velocity.x = 0;
            
            // Causar dano ao jogador (APENAS 1 de dano)
            playerHealth -= 1; // Alterado de 2 para 1
            updateHealthDisplay();
            
            // Tornar jogador invulnerável temporariamente
            isPlayerInvulnerable = true;
            invulnerabilityTimer = 0;
            
            // Empurrar o jogador
            let pushDirection = player.position.x < enemy.position.x ? -1 : 1;
            player.position.x += pushDirection * 30;
            
            // Animação de dano do jogador
            player.changeAnimation("p-damage");
            
            // Verificar se o jogador morreu
            if (playerHealth <= 0) {
                player.changeAnimation("p-defeat");
                gameState = end;
            }
        }
    }
}

function enemy3Spawn() {
    // Spawn a cada 2 segundos (120 frames) apenas na wave3
    if (frameCount % 120 === 0 && gameState === wave3) {
        // Verificar se as animações do enemy3 foram carregadas
        if (!enemy3Idle || !enemy3Attack || !enemy3Damage || !enemy3Defeat) {
            console.error("Animações do enemy3 não carregadas!");
            return;
        }
        
        // Spawnar do topo da tela (fora da tela)
        let x = random(100, width - 100); // Posição X aleatória
        let y = -100; // Começa acima da tela

        let enemy = createSprite(x, y);
        enemy.addAnimation("e3-idle", enemy3Idle);
        enemy.addAnimation("e3-attack", enemy3Attack);
        enemy.addAnimation("e3-damage", enemy3Damage);
        enemy.addAnimation("e3-defeat", enemy3Defeat);
        enemy.changeAnimation("e3-idle");
        enemy.scale = 0.8;
        enemy.setCollider("rectangle", 0, 0, 142 * 0.8, 159 * 0.8);
        
        // Configurações do enemy3
        enemy.health = 2;
        enemy.isAttacking = false;
        enemy.attackCooldown = 0;
        enemy.defeated = false;
        enemy.shootCooldown = 180; // 3 segundos (180 frames) para atirar
        enemy.speed = speed / 2; // METADE da velocidade do jogador
        enemy.isFlying = true; // Indicador de inimigo voador
        enemy.isInAttackRecovery = false; // Novo: estado de recuperação de ataque
        enemy.attackRecoveryTime = 0; // Novo: tempo de recuperação
        
        enemy3Group.add(enemy);
        console.log("Enemy3 spawnado do topo: " + x + ", " + y);
    }
}

function updateEnemies3() {
    // Remover a verificação inicial que impedia a execução
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
        
        // Verificar se está na animação de dano, morte ou ataque - se sim, não mover
        if (enemy.getAnimationLabel() === "e3-damage" || enemy.getAnimationLabel() === "e3-defeat" || enemy.getAnimationLabel() === "e3-attack") {
            // Parar o movimento durante essas animações
            enemy.velocity.x = 0;
            enemy.velocity.y = 0;
            continue;
        }
        
        // Movimento em direção ao jogador (voador, ignora plataformas)
        let dx = player.position.x - enemy.position.x;
        let dy = player.position.y - enemy.position.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            enemy.position.x += (dx / distance) * enemy.speed;
            enemy.position.y += (dy / distance) * enemy.speed;
            
            // Espelhar o sprite baseado na direção
            if (dx > 0) {
                enemy.mirrorX(1); // Direita
            } else {
                enemy.mirrorX(-1); // Esquerda
            }
        }
        
        // Sistema de tiro do enemy3 (a cada 3 segundos)
        enemy.shootCooldown--;
        if (enemy.shootCooldown <= 0 && enemy.getAnimationLabel() !== "e3-damage" && enemy.getAnimationLabel() !== "e3-defeat" && enemy.getAnimationLabel() !== "e3-attack") {
            enemy.shootCooldown = 180; // Reset para 3 segundos
            
            // Criar projétil apenas se a animação estiver disponível
            let bullet = createSprite(enemy.position.x, enemy.position.y - 20);
            
            // Usar animação fallback se necessário
            if (bulletImgs && bulletImgs.images && bulletImgs.images.length > 0) {
                bullet.addAnimation("bullet", bulletImgs);
            } else {
                // Criar um projétil simples como fallback
                bullet.shapeColor = color(255, 0, 0); // Projétil vermelho
                bullet.width = 10;
                bullet.height = 5;
            }
            
            bullet.scale = 0.8;
            bullet.setCollider("rectangle", 0, 0, 30, 10);
            
            // Inicializar velocity como objeto
            bullet.velocity = {x: 0, y: 0};
            
            // Direção do projétil em relação ao jogador
            let bulletDx = player.position.x - enemy.position.x;
            let bulletDy = player.position.y - enemy.position.y;
            let bulletDistance = Math.sqrt(bulletDx * bulletDx + bulletDy * bulletDy);
            
            if (bulletDistance > 0) {
                bullet.velocity.x = (bulletDx / bulletDistance) * 10;
                bullet.velocity.y = (bulletDy / bulletDistance) * 10;
            } else {
                // Direção padrão se a distância for zero
                bullet.velocity.y = 10;
            }
            
            bullet.lifetime = 120; // Projétil dura 2 segundos
            
            bulletsGroup.add(bullet);
        }
    }
}

function checkCollisions3() {
    for (let i = 0; i < enemy3Group.size(); i++) {
        let enemy = enemy3Group[i];
        
        if (enemy.defeated) continue;
        
        // Verificar colisão com o jogador (ataque de perto)
        if (enemy.overlap(player) && !isPlayerInvulnerable && enemy.getAnimationLabel() !== "e3-damage" && enemy.getAnimationLabel() !== "e3-defeat" && enemy.getAnimationLabel() !== "e3-attack") {
            // Mudar para animação de ataque
            enemy.changeAnimation("e3-attack");
            
            // Parar o movimento durante o ataque
            enemy.velocity.x = 0;
            enemy.velocity.y = 0;
            
            // Configurar tempo para voltar ao normal após o ataque (1 segundo)
            enemy.attackRecoveryTime = 60; // 60 frames = 1 segundo
            enemy.isInAttackRecovery = true;
            
            // Causar dano ao jogador
            playerHealth -= 1;
            updateHealthDisplay();
            
            // Tornar jogador invulnerável temporariamente
            isPlayerInvulnerable = true;
            invulnerabilityTimer = 0;
            
            // Empurrar o jogador
            let pushDirection = player.position.x < enemy.position.x ? -1 : 1;
            player.position.x += pushDirection * 30;
            
            // Animação de dano do jogador
            player.changeAnimation("p-damage");
            
            // Verificar se o jogador morreu
            if (playerHealth <= 0) {
                player.changeAnimation("p-defeat");
                gameState = end;
            }
        }
        
        // Gerenciar recuperação após ataque
        if (enemy.isInAttackRecovery) {
            enemy.attackRecoveryTime--;
            if (enemy.attackRecoveryTime <= 0) {
                enemy.isInAttackRecovery = false;
                enemy.changeAnimation("e3-idle");
            }
        }
    }
    
    // Colisão de projéteis com o jogador
    for (let i = 0; i < bulletsGroup.size(); i++) {
        let bullet = bulletsGroup[i];
        
        if (bullet.overlap(player) && !isPlayerInvulnerable) {
            playerHealth -= 1;
            updateHealthDisplay();
            
            isPlayerInvulnerable = true;
            invulnerabilityTimer = 0;
            
            player.changeAnimation("p-damage");
            
            if (playerHealth <= 0) {
                player.changeAnimation("p-defeat");
                gameState = end;
            }
            
            bullet.remove();
        }
    }
}

function updateBullets() {
    // Usar loop reverso para evitar problemas ao remover elementos
    for (let i = bulletsGroup.size() - 1; i >= 0; i--) {
        let bullet = bulletsGroup[i];
        
        // Verificar se o projétil ainda existe
        if (!bullet || !bullet.position) {
            bulletsGroup.remove(i);
            continue;
        }
        
        // Atualizar posição com base na velocity (se existir)
        if (bullet.velocity) {
            bullet.position.x += bullet.velocity.x;
            bullet.position.y += bullet.velocity.y;
        }
        
        // Verificar se o projétil saiu da tela
        const isOffscreen = bullet.position.x < -100 || 
                           bullet.position.x > width + 100 || 
                           bullet.position.y < -100 || 
                           bullet.position.y > height + 100;
        
        // Verificar se o tempo de vida expirou
        const isLifetimeExpired = bullet.lifetime && bullet.lifetime <= 0;
        
        // Remover projétil se necessário
        if (isOffscreen || isLifetimeExpired) {
            bulletsGroup.remove(i);
        }
        
        // Decrementar tempo de vida
        if (bullet.lifetime) {
            bullet.lifetime--;
        }
    }
}