import 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor (key) {
    super(key);
  }

  preload () {
  }

  create () {
    // listen for the resize event
    this.events.on("resize", this.resize, this);
    // create our tilemap
    this.createMap();
  }

  resize (gameSize, baseSize, displaySize, resolution) {
    const width = gameSize.width;
    const height = gameSize.height;
      if (width === undefined) {
        width = this.sys.game.config.width;
      }
      if (height === undefined) {
        height = this.sys.game.config.height;
      }
      this.cameras.resize(width, height);
  }

  createMap () {
    // create the tilemap
    this.map = this.make.tilemap({ key: 'level1' });
    // add tileset image
    this.tiles = this.map.addTilesetImage('RPGpack_sheet');
    // create our layers
    this.backgroundLayer = this.map.createStaticLayer('Background', this.tiles, 0, 0);
    this.blockedLayer = this.map.createStaticLayer('Blocked', this.tiles, 0, 0);
  }
};
