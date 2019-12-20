

// BOOTING LOADING
// create a new scene
let bootScene = new Phaser.Scene('Boot');
// load asset files for our game
bootScene.preload = function () {
    // load assets
    this.load.image('logo', 'assets/images/gorilla3.png');
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
    // load images
  this.load.image('ground', 'assets/images/ground.png');
  this.load.image('platform', 'assets/images/platform.png');
  this.load.image('block', 'assets/images/block.png');
  this.load.image('goal', 'assets/images/gorilla3.png');
  this.load.image('barrel', 'assets/images/barrel.png');

  // load spritesheets
  this.load.spritesheet('player', 'assets/images/player_spritesheet.png', {
    frameWidth: 28,
    frameHeight: 30,
    margin: 1,
    spacing: 1
  });

  this.load.spritesheet('fire', 'assets/images/fire_spritesheet.png', {
    frameWidth: 20,
    frameHeight: 21,
    margin: 1,
    spacing: 1
  });

  // console.log(this.cache.destroy())
  // this.cache.json.destroy();
  this.load.json('levelData', 'assets/json/levelData.json');
};

// executed once, after assets were loaded
loadingScene.create = function () {
  //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'walking',
        // frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
        frames: this.anims.generateFrameNames('player', {
          frames: [0, 1, 2, 4]
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'player', frame: 3 }],
      frameRate: 20
  });

    this.anims.create({
        key: 'jump',
        frames: [{ key: 'player', frame: 2 }],
        frameRate: 20
    });

    // fire animation
  this.anims.create({
    key: 'burning',
    frames: this.anims.generateFrameNames('fire', {
      frames: [0, 1]
    }),
    frameRate: 4,
    repeat: -1
  });

  this.scene.start('Home');
};