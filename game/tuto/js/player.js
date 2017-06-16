/////////////////////////////////////////// 
// Player control

var player; // le joueur
var cercle; // Cercle de l'attaque Multi-Dash

var move = true; // check possibilité de déplacement 
var move_low = 0; // ralentissement du déplacement => différent situation ou skills

activeMulti_dash = false;
invulnerable = false;

/* enemies dans la zone de multidash */
var ataqueEnemies = [];

var P = {  
    x : 500,
    y : 4050,//4050,
    velocity : 300,
    dash_0 : 0,
    dash_max : 800,
    dash_diago : 600,

    preload : function(){
    	game.load.spritesheet('cube','../../img/cube_frame.png', 354, 405); // s_z_d_q_zd_zq_sd_sq
        game.load.image('cercle','../../img/cercle.png', 400, 400); 
    },
    sprite : function(){
        /* creation cercle Multi-Dash */
        cercle = game.add.sprite(this.x, this.y, 'cercle');
        game.physics.arcade.enable(cercle, Phaser.Physics.ARCADE);
        cercle.scale.setTo(0.001,0.001);
        //cercle.body.setCircle(100);
        cercle.anchor.setTo(0.5,0.5);

        /* create player */
        player = game.add.sprite(this.x, this.y, 'cube');
            /* frame animation*/
        player.animations.add('z',[1]);
        player.animations.add('q',[3]);
        player.animations.add('s',[0]);
        player.animations.add('d',[2]);

        player.animations.add('zq',[5]);
        player.animations.add('zd',[4]);
        player.animations.add('sq',[7]);
        player.animations.add('sd',[6]);
            
            /* paramètre player */
        game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;
        player.scale.setTo(0.1);
        player.anchor.setTo(1); 

        player.body.allowRotation = false;

    },
	action : function() {  
        //console.log(ataqueEnemies);
        /* player move*/
        
            /* standard */
        player.animations.play('s');
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        cercle.x = player.x;
        cercle.y = player.y;

            /* Deplacement: fleches directionnelles */
        if (toucheZ.isDown && move == true){
            player.body.velocity.y = -this.velocity + move_low;
            Dash(this.dash_0, -this.dash_max);
            player.animations.play('z');
        }else if (toucheS.isDown && move == true){
            player.body.velocity.y = this.velocity - move_low;
            Dash(this.dash_0, this.dash_max);
            player.animations.play('s');
        }

        if (toucheQ.isDown && move == true){
            player.body.velocity.x = -this.velocity + move_low;
            
            if(toucheZ.isDown){
                Dash(-this.dash_diago, -this.dash_diago);
                player.animations.play('zq');
            }else if(toucheS.isDown){
                Dash(-this.dash_diago, this.dash_diago);
                player.animations.play('sq');
            }else{
                Dash(-this.dash_max, this.dash_0);
                player.animations.play('q');
            }
        }else if (toucheD.isDown && move == true){
            player.body.velocity.x = this.velocity - move_low;
            
            if(toucheZ.isDown){
                Dash(this.dash_diago, -this.dash_diago);
                player.animations.play('zd');
            }else if(toucheS.isDown){
                Dash(this.dash_diago, this.dash_diago);
                player.animations.play('sd');
            }else{
                Dash(this.dash_max, this.dash_0);
                player.animations.play('s');
            }
        }   

            /* Cercle Multi-dash */ 


        enemiesCible = [];

        if(toucheK.isDown && activeK == true){
            scale(cercle);
            activeMulti_dash = true;     
            //console.log(activeMulti_dash);
            if(activeMulti_dash == true){
                for(var i = 0; i < enemytuto.length; i++){
                    
                    if(checkOverlap(cercle, enemytuto[i].enemy1)){
                        if(enemytuto[i].heart.alpha == 1){
                            //enemytuto[i].heart.alpha = 0.7;
                            enemiesCible.push(enemytuto[i].enemy1);
                        }        
                    }else{
                        
                    }
                }
                ataqueEnemies = enemiesCible;
            }else{
                //console.log(ataqueEnemies);
                //activeMulti_dash = false; 
            } 

            if(move_low < P.velocity - 50){
               move_low += 3; 
            }

        }else{
            reduce(cercle);
            move_low = 0;

            //console.log(activeMulti_dash)
            /*if(activeMulti_dash = true){
                //console.log(activeMulti_dash);
               // miltiDash((enemies[0].enemy1.x - player.x) * 5, (enemies[0].enemy1.y - player.y) * 5); 
            }*/
            //console.log(activeMulti_dash);
            if(activeMulti_dash == true){
                if(enemiesCible[0] == []){
                    //console.log('azq')
                    
                }else{
                     console.log('azq')
                    multiDash((ataqueEnemies[0].x - player.x) * 5, (ataqueEnemies[0].y - player.y) * 5);
                }
                
                
            }else{
                
            }
            activeMulti_dash = false;

        }  
    }
}

/* Dash normal / esquive */
function Dash(dash_x, dash_y){
    //console.log('erza');
    
    if(activeJ == true){
        toucheDash.onDown.add(function(){   
            move = false;
            invulnerable = true;
            var e = game.add.tween(player.body.velocity);
                e.to({ x: dash_x, y: dash_y }, 400, Phaser.Easing.Cubic.Out);
                e.start();
                e.onComplete.add(function(){
                    move = true;  
                    invulnerable = false;    
                }, this)
        });  
    } 
}
function multiDash(dash_x, dash_y){
    if(activeK == true){
        toucheK.onUp.add(function(){   
            move = false;
            invulnerable = true;
            var e = game.add.tween(player.body.velocity);
                e.to({ x: dash_x, y: dash_y }, 400, Phaser.Easing.Cubic.Out);
                e.start();
                e.onComplete.add(function(){
                    move = true; 
                    enemiesCible = [];  
                    invulnerable = false;   
                }, this)
        });  
    } 
}

/* Scale du cercle Multi-Dash */
function reduce(trans){
    game.add.tween(trans.scale).to( { x: 0.001, y: 0.001 }, 100, Phaser.Easing.Linear.None,true);
}
function scale(trans){
    game.add.tween(trans.scale).to( { x: 1, y: 1 }, 250, Phaser.Easing.Linear.None, true);
}

function scalereduce(trans){
    var t = game.add.tween(trans.scale).to( { x: 1, y: 1 }, 400, Phaser.Easing.Linear.None,true);  
    t.onComplete.add(function(){
        var f = game.add.tween(trans.scale).to( { x: 0, y: 0 }, 500, Phaser.Easing.Linear.None, true);
    }, this)  
}