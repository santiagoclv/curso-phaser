// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  scene: [bootScene, loadingScene, homeScene, gameScene],
  title: 'Monster Kong',
  pixelArt: false,
  backgroundColor: '000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 1000},
      debug: true
    }
  }
};
 
// create the game, and pass it the configuration
let game = new Phaser.Game(config);