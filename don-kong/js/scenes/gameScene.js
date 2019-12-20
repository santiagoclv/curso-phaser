// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function () { };

// executed once, after assets were loaded
gameScene.create = function () {
    // load json data
    this.levelData = this.cache.json.get('levelData');

    // add all level elements
    this.setupLevel();

    // initiate barrel spawner
    this.setupSpawner();

    // collision detection
    this.physics.add.collider([this.goal, this.player, this.barrels], this.platforms);
    this.physics.add.overlap(this.player, [this.fires, this.goal, this.barrels], this.restartGame, null, this);

    const { width, height } = this.levelData.camera;

    // world bounds
    this.physics.world.bounds.width = width;
    this.physics.world.bounds.height = height;

    // camera bounds
    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.startFollow(this.player);

    this.cursors = this.input.keyboard.createCursorKeys();
    // Develop and debug purpose
    this.input.on('pointerdown', function (pointer) {
        console.log("X, Y: ", pointer.x, pointer.y);
    });
};

gameScene.update = function () {
    let onGround = this.player.body.blocked.down || this.player.body.touching.down;

    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);

        this.player.flipX = false;
        if (onGround) {
            this.player.anims.play('walking', true);
        }
    }
    else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);

        this.player.flipX = true;

        if (onGround) {
            this.player.anims.play('walking', true);
        }
    }
    else {

        this.player.setVelocityX(0);

        if (onGround) {
            this.player.anims.play('turn');
        }
    }

    if (this.cursors.up.isDown && onGround) {
        this.player.setVelocityY(-630);
        this.player.anims.play('jump', true);
    }
};

// restart game (game over + you won!)
gameScene.restartGame = function (sourceSprite, targetSprite) {
    // fade out
    this.cameras.main.fade(500);

    // when fade out completes, restart scene
    this.cameras.main.on('camerafadeoutcomplete', function (camera, effect) {
        // restart the scene
        this.scene.restart();
    }, this);
};

// sets up all the elements in the level
gameScene.setupLevel = function () {
    // create all the platforms
    this.platforms = this.physics.add.staticGroup();
    this.levelData.platforms.map(platform => {
        const { x, y, key, numTiles } = platform;
        let spriteObject;
        // create object
        if (numTiles == 1) {
            // create sprite
            spriteObject = this.add.sprite(x, y, key).setOrigin(0);
        }
        else {
            // create tilesprite
            const { width, height } = this.textures.get(key).get(0);
            spriteObject = this.add.tileSprite(x, y, numTiles * width, height, key).setOrigin(0);
        }
        // add to the group
        this.platforms.add(spriteObject);
    })

    // create all the fire
    this.fires = this.physics.add.group({
        allowGravity: false,
        immovable: true
    });
    this.levelData.fires.map(fire => {
        const { x, y } = fire;
        let spriteObject = this.physics.add.sprite(x, y, 'fire').setOrigin(0);
        // play burning animation
        spriteObject.anims.play('burning');
        // add to the group
        this.fires.add(spriteObject);
        // this is for level creation
        spriteObject.setInteractive();
        this.input.setDraggable(spriteObject);
    });

    // for level creation
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
        console.log("drag: ", dragX, dragY);
    });

    // player
    if (this.levelData.player) {
        const { x, y } = this.levelData.player;
        this.player = this.physics.add.sprite(x, y, 'player', 3);
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
    }

    // goal
    if (this.levelData.goal) {
        const { x, y } = this.levelData.goal;
        this.goal = this.physics.add.sprite(x, y, 'goal');
    }

};

// generation of barrels using a Object Pool strategy 
gameScene.setupSpawner = function () {
    const { x, y } = this.levelData.goal;
    // barrel group
    this.barrels = this.physics.add.group({
        bounceY: 0.1,
        bounceX: 1,
        collideWorldBounds: true
    });

    // spawn barrels
    this.time.addEvent({
        delay: this.levelData.spawner.interval,
        loop: true,
        callbackScope: this,
        callback: function () {
            // create a barrel
            let barrel = this.barrels.get(x, y, "barrel");

            // reactivate
            barrel.enableBody(true, x, y, true, true);
            
            // set properties
            barrel.setVelocityX(this.levelData.spawner.speed);

            // lifespan
            this.time.addEvent({
                delay: this.levelData.spawner.lifespan,
                repeat: 0,
                callbackScope: this,
                callback: function () {
                    barrel.disableBody(true, true);
                }
            });
        }
    });
}