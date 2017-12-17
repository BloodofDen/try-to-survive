let menuState = {
    create: function() {
        createWallpaper();
        createButtonNewGame();
        createButtonFullScreen();
        createButtonSound();
        createButtonAbout();
    }
}

function createWallpaper(){
	let wallpaper = game.add.image(0, 0, 'wallpaper');
    wallpaper.height = innerHeight;
    wallpaper.width = innerWidth;
}

function createButtonNewGame(){
	let text = 'New Game';
    let style = {font: "60px Eater", fill: "#ffffff"};
	let buttonNewGame = game.add.text(20*innerWidth/100, 15*innerHeight/100, text, style);
    buttonNewGame.inputEnabled = true;
    buttonNewGame.input.useHandCursor = true;
    sounds.menu = game.add.audio('menu_sound');
    sounds.menu.play('', 0, 1, true);
    buttonNewGame.events.onInputDown.addOnce(newGame, this);
    buttonNewGame.events.onInputOver.add(over, this);
    buttonNewGame.events.onInputOut.add(out, this);
}

function createButtonFullScreen(){
	let text = 'Full Screen';
    let style = {font: "60px Eater", fill: "#ffffff"};
	let buttonFullScreen = game.add.text(20*innerWidth/100, 30*innerHeight/100, text, style);
    buttonFullScreen.inputEnabled = true;
    buttonFullScreen.input.useHandCursor = true;
    buttonFullScreen.events.onInputDown.add(toggleFullScreen, this);
    buttonFullScreen.events.onInputOver.add(over, this);
    buttonFullScreen.events.onInputOut.add(out, this);
}

function createButtonSound(){
	let text = 'Sounds: On/Off';
    let style = {font: "60px Eater", fill: "#ffffff"};
	let buttonSound = game.add.text(20*innerWidth/100, 45*innerHeight/100, text, style);
    buttonSound.inputEnabled = true;
    buttonSound.input.useHandCursor = true;
    buttonSound.events.onInputDown.add(toggleSound, this);
    buttonSound.events.onInputOver.add(over, this);
    buttonSound.events.onInputOut.add(out, this);
}

function createButtonAbout(){
	let text = 'About';
    let style = {font: "60px Eater", fill: "#ffffff"};
	let buttonAbout = game.add.text(20*innerWidth/100, 60*innerHeight/100, text, style);
    buttonAbout.inputEnabled = true;
    buttonAbout.input.useHandCursor = true;
    buttonAbout.events.onInputDown.add(linkAbout, this);
    buttonAbout.events.onInputOver.add(over, this);
    buttonAbout.events.onInputOut.add(out, this);
}

function over(text){
    text.fill = '#ff0000';
    game.sound.play('menu_hover');
}

function out(text){
    text.fill = '#ffffff';
}

function newGame(button){
    sounds.menu.stop();
	game.state.start('play');
}

function toggleFullScreen(){
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.isFullScreen ? game.scale.stopFullScreen() : game.scale.startFullScreen(false);
}

function toggleSound(){
    game.sound.mute = !game.sound.mute;
    sounds.menu.isPlaying ? sounds.menu.pause() : sounds.menu.resume();
}

function linkAbout(){
	window.open("/about.html", "_self");
}