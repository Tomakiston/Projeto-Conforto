let player;
let playerIdle, playerRunning, playerJump1, playerJump2, playerAttack, playerDamage, playerDefeat;
let playerX, playerY;
let playerWidth = 50;
let playerHeight = 50;
let speed = 10;
let gravity = 0.8;
let jumpForce = -20;
let velocityY = 0;
let onGround = false;

let attacking = false;       // se o player está atacando
let attackCooldown = 500;    // tempo entre ataques em ms
let lastAttackTime = 0;      // última vez que atacou

let damaged = false;         // se o player levou dano
let damageCooldown = 1000;   // tempo que fica invulnerável após tomar dano
let lastDamageTime = 0;      // última vez que levou dano

let attackDuration = 300; 

let enemy1, enemy1Group;
let enemy1Idle, enemy1Running, enemy1Attack, enemy1Defeat;

let enemy2, enemy2Group;
let enemy2Idle, enemy2Attack, enemy2Damage, enemy2Defeat;

let enemy3, enemy3Group;
let enemy3Idle, enemy3Attack, enemy3Damage, enemy3Defeat;
let bullet, bulletImgs;

let ground, groundImg;
let platform, platformImg;

let logo, logoImg;

const start = 1;
const wave1 = 2;
const wave2 = 3;
const wave3 = 4;
const end = 0
let gameState = start;

function preload() {
    playerIdle = loadAnimation("./assets/player/playerIdle.png");
    playerRunning = loadAnimation("./assets/player/playerRunning1.png","./assets/player/playerRunning2.png");
    playerJump1 = loadAnimation("./assets/player/playerJump1.png");
    playerJump2 = loadAnimation("./assets/player/playerJump2.png");
    playerAttack = loadAnimation("./assets/player/playerAttack.png");
    playerDamage = loadAnimation("./assets/player/playerDamage.png");
    playerDefeat = loadAnimation("./assets/player/playerDefeat.png");

    enemy1Idle = loadAnimation("./assets/enemy1/enemy1Idle.png");
    enemy1Running = loadAnimation("./assets/enemy1/enemy1Running1.png", "./assets/enemy1/enemy1Running2.png");
    enemy1Attack = loadAnimation("./assets/enemy1/enemy1Attack1.png", "./assets/enemy1/enemy1Attack2.png", "./assets/enemy1/enemy1Attack3.png");
    enemy1Defeat = loadAnimation("./assets/enemy1/enemy1Defeat.png");

    enemy2Idle = loadAnimation("./assets/enemy2/enemy2Idle2.png");
    enemy2Attack = loadAnimation("./assets/enemy2/enemy2Attack1.png", "./assets/enemy2/enemy2Attack2.png", "./assets/enemy2/enemy2Attack3.png");
    enemy2Damage = loadAnimation("./assets/enemy2/enemy2Damage.png");
    enemy2Defeat = loadAnimation("./assets/enemy2/enemy2Defeat.png");

    enemy3Idle = loadAnimation("./assets/enemy3/enemy3Idle.png");
    enemy3Attack = loadAnimation("./assets/enemy3/enemy3Attack.png");
    enemy3Damage = loadAnimation("./assets/enemy3/enemy3Damage.png");
    enemy3Defeat = loadAnimation("./assets/enemy3/enemy3Defeat.png");
    bulletImgs = loadAnimation("./assets/bullet1.png", "./assets/bullet2.png");

    groundImg = loadImage("./assets/ground.png");
    platformImg = loadImage("./assets/platform.png");

    logoImg = loadImage("./assets/logo.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    player = createSprite(300, 662);
    player.addAnimation("p-idle", playerIdle);
    player.addAnimation("p-running", playerRunning);
    player.addAnimation("p-jump1", playerJump1);
    player.addAnimation("p-jump2", playerJump2);
    player.addAnimation("p-attack", playerAttack);
    player.addAnimation("p-damage", playerDamage);
    player.addAnimation("p-defeat", playerDefeat);
    player.changeAnimation("p-idle");
    playerX = width / 2;
    playerY = height - playerHeight;

    ground = createSprite(764, 760);
    ground.addImage("ground", groundImg);
    ground.scale = 1.45;
    ground.imovable = true;

    platform = createSprite(1000, 550);
    platform.addImage("platform", platformImg);
    platform.imovable = true;

    //ground.setCollider("rectangle", 0, 0, ground.width, 30);
    //player.setCollider("rectangle", 0, 0, player.width*0.5, player.height*1);

    enemy1 = createSprite(450, 615);
    enemy2 = createSprite(600, 632);
    enemy3 = createSprite(750, 615);
    enemy1.addAnimation("e1", enemy1Idle);
    enemy2.addAnimation("e2-idle", enemy2Idle);
    enemy3.addAnimation("e3", enemy3Idle);

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

        player.visible = false;
        ground.visible = false;
        enemy1.visible = false;
        enemy2.visible = false;
        enemy3.visible = false;

        if(keyWentDown("space") || keyWentDown(" ")) {
            gameState = wave1;
        }
    }

    if(gameState === wave1) {
        background("#262121"); // Limpa o canvas

        logo.visible = false;
        player.visible = true;
        ground.visible = true;
        enemy1.visible = true;
        enemy2.visible = true;
        enemy3.visible = true;

        // --------------------------
        // Movimento horizontal
        // --------------------------
        let moving = false;
        if(keyDown(LEFT_ARROW)) {
            player.position.x -= speed;
            player.mirrorX(-1);
            moving = true;
        } 
        if(keyDown(RIGHT_ARROW)) {
            player.position.x += speed;
            player.mirrorX(1);
            moving = true;
        }

        // --------------------------
        // Gravidade e pulo
        // --------------------------
        // Gravidade
        velocityY += gravity;
        player.position.y += velocityY;

        // Colisão com o chão
        if(player.collide(ground) || player.collide(platform)) {
            velocityY = 0;
            onGround = true;
        } else {
            onGround = false;
        }

        if(keyWentDown(UP_ARROW) && onGround) {
            velocityY = jumpForce;
        }
 
        if(!onGround) {
            if(velocityY < 0) {
                 player.changeAnimation("p-jump1"); // subindo
            } else {
                player.changeAnimation("p-jump2"); // caindo
            }
        } else if(moving) {
            player.changeAnimation("p-running");
        } else {
            player.changeAnimation("p-idle");
        }
    }

    drawSprites();
}