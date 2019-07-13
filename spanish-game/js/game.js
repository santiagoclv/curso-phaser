// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function () {


}

// load asset files for our game
gameScene.preload = function () {
  this.load.image('background', 'assets/images/background-city.png');
  this.load.image('building', 'assets/images/building.png');
  this.load.image('car', 'assets/images/car.png');
  this.load.image('house', 'assets/images/house.png');
  this.load.image('tree', 'assets/images/tree.png');

  this.load.audio('treeAudio', 'assets/audio/arbol.mp3');
  this.load.audio('buildingAudio', 'assets/audio/edificio.mp3');
  this.load.audio('houseAudio', 'assets/audio/casa.mp3');
  this.load.audio('carAudio', 'assets/audio/auto.mp3');
  this.load.audio('correctAudio', 'assets/audio/correct.mp3');
  this.load.audio('wrongAudio', 'assets/audio/wrong.mp3');
};

// executed once, after assets were loaded
gameScene.create = function () {

  this.add.sprite(0, 0, 'background').setOrigin(0, 0);

  let soundSample = this.sound.add('correctAudio');
  soundSample.play();
  // soundSample.pause();
  // soundSample.resume();
  // soundSample.stop();

};

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene,
  title: 'Spanish Learning Game',
  pixelArt: false,
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
