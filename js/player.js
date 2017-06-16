/////////////////////////////////////////// 
// Player control

var player; // le joueur
var cercle; // Cercle de l'attaque Multi-Dash

var move = true; // check possibilité de déplacement 
var move_low = 0; // ralentissement du déplacement => différent situation ou skills

var P = {  
    x : window.innerWidth * 0.30,
    y : window.innerHeight * 0.70,
    velocity : 300,

    preload : function(){
    	game.load.spritesheet('cube','img/cube_frame.png', 354, 405); // s_z_d_q_zd_zq_sd_sq
        game.load.image('cercle','img/cercle.png', 400, 400); 
    },
    sprite : function(){
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
        player.scale.setTo(0.1,0.1);
        player.anchor.setTo(0.5,0.5); 

        player.body.allowRotation = false;

            /* creation cercle Multi-Dash */
        cercle = game.add.sprite(this.x, this.y, 'cercle');
        game.physics.arcade.enable(cercle, Phaser.Physics.ARCADE);
        cercle.scale.setTo(0.001,0.001);
        //cercle.body.setCircle(100);
        cercle.anchor.setTo(0.5,0.5);
    },
	action : function() {  
        
        /* player move*/
        
            /* standard */
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        cercle.x = player.x;
        cercle.y = player.y;

            /* Deplacement: fleches directionnelles */
        if (toucheZ.isDown && move == true){
            player.body.velocity.y = -this.velocity + move_low;
            Dash(0, -1500);
            player.animations.play('z');
        }else if (toucheS.isDown && move == true){
            player.body.velocity.y = this.velocity - move_low;
            Dash(0, 1500);
            player.animations.play('s');
        }

        if (toucheQ.isDown && move == true){
            player.body.velocity.x = -this.velocity + move_low;
            
            if(toucheZ.isDown){
                Dash(-1500, -1500);
                player.animations.play('zq');
            }else if(toucheS.isDown){
                Dash(-1500, 1500);
                player.animations.play('sq');
            }else{
                Dash(-1500, 0);
                player.animations.play('q');
            }
        }else if (toucheD.isDown && move == true){
            player.body.velocity.x = this.velocity - move_low;
            
            if(toucheZ.isDown){
                Dash(1500, -1500);
                player.animations.play('zd');
            }else if(toucheS.isDown){
                Dash(1500, 1500);
                player.animations.play('sd');
            }else{
                Dash(1500, 0);
                player.animations.play('s');
            }
        }   

            /* Cercle Multi-dash */ 
        if(toucheK.isDown){
            scale(cercle);
            if(move_low < P.velocity - 50){
               move_low += 3; 
            }
        }else{
            reduce(cercle);
            move_low = 0;
        }


        //ball.body.velocity.x = (ball.x - player.x) * (5 + 0.8 * reception_counter);
        //ball.body.velocity.y = (ball.y - player.y) * (5 + 0.8 * reception_counter);

        
        /* direction de la balle au reception 
        if(control1 == true){
            ball.body.velocity.x = 0;
            reduce(cercle);        
            reinit(player, cercle); 
            ball.anchor.setTo(0.5,0.5);

            if(toucheQ.isDown){
                angle -= 0.15;
            }else if(toucheD.isDown){
                angle += 0.15;
            }

            //distance de la balle (au reception)
            //ball.x = player1.x + (distance + 5 * reception_counter) * Math.cos(angle);
            //ball.y = player1.y + (distance + 5 * reception_counter)* Math.sin(angle);
        } */
    }
}

/* Dash normal / esquive */
function Dash(dash_x, dash_y){
    //console.log('erza');
        
    toucheJ = toucheDash.onDown.add(function(){   
    move = false;

    var e = game.add.tween(player.body.velocity);
        e.to({ x: dash_x, y: dash_y }, 400, Phaser.Easing.Cubic.Out);
        e.start();
        e.onComplete.add(function(){
            move = true;      
        }, this)
    });
}


/* Scale du cercle Multi-Dash */
function reduce(trans){
    game.add.tween(trans.scale).to( { x: 0.001, y: 0.001 }, 100, Phaser.Easing.Linear.None,true);
}
function scale(trans){
    game.add.tween(trans.scale).to( { x: 1, y: 1 }, 250, Phaser.Easing.Linear.None, true);
}




/*
function move(player, up, down, left, right, velocity){

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    //cercle.body.velocity.x = 0;
    //cercle.body.velocity.y = 0;


    if (up.isDown){
        player.body.velocity.y = -velocity;
        //cercle.body.velocity.y = -velocity;
    }else if (down.isDown){
        player.body.velocity.y = velocity;
        //cercle.body.velocity.y = velocity;
    }

    if (left.isDown){
        player.body.velocity.x = -velocity;
        //cercle.body.velocity.x = -velocity;
    }else if (right.isDown){
        player.body.velocity.x = velocity;
        //cercle.body.velocity.x = velocity;
    }    
}*/