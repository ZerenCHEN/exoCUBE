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


//////////////////////////////////////////////
// Preload()
function preload() {
	/* player preload */
	P.preload();
    
    /* ennemies preload */
    Enemy.preload();

}


//////////////////////////////////////////////
// Create()
function create() {
	/* game elements*/
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.stage.backgroundColor = 'dddddd';
	
	/* create player sprite */
	P.sprite();
	
	/* create ennemies sprite */
	Enemy.create();

	/* keyboard create*/
	Keyboard();	
}


//////////////////////////////////////////////
// Update()
function update() {
	P.action();

	Enemy.update();
	/* overlap player and annemies*/
	/*game.physics.arcade.overlap(player, ennemi1, function(player, enemy) {
		console.log('yep');
	})*/
}


//////////////////////////////////////////////
// other function
function render() {
	game.debug.spriteCoords(player, 32, 500);
  	
    game.debug.body(player);
    /*ennemi1.forEach(function(enemy) {
		game.debug.body(enemy);
    })*/
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

