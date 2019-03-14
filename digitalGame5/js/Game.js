"use strict";

BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
    /*
    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)
    
    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    */
    
    // For optional clarity, you can initialize
    // member variables here. Otherwise, you will do it in create().
    //this.bouncy = null;
};

var player;
var MAXmoveSpeed = 500;
var MAXAirSpeed = 400;
var score = 0;
var endScore;

var cursors;
var leftKey, rightKey, jumpKey, downKey;
var rKey;

var president;
var isPresMoving = false;
var isAlive = true;
var xDest;
var xMax;

var bullets;

var timer = 0;

var numBullet = 0;

var scoreText;
var deathText;

var noise_shoot, noise_score, noise_dead;

BasicGame.Game.prototype = {

    create: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#ffffff", align: "center" };
        scoreText = this.game.add.text(150, 20, "Bullets Blocked: 0", style);
        scoreText.anchor.setTo( 0.5, 0.0 );

        deathText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 100, "PRESS R TO RESET", style);
        deathText.anchor.setTo(0.5, 0.5);
        deathText.visible = false;


        //Set up the President
        president = this.game.add.sprite(300, 550, 'pres');
        president.anchor.setTo(0.5, 0.5);
        president.smoothed = false;
        this.game.physics.enable(president, Phaser.Physics.ARCADE);
        president.enableBody = true;
        president.body.collideWorldBounds = true;
        president.body.setCircle(38);


        //Set Up the Player
        player = this.game.add.sprite(200, 100, 'player');
        player.anchor.setTo(0.5, 0.5);
        player.smoothed = false;
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
        player.enableBody = true;
        player.body.collideWorldBounds = true;
        player.body.gravity.y = 600;
        player.animations.add('idle', [3], 20, true);
        player.animations.add('left', [0,1,2], 10, true);
        player.animations.add('right', [4,5,6], 10, true);
        
        //Set up the Player Controls
        cursors = this.game.input.keyboard.createCursorKeys();
        cursors.up.onDown.add(PlayerJump, this);

        leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        jumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        jumpKey.onDown.add(PlayerJump, this);
        downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

        rKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        rKey.onDown.add(this.ResetGame, this);
        

        //Set up bullets group
        bullets = this.game.add.group();


        isPresMoving = false;

        noise_shoot = this.game.add.audio('shoot');
        noise_score = this.game.add.audio('score');
        noise_dead = this.game.add.audio('dead');
    },

    update: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        MovePlayer();

        //Bullet Spawner
        if(timer % 61 === 0){
            //this.MakeBullet(numBullet);
            bullets.create(this.game.world.randomX, Math.random() * (this.game.world._height - 300), 'bullet');
            bullets.children[numBullet].anchor.set(0.25, 0.5);
            bullets.children[numBullet].scale.set(1.5, 1.5);
            bullets.children[numBullet].smoothed = false;
            this.game.physics.enable(bullets.children[numBullet], Phaser.Physics.ARCADE);
            bullets.children[numBullet].body.collideWorldBounds = true;
            bullets.children[numBullet].body.setCircle(6);
            bullets.children[numBullet].body.bounce.set(1);
            if(Math.floor(Math.random() * 100) > 50){
                bullets.children[numBullet].body.velocity.x = 400;
            }
            else{
                bullets.children[numBullet].body.velocity.x = -400;
            }
            bullets.children[numBullet].body.velocity.y = (Math.floor(Math.random() * (400 + 400) - 400));
            var angle = Math.atan(Math.abs(bullets.children[numBullet].body.velocity.y) / Math.abs(bullets.children[numBullet].body.velocity.x)) * (180/Math.PI);
            var xV = bullets.children[numBullet].body.velocity.x;
            var yV = bullets.children[numBullet].body.velocity.y;
            if(xV < 0 && yV > 0){
                angle = 180 - angle;
            }
            else if(xV < 0 && yV < 0){
                angle += 180;
            }
            else if(xV > 0 && yV < 0){
                angle = 360 - angle;
            }
            noise_shoot.play();
            bullets.children[numBullet].angle = angle;
                numBullet++;
        } //END of bullet spawner

        timer = this.game.time.time;

        //FOR LOOP through EVERY BULLET on SCREEN
        for(var i = 0; i < bullets.children.length; i++){
            BulletAngle(i);
            this.game.physics.arcade.overlap(player, bullets.children[i], this.bulletOverlap, null, this);
            this.game.physics.arcade.overlap(president, bullets.children[i], this.presidentOverlap, null, this);
        }

        //Moves the president around randomly
        if(isAlive === true){
            if(isPresMoving === true && president.position.x <= xDest + 45 && president.position.x >= xDest - 45){
            isPresMoving = false;
            }
            else if(isPresMoving === true){
                this.game.physics.arcade.moveToXY(president, xDest, 550, 80);
            }
            if(isPresMoving === false){
                var move = Math.random() % 100;             
                if(move < 10){
                xDest = this.game.world.randomX;         
                isPresMoving = true;
                }
            }
        }
        
        //MovePresident();
        //this.game.debug.text("bullet Velocity X: " + bullets.body.velocity.x + " Y: " + bullets.body.velocity.y, 200, 300);
    },

    quitGame: function () {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    },

    bulletOverlap: function (player, bullet) {
        bullet.kill();
        noise_score.play();
        score++;
        scoreText.text = "Bullets Blocked: " + score;
    },

    presidentOverlap: function( president, bullet){
        isAlive = false;
        noise_dead.play();
        this.game.paused = true;
        endScore = score;
        scoreText.text = "Bullets Blocked: " + endScore;
        scoreText.position.x = this.game.world.centerX;
        scoreText.position.y = this.game.world.centerY;
        deathText.visible = true;
        bullets.kill();
        player.kill();
        
    },

    ResetGame: function() {
        if(this.game.paused){
            numBullet = 0;
            score = 0;
            isAlive = true;
            this.state.start('Game');
            this.game.paused = false;
        }
        else{
            numBullet = 0;
            score = 0;
            this.state.start('Game');
        }        
    }  

};

function MovePlayer(){
    if(cursors.left.isDown || leftKey.isDown){
        //Ground Movement
        if(player.body.velocity.x > -MAXmoveSpeed && player.body.blocked.down){
            if(player.body.velocity.x > 0){ //Allows for pivot turns when grounded
                player.body.velocity.x = 0;
            }
            player.body.velocity.x -= 40;
        }
        //Air Movement
        else if(!player.body.blocked.down){
            if(player.body.velocity.x < -300){
                player.body.velocity.x += 20;
            }            
            else if(player.body.velocity.x > -MAXAirSpeed){
                player.body.velocity.x -= 40;
            }
        }
        player.play('left', true);
    }
    else if(cursors.right.isDown || rightKey.isDown){
        //Ground Movement
        if(player.body.velocity.x < MAXmoveSpeed && player.body.blocked.down){
            if(player.body.velocity.x < 0){ //Allows for pivot turns when grounded
                player.body.velocity.x = 0;
            }
            player.body.velocity.x += 40;
        }
        //Air Movement
        else if(!player.body.blocked.down){
            if(player.body.velocity.x > MAXAirSpeed){
                player.body.velocity.x -= 20;
            }
            else if(player.body.velocity.x < MAXAirSpeed){
                player.body.velocity.x += 40;
            }
        }
        player.play('right', true);
    }    
    else{//Come To a STOP
        if(player.body.velocity.x > 0){
            player.body.velocity.x -= 20;
        }
        else{
            player.body.velocity.x += 20;
        }
        if(player.body.velocity.x <= 20 && player.body.velocity.x >= -20){
            player.body.velocity.x = 0;
        }
        player.play('idle', true);
    }
    if(cursors.down.isDown && !player.body.touching.down || downKey.isDown && !player.body.touching.down){
        player.body.velocity.y = 600;
    }
}

function PlayerJump(){
    if(player.body.blocked.down){
        player.body.velocity.y -= 400;
    }        
}

//Calculates a bullet's angle
function BulletAngle(num){
    if(bullets.children[num].body.blocked.up === true || bullets.children[num].body.blocked.down === true || bullets.children[num].body.blocked.left === true || bullets.children[num].body.blocked.right === true ){
        var angle = Math.atan(Math.abs(bullets.children[num].body.velocity.y) / Math.abs(bullets.children[num].body.velocity.x)) * (180/Math.PI);
        var xV = bullets.children[num].body.velocity.x;
        var yV = bullets.children[num].body.velocity.y;
        if(xV < 0 && yV > 0){
            angle = 180 - angle;
        }
        else if(xV < 0 && yV < 0){
            angle += 180;
        }
        else if(xV > 0 && yV < 0){
            angle = 360 - angle;
        }
        bullets.children[num].angle = angle;
    }
    
}

function MovePresident(){
    if(isAlive === true){
        if(president.position.x === xDest && isPresMoving === true){
        isPresMoving = false;
        }
        else if(isPresMoving == true){
             moveToXY(president, xDest, president.position.y, 80);
        }
        if(isPresMoving === false){
            var move = Math.random() % 100;
            if(move < 50){
            xDest = this.game.world.randomX;          
            isPresMoving = true;
            }
        }
    }    
}


