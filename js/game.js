var config = {
    width: 800,
    height: 600,
    backgroundColor: '#fff',
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const PLAYER_SIZE = 20;
const PLAYER_ACC = 0.1; //TODO adjust
const PLAYER_V_CAP = 5;

var cursors;

var player;

var dots = [];

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('person', 'assets/images/acryl-bladerunner.png');
}

function create ()
{
    cursors = this.input.keyboard.createCursorKeys();

    player = {
        x: 0,
        y: 0,
        v: {
            x: 0,
            y: 0
        },
        graphics: this.add.graphics(),
        size: PLAYER_SIZE
    };

    for(var i=0; i<10; i++)
    {
        dots.push(createDot.call(this));
    }

    /*graphics = this.add.graphics();

    for (var i = 0; i < 2000; i++)
    {
        balls.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            v: 1,
            a: Math.random() * 2 * Math.PI,
        });
    }*/
}

function update (time, delta)
{
    player.size -= delta / 400;

    player.graphics.clear();
    player.graphics.fillCircle(400, 400, player.size);

    // Controls

    if (cursors.left.isDown)
    {
        player.v.x -= PLAYER_ACC;
        player.v.x = Math.max(-PLAYER_V_CAP, player.v.x);
    }
    else if (player.v.x < 0)
    {
        player.v.x += 1.5*PLAYER_ACC;
        player.v.x = Math.min(player.v.x, 0);
    }
    else if (cursors.right.isDown)
    {
        player.v.x += PLAYER_ACC;
        player.v.x = Math.min(player.v.x, PLAYER_V_CAP);
    }
    else
    {
        player.v.x -= 1.5*PLAYER_ACC;
        player.v.x = Math.max(0, player.v.x);
    }

    console.log(player.v);

    if (cursors.down.isDown)
    {
        player.v.y += PLAYER_ACC;
        player.v.y = Math.min(player.v.y, PLAYER_V_CAP);
    }
    else if (player.v.y > 0)
    {
        player.v.y -= 1.5*PLAYER_ACC;
        player.v.y = Math.max(0, player.v.y);
    }
    else if (cursors.up.isDown)
    {
        player.v.y -= PLAYER_ACC;
        player.v.y = Math.max(-PLAYER_V_CAP, player.v.y);
    }
    else
    {
        player.v.y += 1.5*PLAYER_ACC;
        player.v.y = Math.min(player.v.y, 0);
    }

    // TODO update player coordiantes

    player.x += player.v.x;
    player.y += player.v.y;

    // TODO update dots coordinates

    dots.forEach(function (dot) {

        dot.dot.x = dot.x - player.x;
        dot.dot.y = dot.y - player.y;

    })

    /*graphics.clear();
    graphics.fillStyle(0x9966ff, 1);

    for (b in balls)
    {
        var ball = balls[b];
        ball.x += ball.v * Math.cos(ball.a);
        ball.y += ball.v * Math.sin(ball.a);
        ball.a += 0.03;

        graphics.fillCircle(ball.x, ball.y, ball.a);
    }*/
}

function createDot () {

    var dot = {
        x: Math.random() * 800,
        y: Math.random() * 600,
        dot: this.add.graphics(),
        person: this.add.image(0, 0, 'person')
    };

    dot.dot.fillCircle(dot.x, dot.y, PLAYER_SIZE/2);

    dot.person.visible = false;

    return dot;
}
