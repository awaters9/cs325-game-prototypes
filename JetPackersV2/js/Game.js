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
    //this.bouncy = null
};

var backgroundPic;
var eyeball;
var eyeFloatUP = true;
var eyeLftSide = true;

//Player 1 stuff
//Player1 stats & sprites
var player1;
var p1Reticle;
var p1Rocket;
var p1RetOffsetX, p1RetOffsetY;
var p1RocketEmitter;
var p1EmitterOffsetX, p1EmitterOffsetY;
//Player 1 controls
var pad1;
var buttonA1;
var buttonX1;
var start1;
var jumping1;
var shooting1;
//END of Player 1 variables

//Player 2 stuff
//Player 2 stats & sprites
var player2;
var p2Reticle;
var p2Rocket;
var p2RetOffsetX, p2RetOffsetY;
var p2RocketEmitter;
//Player 2 controls
var pad2;
var buttonA2;
var buttonX2;
var start2;
var jumping2;
var shooting2;
//END of Player 2 variables

//Various constants
var reticleRadius = 50;
var rocketTiltSpeed = 10;
var MAXmoveSpeed = 500;
var MAXAirSpeed = 400;
var propulsionSpeed = 50;
var MAXPropulsionSpeed = 1000;
var rocketOffsetY = 10;
var reticleRotateSpeed = 2;
var rocketParticleSpeed = 4;

//Obstacle stuff
var spikes;
var sNum = 0;
var spikeBoundary;
var sBoundNum = 0;
var redPlatform, bluePlatform;

//UI stuff
var p1Score = 0;
var p1ScoreText;
var p2Score = 0;
var p2ScoreText;
var winText;

//Misc stuff
var timer;
var blinkTimer = 2.0;
var blinkAnimTime = 0;
var spikeWaitToShoot = 3.0;
var MAXboundSpikeTime;
var boundTimer;
var platformTimer;
var rGame = false;
var nSetSpike, nStopSpike, nShootSpike, nClash, nDeath, nRocket1, nRocket2;
var music;

BasicGame.Game.prototype = {

    create: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!        

        platformTimer = 2.0;
        MAXboundSpikeTime = 15.0;
        boundTimer = MAXboundSpikeTime;

        //THIS IS BACKGROUND IMAGE STUFF
        //Set Background Image
        backgroundPic = this.game.add.sprite(0,0,'background');
        backgroundPic.scale.set(4,4);
        backgroundPic.smoothed = false;

        //Set floating eyeball image
        eyeball = this.game.add.sprite(1050, 128, 'eyeball', 0);
        eyeball.scale.set(4,4);
        eyeball.anchor.setTo(0.5,0.5);
        eyeball.smoothed = false;
        eyeball.animations.add('idle', [0], 20, true);
        eyeball.animations.add('blink', [1,2,3], 10, true);
        this.game.physics.enable(eyeball, Phaser.Physics.ARCADE);
        eyeball.body.gravity.y = 0;
        //END OF BACKGROUND STUFF


        //Setup Score UI
        var style = { font: "100px Verdana", fill: "#0022ff", align: "center" }; //BLUE TEXT
        p1ScoreText = this.game.add.text(100, 50, p1Score, style);
        p1ScoreText.anchor.setTo(0.5, 0.0);

        style = { font: "100px Verdana", fill: "#ff2200", align: "center" };
        p2ScoreText = this.game.add.text(this.game.world._width - 100, 50, p2Score, style);
        p2ScoreText.anchor.setTo(0.5, 0.0);
        //END of score UI

        //Win text set up
        winText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "RED WINS", style);
        winText.anchor.setTo(0.5,0.5);
        winText.visible = false;



        //Set Up Player1
        player1 = this.game.add.sprite(400, 350, 'player', 1);
        player1.anchor.setTo(0.5, 0.5);
        player1.smoothed = false;
        this.game.physics.enable(player1, Phaser.Physics.ARCADE);
        player1.enableBody = true;
        player1.body.collideWorldBounds = true;
        player1.body.gravity.y = 600;
        player1.body.bounce.set(0.5);

        //Set Up Player 1's aim reticle
        p1Reticle = this.game.add.sprite(0,0, 'reticle', 1);
        p1Reticle.anchor.setTo(0.5,0.5);
        p1Reticle.smoothed = false;
        
        //Set up Player 1's rocket particle emitter
        p1RocketEmitter = this.game.add.emitter(0,0,500);
        p1RocketEmitter.makeParticles('particle', 1, 50);
        p1RocketEmitter.gravity = 0;
        p1RocketEmitter.setAlpha(1, 0, 500, Phaser.Easing.Linear.InOut);
        p1RocketEmitter.start(false, 500, 5, 500);

        //Set Up Player 1's Rocket sprite
        p1Rocket = this.game.add.sprite(player1.x, player1.y + rocketOffsetY, 'rocket');
        p1Rocket.anchor.setTo(0.5,0.5);
        p1Rocket.smoothed = false;

        //Set Up Player 1's starting platform
        bluePlatform = this.game.add.sprite(400, 400, 'platform', 1);
        bluePlatform.anchor.setTo(0.5, 0.5);
        bluePlatform.smoothed = false;
        this.game.physics.enable(bluePlatform, Phaser.Physics.ARCADE);
        bluePlatform.body.gravity.y = 0;
        bluePlatform.body.immovable = true;

        //END of PLAYER 1 SET UP


        //Set Up Player2
        player2 = this.game.add.sprite(1200, 350, 'player', 0);
        player2.anchor.setTo(0.5, 0.5);
        player2.smoothed = false;
        this.game.physics.enable(player2, Phaser.Physics.ARCADE);
        player2.enableBody = true;
        player2.body.collideWorldBounds = true;
        player2.body.gravity.y = 600;
        player2.body.bounce.set(0.5);

        //Set Up Player 2's aim reticle
        p2Reticle = this.game.add.sprite(0,0, 'reticle', 0);
        p2Reticle.anchor.setTo(0.5,0.5);
        p2Reticle.smoothed = false;
        p2Reticle.scale.set(0.75, 0.75);

        //Set Up Player 2's Rocket sprite
        p2Rocket = this.game.add.sprite(player2.x, player2.y + rocketOffsetY, 'rocket');
        p2Rocket.anchor.setTo(0.5,0.5);
        p2Rocket.smoothed = false;

        //Set up Player 2's rocket particle emitter
        p2RocketEmitter = this.game.add.emitter(0,0,500);
        p2RocketEmitter.makeParticles('particle', 0, 50);
        p2RocketEmitter.gravity = 0;
        p2RocketEmitter.setAlpha(1, 0, 500, Phaser.Easing.Linear.InOut);
        p2RocketEmitter.start(false, 500, 5, 500);

        //Set up Player 2's starting platform
        redPlatform = this.game.add.sprite(1200, 400, 'platform', 0);
        redPlatform.anchor.setTo(0.5, 0.5);
        redPlatform.smoothed = false;
        this.game.physics.enable(redPlatform, Phaser.Physics.ARCADE);
        redPlatform.body.gravity.y = 0;
        redPlatform.body.immovable = true;

        //END of PLAYER 2 SET UP


        //Set up the XBOX controller for players 
        this.input.gamepad.start();
        pad1 = this.input.gamepad.pad1;
        pad1.addCallbacks(this, {onConnect: this.addButtons});
        pad2 = this.input.gamepad.pad2;
        pad2.addCallbacks(this, {onConnect: this.addButtons2});



        //Set up the Spikes group
        spikes = this.game.add.group();        
        
        
        //Set up spikes around the border of the screen
        spikeBoundary = this.game.add.group();
        for(sBoundNum; sBoundNum < 31; sBoundNum++){ //TOP of Screen
            spikeBoundary.create(50*sBoundNum + 50, -100, 'spikeU');            
            spikeBoundary.children[sBoundNum].smoothed = false;            
            spikeBoundary.children[sBoundNum].anchor.setTo(0.5, 0.5);
            this.game.physics.enable(spikeBoundary.children[sBoundNum], Phaser.Physics.ARCADE);
            spikeBoundary.children[sBoundNum].angle = 180;
            spikeBoundary.children[sBoundNum].scale.set(-4,4);
        }
        //Right of Screen
        for(var i = 0; i < 14; i++){
            spikeBoundary.create(this.game.world._width + 115, 50*i+70, 'spike');            
            spikeBoundary.children[sBoundNum].smoothed = false;
            spikeBoundary.children[sBoundNum].anchor.setTo(0.5, 0.5);
            this.game.physics.enable(spikeBoundary.children[sBoundNum], Phaser.Physics.ARCADE);
            spikeBoundary.children[sBoundNum].scale.set(-4,4);
            sBoundNum++;
        }
        //Bottom of Screen
        for(var i = 0; i < 31; i++){
            spikeBoundary.create(50*i + 50, this.game.world._height + 100, 'spikeU');            
            spikeBoundary.children[sBoundNum].smoothed = false;
            spikeBoundary.children[sBoundNum].anchor.setTo(0.5, 0.5);
            this.game.physics.enable(spikeBoundary.children[sBoundNum], Phaser.Physics.ARCADE);
            spikeBoundary.children[sBoundNum].scale.set(4,4);
            sBoundNum++;
        }
        //Left of Screen
        for(var i = 0; i < 14; i++){
            spikeBoundary.create(-115, 50*i+70, 'spike');            
            spikeBoundary.children[sBoundNum].smoothed = false;
            spikeBoundary.children[sBoundNum].anchor.setTo(0.5, 0.5);
            this.game.physics.enable(spikeBoundary.children[sBoundNum], Phaser.Physics.ARCADE);

            spikeBoundary.children[sBoundNum].scale.set(4,4);
            sBoundNum++;
        }
        //DONE SETTING UP THE BOUNDARY HAZARD

        //Set up Noises
        nSetSpike = this.game.add.audio('setSpike');
        nStopSpike = this.game.add.audio('stopSpike');
        nShootSpike = this.game.add.audio('shootSpike');
        nClash = this.game.add.audio('clash');
        nDeath = this.game.add.audio('death');
        nRocket1 = this.game.add.audio('rocket');
        nRocket2 = this.game.add.audio('rocket');


    },

    update: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!       

        //Handles starting platform spawn and Despawn
        if(platformTimer <= 0){
            FadePlatform(bluePlatform);
            FadePlatform(redPlatform);
        }
        else{
            platformTimer -= this.game.time.physicsElapsed;
        }
        //END of platform stuff

        //Background animation stuff
        CheckBlink();
        EyeballHover();
        blinkTimer -= this.game.time.physicsElapsed;
        if(blinkAnimTime > 0)
            blinkAnimTime -= this.game.time.physicsElapsed;
        //END of background animations

        //Player 1 Stuff
        MovePlayer(pad1, player1, shooting1);
        PlayerJump(player1, jumping1);
        UpdateReticle(pad1, player1, p1Reticle);
        TiltRocket(player1, p1Reticle, p1Rocket, p1RocketEmitter);
        RotateReticle(p1Reticle);
        PropelRocket(player1, shooting1, p1Reticle, p1RocketEmitter, nRocket1);
        ParentObjectToPlayer(p1Reticle, player1, p1RetOffsetX, p1RetOffsetY);
        ParentObjectToPlayer(p1Rocket, player1, 0, rocketOffsetY);
        ParentObjectToPlayer(p1RocketEmitter, p1Rocket, 1, 1);
        

        //Player 2 Stuff
        MovePlayer(pad2, player2, shooting2);
        PlayerJump(player2, jumping2);
        UpdateReticle(pad2, player2, p2Reticle);
        TiltRocket(player2, p2Reticle, p2Rocket, p2RocketEmitter);
        RotateReticle(p2Reticle);
        PropelRocket(player2, shooting2, p2Reticle, p2RocketEmitter, nRocket2);
        ParentObjectToPlayer(p2Reticle, player2, p2RetOffsetX, p2RetOffsetY);
        ParentObjectToPlayer(p2Rocket, player2, 0, rocketOffsetY);
        ParentObjectToPlayer(p2RocketEmitter, p2Rocket, 1, 1);
        
        //Checks if the players collide with eachother
        this.game.physics.arcade.collide(player1, player2, this.Bounce, null, this);        
        //Checks for collisions with the starting platforms
        if(bluePlatform.alpha > 0.3){
            this.game.physics.arcade.collide(player1, bluePlatform);
            this.game.physics.arcade.collide(player1, redPlatform);
            this.game.physics.arcade.collide(player2, bluePlatform);
            this.game.physics.arcade.collide(player2, redPlatform);
        }
        

        //Spike spawner
        timer = this.game.time.time;
        if(timer % 61 === 0){
            var offScreenQuad = Math.floor(Math.random()*4);
            var offSet;
            var scaleDir = 1;
            switch(offScreenQuad){//spawns a new spike off screen
                case 0:
                    spikes.create(Math.floor(Math.random() * (this.game.world._width + 1)), -70, 'spikeU');
                    scaleDir = -1;
                    spikes.children[sNum].angle = 180;
                    break;
                case 1:
                    spikes.create(this.game.world._width + 70, Math.floor(Math.random() * (this.game.world._height + 1)), 'spike');
                    scaleDir = -1;
                    break;
                case 2:
                    spikes.create(Math.floor(Math.random() * (this.game.world._width + 1)), this.game.world._height + 70, 'spikeU');
                    
                    break; 
                case 3:
                    spikes.create(-70, Math.floor(Math.random() * (this.game.world._height + 1)), 'spike');
                    break;
            }

            spikes.children[sNum].anchor.setTo(0.5,0.5);
            spikes.children[sNum].smoothed = false;
            this.game.physics.enable(spikes.children[sNum], Phaser.Physics.ARCADE);
            spikes.children[sNum].scale.set(4 * scaleDir,4);
            this.game.time.events.add(0, this.setSpike, this, spikes.children[sNum], offScreenQuad); //1/3 parts

            sNum++;
        }//END of spike spawner

        //Checks overlap of all spikes with the players
        for(var i = 0; i < spikes.children.length; i++){
            this.game.physics.arcade.overlap(player1, spikes.children[i], this.spikeOverlap, null, this);
            this.game.physics.arcade.overlap(player2, spikes.children[i], this.spikeOverlap, null, this);            
        }
        for(var i = 0; i < spikeBoundary.children.length; i+=2){
            this.game.physics.arcade.overlap(player1, spikeBoundary.children[i], this.spikeOverlap, null, this);
            this.game.physics.arcade.overlap(player2, spikeBoundary.children[i], this.spikeOverlap, null, this);
        }
        //END of spike overlap checks
        
        if(boundTimer <= 0){
            this.game.time.events.add(0, this.setBounds, this);
            if(MAXboundSpikeTime != 2){
                MAXboundSpikeTime -= 2;
                boundTimer = MAXboundSpikeTime;
            }
        }
        else
            boundTimer -= this.game.time.physicsElapsed;
        
        CheckBoundSpikeLimits();


    },

    render: function(){
        for(var i = 0; i < spikes.children.length; i++){
            this.game.debug.body(spikes.children[i]);
        }
    },

    setSpike: function (spike, quad){
        if(quad === 0)
            spike.body.velocity.y = 50;
        else if(quad === 1)
            spike.body.velocity.x = -50;
        else if(quad === 2)
            spike.body.velocity.y = -50;
        else if(quad === 3)
            spike.body.velocity.x = 50;
        nSetSpike.play('', 0, 0.8, false, true);
        this.game.time.events.add(2500, this.stopSpike, this, spike, quad); // 2/3 parts        
    },

    stopSpike: function(spike, quad){
        if(quad === 0)
            spike.body.velocity.y = 0;
        else if(quad === 1)
            spike.body.velocity.x = -0;
        else if(quad === 2)
            spike.body.velocity.y = -0;
        else if(quad === 3)
            spike.body.velocity.x = 0;
        nStopSpike.play('', 0, 0.8, false, true);
        this.game.time.events.add(2500, this.shootSpike, this, spike, quad); // 3/3 parts
    },

    shootSpike: function(spike, quad){
        if(quad === 0)
                spike.body.velocity.y = 300;
            else if(quad === 1)
                spike.body.velocity.x = -300;
            else if(quad === 2)
                spike.body.velocity.y = -300;
            else if(quad === 3)
                spike.body.velocity.x = 300;
        nShootSpike.play();
    },

    setBounds: function(){
        var howMany = Math.floor(Math.random() * 11);
        if(howMany > 9){//spawns all 4 bounds  
            for(var i = 0; i < 31; i++){
                spikeBoundary.children[i].body.velocity.y = 50;
            }
            for(var i = 31; i < 45; i++){
                spikeBoundary.children[i].body.velocity.x = -50;
            }
            for(var i = 45; i < 76; i++){
                spikeBoundary.children[i].body.velocity.y = -50;
            }
            for(var i = 76; i < 90; i++){
                spikeBoundary.children[i].body.velocity.x = 50;
            }
            this.game.time.events.add(2500, this.stopBound, this, 0);
            this.game.time.events.add(2500, this.stopBound, this, 1);
            this.game.time.events.add(2500, this.stopBound, this, 2);
            this.game.time.events.add(2500, this.stopBound, this, 3);
        }
        else if(howMany > 7){ //spawns 3 bounds
            var num = Math.floor(Math.random() * 4);
            for(var x = 0; x < 3; x++){
                if(num === 0){
                    for(var i = 0; i < 31; i++){
                        spikeBoundary.children[i].body.velocity.y = 50;
                    }
                    this.game.time.events.add(2500, this.stopBound, this, 0);
                    num++;
                }
                else if(num === 1){
                    for(var i = 31; i < 45; i++){
                        spikeBoundary.children[i].body.velocity.x = -50;
                    }
                    this.game.time.events.add(2500, this.stopBound, this, 1);
                    num++;
                }
                else if(num === 2){
                    for(var i = 45; i < 76; i++){
                        spikeBoundary.children[i].body.velocity.y = -50;
                    }
                    this.game.time.events.add(2500, this.stopBound, this, 2);
                    num++;
                }
                else{
                    for(var i = 76; i < 90; i++){
                        spikeBoundary.children[i].body.velocity.x = 50;
                    }
                    this.game.time.events.add(2500, this.stopBound, this, 3);
                    num = 0;
                }
            }
        }
        else if(howMany > 4){//spawns 2 bounds
            var num1 = Math.floor(Math.random() * 4);
            var num2 = Math.floor(Math.random() * 4);
            while(num1 === num2)
                num2 = Math.random() % 4;
            for(var x = 0; x < 2; x++){
                var n = 0;
                if(x === 0)
                    n = num1;
                else
                    n = num2;

                if(n === 0){
                    for(var i = 0; i < 31; i++){
                        spikeBoundary.children[i].body.velocity.y = 50;
                    }
                    this.game.time.events.add(2500, this.stopBound, this, 0);
                }
                else if(n === 1){
                    for(var i = 31; i < 45; i++){
                        spikeBoundary.children[i].body.velocity.x = -50;
                    }
                    this.game.time.events.add(2500, this.stopBound, this, 1);
                }
                else if(n === 2){
                    for(var i = 45; i < 76; i++){
                        spikeBoundary.children[i].body.velocity.y = -50;
                    }
                    this.game.time.events.add(2500, this.stopBound, this, 2);
                }
                else{
                    for(var i = 76; i < 90; i++){
                        spikeBoundary.children[i].body.velocity.x = 50;
                    }
                    this.game.time.events.add(2500, this.stopBound, this, 3);
                }
            }
        }
        else{//spawns 1 bound
            var num = Math.floor(Math.random() * 4);
            if(num === 0){
                    for(var i = 0; i < 31; i++){
                        spikeBoundary.children[i].body.velocity.y = 50;
                    }
                    this.game.time.events.add(2500, this.stopBound, this, 0);
                }
                else if(num === 1){
                    for(var i = 31; i < 45; i++){
                        spikeBoundary.children[i].body.velocity.x = -50;
                    }
                    this.game.time.events.add(2500, this.stopBound, this, 1);
                }
                else if(num === 2){
                    for(var i = 45; i < 76; i++){
                        spikeBoundary.children[i].body.velocity.y = -50;
                    }
                    this.game.time.events.add(2500, this.stopBound, this, 2);
                }
                else{
                    for(var i = 76; i < 90; i++){
                        spikeBoundary.children[i].body.velocity.x = 50;
                    }
                    this.game.time.events.add(2500, this.stopBound, this, 3);
                }
        }
        nSetSpike.play('', 0, 0.8, false, true); 
    },

    stopBound: function(quad){
        if(quad === 0){
            for(var i = 0; i < 31; i++){
                spikeBoundary.children[i].body.velocity.y = 0;
            }
        }
        else if(quad === 1){
            for(var i = 31; i < 45; i++){
                spikeBoundary.children[i].body.velocity.x = 0;
            }
        }
        else if(quad === 2){
            for(var i = 45; i < 76; i++){
                spikeBoundary.children[i].body.velocity.y = 0;
            }
        }
        else{
            for(var i = 76; i < 90; i++){
                spikeBoundary.children[i].body.velocity.x = 0;
            }
        }
        this.game.time.events.add(5000, this.retractBound, this, quad);
        nStopSpike.play('', 0, 0.8, false, true);
    },

    retractBound: function(quad){
        if(quad === 0){
            for(var i = 0; i < 31; i++){
                spikeBoundary.children[i].body.velocity.y = -50;
            }
        }
        else if(quad === 1){
            for(var i = 31; i < 45; i++){
                spikeBoundary.children[i].body.velocity.x = 50;
            }
        }
        else if(quad === 2){
            for(var i = 45; i < 76; i++){
                spikeBoundary.children[i].body.velocity.y = 50;
            }
        }
        else{
            for(var i = 76; i < 90; i++){
                spikeBoundary.children[i].body.velocity.x = -50;
            }
        }
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
        nClash.play();
    },

    spikeOverlap:function(player, spike){
        if(player === player1)
            p2Score++;
        else
            p1Score++;
        nDeath.play();
        this.ResetGame();
    },

    ResetGame:function(){
        sNum = 0;
        sBoundNum = 0;
        if(p1Score === 10){
            p1ScoreText.text = p1Score;
            winText.addColor('#0022ff', 0);
            winText.text = "BLUE WINS";
            this.game.world.bringToTop(winText);
            winText.visible = true;
            this.game.paused = true;
        }
        else if(p2Score === 10){
            p2ScoreText.text = p2Score;
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
    if(player.body.velocity.y === 0 && jumpPressed){
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
        //p1EmitterOffsetX = reticle.x + player.x;
        //p1EmitterOffsetY = reticle.y + player.y;
    }
    else{
        p2RetOffsetX = reticle.x - player.x;
        p2RetOffsetY = reticle.y - player.y;
    }
}

function TiltRocket(player, reticle, rocket, emitter){
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
    emitter.setXSpeed(rocketParticleSpeed*Math.cos(rocket.angle+Math.PI), rocketParticleSpeed*Math.cos(rocket.angle+Math.PI));
    emitter.setYSpeed(rocketParticleSpeed*Math.sin(rocket.angle+Math.PI), rocketParticleSpeed*Math.sin(rocket.angle+Math.PI));

}

function PropelRocket(player, shooting, reticle, emitter, noise){
    if(shooting){
        player.body.gravity.y = 0;
        var x = reticle.x - player.x;
        var y = reticle.y - player.y;

        var normX = x / (Math.sqrt(x*x+y*y));
        var normY = y / (Math.sqrt(x*x+y*y));

        var xV = normX * propulsionSpeed;
        var yV = normY * propulsionSpeed;

        player.body.velocity.x += xV;
        player.body.velocity.y += yV;

        
        emitter.on = true;
        noise.play('', 0, 0.4, false, false);
    }
    else{
        player.body.gravity.y = 600;  
        emitter.on = false;
        noise.stop();
    }
    
}

function CheckBlink(){
    if(blinkTimer <= 0){
        eyeball.play('blink', null, false);
        blinkAnimTime = 0.3;
        blinkTimer = Math.random() % 10 + 10;
    }
    if(blinkAnimTime <= 0)
        eyeball.play('idle');    
}

function EyeballHover(){
    if(eyeFloatUP && eyeball.y > 115){ //MOVE UP
        if(eyeball.body.velocity.y >= -20)
            eyeball.body.velocity.y -= 2;
        eyeLftSide = true;        
    }
    else if(eyeball.y < 115 || !eyeFloatUP){ //MOVE DOWN
        if(eyeball.y < 115)
            eyeFloatUP = false;
        if(eyeball.body.velocity.y <= 20)
            eyeball.body.velocity.y += 2;
        if(eyeball.y >= 128)
            eyeFloatUP = true;
        if(!eyeFloatUP)
            eyeLftSide = false;
    }
    
    if(eyeLftSide && eyeball.y > 115){
        if(eyeball.body.velocity.x <= 15)
            eyeball.body.velocity.x += 1;
    }
    else if(eyeball.y < 120 || !eyeLftSide){
        if(eyeball.body.velocity.x >= -15)
            eyeball.body.velocity.x -= 1;
    }   
}

function RotateReticle(reticle){
    reticle.angle += reticleRotateSpeed;
}

function FadePlatform(platform){
    if(platform.alpha !== 0)
        platform.alpha -= 0.01;
}

function CheckBoundSpikeLimits(){
    for(var i = 0; i < 31; i++){ //QUAD 0
        if(spikeBoundary.children[i].y > 25 ){
            spikeBoundary.children[i].body.velocity.y = 0;
            spikeBoundary.children[i].y = 25;
        }
        else if(spikeBoundary.children[i].y < -100){
            spikeBoundary.children[i].body.velocity.y = 0;
            spikeBoundary.children[i].y = -100;
        }
    }
    for(var i = 31; i < 45; i++){ //QUAD 1
        if(spikeBoundary.children[i].x < 1590 ){
            spikeBoundary.children[i].body.velocity.x = 0;
            spikeBoundary.children[i].x = 1590;
        }
        else if(spikeBoundary.children[i].x < -115){
            spikeBoundary.children[i].body.velocity.x = 0;
            spikeBoundary.children[i].x = -115;
        }
    }
    for(var i = 45; i < 76; i++){ //QUAD 2
        if(spikeBoundary.children[i].y < 774 ){
            spikeBoundary.children[i].body.velocity.y = 0;
            spikeBoundary.children[i].y = 774
        }
        else if(spikeBoundary.children[i].y > 900){
            spikeBoundary.children[i].body.velocity.y = 0;
            spikeBoundary.children[i].y = 900;
        }
    }
    for(var i = 76; i < 90; i++){ //QUAD 3
        if(spikeBoundary.children[i].x > 10 ){
            spikeBoundary.children[i].body.velocity.x = 0;
            spikeBoundary.children[i].x = 10;
        }
        else if(spikeBoundary.children[i].x < -115){
            spikeBoundary.children[i].body.velocity.x = 0;
            spikeBoundary.children[i].y = -115;
        }
    }
}