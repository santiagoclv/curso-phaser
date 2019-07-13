// Create a scene, a game could be compuse by multiple scenes
const gameScene = new Phaser.Scene("Game");

// declare and load constantes to the scene
gameScene.init = function () {
    // Load assets: audio, sprites' images, etc
    // So when the game starts every assets ir already on memory
    const { height } = this.sys.game.config;

    this.speed = 4;
    this.isGameOver = false;

    this.enemyMinSpeed = 2;
    this.enemyMaxSpeed = 6;
    this.enemyMinY = height / 4.5;
    this.enemyMaxY = height - (height / 4.5);

};

gameScene.preload = function () {
    // Load assets: audio, sprites' images, etc
    // So when the game starts every assets ir already on memory
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/dragon.png');
    this.load.image('treasure', 'assets/treasure.png');
};

gameScene.create = function () {
    // Create elements from the scene
    const { width, height } = this.sys.game.config;
    //this.add.sprite(0, 0, 'background').setOrigin(0,0);
    //this.add.sprite(0, 0, 'background').setPosition(width / 2, height / 2);
    this.add.sprite(width / 2, height / 2, 'background');

    this.player = this.add.sprite(width / 8, height / 2, 'player');
    // Setting up the depth: this way does not matter
    // if the background overlaps the player on the render order
    // player.depth = 2;
    this.player.setScale(0.5);

    this.enemies = this.add.group({
        key: 'enemy',
        repeat: 3,
        setXY: {
            x: (width * 2.5) / 10,
            y: height / 2,
            stepX: (width * 2.5) / 16,
        }
    });

    // Scale by default: 1
    Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
        enemy.setFlipX(true);
        enemy.setScale(0.6);
        //Rotate - using angles
        //this.enemy.setAngle(45);
        //Rotate - using radios PI = 180
        //this.enemy.setRotation(Math.PI)
        // this.enemy.setFlipX(true);

        // speed is not part of phaser game object's api
        let dir = Math.random() < 0.5 ? 1 : -1;
        let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
        enemy.speed = speed * dir;
    }, this);


    this.treasure = this.add.sprite((width * 7) / 8, height / 2, 'treasure');
    this.treasure.setScale(0.6);
}

gameScene.gameOver = function () {
    this.isGameOver = true;
    this.cameras.main.shake(500);
    this.cameras.main.on('camerashakecomplete', function (camera, effect) {
        this.cameras.main.fade(1000);
    }, this);
    this.cameras.main.on('camerafadeoutcomplete', function (camera, effect) {
        this.scene.restart();
    }, this);
};

// This is callled up to 60 times per second
gameScene.update = function (time) {
    // const millisecs = time / 1000
    // if (millisecs <= 2) {
    //     this.enemy3.setScale(millisecs);
    // }

    if (this.isGameOver) {
        return;
    }

    if (this.input.activePointer.isDown) {
        this.player.setX(this.player.x + this.speed);
    }

    if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())) {
        this.gameOver();
    }

    Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
        enemy.setY(enemy.y + enemy.speed);

        if ((enemy.y <= this.enemyMinY || enemy.y >= this.enemyMaxY)) {
            enemy.speed *= -1;
        }
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemy.getBounds())) {
            this.gameOver();
        }
    }, this);
}

// Game Configuration

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene,
}

// Creat the game instance:

const game = new Phaser.Game(config);