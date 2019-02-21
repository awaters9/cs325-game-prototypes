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

var map1, map2;
var layer1, layer2, layer3;//map layers
var lock1, lock2, lock3; //locker layers

var activeEnemies = [];

var uKey, dKey; //input keys UP and DOWN

var player;
var distanceTraveled = 0;

var currPointDist = 0;
var pointDistMAX = 500;
var moveSpeed = 5;

var paper; //the 'COIN'

var score = 0;
var scoreText;

var health = 3;
var healthText;

var hurtDuration = 0;

var pointSound;
var hurtSound;

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
        //var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        //var text = this.game.add.text( this.game.world.centerX, 15, "Build something amazing.", style );
        //text.anchor.setTo( 0.5, 0.0 );
        
        // When you click on the sprite, you go back to the MainMenu.
        //this.bouncy.inputEnabled = true;
        //this.bouncy.events.onInputDown.add( function() { this.quitGame(); }, this );

        map1 = this.game.add.tilemap('tilemap');
        map1.addTilesetImage('world', 'tiles');
        layer1 = map1.createLayer(1);
        layer1.fixedToCamera = false;

        layer2 = map1.createLayer(1);
        layer2.fixedToCamera = false;
        layer2.position.set(620, 0);

        layer3 = map1.createLayer(1);
        layer3.fixedToCamera = false;
        layer3.position.set(1240, 0);

        map2 = this.game.add.tilemap('lockerMap');
        map2.addTilesetImage('locker', 'lockerTiles');
        lock1 = map2.createLayer(0);
        lock1.fixedToCamera = false;
        lock1.position.set(0, 25);

        lock2 = map2.createLayer(0);
        lock2.fixedToCamera = false;
        lock2.position.set(620, 25);

        lock3 = map2.createLayer(0);
        lock3.fixedToCamera = false;
        lock3.position.set(1240, 25);


        player = this.game.add.sprite(100, 175, 'player');
        player.smoothed = false;
        player.scale.setTo(3, 3);
        player.animations.add('run', [4, 5, 6, 7, 8, 9], 12, true);

        this.game.physics.enable(player, Phaser.Physics.ARCADE);
        player.enableBody = true;

        //creates all the Enemies
        for(var i = 0; i < 5; i++){
            activeEnemies.push(this.game.add.sprite(0, -200, 'enemy1'));
            activeEnemies[i*3].smoothed = false;
            activeEnemies[i*3].scale.setTo(3,3);
            activeEnemies[i*3].animations.add('idle', [0,1,2,3], 5, true);
            this.game.physics.enable(activeEnemies[i*3], Phaser.Physics.ARCADE);
            activeEnemies[i*3].enableBody = true;            

            activeEnemies.push(this.game.add.sprite(0, -200, 'enemy2'));
            activeEnemies[i*3+1].smoothed = false;
            activeEnemies[i*3+1].scale.setTo(3,3);
            activeEnemies[i*3+1].animations.add('idle', [0,1,2,3], 5, true);
            this.game.physics.enable(activeEnemies[i*3+1], Phaser.Physics.ARCADE);
            activeEnemies[i*3+1].enableBody = true;

            activeEnemies.push(this.game.add.sprite(0, -200, 'enemy3'));
            activeEnemies[i*3+2].smoothed = false;
            activeEnemies[i*3+2].scale.setTo(3,3);
            activeEnemies[i*3+2].animations.add('idle', [0,1,2,3], 5, true);
            this.game.physics.enable(activeEnemies[i*3+2], Phaser.Physics.ARCADE);
            activeEnemies[i*3+2].enableBody = true;
        }
        

        paper = this.game.add.sprite(0, -100, 'paper');
        paper.anchor.setTo(0.5, 0.5);
        paper.scale.setTo(3,3);
        paper.smoothed = false;
        this.game.physics.enable(paper, Phaser.Physics.ARCADE);


        uKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        uKey.onDown.add(MoveUP, this);
        dKey.onDown.add(MoveDown, this);

        var style = { font: "40px Verdana", fill: "#ffffff", align: "center" };
        scoreText = this.game.add.text(600, 375, "Score: " + score, style);

        style = {font: "40px Verdana", fill: "#ff0000", align: "center"};
        healthText = this.game.add.text(30, 375, "Health: " + health, style);

        pointSound = this.game.add.audio('pointUp');
        hurtSound = this.game.add.audio('hurtSound');

    },

    update: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

        player.play('run');

        for(var i = 0; i < activeEnemies.length; i++){
            activeEnemies[i].play('idle');
            this.game.physics.arcade.overlap(activeEnemies[i], player, Hurt, null, this);
        }
        MoveWorld();
        if(distanceTraveled >= 300 && currPointDist !== pointDistMAX){
            GenerateEnemies(this.game.rnd.integerInRange(0,14), this.game.rnd.integerInRange(1,3));
        }
        if(currPointDist >= pointDistMAX){
            SpawnPaper(this.game.rnd.integerInRange(1,3));
        }

        this.game.physics.arcade.collide(paper, player, Score, null, this);
        

        if(hurtDuration > 0){
            hurtDuration++;
            if(hurtDuration == 50)
                hurtDuration = 0;
        }

        if(health === 0){ 
            for(var i = activeEnemies.length; i <= 0; i--){
                delete activeEnemies[i]
                activeEnemies.pop();
            }        
            this.state.start('MainMenu');
        }
        if(score === 10){
            this.state.start('Win');
        }
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //this.bouncy.rotation = this.game.physics.arcade.accelerateToPointer( this.bouncy, this.game.input.activePointer, 500, 500, 500 );

    },

    quitGame: function () {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');
    }

    
};

    function MoveWorld() {
        var currXPos;
        var currYPos;

        currXPos = layer1.position.x;
        layer1.position.set(currXPos - moveSpeed, 0);

        currXPos = layer2.position.x;
        layer2.position.set(currXPos - moveSpeed, 0);
        
        currXPos = layer3.position.x;
        layer3.position.set(currXPos - moveSpeed, 0);

        currXPos = lock1.position.x;
        lock1.position.set(currXPos - moveSpeed, 25);
        currXPos = lock2.position.x;
        lock2.position.set(currXPos - moveSpeed, 25); 
        currXPos = lock3.position.x;
        lock3.position.set(currXPos - moveSpeed, 25);        

        distanceTraveled += moveSpeed;
        currPointDist += moveSpeed;

        if(layer1.position.x <= -620){
            layer1.position.set(layer3.position.x + 620, 0);
            lock1.position.set(layer3.position.x + 620, 25);
        }        
        else if(layer2.position.x <= -620){
            layer2.position.set(layer1.position.x + 620, 0);
            lock2.position.set(layer1.position.x + 620, 25);
        }
        else if(layer3.position.x <= -620){
            layer3.position.set(layer2.position.x + 620, 0);
            lock3.position.set(layer2.position.x + 620, 25);
        }

        for(var i = 0; i < activeEnemies.length; i++){
            currXPos = activeEnemies[i].position.x;
            currYPos = activeEnemies[i].position.y;
            activeEnemies[i].position.set(currXPos - moveSpeed, currYPos);

            if(activeEnemies[i].position.x <= -50)
                activeEnemies[i].position.y = -200;
        }

        currXPos = paper.position.x;
        currYPos = paper.position.y;
        paper.position.setTo(currXPos - moveSpeed, currYPos);
        if(paper.position.x >= -50){
            currPointDist = 0;
        }
    }

    function MoveUP() {
        if(player.position.y !== 75)
            player.position.y -= 100;
    }
    function MoveDown() {
        if(player.position.y !== 275)
            player.position.y += 100;
    }

    function GenerateEnemies(rNum, lane){
        if(distanceTraveled >= 300){
            while(activeEnemies[rNum].position.y >= 0){
                rNum++;
                
                if(rNum > 14)
                    rNum = 0;
            }
        
            if(lane === 1){
                activeEnemies[rNum].position.set(1240, 75);
            }
            else if(lane === 2){
                activeEnemies[rNum].position.set(1240, 175);
            }
            else if(lane === 3){
                activeEnemies[rNum].position.set(1240, 275);
            }
            distanceTraveled = 0;

        }
    }

    function SpawnPaper(rNum) {
        if(rNum === 1){
            paper.position.setTo(1240, 125);
        }
        else if(rNum === 2){
            paper.position.setTo(1240, 215);
        }
        else if(rNum === 3){
            paper.position.setTo(1240, 305);
        }
    }

    function Score(){
        paper.position.y = -100;
        pointDistMAX += 200;
        score++;
        moveSpeed++;
        scoreText.text = "Score: " + score;
        pointSound.play();
    }

    function Hurt(){
        if(hurtDuration === 0){
            health--;
            hurtDuration++;
            healthText.text = "Health: " + health;
            hurtSound.play();
        }
    }
