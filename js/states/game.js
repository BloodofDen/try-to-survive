let game = new Phaser.Game(innerWidth, innerHeight, Phaser.AUTO, 'game');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('end', endState);

game.state.start('boot');

WebFontConfig = {
    google: {
      families: ['Russo One', 'Eater']
    }
};

let officerAlive = true;
let officerHP = 100;
let officerVelocity = {
    front: 200,
    back: 150
};
let damages = 30;
let enemiesCount = 50;
let enemiesVelocity = 100;
let dropChance = 40;
let win = false;
let helicopterArrived = false;
let time = {
    text: '04:59',
    color: '#ff8381',
    style: '30px Russo One'
};
let currentSet = {
    weaponSelected: false,
    weaponPicture: 'fist',
    officerTexture: 'officer-move',
    numberOfCartridges: 0,
    maxNumberOfCartridges: 0,
    capacityOfClip: 0,
    speedCoefficient: 1,
    index: 0
};
let armory = Array(currentSet);
let zombies = ['zombie_03', 'zombie_03', 'zombie_03'];
let enemies;
let blood;
let loot;
let background;
let helicopter;
let officer;
let weapon;
let bullet;
let flash;
let circle;
let shadowTexture;
let LIGHT_RADIUS = 294;
let nextFire = 0;
let interface = {};
let sounds = {};
let stomp = 0;
let loadingText;