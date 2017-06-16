///////////////////////////////////   
// Enemies

//Paramètre de l'ennemi
Enemy1 = function(index, game, player, dash, pos_x, pos_y){

	var x = pos_x;
    var y = pos_y;
    
    this.game = game;
    this.health = 1;
    this.player = player;
    this.dash = dash;
    this.dashRate = 1000;
    this.nextDash = 0;
    this.alive = true;

    this.cible = false;

    this.heart = game.add.sprite(x, y, 'heart'); 
    this.enemy1 = game.add.sprite(x, y, 'enemy1');
    this.weapon = game.add.sprite(x, y, 'weapon');

    this.heart.anchor.set(0.5);
    this.heart.scale.set(0.3);
    this.enemy1.anchor.set(0.5);
    this.enemy1.scale.set(0.3);
    this.weapon.anchor.set(0.5, 0.5);
    this.weapon.scale.set(0.3);

    this.enemy1.name = index.toString();
    game.physics.enable(this.enemy1, Phaser.Physics.ARCADE);
    this.enemy1.body.immovable = false;
    this.enemy1.body.collideWorldBounds = true;
    this.enemy1.body.bounce.setTo(1, 1);

    //this.enemy1.angle = game.rnd.angle();

    //game.physics.arcade.velocityFromRotation(this.enemy1.rotation, 100, this.enemy1.body.velocity);
}

// fonction de la mort de l'ennemi 
Enemy1.prototype.damage = function() {

    this.health -= 1;

    if (this.health <= 0)
    {
        this.alive = false;

        this.heart.kill();
        this.enemy1.kill();
        this.weapon.kill();

        return true;
    }

    return false;
}

/* fonction mettre en forme l'ennemi */
Enemy1.prototype.update = function() {

    this.heart.x = this.enemy1.x;
    this.heart.y = this.enemy1.y;

    this.weapon.x = this.enemy1.x;
    this.weapon.y = this.enemy1.y;
    this.weapon.rotation = this.game.physics.arcade.angleBetween(this.enemy1, this.player);
    this.enemy1.rotation = this.game.physics.arcade.angleBetween(this.enemy1, this.player);

    /*if (this.game.physics.arcade.distanceBetween(this.enemy1, this.player) < 300)
    {
        if (this.game.time.now > this.nextFire && this.dash.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.dashRate; // temps de tire

            var dash = this.dash.getFirstDead(); 
            dash.reset(this.weapon.x, this.weapon.y);
            dash.rotation = this.game.physics.arcade.moveToObject(dash, this.player, 500);
        }
    }*/
};

/* differentes variable */

/* variable body */
var enemies;
var enemyweapon;
var enemiesTotal = 0;
var enemiesAlive = 0;

var enemytuto = [];

/* vairable attaque*/ 
var dash;
var fireRate = 100;
var nextFire = 0;

/* Fonction création de l'ennemi */
var Enemy = {

	preload : function(){
		game.load.image('enemy1', '../../img/enemies/enemy1/body.png');

    	game.load.image('weapon', '../../img/enemies/enemy1/weapon.png');
    	game.load.image('heart', '../../img/enemies/heart.png')

    	//game.load.spritesheet('kaboom', 'assets/games/tanks/explosion.png', 64, 64, 23);
	},
	create : function(){
		enemyweapon = game.add.group();
    	enemyweapon.enableBody = true;
    	enemyweapon.physicsBodyType = Phaser.Physics.ARCADE;

    	//  Create some baddies to waste :)

        enemies = [];

    	enemiesTotal = 0;
    	enemiesAlive = 2;

    	for (var i = 0; i < enemiesTotal; i++)
    	{
        	enemies.push(new Enemy1(i, game, player, enemyweapon, game.world.randomX, game.world.randomY));
    	}

        if(tuto2 == true){
            enemytuto.push(new Enemy1(0, game, player, enemyweapon, cercleaide.x, cercleaide.y));

            enemytuto.push(new Enemy1(1, game, player, enemyweapon, terrain2.x-100, terrain2.y-100));
            enemytuto.push(new Enemy1(2, game, player, enemyweapon, terrain2.x+100, terrain2.y-100));
            enemytuto.push(new Enemy1(3, game, player, enemyweapon, terrain2.x-100, terrain2.y+100));
            enemytuto.push(new Enemy1(4, game, player, enemyweapon, terrain2.x+100, terrain2.y+100));
        }


        
	},
	update : function(){

		game.physics.arcade.overlap(enemyweapon, player, bulletHitPlayer, null, this);

    	enemiesAlive = 0;

		for (var i = 0; i < enemies.length; i++){
        	if (enemies[i].alive){
            	enemiesAlive++;
            	game.physics.arcade.collide(player, enemies[i]);
            	game.physics.arcade.overlap(dash, enemies[i].heart, bulletHitEnemy, null, this);
            	enemies[i].update();
        	}
    	}
	}

}

/* */
function bulletHitPlayer (tank, bullet) {
    dash.kill();
}

function bulletHitEnemy (tank, bullet) {

    dash.kill();

    var destroyed = enemies[tank.name].damage();

    if (destroyed)
    {
    	console.log('mort de l\'ennemi');
        //var explosionAnimation = explosions.getFirstExists(false);
        //explosionAnimation.reset(tank.x, tank.y);
        //explosionAnimation.play('kaboom', 30, false, true);
    }

}