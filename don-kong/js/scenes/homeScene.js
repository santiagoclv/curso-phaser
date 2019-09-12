// create a new scene
let homeScene = new Phaser.Scene('Home');

// executed once, after assets were loaded
homeScene.create = function () {
  // game background, with active input
  this.add.image(180, 604, 'ground');

  // welcome text
  let gameW = this.sys.game.config.width;
  let gameH = this.sys.game.config.height;
  let text = this.add.text(gameW / 2, gameH / 2, '🦍 Dn K', {
    font: '40px Arial',
    fill: '#000000',
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: {
      x: 10,
      y: 10
    }
  });
  text.setOrigin(0.5, 0.5);
  text.setInteractive();

  text.on('pointerdown', function () {
    this.scene.start('Game');
  }, this);
};