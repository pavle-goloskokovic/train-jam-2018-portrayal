const WIDTH = 800;
const HEIGHT = 600;

var config = {
    width: WIDTH,
    height: HEIGHT,
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
const PLAYER_ACC = 0.05; //TODO adjust
const PLAYER_V_CAP = 2;

const PORTRAITS_NUM = 47;

/*const BG = {
    WIDTH: 512,
    HEIGHT: 512,
    ROWS: 24
};*/

var cursors;

var player;

var dots = [];
var activeDot = null;

var background;
var game = new Phaser.Game(config);

function preload ()
{
    //this.load.spritesheet('bg', 'assets/images/checker.png', { frameWidth: BG.WIDTH, frameHeight: BG.HEIGHT/BG.ROWS });
    this.load.image('bg', 'assets/images/bg.png');
    //this.load.image('person', 'assets/images/acryl-bladerunner.png');

    /*for(var i=1; i<=PORTRAITS_NUM; i++)
    {*/
    this.load.image('portrait' + 1, 'assets/images/ROSA/P'+'1'+'.png');
    //}
}

function create ()
{
    cursors = this.input.keyboard.createCursorKeys();

    background = this.add.image(WIDTH/2, HEIGHT/2, 'bg');
    background.setOrigin(0.5);
    background.setScale(3);

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

    player.graphics.depth = HEIGHT/3*2 + PLAYER_SIZE;

    for(var i=0; i<10; i++)
    {
        dots.push(createDot.call(this));
    }

    /*for(i=0; i<BG.ROWS; i++)
    {
        var sprite1 = this.add.image(WIDTH/2, 0, 'bg', 1);
        sprite1.setOrigin(0.5, 0);

        var sprite2 = this.add.image(WIDTH/2 + sprite1.width*sprite1.scaleX, 0, 'bg', 1);
        sprite2.setOrigin(0.5, 0);

        backgrounds.push([
            sprite1,
            sprite2
        ]);
    }*/

    /*graphics = this.add.graphics();

    for (var i = 0; i < 2000; i++)
    {
        balls.push({
            x: Math.random() * WIDTH,
            y: Math.random() * HEIGHT,
            v: 1,
            a: Math.random() * 2 * Math.PI,
        });
    }*/
}

function update (time, delta)
{
    !activeDot && (player.size -= delta / 600);

    if(player.size <= 0)
    {
        //TODO end game
        player.size = 0;
    }

    player.graphics.clear();
    player.graphics.fillCircle(WIDTH/2, HEIGHT/3*2, player.size);

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

    player.x += player.v.x;
    player.y += player.v.y;

    dots.forEach(function (dot) {

        var factor = 1 + ((dot.y - player.y)+HEIGHT/3*2)/HEIGHT;

        dot.graphics.clear();

        dot.graphics.fillStyle(dot.color, 1.0);
        dot.graphics.lineStyle(2, dot.color, -2*dot.transmitSize/PLAYER_SIZE - 3);

        dot.graphics.fillCircle(-PLAYER_SIZE/2, -PLAYER_SIZE/2, PLAYER_SIZE);
        dot.graphics.strokeCircle(-PLAYER_SIZE/2, -PLAYER_SIZE/2, dot.transmitSize);

        dot.graphics.x = (dot.x - player.x) * factor;
        dot.graphics.y = (dot.y - player.y) * factor;
        dot.graphics.depth = dot.graphics.y;

        dot.graphics.setScale(1 + (dot.graphics.y-WIDTH/2)/HEIGHT); // TODO interesting

        dot.person.x = dot.graphics.x;
        dot.person.y = dot.graphics.y - HEIGHT/8;

        dot.person.setScale(400/1500*dot.graphics.scaleX);

        dot.person.mask.geometryMask.x = dot.person.x;
        dot.person.mask.geometryMask.y = dot.person.y - 170;
        dot.person.mask.geometryMask.setScale(dot.graphics.scaleX);

    }.bind(this));

    background.x -= player.v.x/3;
    background.y -= player.v.y/3;

    if(activeDot)
    {
        if (Phaser.Math.Distance.Between(
                WIDTH/2, HEIGHT/3*2,
                activeDot.graphics.x, activeDot.graphics.y
            ) > PLAYER_SIZE*1.5)
        {
            visitDot.call(this, activeDot);
            activeDot = null;
        }
    }
    else
    {
        for (var i = 0; i < dots.length; i++)
        {
            var dot = dots[i];

            if (!dot.visited && Phaser.Math.Distance.Between(
                    WIDTH/2, HEIGHT/3*2,
                    dot.graphics.x, dot.graphics.y
                ) < PLAYER_SIZE*1.5)
            {
                activeDot = dot;
                // TODO show popup

                dot.person.visible = true;
                dot.person.alpha = 0;

                dot.personTween = this.tweens.add({
                    targets: dot.person,
                    duration: 1000,
                    alpha: 1,
                    //delay: Math.random() * 2,
                    //ease: 'Sine.easeInOut',
                    repeat: 0,
                    yoyo: false
                });

                break;
            }
        }
    }

    // TODO trail

    // TODO add snow

    /*backgrounds.forEach(function (sprites, i) {

        var sprite1 = sprites[0];
        var sprite2 = sprites[1];

        var newScale;

        if(i === 0)
        {
            newScale = WIDTH/BG.WIDTH;

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

        sprite1.x = WIDTH/2 - (player.x*sprite1.scaleX/2)%(sprite1.width * sprite1.scaleX);

        if(sprite1.x < WIDTH/2)
        {
            sprite2.x = sprite1.x + sprite1.width*sprite1.scaleX;
        }
        else
        {
            sprite2.x = sprite1.x - sprite1.width*sprite1.scaleX;
        }

        sprite2.y = sprite1.y;

    })*/

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
        person: this.add.image(0, 0, 'portrait'+ 1),//(1+Math.floor(Math.random()*PORTRAITS_NUM))),
        //color: selectColor(Math.floor(Math.random()*113), 113),
        personTween: null,
        color: getRandomColor(),
        transmitSize: PLAYER_SIZE,
        visited: false
    };

    dot.person.setOrigin(0.5, 1);
    dot.person.depth = 1000;

    var shape = this.make.graphics();
    shape.fillCircle(0, 0, 150);
    dot.person.mask = new Phaser.Display.Masks.GeometryMask(this, shape);

    /*this.input.on('pointermove', function (pointer) {

        shape.x = pointer.x;
        shape.y = pointer.y;

    });*/

    dot.transmitTween = this.tweens.add({
        targets: dot,
        duration: 1000,
        transmitSize: PLAYER_SIZE * 1.5,
        //delay: Math.random() * 2,
        //ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: false
    });

    dot.person.visible = false;

    return dot;
}

function visitDot (dot)
{
    dot.transmitTween.stop();
    dot.transmitSize = 0;
    this.tweens.add({
        targets: dot,
        duration: 200,
        color: 0x999999,
        //delay: Math.random() * 2,
        //ease: 'Sine.easeInOut',
        repeat: 0,
        yoyo: false
    });

    dot.visited = true;

    dot.personTween.stop();
    dot.personTween = this.tweens.add({
        targets: dot.person,
        duration: 300,
        alpha: 0,
        //delay: Math.random() * 2,
        //ease: 'Sine.easeInOut',
        repeat: 0,
        yoyo: false
    });

    player.size += 5;

}

var colors = [
    0xf48c41,
    0xf16a45,
    0xe64560,
    0xf32883,
    0xe87295,
    0xf55b7a,
    0xe3449b,
    0x42bd9e,
    0x2dd5b9,
    0x2dd5b9,
    0x76e5e9,
    0x16cde9,
    0x41adb1,
    0x40b7cf,
    0x33b3e2,
    0x345dcd,
    0x5896cd,
    0x413cd3,
    0x465ee7,
    0x6663ed,
    0x7f68e4,
    0x964cea,
    0x713bd4,
    0xd95cdb,
    0xb944dc,
    0xe345d1,
    0xbf1fdb,
    0xaf0ecb
];

function getRandomColor()
{
    return colors[Math.floor(Math.random()*colors.length)];
}

function selectColor (colorNum, colors)
{
    if (colors < 1) colors = 1;
    //return 'hsl(' + (colorNum * (360 / colors) % 360) + ',100%,50%)';
    var color = Phaser.Display.Color.HSVToRGB(colorNum/colors, 0.9, 1);
    return (color.r << 16) + (color.g << 8) + color.b;
}
