let playState = {
	create: function() {
		createSounds();
	    createSurface();
	    createBlood();
	    createLoot();
	    createBullet();
	    createOfficer();
	    createWeapon();
	    createDetectionArea();
	    createEnemies();
	    createScore();
	    createInterface();
	    createHP();
	    createTimer();
	    setCamera(officer);
	},

	update: function() {
		circle.x = officer.x;
		circle.y = officer.y;	

	    officer.body.velocity.x = 0;
	    officer.body.velocity.y = 0;
	    officer.body.angularVelocity = 0;

	    game.physics.arcade.collide(enemies);
	    game.physics.arcade.collide(officer, enemies, collideDamageHandler, null, this);
	    game.physics.arcade.overlap(officer, weapon, overlapWeaponHandler, null, this);
	    game.physics.arcade.overlap(officer, loot, overlapLootHandler, null, this);
	    game.physics.arcade.overlap(enemies, bullet, overlapFireHandler, null, this);
	    game.physics.arcade.overlap(circle, enemies, overlapEnemyHandler, null, this);
	    game.input.mouse.mouseWheelCallback = mouseWheel;

	    if(helicopterArrived){
	    	interface.arrow.rotation = game.physics.arcade.angleToXY(interface.arrow, helicopter.body.x, helicopter.body.y);
	    	game.physics.arcade.overlap(officer, helicopter, overlapHelicopterHandler, null, this);
	    }

	    if (game.input.keyboard.isDown(Phaser.Keyboard.D) && officerAlive){
	        officer.body.angularVelocity = game.input.keyboard.isDown(Phaser.Keyboard.SHIFT) ? 120 : 250;
	    }
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.A) && officerAlive){
	        officer.body.angularVelocity = game.input.keyboard.isDown(Phaser.Keyboard.SHIFT) ? -120 : -250;
	    }

	    if (game.input.keyboard.isDown(Phaser.Keyboard.W) && officerAlive){
	        game.physics.arcade.velocityFromAngle(
	            officer.angle, 
	            officerVelocity.front*currentSet.speedCoefficient, 
	            officer.body.velocity);
	        officer.animations.play('move', officerVelocity.front*currentSet.speedCoefficient/10, false);
	        if(game.time.now>stomp){
	        	sounds.foot.play('', 0, 0.5);
	        	stomp = game.time.now + officerVelocity.back*2;
	        }

	    }
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.S) && officerAlive){
	        game.physics.arcade.velocityFromAngle(
	            officer.angle, 
	            -officerVelocity.back*currentSet.speedCoefficient, 
	            officer.body.velocity);
	        officer.animations.play('move', officerVelocity.back*currentSet.speedCoefficient/10, false);
	        if(game.time.now>stomp){
	        	sounds.foot.play('', 0, 0.5);
	        	stomp = game.time.now + officerVelocity.front*2;
	        }
	    }

	    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
	        if(currentSet.weaponSelected && currentSet.numberOfCartridges){
	            makeShot();
	        }
	    }

	    if((game.input.keyboard.isDown(Phaser.Keyboard.R) || 
	    	!currentSet.numberOfCartridges) && currentSet.weaponSelected){
	    	reload();
	    }

	    if(game.input.keyboard.isDown(Phaser.Keyboard.ONE)){
	    	if(currentSet !== armory[0]){
		    	currentSet = armory[0];
		    	updateInterface();
	    		updateOfficerTexture();
	    	}
	    }
	    else if(game.input.keyboard.isDown(Phaser.Keyboard.TWO)){
	    	if(currentSet !== armory[1] && armory.length>1){
		    	currentSet = armory[1];
		    	updateInterface();
	    		updateOfficerTexture();
	    	}
	    }
	},

	render: function() {
	    game.debug.text('fps:'+game.time.fps || '--', 10, 20, '#00ff00');
	    game.debug.text(time.text, innerWidth*0.5-40, innerHeight*0.1, time.color, time.style);
	}
}

function createSounds(){
	createMainTheme();
	createShootSound();
	createReloadSound();
	createFootSound();
	createHitSound();
	createCollectSound();
	createHelicopterSound();
	createZombiesSound();
}

function createMainTheme(){
	sounds.mainTheme = game.add.audio('fool-zombie');
	sounds.mainTheme.play('', 0, 0.6, true);
}

function createShootSound(){
	sounds.shoot = game.add.audio('shoot');
}

function createReloadSound(){
	sounds.reload = game.add.audio('reload');
}

function createFootSound(){
	sounds.foot = game.add.audio('footstep');
}

function createHelicopterSound(){
	sounds.helicopter = {
		stay: game.add.audio('helicopter-stay'),
		fly:  game.add.audio('helicopter-fly')
	};
}

function createCollectSound(){
	sounds.collect = {
		health: game.add.audio('collect_health'),
		ammo:   game.add.audio('collect_ammo')
	};
}

function createHitSound(){
	sounds.hit = {
		_1: game.add.audio('hit_1'),
		_2: game.add.audio('hit_2'),
		_3: game.add.audio('hit_3'),
		_4: game.add.audio('hit_4')
	};
}

function createZombiesSound(){
	sounds.zombies = {
		roar_1: game.add.audio('zombie_roar_1'),
		roar_2: game.add.audio('zombie_roar_2'),
		roar_3: game.add.audio('zombie_roar_3'),
		roar_4: game.add.audio('zombie_roar_4')
	};
}

function createSurface(){
	background = game.add.tileSprite(0, 0, innerWidth*3, innerHeight*3, 'ground');
    game.world.setBounds(0, 0, innerWidth*3, innerHeight*3);
}

function createArrow(){
    interface.arrow = game.add.sprite(innerWidth*0.5, innerHeight*0.17, 'arrow');
    interface.arrow.anchor.setTo(0.5);
    interface.arrow.fixedToCamera = true;
}

function createBullet(){
    bullet = game.add.sprite(0, 0, 'bullet');
    game.physics.enable(bullet, Phaser.Physics.ARCADE);
    bullet.anchor.setTo(0.5);
    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;
}

function createBlood(){
    blood = game.add.group();
    for(let i = 0; i < 100; i++){
        let item = blood.create(0,0,'blood');
        item.anchor.setTo(0.5);
        item.animations.add('spray', [0,1,2,3,4]);
        item.events.onAnimationComplete.add(addLoot, item);
        item.kill();
    }
}

function createLoot(){
	loot = game.add.physicsGroup(Phaser.Physics.ARCADE);
    for(let i = 0; i < enemiesCount/2; i++){
    	createLootItem('clip');
    	createLootItem('clip');
    	createLootItem('pills');
    	createLootItem('kit');
    }
    loot.setAll('collideWorldBounds', true);
    loot.setAll('checkWorldBounds', true);
}

function createLootItem(sprite){
	let item = loot.create(0,0,sprite);
    item.anchor.setTo(0.5);
    item.kill();
}

function createOfficer(){
    officer = game.add.sprite(game.world.centerX, game.world.centerY, 'officer-move');
    game.physics.enable(officer, Phaser.Physics.ARCADE);
    officer.scale.set(1.7);
    officer.anchor.setTo(0.5);
    officer.body.setCircle(14);
    officer.body.offset.set(2,8);
    officer.body.immovable = true;
    officer.body.collideWorldBounds = true;
    officer.animations.add('move', [0,1,2,3,4,5,6,7]);
    officer.animations.add('headless', [0,1,2,3]);
    officer.animations.add('die', [0,1,2,3]);
    officer.rotation = getRandomValue(-180, 180);
}

function createWeapon(){
    weapon = game.add.sprite(game.world.centerX+250, game.world.centerY, 'pistol');
    game.physics.enable(weapon, Phaser.Physics.ARCADE);
    weapon.anchor.setTo(0.5);
}

function createEnemies(){
    enemies = game.add.physicsGroup(Phaser.Physics.ARCADE);
    addEnemies();
}

function addEnemies(){
    for(let i = 0; i < enemiesCount; i++){
        createEnemy(enemies, zombies[getRandomValue(0, zombies.length)]);
    }
    enemies.setAll('collideWorldBounds', true);
    enemies.setAll('checkWorldBounds', true);
}

function createEnemy(group, sprite){
	let axis = setEnemy();
    let enemy = group.create(axis.x, axis.y, sprite+'-idle');
    enemy.anchor.setTo(0.5);
    enemy.body.setCircle(25);
    enemy.body.offset.set((enemy.width-enemy.body.width)/2, (enemy.height-enemy.body.width)/2);
    enemy.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
    enemy.animations.add('move', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
    enemy.animations.add('attack', [0,1,2,3,4,5,6,7,8]);
    enemy.animations.play('idle', 15, true);
    enemy.overlappedWithFOV = false;
    enemy.collidedWithOfficer = false;
    enemy.rotation = getRandomValue(-180, 180);
    enemy.events.onKilled.add(enemyKillHandler, enemy);
    enemy.events.onAnimationComplete.add(hurtOfficer, enemy);
    enemy.events.onAnimationLoop.add(moveToOfficer, enemy);
}

function enemyKillHandler(){
	addPoints();
	addBlood.call(this);
}

function addBlood(){
	let remains = blood.getFirstDead();
    remains.reset(this.x, this.y);
    remains.lifespan = 20000;
    remains.animations.play('spray', 20, false);
}

function addLoot(){
	let drop;
	if(Math.random() > (100-dropChance)/100) {
		drop = Phaser.ArrayUtils.getRandomItem(loot.children.filter(function (e) { 
			return !e.alive;
		})).reset(this.x, this.y);
		drop.lifespan = 60000;
	}
}

function addPoints(){
	interface.score.setText(`${+interface.score.text+1}`);
}

function createDetectionArea(){
    circle = game.add.sprite(officer.x, officer.y, 'fov');
    game.physics.enable(circle, Phaser.Physics.ARCADE);
    circle.anchor.set(0.5);
    circle.body.width = innerWidth*0.7;
    circle.body.height = innerHeight*0.7;
    circle.body.offset.x = -circle.body.width/2;
    circle.body.offset.y = -circle.body.height/2; 
    circle.alpha = 0;
}

function createScore(){
    let style = {font: "35px Russo One", fill: "#ffffff", align: "center"};
    interface.iconScore = game.add.sprite(innerWidth*0.05, innerHeight*0.3, 'skull');
    interface.iconScore.fixedToCamera = true;
    interface.score = game.add.text(0, 0, '0', style);
    interface.score.alignTo(interface.iconScore, Phaser.RIGHT_CENTER, 30, 5);
    interface.score.anchor.setTo(0.5, 0);
    interface.score.fixedToCamera = true;
}

function createInterface(){
    let text = '10/10';
    let style = {font: "35px Russo One", fill: "#ffffff", align: 'center'};
    interface.weapon = game.add.sprite(innerWidth*0.05, innerHeight*0.05, currentSet.weaponPicture);
    interface.weapon.fixedToCamera = true;
    interface.iconAmmo = game.add.sprite(innerWidth*0.11, innerHeight*0.175, 'ammo');
    interface.iconAmmo.fixedToCamera = true;
    interface.ammo = game.add.text(0, 0, text, style);
    interface.ammo.anchor.set(0.5, 0);
    interface.ammo.alignTo(interface.iconAmmo, Phaser.LEFT_BOTTOM, 1, 5);
    interface.ammo.fixedToCamera = true;
    interface.iconAmmo.visible = false;
    interface.ammo.visible = false;
}

function createHP(){
    let text = `${officerHP}`;
    let style = {font: "35px Russo One", fill: "#ffffff", align: "center"};
    interface.iconHP = game.add.sprite(innerWidth*0.9, innerHeight*0.05, 'HP');
    interface.iconHP.fixedToCamera = true;
    interface.HP = game.add.text(0, 0, text, style);
    interface.HP.alignTo(interface.iconHP, Phaser.BOTTOM_CENTER, 30);
    interface.HP.anchor.setTo(0.5, 0);
    interface.HP.fixedToCamera = true;
}

function createTimer(){
	interface.rescueText = game.add.text(innerWidth*0.5, innerHeight*0.035,
		"You'll be rescued in:", {
			font: "30px Russo One",
			fill: "#ff8381",
			align: "center"
	});
	interface.rescueText.anchor.setTo(0.5);
	interface.rescueText.fixedToCamera = true;

    let timer = game.time.create(false);
    timer.loop(Phaser.Timer.SECOND, updateTimer, timer);
    timer.start();
}

function updateTimer(){
    let tmp = time.text.split(':');
    let min = tmp[0];
    let sec = tmp[1];
    if(min === '00'){
        if(sec === '01'){
            this.destroy();
            time.color = '#00ff00';
            accomplishRescue();
        }
        if(sec === '10'){
        	sounds.helicopter.fly.fadeIn(8000, true);
        	game.time.events.add(Phaser.Timer.SECOND*10, ()=>{
        		sounds.helicopter.fly.stop();
        		sounds.helicopter.stay.play('', 0, 0.6, true);
        		sounds.mainTheme.fadeTo(1000, 0.5);
        	}, this);
        }
    }
    if(sec === '00'){
    	addEnemies();
    	enemiesVelocity+=20;
    	circle.body.width += innerWidth*0.1;
    	circle.body.height += innerHeight*0.1;
        circle.body.offset.x -= innerWidth*0.05;
        circle.body.offset.y -= innerHeight*0.05;
        sec = '59';
        min = +min-1+'';
        if(min.length === 1)
            min = '0'+min;
    }    
    sec = +sec-1+'';
    if(sec.length === 1)
        sec = '0'+sec;

    time.text = min+':'+sec; 
}

function createHelicopter(){
    let axis = freeSpace();
    helicopter = game.add.sprite(axis.x, axis.y, 'helicopter');
    game.physics.enable(helicopter, Phaser.Physics.ARCADE);
    helicopter.anchor.setTo(0.65, 0.5);
    helicopter.body.immovable = true;
    helicopter.body.setCircle(130);
    helicopter.body.offset.set((helicopter.width-helicopter.body.width)/2+100, (helicopter.height-helicopter.body.width)/2);
    helicopter.animations.add('fly');
    helicopter.animations.play('fly', 35, true);
    helicopter.rotation = getRandomValue(-180, 180);
}

function freeSpace(){
    let axis = {
        x: 350,
        y: game.world.centerY
    }, x, y;
    if(game.world.width<2500 || game.world.height<1500)
        return axis;
    let edgeLeft = officer.body.x - innerWidth/2 - 250;
    let edgeRight = officer.body.x + innerWidth/2 + 250;
    let edgeTop = officer.body.y - innerHeight/2 - 250;
    let edgeBottom = officer.body.y + innerHeight/2 + 250;
    while(true){
        x = getRandomValue(250, game.world.width-250);
        y = getRandomValue(250, game.world.height-250);
        if((x < edgeLeft || x > edgeRight) ||
            (y < edgeTop || y > edgeBottom))
            break;
    }
    axis.x = x;
    axis.y = y;
    return axis;
}

function accomplishRescue(){
	createHelicopter();
	createArrow();
	helicopterArrived = true;
}

function setCamera(sprite){
    game.camera.follow(sprite, Phaser.Camera.FOLLOW_LOCKON);
}

function overlapWeaponHandler(officer, weapon) {
    weapon.destroy();
    currentSet = {
        weaponSelected: true,
        weaponPicture: 'pistol-img',
        officerTexture: 'officer-armed',
        numberOfCartridges: 10,
        maxNumberOfCartridges: 10,
        capacityOfClip: 10,
        speedCoefficient: 0.7,
        index: 1
    }
    armory.push(currentSet);
    updateInterface();
    updateOfficerTexture();
}

function overlapFireHandler(enemy, bullet){
    bullet.kill();
    enemy.kill();
    sounds.hit[`_${getRandomValue(1,4)}`].play();
}

function overlapEnemyHandler(circle, enemy){
    if(!enemy.overlappedWithFOV){
        enemy.overlappedWithFOV = true;
        enemy.loadTexture('zombie_03-move', 0, false);
        enemy.animations.play('move', 15, true);
        if(!win)
        	sounds.zombies[`roar_${getRandomValue(1,4)}`].play('', 0, 1, true);
    }
    rotateEnemyToTarget(enemy, officer);
    moveEnemyToTarget(enemy, officer);
}

function overlapHelicopterHandler(officer, helicopter){
    let x = game.world.width + 300;
    let y = getRandomValue(0, game.world.height);
    for(let roar in sounds.zombies){
    	if(sounds.zombies[roar].isPlaying){
    		sounds.zombies[roar].stop();
    	}
    }
    sounds.helicopter.stay.stop();
    sounds.helicopter.fly.play('', 0, 1, true);
    sounds.helicopter.fly.fadeOut(4000);
    stopMainTheme();
    circle.kill();
    setCamera(helicopter);
    cleanInterface();
    rotateHelicopterToXY(x, y);
    moveHelicopterToXY(x, y, 150);
    win = true;
    game.time.events.add(Phaser.Timer.SECOND*4, ()=>{game.state.start('end');}, this);
}

function stopMainTheme(){
	sounds.mainTheme.stop();
}

function cleanInterface(){
	[officer,
	interface.iconAmmo,
	interface.ammo,
	interface.iconHP,
	interface.HP,
    interface.iconScore,
    interface.score,
	interface.weapon,
	interface.rescueText,
	interface.arrow].forEach(item=>{item.kill()});
	game.debug.destroy();
}

function moveHelicopterToXY(x, y, speed){
    game.physics.arcade.moveToXY(helicopter, x, y, speed);
}

function rotateHelicopterToXY(x, y){
    helicopter.rotation = game.physics.arcade.angleToXY(helicopter, x, y);
}

function moveToOfficer(){
    this.loadTexture('zombie_03-idle', 0, false);
    this.animations.play('idle', 15, true);
    this.overlappedWithFOV = false;
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.body.angularVelocity = 0;
    for(let roar in sounds.zombies){
    	if(sounds.zombies[roar].isPlaying){
    		sounds.zombies[roar].stop();
    	}
    }
}

function collideDamageHandler(officer, enemy){
    if(!enemy.collidedWithOfficer){
        enemy.collidedWithOfficer = true;
        enemy.loadTexture('zombie_03-attack', 0, false);
        enemy.animations.play('attack', 18, false);
    }
}

function hurtOfficer(){
	if(officerAlive){
    	cameraFlash();
    	hurtHP();
	}
    this.collidedWithOfficer = false;
}

function cameraFlash() {
    game.camera.flash(0xff0000, 100);
}

function hurtHP(){
    officerHP -= damages;
	if(officerHP<0)
		officerHP=0;
    changeHP();
}

function changeHP(){
	if(officerHP <= 0){
		Math.random()>0.5 ? killOfficer('headless') : killOfficer('die');
		officerAlive = false;
	}
	interface.HP.setText(`${officerHP}`);
}

function killOfficer(animationName){
	officer.loadTexture('officer-'+animationName, 0, false);
	officer.animations.play(animationName, 16, false);
	stopMainTheme();
	game.time.events.add(Phaser.Timer.SECOND*2, ()=>{game.state.start('end')}, this);
}

function overlapLootHandler(officer, loot){
	if(loot.key === 'clip'){
        armory[1].maxNumberOfCartridges+=10;
        if(currentSet.index){
	       updateCartridges(false);
        }
		sounds.collect.ammo.play();
	}
	else{
		if(officerHP === 100) return;
		loot.key === 'kit' ? restoreHP(30) : restoreHP(10);
		changeHP();
		sounds.collect.health.play();
	}
	loot.kill();
}

function restoreHP(quantity){
	officerHP<=100-quantity ? officerHP+=quantity : officerHP = 100;
}

function mouseWheel(event){
    changeSet();
    updateInterface();
    updateOfficerTexture();
}

function changeSet(){
    let nextSet;

    if(armory.length===1) return;

    if(game.input.mouse.wheelDelta === Phaser.Mouse.WHEEL_UP){
        nextSet = (currentSet.index+1)!==armory.length ? currentSet.index+1 : 0;
    }
    else{
        nextSet = !currentSet.index ? armory.length-1 : currentSet.index-1;
    }
    currentSet = armory[nextSet];
    updateCartridges(false);
}

function updateInterface(){
    if(armory.length===1) return;
    interface.iconAmmo.visible = !!currentSet.index;
    interface.ammo.visible = !!currentSet.index;
    interface.weapon.loadTexture(currentSet.weaponPicture);
}

function updateOfficerTexture(){
    if(armory.length===1) return;
    officer.loadTexture(currentSet.officerTexture, 0);
}

function rotateEnemyToTarget(enemy, target){
    enemy.rotation = game.physics.arcade.angleBetween(enemy, target);
}

function moveEnemyToTarget(enemy, target){
    game.physics.arcade.moveToObject(enemy, target, enemiesVelocity);
}

function turnRoundToTarget(enemy, target){
    let rotation = game.physics.arcade.angleBetween(enemy, target);
    if(rotation>Math.abs(enemy.rotation)){
        while(rotation-Math.abs(enemy.rotation)>0.005){
            enemy.rotation += 0.001;
        }
    }
    else{
        while(rotation+Math.abs(enemy.rotation)<0.005){
            enemy.rotation -= 0.001;
        }
    }
    enemy.rotation = rotation;
}

function makeShot() {
    if (game.time.now > nextFire){
        makeBullet();
        makeFlash();
        sounds.shoot.play('', 0, 5);
        updateCartridges(true);
        nextFire = game.time.now + 700;
    }
}

function makeFlash() {
    !flash ? flash = game.add.sprite(officer.x, officer.y, 'flash') : flash.reset(officer.x, officer.y);
    flash.lifespan = 16;
    flash.rotation = officer.rotation;
    flash.anchor.setTo(-3, 0.4);
}

function makeBullet() {
    bullet.reset(officer.x, officer.y);
    bullet.lifespan = 700;
    bullet.rotation = officer.rotation;
    game.physics.arcade.velocityFromRotation(officer.rotation, 2000, bullet.body.velocity);
}

function updateCartridges(wasShot) {
    let text;
	if(wasShot){
		text = `${currentSet.numberOfCartridges>0 ? --currentSet.numberOfCartridges : 0}/${currentSet.maxNumberOfCartridges}`;
	}
	else{
		text = `${currentSet.numberOfCartridges}/${currentSet.maxNumberOfCartridges}`;
	}
    interface.ammo.setText(text);
}

function getRandomValue(min, max) {
  return ~~(Math.random() * (max - min)) + min;
}

function reload(){
	if(currentSet.maxNumberOfCartridges && currentSet.numberOfCartridges<currentSet.capacityOfClip){
		currentSet.maxNumberOfCartridges += currentSet.numberOfCartridges;
    	if(currentSet.maxNumberOfCartridges >= currentSet.capacityOfClip){
    		currentSet.numberOfCartridges = currentSet.capacityOfClip;
    		currentSet.maxNumberOfCartridges -= currentSet.capacityOfClip;
    	}
    	else if(currentSet.maxNumberOfCartridges < currentSet.capacityOfClip){
    		currentSet.numberOfCartridges = currentSet.maxNumberOfCartridges;
    		currentSet.maxNumberOfCartridges = 0;
    	}
    	game.time.events.add(Phaser.Timer.SECOND/2, ()=>{
    		sounds.reload.play('', 0, 3);
    		updateCartridges(false);
    	}, this);
	}
}

function setEnemy(){
	let axis = {x: 0, y: 0}, x, y;
	let edgeLeft = officer.body.x - innerWidth/2;
    let edgeRight = officer.body.x + innerWidth/2;
    let edgeTop = officer.body.y - innerHeight/2;
    let edgeBottom = officer.body.y + innerHeight/2;
    while(true){
        x = getRandomValue(10, game.world.width-10);
        y = getRandomValue(10, game.world.height-10);
        if((x < edgeLeft || x > edgeRight) ||
            (y < edgeTop || y > edgeBottom))
            break;
    }
    axis.x = x;
	axis.y = y;
	return axis;
}