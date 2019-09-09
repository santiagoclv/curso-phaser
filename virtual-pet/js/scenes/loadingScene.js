// create a new scene
let loadingScene = new Phaser.Scene('Loading');

// load asset files for our game
loadingScene.preload = function() {
 
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
};
 
// executed once, after assets were loaded
loadingScene.create = function() {
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