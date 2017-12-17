let endState = {
    create: function(){
        createSurface();
        createBlur();
        createTotal();
    }
}

function createBlur(){
    var blurX = game.add.filter('BlurX');
    var blurY = game.add.filter('BlurY');
    blurX.blur = 7;
    blurY.blur = 7;
    background.filters = [blurX, blurY];
}

function createTotal(){
    let style = {font: "80px Russo One", align: "center"};
    style.fill = win ? '#00ff00' : '#ff0000';
    let text = win ? 'Game Complete!' : 'Game Over!';
    let message1 = game.add.text(innerWidth*0.5, innerHeight*0.4, text, style);
    let message2 = game.add.text(innerWidth*0.5, innerHeight*0.5, 'Your Score: '+interface.score.text, style);
    message1.anchor.setTo(0.5);
    message2.anchor.setTo(0.5);
    message1.alpha = 0;
    message2.alpha = 0;
    game.add.tween(message1).to( { alpha: 1 }, 3000, Phaser.Easing.Linear.None, true);
    game.add.tween(message2).to( { alpha: 1 }, 3000, Phaser.Easing.Linear.None, true);
    let message3 = game.add.text(innerWidth*0.5, innerHeight*0.8, `exit to main menu`, {
        font: "40px Russo One",
        fontStyle: "italic",
        fill: "#ffffff",
        align: "center"
    });
    message3.anchor.setTo(0.5);
    message3.alpha = 0;
    game.add.tween(message3).to( { alpha: 1 }, 800, Phaser.Easing.Linear.None, true, 0, 800, true);
    message3.inputEnabled = true;
    message3.input.useHandCursor = true;
    message3.events.onInputDown.addOnce(restart, this);
}

function restart(){
    game.sound.stopAll();
    reset();
    game.state.start('menu');
}

function reset(){
    officerAlive = true;
    officerHP = 100;
    officerVelocity = {
        front: 200,
        back: 150
    };
    damages = 30;
    enemiesCount = 50;
    enemiesVelocity = 100;
    dropChance = 40;
    win = false;
    helicopterArrived = false;
    time = {
        text: '04:59',
        color: '#ff8381',
        style: '30px Russo One'
    };
    currentSet = {
        weaponSelected: false,
        weaponPicture: 'fist',
        officerTexture: 'officer-move',
        numberOfCartridges: 0,
        maxNumberOfCartridges: 0,
        capacityOfClip: 0,
        speedCoefficient: 1,
        index: 0
    };
    armory = Array(currentSet);
    zombies = ['zombie_03', 'zombie_03', 'zombie_03'];
    enemies;
    blood;
    loot;
    background;
    helicopter;
    officer;
    weapon;
    bullet;
    flash;
    circle;
    shadowTexture;
    LIGHT_RADIUS = 294;
    nextFire = 0;
    interface = {};
    sounds = {};
    stomp = 0;
}