import 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor (key) {
    super(key);
  }

  preload () {
    // load in the tilemap
    this.load.tilemapTiledJSON('level1', 'assets/tilemaps/level1.json');
    // load in the spritesheet
    this.load.spritesheet('RPGpack_sheet', 'assets/images/RPGpack_sheet.png', { frameWidth: 64, frameHeight: 64 });
  }

  create () {
    this.scene.start('Game');
  }
};
