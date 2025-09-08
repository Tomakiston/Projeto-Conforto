let player;
let playerIdle, playerRunning, playerJump, playerAttack, playerDamage, playerDefeat;

let enemy1, enemy1Group;
let enemy1Idle, enemy1Running, enemy1Attack, enemy1Defeat;

let enemy2, enemy2Group;
let enemy2Idle, enemy2Attack, enemy2Damage, enemy2Defeat;

let enemy3, enemy3Group;
let enemy3Idle, enemy3Attack, enemy3Damage, enemy3Defeat;

function preload() {
    playerIdle = loadAnimation("./assets/player/playerIdle.png");
    playerRunning = loadAnimation("./assets/player/playerRunning1.png","./assets/player/playerRunning2.png");
    playerJump = loadAnimation("./assets/player/playerJump1.png", "./assets/player/playerJump1.png", "./assets/player/playerJump1.png", "./assets/player/playerJump2.png");
    playerAttack = loadAnimation("./assets/player/playerAttack.png");
    playerDamage = loadAnimation("./assets/player/playerDamage.png");
    playerDefeat = loadAnimation("./assets/player/playerDefeat.png");

    enemy1Idle = loadAnimation("./assets/enemy1/enemy1Idle.png");
    enemy1Running = loadAnimation("./assets/enemy1/enemy1Running1.png", "./assets/enemy1/enemy1Running2.png");
    enemy1Attack = loadAnimation("./assets/enemy1/enemy1Attack1.png", "./assets/enemy1/enemy1Attack2.png", "./assets/enemy1/enemy1Attack3.png");
    enemy1Defeat = loadAnimation("./assets/enemy1/enemy1Defeat.png");

    enemy2Idle = loadAnimation("./assets/enemy2/enemy2Idle1.png", "./assets/enemy2/enemy2Idle2.png");
    enemy2Attack = loadAnimation("./assets/enemy2/enemy2Attack1.png", "./assets/enemy2/enemy2Attack2.png", "./assets/enemy2/enemy2Attack3.png");
    enemy2Damage = loadAnimation("./assets/enemy2/enemy2Damage.png");
    enemy2Defeat = loadAnimation("./assets/enemy2/enemy2Defeat.png");

    enemy3Idle = loadAnimation("./assets/enemy3/enemy3Idle.png");
    enemy3Attack = loadAnimation("./assets/enemy3/enemy3Attack.png");
    enemy3Damage = loadAnimation("./assets/enemy3/enemy3Damage.png");
    enemy3Defeat = loadAnimation("./assets/enemy3/enemy3Defeat.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    player = createSprite(300, 170);
    player.addAnimation("p-idle", playerIdle);
    player.addAnimation("p-running", playerRunning);
    player.addAnimation("p-jump", playerJump);
    player.addAnimation("p-attack", playerAttack);
    player.addAnimation("p-damage", playerDamage);
    player.addAnimation("p-defeat", playerDefeat);
    player.changeAnimation("p-idle");
}

function draw() {
    background("red");

    drawSprites();
}