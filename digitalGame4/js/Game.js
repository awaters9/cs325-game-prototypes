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
var map;
var platformLayer;

var rKey, lKey, spaceKey, resKey;
var reset = false;


var player;
var MAXmoveSpeed = 200;

var score = 0;
var scoreText;

var foodGroup;

var eatenFood = 0.4;

var eatSound;
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
        
        var background = this.game.add.sprite(0,0, 'background');
        background.scale.setTo(3,3);

        //Loads Level1
        this.game.stage.backgroundColor = '#787878';
        map = this.game.add.tilemap('level1');
        map.addTilesetImage('world', 'tiles');
        platformLayer = map.createLayer('Tile Layer 1');
        platformLayer.resizeWorld();
        this.game.physics.enable(platformLayer, Phaser.Physics.ARCADE);
        //map.createLayer(1);
        map.setCollision([1,2,3,4,5,6,7,9,11,12,13,14,16,17,18,19], true, 0);

        //Set up the Player Controls
        rKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        lKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(PlayerJump, this);
        resKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        resKey.onDown.add(ResetGame, this);

        //Sets up the player
        player = this.game.add.sprite(200,100, 'hippo');
        player.anchor.setTo(0.5, 0.5);
        player.scale.setTo(eatenFood,eatenFood);
        player.smoothed = false;
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.gravity.y = 300;
        player.body.bounce.set(.2);
        player.body.setCircle(35);
        this.game.camera.follow(player);


        //Set up the Food Group
        foodGroup = this.game.add.group();

        for(var j = 0; j < 8; j++){
            foodGroup.create(this.game.world.randomX, this.game.world.randomY, 'foods', j);
        }

        for(var i = 0; i < foodGroup.children.length; i++){
            foodGroup.children[i].scale.set(1.2, 1.2);
            foodGroup.children[i].smoothed = false;
            this.game.physics.enable(foodGroup.children[i], Phaser.Physics.ARCADE);
            foodGroup.children[i].body.gravity.y = 350;
            foodGroup.children[i].body.bounce.set(.2);
        }

        //Sets each food item to it's correct location
        foodGroup.children[0].position.set(96, 160);
        foodGroup.children[1].position.set(448, 128);
        foodGroup.children[2].position.set(512, 288);
        foodGroup.children[3].position.set(352, 288);
        foodGroup.children[4].position.set(448, 544);
        foodGroup.children[5].position.set(224, 160);
        foodGroup.children[6].position.set(96, 416);
        foodGroup.children[7].position.set(320, 480);

        //Text to show how much food has been eaten
        var style = { font: "40px Verdana", fill: "#ffffff", align: "center" };
        scoreText = this.game.add.text(30, 20, "Eaten 0 / 8", style);
        scoreText.fixedToCamera = true;

        //Set up noises
        eatSound = this.game.add.audio('eatNoise');
        

    },

    update: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //this.bouncy.rotation = this.game.physics.arcade.accelerateToPointer( this.bouncy, this.game.input.activePointer, 500, 500, 500 );
        this.game.physics.arcade.collide(player, platformLayer);
        this.game.physics.arcade.collide(foodGroup, platformLayer);

        MovePlayer();
        CheckBounds();
        if(player.body.velocity.x === 0){
            player.angle = player.angle;
        }
        
        for(var i = 0; i < foodGroup.children.length; i++){
            this.game.physics.arcade.overlap(player, foodGroup.children[i], CollectFood, null, this);
        }

        //RESETS THE GAME
        if(reset === true){
            reset = false;
            score = 0;
            eatenFood = 0.4;
            player.scale.setTo(eatenFood, eatenFood);
            this.state.start('Game');
        }

        if(score === 8){
            reset = false;
            score = 0;
            eatenFood = 0.4;
            player.scale.setTo(eatenFood, eatenFood);
            this.state.start('Game2');
        }
        

    },

    quitGame: function () {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
        
        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};

function MovePlayer(){
    if(lKey.isDown === true){
        if(player.body.velocity.x > -MAXmoveSpeed){
            player.body.velocity.x -= 10;
        }
        player.angle -= 10;
    }
    else if(rKey.isDown === true){
        if(player.body.velocity.x < MAXmoveSpeed){
            player.body.velocity.x += 10;    
        }
        player.angle += 10;
    }
    else{
        if(player.body.velocity.x > 0){
            player.body.velocity.x -= 2;
        }
        else{
            player.body.velocity.x += 2;
        }
    }
    if(player.angle === 360){
        player.angle = 0;
    }
    else if(player.angle === -360){
        player.angle = 0;
    }
}

function PlayerJump(){
    player.body.velocity.y -= 300;
    
}

function CollectFood(player, food){
    eatSound.play();
    food.position.set(-1000, -1000);
    if(eatenFood < 3)
        eatenFood += 0.1;
    player.scale.setTo(eatenFood, eatenFood);
    score++;
    scoreText.text = "Eaten " + score + " / 8";
    
}

function ResetGame(){
    reset = true;
}

function CheckBounds(){
    if(player.position.y > 670)
        ResetGame();
}