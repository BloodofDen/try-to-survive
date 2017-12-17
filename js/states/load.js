let loadState = {
    create: function(){
	    game.load.onFileComplete.add(fileComplete, this);
	    game.load.onLoadComplete.add(loadComplete, this);

	    loadingText = game.add.text(innerWidth/2, innerHeight/2, '0%', {
        	style: '100px',
	    	fill: '#ff0000',
	    	fontStyle: "italic",
			align: "center"
	    });
	    loadingText.anchor.set(0.5);
	    start();
	}
}

function start() {
    	game.time.advancedTiming = true;
    	game.load.audio('menu_sound', 'sounds/UI/menu.mp3');
	  	game.load.audio('fool-zombie', 'sounds/background/Zombies also love to play the fool.mp3');  
	    game.load.audio('menu_hover', 'sounds/UI/hover.wav');
	    game.load.audio('footstep', 'sounds/footstep/step.wav');
	    game.load.audio('shoot', 'sounds/gun/pistol/shoot.wav');
	    game.load.audio('reload', 'sounds/gun/pistol/reload.wav');
	    game.load.audio('helicopter-fly', 'sounds/helicopter/fly.mp3');
	    game.load.audio('helicopter-stay', 'sounds/helicopter/stay.mp3');
	    game.load.audio('hit_1', 'sounds/hit/hit_1.ogg');
	    game.load.audio('hit_2', 'sounds/hit/hit_2.ogg');
	    game.load.audio('hit_3', 'sounds/hit/hit_3.ogg');
	    game.load.audio('hit_4', 'sounds/hit/hit_4.ogg');
	    game.load.audio('collect_ammo', 'sounds/collect/ammo.wav');
	    game.load.audio('collect_health', 'sounds/collect/health.ogg');
	    game.load.audio('zombie_roar_1', 'sounds/zombie/moan_1.ogg');
	    game.load.audio('zombie_roar_2', 'sounds/zombie/moan_2.ogg');
	    game.load.audio('zombie_roar_3', 'sounds/zombie/moan_3.ogg');
	    game.load.audio('zombie_roar_4', 'sounds/zombie/moan_4.ogg');
	    game.load.audio('zombie_roar_5', 'sounds/zombie/moan_5.ogg');
		game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
	    game.load.script('BlurX', 'https://cdn.rawgit.com/photonstorm/phaser/master/v2/filters/BlurX.js');
    	game.load.script('BlurY', 'https://cdn.rawgit.com/photonstorm/phaser/master/v2/filters/BlurY.js');
        game.load.image('wallpaper', 'assets/background/wallpaper.jpg');
	    game.load.image('ground', 'assets/background/ground.png');
	    game.load.image('fov', 'assets/circle.png');
	    game.load.image('arrow', 'assets/arrow.png');
	    game.load.image('fist', 'assets/interface/fist.png');
	    game.load.image('pistol-img', 'assets/interface/pistol.png');
	    game.load.image('HP', 'assets/interface/health.png');
	    game.load.image('skull', 'assets/interface/skull.png');
	    game.load.image('ammo', 'assets/interface/ammo.png');
	    game.load.image('pistol', 'assets/weapons/guns/pistol.png');
	    game.load.image('bullet', 'assets/weapons/guns/bullet.png');
	    game.load.image('flash', 'assets/weapons/guns/flash.png');
	    game.load.image('clip', 'assets/equipment/clip.png');
	    game.load.image('kit', 'assets/equipment/kit.png');
	    game.load.image('pills', 'assets/equipment/pills.png');
	    game.load.spritesheet('officer-die', 'assets/officer/officer_die_strip.png', 49, 54, 4);
	    game.load.spritesheet('officer-headless', 'assets/officer/officer_headless_strip.png', 46, 52, 4);
	    game.load.spritesheet('officer-armed', 'assets/officer/officer_shoot_strip.png', 38, 45, 6);
	    game.load.spritesheet('officer-move', 'assets/officer/officer_move_strip.png', 32, 45, 8);
	    game.load.spritesheet('zombie_03-move', 'assets/zombies/zombie_03/move_strip.png', 76, 82, 17);
	    game.load.spritesheet('zombie_03-idle', 'assets/zombies/zombie_03/idle_strip.png', 68, 63, 17);
	    game.load.spritesheet('zombie_03-attack', 'assets/zombies/zombie_03/attack_strip.png', 87, 80, 9);
	    game.load.spritesheet('blood', 'assets/zombies/blood.png', 64, 64, 5);
	    game.load.spritesheet('helicopter', 'assets/helicopter/helicopter.png', 582, 450, 2);
	    game.load.start();
}

function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
	loadingText.setText(`Loading...${progress === 100 ? 99 : progress}%`);
}

function loadComplete() {
	game.add.audio('menu_sound').onDecoded.add(()=>{
		loadingText.setText(`Loading...100%`);	
		game.state.start('menu');
	}, this);
}