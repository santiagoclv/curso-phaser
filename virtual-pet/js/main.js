// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  scene: [loadingScene, homeScene, gameScene],
  title: 'Virtual Pet',
  pixelArt: false,
  backgroundColor: 'ffffff'
};
 
// create the game, and pass it the configuration
let game = new Phaser.Game(config);