"use strict";

var config = {
    type: Phaser.AUTO,
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game',
        width: 360,
        height: 640
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

var player;
var beers;
var pineapples;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var particles;
var isMobile = true;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'assets/bg.svg');
    this.load.image('left', 'assets/left.png');
    this.load.image('up', 'assets/up.png');
    this.load.image('right', 'assets/right.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('beer', 'assets/beer.png');
    this.load.image('pineapple', 'assets/pineapple.png');
    this.load.spritesheet('dude', 'assets/marquitos.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('red', 'assets/red.png');
}

function create() {
    //  A simple background for our game
    this.add.image(200, 300, 'sky');

    //  The platforms group contains the ground and the 3 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(200, 560, 'ground').setScale(2.5).refreshBody();

    //  Now let's create some ledges
    platforms.create(220, 400, 'ground').setScale(0.35).refreshBody();
    platforms.create(0, 250, 'ground').setScale(0.35).refreshBody();
    platforms.create(360, 200, 'ground').setScale(0.35).refreshBody();

    // The player and its settings
    player = this.physics.add.sprite(50, 470, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    particles = this.add.particles('red');

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some beers to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    beers = this.physics.add.group({
        key: 'beer',
        repeat: 5,
        setXY: { x: 12, y: 0, stepX: 60 }
    });

    beers.children.iterate(function (child) {

        //  Give each beer a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    pineapples = this.physics.add.group();

    //  The score
    scoreText = this.add.text(8, 540, '0', { fontSize: '32px', fill: '#FFF' });

    //  Collide the player and the beers with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(beers, platforms);
    this.physics.add.collider(pineapples, platforms);

    //  Checks to see if the player overlaps with any of the beers, if he does call the collectBeer function
    this.physics.add.overlap(player, beers, collectBeer, null, this);

    this.physics.add.collider(player, pineapples, hitPineapple, null, this);


    this.input.addPointer(2);

    var left = this.add.image(0, 0, 'left').setName('left').setInteractive();
    var up = this.add.image(0, 0, 'up').setName('up').setInteractive();
    var right = this.add.image(0, 0, 'right').setName('right').setInteractive();

    Phaser.Actions.GridAlign([left, up, right], {
        width: 3,
        cellWidth: 120,
        cellHeight: 60,
        x: 60,
        y: 610
    });


    this.input.on('gameobjectdown', function (pointer, gameObject) {
        if (gameOver || !isMobile) {
            return;
        }

        if (gameObject.name === 'left') {

            player.setVelocityX(-160);
            player.anims.play('left', true);
        } else if (gameObject.name === 'right') {
            player.setVelocityX(160);
            player.anims.play('right', true);
        }

        if (gameObject.name === 'up' && player.body.touching.down) {
            player.setVelocityY(-330);
        }
    });

    this.input.on('gameobjectup', function (pointer, gameObject) {
        if (!isMobile) {
            return;
        }
        player.setVelocityX(0);
        player.anims.play('turn');
    });
}

function update() {
    if (cursors.left.isDown || cursors.right.isDown || cursors.up.isDown) {
        isMobile = false;
    }

    if (isMobile) {
        return;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }

    if (gameOver) {
        alert("Game Over!");
        window.location = "";
    }
}

function collectBeer(player, beer) {
    beer.disableBody(true, true);

    //  Add and update the score
    score += 1;
    scoreText.setText(score);

    if (beers.countActive(true) % 3 === 0) {
        var x = (player.x < 200) ? Phaser.Math.Between(200, 400) : Phaser.Math.Between(0, 200);

        var pineapple = pineapples.create(x, 16, 'pineapple');
        pineapple.setBounce(1);
        pineapple.setCollideWorldBounds(true);
        pineapple.setVelocity(Phaser.Math.Between(-200, 200), 20);
        pineapple.allowGravity = false;

        var emitter = particles.createEmitter({
            speed: 50,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });

        emitter.startFollow(pineapple);

    }
    if (beers.countActive(true) === 0) {
        //  A new batch of beers to collect
        beers.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });
    }
}

function hitPineapple(player, pineapple) {
    this.physics.pause();

    player.setTint(0x5F5F5F);

    player.anims.play('turn');

    gameOver = true;
}