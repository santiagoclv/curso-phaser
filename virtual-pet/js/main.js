// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function () {

  this.customStats = {
      apple: { health: 20, fun: 0 },
      candy: { health: -10, fun: 10 },
      toy: { health: 0, fun: 15 },
      rotate: { health: 0, fun: 10 },
  }

  this.buttons = [
    {
      key: 'apple',
      setXY: {
        x: 72,
        y: 570
      },
    },
    {
      key: 'candy',
      setXY: {
        x: 144,
        y: 570
      },
    },
    {
      key: 'toy',
      setXY: {
        x: 216,
        y: 570
      },
    },
    {
      key: 'rotate',
      setXY: {
        x: 288,
        y: 570
      },
    },
  ];
}

// load asset files for our game
gameScene.preload = function() {
  
  // load assets
  this.load.image('backyard', 'assets/images/backyard.png');
  this.load.image('apple', 'assets/images/apple.png');
  this.load.image('candy', 'assets/images/candy.png');
  this.load.image('rotate', 'assets/images/rotate.png');
  this.load.image('toy', 'assets/images/rubber_duck.png');

  this.load.spritesheet('pet', 'assets/images/pet.png', {
    frameWidth: 97,
    frameHeight: 83,
    margin: 1,
    spacing: 1
  })
};

// executed once, after assets were loaded
gameScene.create = function() {

  const bg = this.add.sprite(0, 0, 'backyard');
  bg.setInteractive();
  bg.setOrigin(0, 0);
  bg.on('pointerdown', this.placeItem, this);

  this.pet = this.add.sprite(100, 200, 'pet', 0);
  this.pet.setInteractive();
  this.pet.stats = { health: 100, fun: 30};

  this.input.setDraggable(this.pet);

  this.input.on('drag', function (pointer, gameObject, x, y) {
    gameObject.x = x;
    gameObject.y = y;
  });

  this.uiBlocked = true;
  this.createUi();
  this.uiReady();
};

gameScene.placeItem = function(pointer, localX, localY) {
  if(this.selectedBttn){
    const {health, fun} = this.customStats[this.selectedBttn.texture.key];
    console.log(this.pet.stats, health, fun)
    this.pet.stats = {
      health: this.pet.stats.health + health,
      fun: this.pet.stats.fun + fun
    };
    if(this.selectedBttn.texture.key === 'rotate'){
      this.rotatePet();
    } else {
      this.add.sprite(localX, localY, this.selectedBttn.texture.key);
    }
    console.log(this.pet.stats)
    this.uiReady();
  }
};

gameScene.alphaTween = function (item) {
  return this.tweens.add({
    targets: item,
    alpha: 0.5,
    duration: 200,
    paused: true,
  });
};

gameScene.rotatePet = function (item) {
  const tween = this.tweens.add({
    targets: this.pet,
    rotation: 2 * Math.PI,
    duration: 200,
    paused: true,
    onComplete: this.uiReady,
    onCompleteScope: this,
  });
  tween.restart();
};

gameScene.createUi = function createUi() {
  this.uiButtons = this.add.group(this.buttons);

  Phaser.Actions.Call(this.uiButtons.getChildren(), function (bttn) {
    bttn.setInteractive();
    bttn.alphaTween = this.alphaTween(bttn);
    
    bttn.on('pointerdown', function (pointer) {
      // UI could not be blocked in order to select a bttn item.
      if(this.scene.uiBlocked) return;

      // make sure the ui is ready
      this.scene.uiReady();
      this.scene.uiBlocked = true;
      
      // I didn't set scene as the context, so this === bttn.
      this.scene.selectedBttn = this;
      this.alphaTween.restart();

      if(this.texture.key === 'rotate'){
        this.scene.placeItem();
      }
    });
  }, this);
};

gameScene.uiReady = function uiReady() {
  this.selectedBttn = null;
  Phaser.Actions.Call(this.uiButtons.getChildren(), function (bttn) {
    bttn.alpha = 1;
  }, this);
  this.uiBlocked = false;
};

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  scene: gameScene,
  title: 'Virtual Pet',
  pixelArt: false,
  backgroundColor: 'ffffff'
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
