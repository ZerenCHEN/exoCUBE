/////////////////////////  
// Stage Tuto 2

var tuto2 = true;
var batton;


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
var activeJ = true;
var activeK = true;

var cercleaide;
var cercleactiveSurvie;


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
	game.load.image('terraincarre', '../../img/map/terraincarre.png');
	game.load.spritesheet('cercleaide', '../../img/map/cercleaide.png', 100, 100);
	game.load.spritesheet('activek','../../img/map/activek.png', 200, 200);
	game.load.spritesheet('lueur_noir', '../../img/map/lueur_noir.png', 300,300);

	game.load.image('pont', '../../img/map/pont.png');
	game.load.image('end', '../../img/map/end.png');

	game.load.image('batton', '../../img/map/batton.png');
}


//////////////////////////////////////////////
// Create()
function create() {
	/* game elements*/
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.stage.backgroundColor = '5A5A4B';
	game.world.setBounds(0, 0, 10000, 7200);


	/* ponts group */
	plat_ponts = game.add.group();
	batton = game.add.physicsGroup();
	/* create terrains en cercle */
	terrain = game.add.sprite(game.world.centerX, game.world.centerY + pont_width, 'terraincarre');
	game.physics.arcade.enable(terrain, Phaser.Physics.ARCADE);
	terrain.anchor.setTo(0.5);


	terrain2 = game.add.sprite(game.world.centerX, game.world.centerY + pont_width - 1000, 'terrain');
	game.physics.arcade.enable(terrain2, Phaser.Physics.ARCADE);
	terrain2.anchor.setTo(0.5);
	terrain2.scale.setTo(1);

	terrain3 = game.add.sprite(game.world.centerX - 601, game.world.centerY + pont_width - 1000, 'terrain');
	game.physics.arcade.enable(terrain3, Phaser.Physics.ARCADE);
	terrain3.anchor.setTo(0.5);
	terrain3.scale.setTo(0.5);

	terrain4 = game.add.sprite(game.world.centerX - 1000, game.world.centerY + pont_width - 1000 -500, 'terrain');
	game.physics.arcade.enable(terrain4, Phaser.Physics.ARCADE);
	terrain4.anchor.setTo(1);
	terrain4.scale.setTo(0.5);
	
	terrain5 = game.add.sprite(game.world.centerX - 1000 - 200, game.world.centerY + pont_width - 1000 - 600, 'terrain');
	game.physics.arcade.enable(terrain5, Phaser.Physics.ARCADE);
	terrain5.anchor.setTo(0.5);
	terrain5.scale.setTo(0.5);

	/* create cercleaide */ 
	cercleaide = game.add.sprite(game.world.centerX, game.world.centerY + pont_width, 'cercleaide');
	cercleaide.animations.add('off',[0]);
    cercleaide.animations.add('on',[1]);
    cercleaide.anchor.setTo(0.5);
    cercleaide.scale.setTo(0.6);
	
    batton2 = game.add.sprite(game.world.centerX, game.world.centerY + pont_width - 1000, 'batton');
    game.physics.arcade.enable(batton2, Phaser.Physics.ARCADE);
	batton2.anchor.setTo(1, 0.5);

	/*batton = game.add.sprite(game.world.centerX, game.world.centerY + pont_width, 'batton');
    game.physics.arcade.enable(batton, Phaser.Physics.ARCADE);
	batton.anchor.setTo(1, 0.5);*/


	/* create ponts */
    pontcreation();

	/* create player sprite */
	P.x = 5000;
	P.sprite();


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

	if(invulnerable == true){
		player.alpha = 0.5;
	}else{
		player.alpha = 1;
	}

	/* La mort: gestion de la mort si en dehors du terrain de jeu */ 
	if(checkOverlap(player, plat_ponts) || checkOverlap(terrain, player) || checkOverlap(terrain2, player) 
		|| checkOverlap(terrain3,player) || checkOverlap(terrain4,player) || checkOverlap(terrain5, player)){
		//console.log('yep');
	}else{
		console.log('mort');
		dead(); 
	}

	mobileterrain(terrain3, 400, 0, 4000, 4399);
	terrain4.body.angularVelocity = -40;
	mobileterrain(terrain5, 400, 0, 4300, 4800);

	//batton.body.angularVelocity = -100;
	
	batton2.body.angularVelocity = -100;

	

	if(checkOverlap(player, batton2) && invulnerable == false){
		dead(); 
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


/* terrain mobile */
function mobileterrain(terrain, x, y, x_min, x_max, y_min, y_max){

    var e = game.add.tween(terrain.body.velocity);	
        if(terrain.x >= x_max){
        	e.to({ x: -x}, 400, Phaser.Easing.Linear.None, true, 0, 1000, true);
        }	
        if(terrain.x <= x_min){
        	e.to({ x: x}, 400, Phaser.Easing.Linear.None, true, 0, 1000, true);
        }
        if(terrain.y >= y_max){
        	e.to({ y: -y}, 400, Phaser.Easing.Linear.None, true, 0, 1000, true);
        }
        if(terrain.y <= y_min){
        	e.to({ y: y}, 400, Phaser.Easing.Linear.None, true, 0, 1000, true);
        }
};  

     

