var config = {
    width: window.innerWidth,
    height: window.innerHeight,
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

const BG = {
    WIDTH: 512,
    HEIGHT: 512,
    ROWS: 37
};

var cursors;

var player;

var dots = [];
var backgrounds = [];
var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('bg', 'assets/images/checker.png', { frameWidth: BG.WIDTH, frameHeight: BG.HEIGHT/BG.ROWS });
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

    player.graphics.depth = window.innerHeight/3*2;

    for(var i=0; i<10; i++)
    {
        dots.push(createDot.call(this));
    }

    for(i=0; i<BG.ROWS; i++)
    {
        var sprite1 = this.add.image(window.innerWidth/2, 0, 'bg', i);
        sprite1.setOrigin(0.5, 0);

        var sprite2 = this.add.image(window.innerWidth/2 + sprite1.width*sprite1.scaleX, 0, 'bg', i);
        sprite2.setOrigin(0.5, 0);

        backgrounds.push([
            sprite1,
            sprite2
        ]);
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
    player.graphics.fillCircle(window.innerWidth/2, window.innerHeight/3*2, player.size);

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

        var factor = 1 + ((dot.y - player.y)+window.innerHeight/3*2)/window.innerHeight;

        dot.graphics.x = (dot.x - player.x) * factor;
        dot.graphics.y = (dot.y - player.y) * factor;
        dot.graphics.depth = dot.graphics.y;

        dot.graphics.setScale(1 + (dot.graphics.y-window.innerWidth/2)/window.innerHeight); // TODO interesting

    });

    backgrounds.forEach(function (sprites, i) {

        var sprite1 = sprites[0];
        var sprite2 = sprites[1];

        var newScale;

        if(i === 0)
        {
            newScale = window.innerWidth/BG.WIDTH;

            sprite1.y = 0;
        }
        else
        {
            var prevSprite = backgrounds[i-1][0];

            newScale = prevSprite.scaleX * 1.1;

            sprite1.y = prevSprite.y + prevSprite.height*prevSprite.scaleY;
        }

        sprite1.setScale(newScale);
        sprite2.setScale(newScale);

        sprite1.x = window.innerWidth/2 - (player.x*sprite1.scaleX/2)%(sprite1.width * sprite1.scaleX);

        if(sprite1.x < window.innerWidth/2)
        {
            sprite2.x = sprite1.x + sprite1.width*sprite1.scaleX;
        }
        else
        {
            sprite2.x = sprite1.x - sprite1.width*sprite1.scaleX;
        }

        sprite2.y = sprite1.y;

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
        graphics: this.add.graphics(),
        person: this.add.image(0, 0, 'person'),

        visit: function () {

        }
    };

    dot.graphics.fillStyle(selectColor(Math.floor(Math.random()*111), 111), 1.0);

    dot.graphics.fillCircle(-PLAYER_SIZE/2, -PLAYER_SIZE/2, PLAYER_SIZE);

    dot.person.visible = false;

    return dot;
}

function selectColor (colorNum, colors)
{
    if (colors < 1) colors = 1;
    //return 'hsl(' + (colorNum * (360 / colors) % 360) + ',100%,50%)';
    var color = Phaser.Display.Color.HSVToRGB(colorNum/colors, 1, 0.5);
    return (color.r << 16) + (color.g << 8) + color.b;
}
