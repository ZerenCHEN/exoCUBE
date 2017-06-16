/////////////////////////  
// Stage Tuto 1

tuto2 = false;
/* Teste de dash entrainement */

var game = new Phaser.Game(
	window.innerWidth, 
	window.innerHeight, 
	Phaser.AUTO, 
	'', 
	{ preload: preload, 
	  create: create, 
	  update: update //,render : render
	});


/* variable */
var counter = 0;
var activeJ = false;
var activeK = true;

var terrain;
var terrain2;
var cercleaide;
var cercleactivej;


/* var creation ponts */
var plat_ponts; // group
var index = 0; // index rechercher

var pont_width = 200;
var pont_distance = -120;
var scale_x = 1;
var scale_y = 1;

var activedestructionpont = false;

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

	game.load.image('terrain', '../../img/map/cercledudebut.png');
	game.load.spritesheet('cercleaide', '../../img/map/cercleaide.png', 100, 100);
	game.load.spritesheet('activej','../../img/map/activej.png', 200, 200);

	game.load.image('pont', '../../img/map/pont.png');
	game.load.image('end', '../../img/map/end.png');
}


//////////////////////////////////////////////
// Create()
function create() {
	/* game elements*/
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.stage.backgroundColor = '5A5A4B';
	game.world.setBounds(0, 0, 1000, 5000);

	/* ponts group */
	plat_ponts = game.add.group();

	/* create terrain */
	terrain = game.add.sprite(game.world.centerX, game.world.centerY + pont_width, 'terrain');
	game.physics.arcade.enable(terrain, Phaser.Physics.ARCADE);
	terrain.body.setCircle(380);
	terrain.anchor.setTo(0.5,0.5);
	terrain.scale.setTo(0.8,0.8);

	/* create cercleaide */ 
	cercleaide = game.add.sprite(game.world.centerX, game.world.centerY + pont_width, 'cercleaide');
	cercleaide.animations.add('off',[0]);
    cercleaide.animations.add('on',[1]);
    cercleaide.anchor.setTo(0.5);
    cercleaide.scale.setTo(0.6);


    end = game.add.sprite(game.world.centerX, 0, 'end');
	end.anchor.setTo(0.5);
	end.scale.setTo(0.7);
	
	/* create ponts */
    pontcreation();
	
	/* create player sprite */
	P.sprite();
	/* create ennemies sprite */
	Enemy.create();

	/* keyboard create*/
	Keyboard();	
	game.camera.follow(player);

	/* hover l'indicateur J */ 
	cercleactivej = game.add.sprite(cercleaide.x, cercleaide.y, 'activej');
	cercleactivej.animations.add('off',[0]);
    cercleactivej.animations.add('on',[1,2]);
	cercleactivej.anchor.setTo(0.5);
	cercleactivej.scale.setTo(0.3);

	//cercleactivej.tint = 0xf4a01d ;
}



//////////////////////////////////////////////
// Update()
function update() {
	P.action();	

	Enemy.update();


	/* affichage de la bulle aide */
	if(checkOverlap(player, cercleaide)){
		cercleaide.animations.play('on');
		cercleactivej.animations.play('on');
		if(activeJ == false){
			scaleloop(cercleactivej);
			if(toucheDash.isDown){
				scalereduce(cercleactivej);
				activeJ = true;
			}
		}		
	}else{
		cercleaide.animations.play('off');
		cercleactivej.animations.play('off');
	}

	/* suppression pont si taille inférieur à 0.3 */
	for (var i = 0; i < pontTotal; i++)
    {
    	if(plat_ponts.children[i].scale.x < 0.3){
    		plat_ponts.children[i].kill();
    	}
    }

	/* quand pont contacte, le pont s'écroule 1 par 1*/
	if(checkOverlap(player, plat_ponts.children[5]) && activedestructionpont == false){
		activedestructionpont = true;
		console.log(activedestructionpont);
		
		game.time.events.repeat(85, plat_ponts.children.length, pontdestruction, this, plat_ponts.children);
		game.time.events.start();	
	}
	
	if(checkOverlap(player, end)){
		document.location.href = "tuto2.html";
	}


	/* gestion de la mort si en dehors du terrain de jeu */ 
	if(checkOverlap(player, plat_ponts) || checkOverlap(terrain, player)){
		//console.log('yep');
	}else{
		console.log('mort');
		dead(); 

		activedestructionpont = false;

		//timer_repeat.timer.destroy();
		game.time.events.stop();

		index = 0;
		plat_ponts.children = [];
		scale_x = 1;
		scale_y = 1;
		pont_width = 200;
		pont_distance = -120;
		pontcreation();

	}
}


//////////////////////////////////////////////
// other function
function render() {
	game.debug.spriteCoords(player, 32, 500);
  	
    game.debug.body(player);
    /*ennemi1.forEach(function(enemy) {
		game.debug.body(enemy);
    })*/

    game.debug.body(terrain);
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

    toucheSPACE = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    toucheDash = game.input.keyboard.addKey(Phaser.Keyboard.J);
}	

function dead(){

	if(checkOverlap(player, terrain)){
		console.log('safe');
	}else {
		player.x = cercleaide.x;
		player.y = cercleaide.y;
	}
}


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