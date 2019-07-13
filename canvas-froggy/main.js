var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const screenWidth = 800;
const screenHeight = 500;

const directions = { left: "left", right: "right", up: "up", down: "down" }

const directionsKeys = { left: 37, right: 39, up: 38, down: 40 }

var sprites = {};

var loadSprites = function () {
    sprites.player = new Image();
    sprites.player.src = 'assets/red.png';
    sprites.background = new Image();
    sprites.background.src = 'assets/bg.svg';
    sprites.enemy = new Image();
    sprites.enemy.src = 'assets/pineapple.png';
    sprites.goal = new Image();
    sprites.goal.src = 'assets/beer.png';
}
loadSprites();

class GameCharacter {
    constructor(x, y, width, height, sprite) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = sprite;
    }

    move(offsetX, offsetY) {
        const x = parseFloat(offsetX, 10);
        const y = parseFloat(offsetY, 10);
        this.x += isNaN(x) ? 0 : x;
        this.y += isNaN(y) ? 0 : y;
    }

    render(ctx) {
        ctx.drawImage(this.sprite, this.x, this.y);
    }
}


class Player extends GameCharacter {
    constructor(x, y, width, height, color, direction, speed) {
        super(x, y, width, height, color);
        this.speed = speed;
        this.direction = direction;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    setDirection(direction) {
        this.direction = direction;
    }

    move() {
        if (!!this.speed) {
            switch (this.direction) {
                case directionsKeys.up:
                    super.move(0, -this.speed)
                    break;
                case directionsKeys.down:
                    super.move(0, this.speed)
                    break;
                case directionsKeys.left:
                    super.move(-this.speed, 0)
                    break;
                case directionsKeys.right:
                    super.move(this.speed, 0)
                    break;
                default:
                    break;
            }
        }

    }
}

class BadBoy extends GameCharacter {
    constructor(x, y, width, height, color, direction) {
        super(x, y, width, height, color);
        this.direction = direction;
    }

    setDirection(direction) {
        if (directions[direction]) {
            this.direction = direction;
        }
    }

    verticalMove(velocity) {
        const y = Math.abs(velocity);
        switch (this.direction) {
            case directions.down:
                if (this.y < (screenHeight - this.height)) {
                    super.move(0, y);
                } else {
                    this.setDirection(directions.up);
                    super.move(0, -y);
                }
                break;
            case directions.up:
                if (this.y > 0) {
                    super.move(0, -y);
                } else {
                    this.setDirection(directions.down);
                    super.move(0, y);
                }
                break;
            default:
                console.log("Error, default");
                break;
        }
    }
}

var badBoy1 = new BadBoy(200, 50, 25, 25, sprites.enemy, directions.down);
var badBoy2 = new BadBoy(300, 400, 25, 25, sprites.enemy, directions.up);
var badBoy3 = new BadBoy(450, 50, 25, 25, sprites.enemy, directions.down);
var badBoy4 = new BadBoy(600, 400, 25, 25, sprites.enemy, directions.down);

var player = new Player(50, 200, 25, 25, sprites.player, null, 5);

var end = new GameCharacter(screenWidth - 25, 150, 25, 25, sprites.goal);

document.onkeydown = (event) => {
    player.setSpeed(5);
    player.setDirection(event.keyCode);
}

document.onkeyup = (event) => {
    player.setSpeed(0);
    player.setDirection(null);
}

function checkCollisions(rectA, rectB) {
    const overlapX = Math.abs(rectA.x - rectB.x) <= Math.max(rectA.width, rectB.width);
    const overlapY = Math.abs(rectA.y - rectB.y) <= Math.max(rectA.height, rectB.height);
    return overlapX && overlapY;
}

function draw() {
    ctx.clearRect(0, 0, screenWidth, screenHeight);
    ctx.drawImage(sprites.background, 0, 0);
    badBoy1.render(ctx);
    badBoy2.render(ctx);
    badBoy3.render(ctx);
    badBoy4.render(ctx);
    end.render(ctx);
    player.render(ctx);
}

function update() {
    badBoy1.verticalMove(3);
    badBoy2.verticalMove(6);
    badBoy3.verticalMove(8);
    badBoy4.verticalMove(7);
    player.move();
}

function step(timestamp) {
    update();
    draw();

    if (checkCollisions(badBoy1, player)
        || checkCollisions(badBoy2, player)
        || checkCollisions(badBoy3, player)
        || checkCollisions(badBoy4, player)) {
        alert('Game Over :(');
        window.location = "";
    } else if (checkCollisions(end, player)) {
        alert('You win!');
        window.location = "";
    } else {
        window.requestAnimationFrame(step);
    }
}

step();