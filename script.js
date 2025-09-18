let player;
        let playerIdle, playerRunning, playerJump1, playerJump2, playerAttack, playerDamage, playerDefeat;
        let speed = 10;
        let gravity = 0.8;
        let jumpForce = -20;
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

        const start = 1;
        const wave1 = 2;
        const wave2 = 3;
        const wave3 = 4;
        const end = 0;
        let gameState = wave1;

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
    bulletImgs = loadAnimation("./assets/enemy3/bullet1.png", "./assets/enemy3/bullet2.png");

    groundImg = loadImage("./assets/ground.png");
    roofImg = loadImage("./assets/ground.png");
    platformImg = loadImage("./assets/platform.png");

    logoImg = loadImage("./assets/logo.png");

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

    //ground.setCollider("rectangle", 0, 0, ground.width, 30);
    //player.setCollider("rectangle", 0, 0, player.width*0.5, player.height*1);

    enemy2 = createSprite(600, 642);
    enemy2.addAnimation("e2-idle", enemy2Idle);
    enemy2.addAnimation("e2-attack", enemy2Attack);
    enemy2.addAnimation("e2-damage", enemy2Damage);
    enemy2.addAnimation("e2-defeat", enemy2Defeat);
    enemy2.changeAnimation("e2-idle");
    enemy2.scale = 0.8;

    enemy3 = createSprite(750, 615);
    enemy3.addAnimation("e3-idle", enemy3Idle);
    enemy3.addAnimation("e3-attack", enemy3Attack);
    enemy3.addAnimation("e3-damage", enemy3Damage);
    enemy3.addAnimation("e3-defeat", enemy3Defeat);
    enemy3.changeAnimation("e3-idle");
    enemy3.scale = 0.8;

    logo = createSprite(730, 360);
    logo.addImage("logo", logoImg);

    enemy1Group = new Group();
    enemy2Group = new Group();
    enemy3Group = new Group();
}

function draw() {
    
    //"#262121ff"
    if(gameState === start) {
        background("#fdefefff");

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
        enemy2.visible = false;
        enemy3.visible = false;

        if(keyWentDown("space") || keyWentDown(" ")) {
            gameState = wave1;
        }
    }

    if(gameState === wave1) {
        background("#262121");

        textSize(24);
        fill("white");
        text("Score: " + score, 1400, 60);

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
        enemy2.visible = true;
        enemy3.visible = true;

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
        //enemy2Spawn();
        //enemy3Spawn();
    }

    drawSprites();
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
    let rand = Math.floor(Math.random() * 150) + 110;

    if (frameCount % rand === 0) {
        // Spawnar dentro da tela temporariamente para teste
        let side = random() > 0.5 ? 1 : -1;
        let x = side > 0 ? 50 : width - 100; // Dentro da tela para teste
        let y = height - 110; // Posição Y fixa para teste

        enemy1 = createSprite(x, y);
        enemy1.addAnimation("e1-running", enemy1Running);
        enemy1.addAnimation("e1-attack", enemy1Attack);
        enemy1.addAnimation("e1-defeat", enemy1Defeat);
        enemy1.changeAnimation("e1-running");
        enemy1.scale = 0.8;
        enemy1.setCollider("rectangle", 0, 0, 145 * 0.8, 182 * 0.8);
        enemy1.mirrorX(side);
        enemy1.speed = 15 * side;
        enemy1.health = 1;
        enemy1.isAttacking = false;
        enemy1.attackCooldown = 0;
        enemy1.defeated = false;
        enemy1.lifetime = 1000; // Adicionar lifetime

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