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

var grapplePoints;

//Player 1 stuff
//Player1 stats & sprites
var player1;
var p1Reticle;
var p1Rocket;
var p1RetOffsetX, p1RetOffsetY;
//Player 1 controls
var pad1;
var buttonA1;
var buttonX1;
var start1;
var jumping1;
var shooting1;
//END of Player 1 setup

//Player 2 stuff
//Player 2 stats & sprites
var player2;
var p2Reticle;
var p2Rocket;
var p2RetOffsetX, p2RetOffsetY;
//Player 2 controls
var pad2;
var buttonA2;
var buttonX2;
var start2;
var jumping2;
var shooting2;
//END of Player 2 setup

//Various constants
var reticleRadius = 50;
var rocketTiltSpeed = 10;
var MAXmoveSpeed = 500;
var MAXAirSpeed = 400;
var propulsionSpeed = 50;
var MAXPropulsionSpeed = 1000;
var rocketOffsetY = 10;

//Obstacle stuff
var spikes;
var spikeNum = 0;

//UI stuff
var p1Score = 0;
var p1ScoreText;
var p2Score = 0;
var p2ScoreText;
var winText;

//Misc stuff
var timer;
var rGame = false;

BasicGame.Game.prototype = {

    create: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        
        // Create a sprite at the center of the screen using the 'logo' image.
        //this.bouncy = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'logo' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        //this.bouncy.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
        //this.game.physics.enable( this.bouncy, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        //this.bouncy.body.collideWorldBounds = true;
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.

        //Setup Score UI
        var style = { font: "100px Verdana", fill: "#0022ff", align: "center" }; //BLUE TEXT
        p1ScoreText = this.game.add.text(50, 0, p1Score, style);
        p1ScoreText.anchor.setTo(0.5, 0.0);

        style = { font: "100px Verdana", fill: "#ff2200", align: "center" };
        p2ScoreText = this.game.add.text(this.game.world._width - 50, 0, p2Score, style);
        p2ScoreText.anchor.setTo(0.5, 0.0);
        //END of score UI

        winText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "RED WINS", style);
        winText.anchor.setTo(0.5,0.5);
        winText.visible = false;

        //Set Up Player1
        player1 = this.game.add.sprite(200, 100, 'player', 1);
        player1.anchor.setTo(0.5, 0.5);
        player1.smoothed = false;
        this.game.physics.enable(player1, Phaser.Physics.ARCADE);
        player1.enableBody = true;
        player1.body.collideWorldBounds = true;
        player1.body.gravity.y = 600;

        //Set Up Player 1's aim reticle
        p1Reticle = this.game.add.sprite(0,0, 'grapplePt');
        p1Reticle.anchor.setTo(0.5,0.5);
        p1Reticle.smoothed = false;
        p1Reticle.scale.set(0.1, 0.1);

        //Set Up Player 1's Rocket sprite
        p1Rocket = this.game.add.sprite(player1.x, player1.y + rocketOffsetY, 'rocket');
        p1Rocket.anchor.setTo(0.5,0.5);
        p1Rocket.smoothed = false;

        //Set Up Player2
        player2 = this.game.add.sprite(1400, 100, 'player', 0);
        player2.anchor.setTo(0.5, 0.5);
        player2.smoothed = false;
        this.game.physics.enable(player2, Phaser.Physics.ARCADE);
        player2.enableBody = true;
        player2.body.collideWorldBounds = true;
        player2.body.gravity.y = 600;

        //Set Up Player 2's aim reticle
        p2Reticle = this.game.add.sprite(0,0, 'grapplePt');
        p2Reticle.anchor.setTo(0.5,0.5);
        p2Reticle.smoothed = false;
        p2Reticle.scale.set(0.1, 0.1);

        //Set Up Player 2's Rocket sprite
        p2Rocket = this.game.add.sprite(player2.x, player2.y + rocketOffsetY, 'rocket');
        p2Rocket.anchor.setTo(0.5,0.5);
        p2Rocket.smoothed = false;

        //Set up the XBOX controller for player 1
        this.input.gamepad.start();
        pad1 = this.input.gamepad.pad1;
        pad1.addCallbacks(this, {onConnect: this.addButtons});
        pad2 = this.input.gamepad.pad2;
        pad2.addCallbacks(this, {onConnect: this.addButtons2});

        //Set up the Spikes group
        spikes = this.game.add.group();


    },

    update: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //this.bouncy.rotation = this.game.physics.arcade.accelerateToPointer( this.bouncy, this.game.input.activePointer, 500, 500, 500 );
        //GamePadInputs(pad1, jumping1, shooting1);
        MovePlayer(pad1, player1, shooting1);
        PlayerJump(player1, jumping1);
        UpdateReticle(pad1, player1, p1Reticle);
        TiltRocket(player1, p1Reticle, p1Rocket);
        PropelRocket(player1, shooting1, p1Reticle);
        ParentObjectToPlayer(p1Reticle, player1, p1RetOffsetX, p1RetOffsetY);
        ParentObjectToPlayer(p1Rocket, player1, 0, rocketOffsetY);
        

        //GamePadInputs(pad2, jumping2, shooting2);
        MovePlayer(pad2, player2, shooting2);
        PlayerJump(player2, jumping2);
        UpdateReticle(pad2, player2, p2Reticle);
        TiltRocket(player2, p2Reticle, p2Rocket);
        PropelRocket(player2, shooting2, p2Reticle);
        ParentObjectToPlayer(p2Reticle, player2, p2RetOffsetX, p2RetOffsetY);
        ParentObjectToPlayer(p2Rocket, player2, 0, rocketOffsetY);
        

        this.game.physics.arcade.collide(player1, player2, this.Bounce, null, this);
        if(player1.body.bounce > 0)
            player1.body.bounce.set(player1.body.bounce.x - 0.5);
        if(player2.body.bounce > 0)
            player2.body.bounce.set(player2.body.bounce.x - 0.5);

        //Spike spawner
        if(timer % 61 === 0){
            var offScreenQuad = Math.floor(Math.random()*4);
            var offSet;
            var scaleDir = 1;
            switch(offScreenQuad){
                case 0:
                    spikes.create(Math.floor(Math.random() * (this.game.world._width + 1)), 0, 'spike');
                    spikes.children[spikeNum].angle = 90;
                    break;
                case 1:
                    spikes.create(this.game.world._width, Math.floor(Math.random() * (this.game.world._height + 1)), 'spike');
                    scaleDir = -1;
                    break;
                case 2:
                    spikes.create(Math.floor(Math.random() * (this.game.world._width + 1)), this.game.world._height, 'spike');
                    spikes.children[spikeNum].angle = 90;
                    scaleDir = -1;
                    break; 
                case 3:
                    spikes.create(0, Math.floor(Math.random() * (this.game.world._height + 1)), 'spike');
                    break;   

            }
            spikes.children[spikeNum].scale.set(4 * scaleDir,4);
            spikes.children[spikeNum].smoothed = false;
            this.game.physics.enable(spikes.children[spikeNum], Phaser.Physics.ARCADE);
            if(offScreenQuad === 0)
                spikes.children[spikeNum].body.velocity.y = 300;
            else if(offScreenQuad === 1)
                spikes.children[spikeNum].body.velocity.x = -300;
            else if(offScreenQuad === 2)
                spikes.children[spikeNum].body.velocity.y = -300;
            else if(offScreenQuad === 3)
                spikes.children[spikeNum].body.velocity.x = 300;

            spikeNum++;
        }//END of spike spawner1

        //Checks every spike
        for(var i = 0; i < spikes.children.length; i++){
            this.game.physics.arcade.overlap(player1, spikes.children[i], this.spikeOverlap, null, this);
            this.game.physics.arcade.overlap(player2, spikes.children[i], this.spikeOverlap, null, this);
        }
        

        timer = this.game.time.time;


    },

    quitGame: function () {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');
    },

    addButtons:function(){
        buttonA1 = pad1.getButton(Phaser.Gamepad.XBOX360_A);
        buttonX1 = pad1.getButton(Phaser.Gamepad.XBOX360_X);
        start1 = pad1.getButton(Phaser.Gamepad.XBOX360_START)

        buttonA1.onDown.add(function() {
            jumping1 = true;
        }, this);

        buttonA1.onUp.add(function() {
            jumping1 = false;
        }, this);

        buttonX1.onDown.add(function() {
            shooting1 = true;
        }, this);

        buttonX1.onUp.add(function() {
            shooting1 = false;
        }, this);

        start1.onDown.add(function(){
            rGame = true;
        }, this);

    },

    addButtons2:function(){
        buttonA2 = pad2.getButton(Phaser.Gamepad.XBOX360_A);
        buttonX2 = pad2.getButton(Phaser.Gamepad.XBOX360_X);

        buttonA2.onDown.add(function() {
            jumping2 = true;
        }, this);

        buttonA2.onUp.add(function() {
            jumping2 = false;
        }, this);

        buttonX2.onDown.add(function() {
            shooting2 = true;
        }, this);

        buttonX2.onUp.add(function() {
            shooting2 = false;
        }, this);
    },

    Bounce:function(player1, player2){
        var p1V = Math.abs(player1.body.velocity.x) + Math.abs(player1.body.velocity.y);
        var p2V = Math.abs(player2.body.velocity.x) + Math.abs(player2.body.velocity.y);

        if(p1V > 1000)
            player2.body.bounce.set(1);
        else if(p1V > 800)
            player2.body.bounce.set(0.75);
        else if(p1V > 400)
            player2.body.bounce.set(0.5);
        else if(p1V > 200)
            player2.body.bounce.set(0.25);
        else
            player2.body.bounce.set(0);

        if(p2V > 1000)
            player1.body.bounce.set(1);
        else if(p2V > 800)
            player1.body.bounce.set(0.75);
        else if(p2V > 400)
            player1.body.bounce.set(0.5);
        else if(p2V > 200)
            player1.body.bounce.set(0.25);
        else
            player1.body.bounce.set(0);

    },

    spikeOverlap:function(player, spike){
        if(player === player1)
            p2Score++;
        else
            p1Score++;
        this.ResetGame();
    },

    ResetGame:function(){
        spikeNum = 0;
        if(p1Score === 10){
            p1ScoreText.text = p1Score;
            winText.addColor('#0022ff', 0);
            winText.text = "BLUE WINS";
            this.game.world.bringToTop(winText);
            winText.visible = true;
            this.game.paused = true;
        }
        else if(p2Score === 10){
            p2ScoreText = p2Score;
            winText.visible = true;
            this.game.world.bringToTop(winText);
            this.game.paused = true;
        }
        else if(!rGame){
            this.state.start('Game');
        }

        if(this.game.paused && rGame){
            this.state.start('Game');
        }        
    }

};

function MovePlayer(pad, player, shooting){
    if(!shooting){
        if(pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1){
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
        player.scale.set(-1, 1);
    }
    else if(pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1){
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
                player.body.velocity.x -= 10;
            }
            else if(player.body.velocity.x < MAXAirSpeed){
                player.body.velocity.x += 40;
            }
        }
        player.scale.set(1,1);
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
    }
    /*
    if(cursors.down.isDown && !player.body.touching.down || downKey.isDown && !player.body.touching.down){
        player.body.velocity.y = 600;
    }
    */
    }    
}

function PlayerJump(player, jumpPressed){
    if(player.body.blocked.down && jumpPressed){
        player.body.velocity.y -= 400;
    }        
}

function ParentObjectToPlayer(reticle, player, retOffX, retOffY){
    reticle.x = player.x + retOffX;
    reticle.y = player.y + retOffY;
}

function UpdateReticle(pad, player, reticle){
    var posX = pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
    var posY = pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
    var normX, normY;

    if(posX != 0 || posY != 0){
        normX = posX / (Math.sqrt(posX*posX+posY*posY));
        normY = posY / (Math.sqrt(posX*posX+posY*posY));

        reticle.x = player.x + (normX * reticleRadius);
        reticle.y = player.y + (normY * reticleRadius);
    }

    if(player === player1){
        p1RetOffsetX = reticle.x - player.x;
        p1RetOffsetY = reticle.y - player.y;
    }
    else{
        p2RetOffsetX = reticle.x - player.x;
        p2RetOffsetY = reticle.y - player.y;
    }
}

function TiltRocket(player, reticle, rocket){
    var angle = Math.atan2(reticle.y - player.y, reticle.x - player.x) * 180/Math.PI;
    if(rocket.angle !== angle){//if the input angle and the rocket's angle dont match THEN match em
        var aDiff = angle - rocket.angle;
        if(rocket.angle > 0){//the rocket's angle is positive
            if(aDiff > 0 || aDiff <= -180){ //Moves Clockwise
                if(aDiff < rocketTiltSpeed)
                    rocket.angle = angle;
                else
                    rocket.angle += rocketTiltSpeed;
            }
            else{ //Moves CounterClockwise
                if(aDiff > rocketTiltSpeed)
                    rocket.angle = angle;
                else
                    rocket.angle -= rocketTiltSpeed;
            }
        }
        else{ //The rocket's angle is negative
            if(aDiff > 0 && aDiff <= 180){//Moves Clockwise
                if(aDiff < rocketTiltSpeed)
                    rocket.angle = angle;
                else
                    rocket.angle += rocketTiltSpeed;
            }
            else{ //Moves CounterClockwise
                if(aDiff > rocketTiltSpeed)
                    rocket.angle = angle;
                else
                    rocket.angle -= rocketTiltSpeed;
            }
        }
        
    }
    
}

function PropelRocket(player, shooting, reticle){
    if(shooting){
        player.body.gravity.y = 0;
        var x = reticle.x - player.x;
        var y = reticle.y - player.y;

        var normX = x / (Math.sqrt(x*x+y*y));
        var normY = y / (Math.sqrt(x*x+y*y));

        var xV = normX * propulsionSpeed;
        var yV = normY * propulsionSpeed;

        //if(Math.abs(player.body.velocity.x) + Math.abs(player.body.velocity.y) < MAXPropulsionSpeed){
            player.body.velocity.x += xV;
            player.body.velocity.y += yV;
        //}
    }
    else
        player.body.gravity.y = 600;  
    
}