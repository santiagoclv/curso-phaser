

// BOOTING LOADING
// create a new scene
let bootScene = new Phaser.Scene('Boot');
// load asset files for our game
bootScene.preload = function () {
    // load assets
    this.load.image('logo', 'assets/images/rubber_duck.png');
};
// executed once, after assets were loaded
bootScene.create = function () {
    this.scene.start('Loading');
};

// create a new scene
let loadingScene = new Phaser.Scene('Loading');

// load asset files for our game
loadingScene.preload = function () {
    // show logo
    this.add.sprite(this.sys.game.config.width / 2, 250, 'logo');

    // progress bar background
    let bgBar = this.add.graphics();

    let barW = 150;
    let barH = 30;

    bgBar.setPosition(this.sys.game.config.width / 2 - barW / 2, this.sys.game.config.height / 2 - barH / 2);
    bgBar.fillStyle(0xF5F5F5, 1);
    bgBar.fillRect(0, 0, barW, barH);

    // progress bar
    let progressBar = this.add.graphics();
    progressBar.setPosition(this.sys.game.config.width / 2 - barW / 2, this.sys.game.config.height / 2 - barH / 2);

    // listen to the "progress" event, value is a number between 0 to 1
    this.load.on('progress', function (value) {
        // clearing progress bar (so we can draw it again)
        progressBar.clear();
        // set style
        progressBar.fillStyle(0x9AD98D, 1);
        // draw rectangle
        progressBar.fillRect(0, 0, value * barW, barH);

    }, this);

    // load assets
    this.load.image('backyard', 'assets/images/backyard.png');
    this.load.image('apple', 'assets/images/apple.png');
    this.load.image('candy', 'assets/images/candy.png');
    this.load.image('rotate', 'assets/images/rotate.png');
    this.load.image('toy', 'assets/images/rubber_duck.png');

    // load spritesheet
    this.load.spritesheet('pet', 'assets/images/pet.png', {
        frameWidth: 97,
        frameHeight: 83,
        margin: 1,
        spacing: 1
    });

    // TESTING - to see the progress bar in action!
//   for(let i = 0; i < 200; i++) {
//     this.load.image('test' + i, 'assets/images/candy.png');
//   }
};

// executed once, after assets were loaded
loadingScene.create = function () {
    // animation
    this.anims.create({
        key: 'funnyfaces',
        frames: this.anims.generateFrameNames('pet', {
            frames: [1, 2, 3]
        }),
        frameRate: 7,
        yoyo: true,
        repeat: 0 // to repeat forever: -1
    });

    this.scene.start('Home');
};