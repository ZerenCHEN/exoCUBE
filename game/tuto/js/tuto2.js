/////////////////////////  
// Stage Tuto 2

tuto2 = true;
/* Teste de dash entrainement */

var game = new Phaser.Game(
	window.innerWidth, 
	window.innerHeight, 
	Phaser.AUTO, 
	'', 
	{ preload: preload, 
	  create: create, 
	  update: update // ,render : render
	});


/* variable */
var counter = 0;
var activeJ = true;
var activeK = false;

var terrain;
var cercleaide;
var cercleactivek;
var lueurnoir;

/* var creation ponts */
var plat_ponts; // group
var index = 0; // index rechercher

var pont_width = 200;
var pont_distance = -120;
var scale_x = 1;
var scale_y = 1;


var timer_repeat;

/* paramètre ponts */
Pont = function(index, game){

	var x = game.world.centerX;
	var y = game.world.centerY + pont_distance;

	this.game = game;
	this.pont = plat_ponts.create(x, y, 'pont');
	this.pont.scale.set(scale_x, scale_y);
	this.pont.anchor.set(0.5);
}



//////////////////////////////////////////////
// Preload()
function preload() {
	/* player preload */
	P.preload();
    
    /* ennemies preload */
    Enemy.preload();

    /* image necessaire pour ce stage tuto */
	game.load.image('terrain', '../../img/map/cercledudebut.png');
	game.load.spritesheet('cercleaide', '../../img/map/cercleaide.png', 100, 100);
	game.load.spritesheet('activek','../../img/map/activek.png', 200, 200);
	game.load.spritesheet('lueur_noir', '../../img/map/lueur_noir.png', 300,300);

	game.load.image('pont', '../../img/map/pont.png');
	game.load.image('end', '../../img/map/end.png');

}


//////////////////////////////////////////////
// Create()
function create() {
	/* game elements*/
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.stage.backgroundColor = '5A5A4B';
	game.world.setBounds(0, 0, 1000, 7200);



	/* ponts group */
	plat_ponts = game.add.group();

	/* create terrains en cercle */
	terrain = game.add.sprite(game.world.centerX, game.world.centerY + pont_width, 'terrain');
	game.physics.arcade.enable(terrain, Phaser.Physics.ARCADE);
	terrain.body.setCircle(380);
	terrain.anchor.setTo(0.5,0.5);
	terrain.scale.setTo(0.8,0.8);

	terrain2 = game.add.sprite(game.world.centerX, game.world.centerY + pont_width - 680, 'terrain');
	game.physics.arcade.enable(terrain2, Phaser.Physics.ARCADE);
	terrain2.body.setCircle(380);
	terrain2.anchor.setTo(0.5,0.5);
	terrain2.scale.setTo(1,1);
	
	/* create cercleaide */ 
	cercleaide = game.add.sprite(game.world.centerX, game.world.centerY + pont_width, 'cercleaide');
	cercleaide.animations.add('off',[0]);
    cercleaide.animations.add('on',[1]);
    cercleaide.anchor.setTo(0.5);
    cercleaide.scale.setTo(0.6);

    lueurnoir = game.add.sprite(game.world.centerX, game.world.centerY + pont_width, 'lueur_noir');
	lueurnoir.animations.add('activelueur_noir',[0,1]);
    lueurnoir.anchor.setTo(0.5);
    lueurnoir.scale.setTo(0.2);

    /* point de passage au niveau suivant */
    end = game.add.sprite(game.world.centerX, 0, 'end');
	end.anchor.setTo(0.5);
	end.scale.setTo(0.7);
	

	/* create ponts */
    pontcreation();

	/* create player sprite */
	P.sprite();
	/* create ennemies sprite */
	Enemy.create();


	/* Other create*/
	Keyboard();	
	game.camera.follow(player);

	/* hover l'indicateur K */ 
	cercleactivek = game.add.sprite(cercleaide.x, cercleaide.y, 'activek');
	cercleactivek.animations.add('off',[0]);
    cercleactivek.animations.add('on',[1,2]);
	cercleactivek.anchor.setTo(0.5);
	cercleactivek.scale.setTo(0.3);

}



//////////////////////////////////////////////
// Update()
function update() {

	/* update personnage et ennemi */
	P.action();	
	Enemy.update();


	/* affichage de la bulle aide */
	
	cercleaide.animations.play('on');
	cercleactivek.animations.play('on');

	if(enemytuto[0].enemy1.alive == true){
		cercleactivek.animations.play('off');
	}else{
		if(checkOverlap(player, cercleaide)){
			cercleaide.animations.play('on');
			cercleactivek.animations.play('on');
		
			if(activeK == false){
				scaleloop(cercleactivek);
				if(toucheK.isDown){
					scalereduce(cercleactivek);
					activeK = true;
				}
			}	
		}else{
			cercleaide.animations.play('off');
			cercleactivek.animations.play('off');
		}
	}
	


	/* quand pont contacte, le pont s'écroule 1 par 1*/
	/*if(checkOverlap(player, plat_ponts.children[5]) && activedestructionpont == false){
		activedestructionpont = true;
		console.log(activedestructionpont);
		
		game.time.events.repeat(85, plat_ponts.children.length, pontdestruction, this, plat_ponts.children);
		game.time.events.start();	
	}*/
	
	/* passage niveau suivant */
	if(checkOverlap(player, end)){
		document.location.href = "tutomodesurvie.html";
	}


	/* La mort: gestion de la mort si en dehors du terrain de jeu */ 
	if(checkOverlap(player, plat_ponts) || checkOverlap(terrain, player) || checkOverlap(terrain2, player)){
		//console.log('yep');
	}else{
		console.log('mort');
		dead(); 
	}

	
	for(var i = 0; i < enemytuto.length; i++){
		if(invulnerable == true && checkOverlap(enemytuto[i].heart, player)){
			enemytuto[i].enemy1.x = 0;
			enemytuto[i].enemy1.y = 0;

			console.log('hello');
			enemytuto[i].enemy1.kill();
			enemytuto[i].heart.kill();
			enemytuto[i].weapon.kill();
			
			//lueurnoir.kill();	
		}
	}
	

	if(invulnerable == true && checkOverlap(enemytuto[0].heart, player)){
		console.log('hello')	
		enemytuto[0].enemy1.kill();
		enemytuto[0].heart.kill();
		enemytuto[0].weapon.kill();
		lueurnoir.kill();	
	}

}



//////////////////////////////////////////////
// other function


/* function banal */
function render() {
	game.debug.spriteCoords(player, 32, 500);
  	
    game.debug.body(player);
    /*ennemi1.forEach(function(enemy) {
		game.debug.body(enemy);
    })*/

    //game.debug.body(terrain);
}
function Counter() {
    counter++;
    console.log(counter);
}
function checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Rectangle.intersects(boundsA, boundsB);
}
function Keyboard(){
    //fleche = game.input.keyboard.createCursorKeys();
    toucheQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    toucheD = game.input.keyboard.addKey(Phaser.Keyboard.D);
    toucheZ = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    toucheS = game.input.keyboard.addKey(Phaser.Keyboard.S);
    
    toucheK = game.input.keyboard.addKey(Phaser.Keyboard.K);

    toucheDash = game.input.keyboard.addKey(Phaser.Keyboard.J);
    toucheSPACE = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}	

/* autre fonctions */
/* la mort */
function dead(){

	if(checkOverlap(player, terrain)){
		console.log('safe');
	}else {
		player.x = cercleaide.x;
		player.y = cercleaide.y;
	}
}
/* les function en rapport avec le Pont*/
function pontcreation(){
	pontTotal = 80;

	for (var i = 0; i < pontTotal; i++)
    {
    	new Pont(i, game);
       	pont_distance -= 50;
       	scale_x -= 0.01;
    }
}
function pontdestruction(group){
	console.log(index);
	var newTabs = group[index];
	var p = game.add.tween(newTabs.scale).to({x: 0, y:0}, 1000, Phaser.Easing.Linear.None);
	p.start();
	index++;
}

/* En rapport avec le cercle aide */ 
var oui = 1;
function scaleloop(cercleactive){

    if(oui == 0){
    	cercleactive.scale.x -= 0.02;
    	cercleactive.scale.y -= 0.01;
    	if(cercleactive.scale.x <= 0.20){
    		oui = 1;
    	}
    }
    if(oui == 1){
    	cercleactive.scale.x += 0.02;
    	cercleactive.scale.y += 0.01;
    	if(cercleactive.scale.x >= 0.40){
    		oui = 0;
    	}
    }
}
