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

const PORTRAITS_NUM = 88;

/*const BG = {
    WIDTH: 512,
    HEIGHT: 512,
    ROWS: 24
};*/

var progress;

var cursors;

var player;

var dots = [];
var activeDot = null;

var playing = false;

var background;
var game = new Phaser.Game(config);

var title;

function preload ()
{
    var progress = this.add.graphics();

    this.load.on('progress', function (value) {

        progress.clear();
        progress.fillStyle(0x00000, 1);
        progress.fillRect(0, 299, 800 * value, 2);

    });

    this.load.on('complete', function () {

        progress.destroy();

    }, this);

    //this.load.spritesheet('bg', 'assets/images/checker.png', { frameWidth: BG.WIDTH, frameHeight: BG.HEIGHT/BG.ROWS });
    this.load.image('bg', 'assets/images/bg.png');
    //this.load.image('person', 'assets/images/acryl-bladerunner.png');

    for(var i=0; i<PORTRAITS_NUM; i++)
    {
        this.load.image('portrait' + i, 'assets/images/Portraits/P'+(i+1)+'.png');
    }

    this.load.audio('music', [
        'assets/audio/Portrait Odyssey_2.ogg',
        'assets/audio/tech/Portrait Odyssey_2.mp3'
    ]);

}

function create ()
{
    this.sound.play('music', {
        loop: true
    });

    cursors = this.input.keyboard.createCursorKeys();

    background = this.add.image(WIDTH/2, HEIGHT/2, 'bg');
    background.setOrigin(0.5);
    background.setScale(3);

    title = this.add.text(WIDTH/2, HEIGHT/3, 'Portrayal', {
        fontSize: '56px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        color: '#000'
    });
    title.setOrigin(0.5);

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

    [background, title, player.graphics].forEach(function (item) {
        item.alpha = 0;
    });

    this.tweens.add({
        targets: [background, title, player.graphics],
        duration: 1000,
        alpha: 1,
        //delay: Math.random() * 2,
        //ease: 'Sine.easeInOut',
        repeat: 0,
        yoyo: false
    });

    this.input.keyboard.on('keydown', function (event)
    {
        if (event.code === 'ArrowUp' || event.code === 'ArrowDown' ||
            event.code === 'ArrowLeft' || event.code === 'ArrowRight')
        {
            console.log('input detected');

            addDots.call(this);

            this.tweens.add({
                targets: title,
                duration: 1000,
                alpha: 0,
                //delay: Math.random() * 2,
                //ease: 'Sine.easeInOut',
                repeat: 0,
                yoyo: false
            });

            this.input.keyboard.removeAllListeners();

            playing = true;
        }
    }, this);

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

    !activeDot && playing && (player.size -= delta / 600);

    if(playing && player.size <= 0)
    {
        playing = false;

        player.graphics.visible = false;

        // TODO add menu transition

        // background

        this.tweens.add({
            targets: background,
            duration: 6000,
            x: 0,
            y: 0,
            //delay: Math.random() * 2,
            //ease: 'Sine.easeInOut',
            repeat: 0,
            yoyo: false
        });

        // Text and dots

        this.tweens.add({
            targets: title,
            duration: 1000,
            alpha: 1,
            //delay: Math.random() * 2,
            //ease: 'Sine.easeInOut',
            repeat: 0,
            yoyo: false,
            onStart: function ()
            {
                title.setText("Thank you!");
            }
        });
        this.tweens.add({
            targets: title,
            duration: 1000,
            alpha: 0,
            //delay: Math.random() * 2,
            //ease: 'Sine.easeInOut',
            repeat: 0,
            yoyo: false,
            delay: 4000,
            onComplete: function ()
            {
                title.setText('Portrayal');
            }
        });
        this.tweens.add({
            targets: title,
            duration: 1000,
            alpha: 1,
            //delay: Math.random() * 2,
            //ease: 'Sine.easeInOut',
            repeat: 0,
            yoyo: false,
            delay: 6000,
            onStart: function ()
            {
                for(var i = 0; i<dots.length; i++)
                {
                    dots[i].graphics.destroy();
                    dots[i].person.destroy();
                }

                dots.length = 0;
            },
            onComplete: function ()
            {
                player.graphics.visible = true;

                player.size = PLAYER_SIZE;
                player.x = 0;
                player.y = 0;

                this.input.keyboard.on('keydown', function (event)
                {
                    if (event.code === 'ArrowUp' || event.code === 'ArrowDown' ||
                        event.code === 'ArrowLeft' || event.code === 'ArrowRight')
                    {
                        console.log('input detected');

                        addDots.call(this);

                        this.tweens.add({
                            targets: title,
                            duration: 1000,
                            alpha: 0,
                            //delay: Math.random() * 2,
                            //ease: 'Sine.easeInOut',
                            repeat: 0,
                            yoyo: false
                        });

                        this.input.keyboard.removeAllListeners();

                        playing = true;
                    }

                }, this);

            }.bind(this)
        });
    }

    player.graphics.clear();
    player.graphics.fillCircle(WIDTH/2, HEIGHT/3*2, player.size);

    if(!playing)
    {
        player.graphics.fillTriangle(
            WIDTH/2 - 80, HEIGHT/3*2,
            WIDTH/2 - 50, HEIGHT/3*2 - 30,
            WIDTH/2 - 50, HEIGHT/3*2 + 30
        );

        player.graphics.fillTriangle(
            WIDTH/2 + 80, HEIGHT/3*2,
            WIDTH/2 + 50, HEIGHT/3*2 - 30,
            WIDTH/2 + 50, HEIGHT/3*2 + 30
        );

        player.graphics.fillTriangle(
            WIDTH/2, HEIGHT/3*2 - 80,
            WIDTH/2 - 30, HEIGHT/3*2 - 50,
            WIDTH/2 + 30, HEIGHT/3*2 - 50
        );

        player.graphics.fillTriangle(
            WIDTH/2, HEIGHT/3*2 + 80,
            WIDTH/2 - 30, HEIGHT/3*2 + 50,
            WIDTH/2 + 30, HEIGHT/3*2 + 50
        );
    }

    // Controls

    if (playing && cursors.left.isDown) {
        player.v.x -= PLAYER_ACC;
        player.v.x = Math.max(-PLAYER_V_CAP, player.v.x);
    }
    else if (player.v.x < 0) {
        player.v.x += 1.5 * PLAYER_ACC;
        player.v.x = Math.min(player.v.x, 0);
    }
    else if (playing && cursors.right.isDown) {
        player.v.x += PLAYER_ACC;
        player.v.x = Math.min(player.v.x, PLAYER_V_CAP);
    }
    else {
        player.v.x -= 1.5 * PLAYER_ACC;
        player.v.x = Math.max(0, player.v.x);
    }

    if (playing && cursors.down.isDown) {
        player.v.y += PLAYER_ACC;
        player.v.y = Math.min(player.v.y, PLAYER_V_CAP);
    }
    else if (player.v.y > 0) {
        player.v.y -= 1.5 * PLAYER_ACC;
        player.v.y = Math.max(0, player.v.y);
    }
    else if (playing && cursors.up.isDown) {
        player.v.y -= PLAYER_ACC;
        player.v.y = Math.max(-PLAYER_V_CAP, player.v.y);
    }
    else {
        player.v.y += 1.5 * PLAYER_ACC;
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

        dot.person.setScale(320/dot.person.width*dot.graphics.scaleX);

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

function addDots ()
{
    for(var i=0; i<PORTRAITS_NUM; i++)
    {
        dots.push(createDot.call(this, i));
    }
}

function createDot (i) {

    var dot = {
        x: Math.random() * 1700,
        y: Math.random() * 1700,
        graphics: this.add.graphics(),
        person: this.add.image(0, 0, 'portrait'+i),
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

    if(player.size < PLAYER_SIZE*1.5)
    {
        player.size *= 1.15;
    }
    else
    {
        player.size += 1;
    }
}

var colors = [
    0xf48c41,
    0xf16a45,
    0xe64560,
    0xf32883,
    0xe87295,
    0xf55b7a,
    0xe3449b,
    0x41adb1,
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
    0xaf0ecb,
    0xd7786b,
    0xc96e39,
    0xc73664,
    0xd04d68,
    0x488fa3,
    0x2983aa,
    0x3f79c0,
    0x2878ae,
    0x554fcd,
    0x7064b7,
    0x5e3dba,
    0x8a53ce,
    0xbf49a7,
    0xce5991,
    0xb740bb,
    0xc92788,
    0xbc2ab2,
    0x9741d1
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
