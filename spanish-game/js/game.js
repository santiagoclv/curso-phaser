// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function () {

  this.spanish = {
    building: 'Edificio',
    house: 'Casa',
    car: 'Auto',
    tree: 'Árbol'
  };

  this.sprites = [
    {
      key: 'building',
      setXY: {
        x: 100,
        y: 240
      },
    },
    {
      key: 'house',
      setXY: {
        x: 240,
        y: 280
      },
      setScale: {
        x: 0.8,
        y: 0.8
      },
    },
    {
      key: 'car',
      setXY: {
        x: 400,
        y: 300
      },
      setScale: {
        x: 0.8,
        y: 0.8
      },
    },
    {
      key: 'tree',
      setXY: {
        x: 550,
        y: 240
      },
    },
  ];
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

gameScene.correctTween = function (item) {
  return this.tweens.add({
    targets: item,
    scaleX: 1.5,
    scaleY: 1.5,
    duration: 300,
    paused: true,
    yoyo: true,
    ease: 'Power4'
  });
};

gameScene.wrongTween = function (item) {
  return this.tweens.add({
    targets: item,
    scaleX: 1.5,
    scaleY: 1.5,
    duration: 300,
    angle: 90,
    paused: true,
    yoyo: true,
    ease: 'Quad.easeInOut'
  });
};

gameScene.alphaTween = function (item) {
  return this.tweens.add({
    targets: item,
    alpha: 0.7,
    duration: 200,
    paused: true,
  });
};

// answer processing
gameScene.processAnswer = function (userResponse) {
  // compare user response with correct response
  if (userResponse == this.nextWord.spanish) {
    this.correctSound.play();
    return true;
  } else {
    this.wrongSound.play();
    return false;
  }
}

// show new question
gameScene.showNextQuestion = function () {
  // select a random word
  this.nextWord = Phaser.Math.RND.pick(this.items.getChildren());
  // play a sound for that word
  this.nextWord.sound.play();
  // show the text of the word in Spanish
  this.wordText.setText(this.nextWord.spanish);
};

// executed once, after assets were loaded
gameScene.create = function () {

  this.add.sprite(0, 0, 'background').setOrigin(0, 0);

  this.items = this.add.group(this.sprites);

  Phaser.Actions.Call(this.items.getChildren(), function (item) {
    item.sound = this.sound.add(item.texture.key + 'Audio');
    item.spanish = this.spanish[item.texture.key];

    item.setInteractive();
    item.alphaTween = this.alphaTween(item);
    item.correctTween = this.correctTween(item);
    item.wrongTween = this.wrongTween(item);

    item.on('pointerdown', function (pointer) {
      let result = this.processAnswer(item.spanish);
      // depending on the result, we'll play one tween or the other
      if (result) {
        item.correctTween.restart();
      }
      else {
        item.wrongTween.restart();
      }
      // show next question
      this.showNextQuestion();
    }, this);

    item.on('pointerover', function (pointer) {
      item.alphaTween.restart();
    }, this);
    item.on('pointerout', function (pointer) {
      item.alphaTween.stop();
      item.alpha = 1;
    }, this);
  }, this);

  // text object
  this.wordText = this.add.text(30, 20, ' ', {
    font: '28px Open Sans',
    fill: '#ffffff'
  });

  // show the first question
  this.showNextQuestion();

  this.correctSound = this.sound.add('correctAudio');
  this.wrongSound = this.sound.add('wrongAudio');

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
