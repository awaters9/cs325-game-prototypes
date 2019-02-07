"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game( 800, 480, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
    
    
    function preload() {
        game.load.image('background', 'assets/background.png');
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('ground', 'assets/roof.png');
        game.load.image('wall', 'assets/wall.png');
        game.load.spritesheet('player', 'assets/player.png', 64, 64);
        game.load.spritesheet('sWeap', 'assets/WeaponSwingLR.png', 19, 16);
        game.load.image('rWeap', 'assets/weaponRest.png');
        game.load.audio('swingNoise', 'assets/swordSound.mp3');
    }
    
    //var bouncy;
    var cursors;
    var walls;
    var player;
    var sword;
    
    var keys;

    var bullet1, bullet2, bullet3, bullet4, bullet5;

    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        //bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'logo' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        //bouncy.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
        //game.physics.enable( bouncy, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        //bouncy.body.collideWorldBounds = true;
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        //var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        //var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
        //text.anchor.setTo( 0.5, 0.0 );
        


        player = game.add.sprite(200, 240, 'player');
        player.animations.add('left', [0,2], 10, true);
        player.animations.add('right', [4,6], 10, true);
        player.animations.add('still', [3], 20, true);

        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;
        player.body.gravity.y = 800;

/*
        bullets = game.add.group();
        for (var i = 10; i < 130; i += 20) {
           var bull = bullets.create(i, 420-i, 'bullet'); 
           bull.sprite.checkWorldBounds = true;       
           game.physics.enable(bull, Phaser.Physics.ARCADE);
                    
           bull.body.collideWorldBounds = true;
           bull.body.bounce = 1.2;
           bull.body.velocity.x = -400;
           //game.physics.arcade.checkCollision()
        }
        */

        bullet1 = createBullet(10, 420);
        bullet2 = createBullet(50, 260);
        bullet3 = createBullet(750, 20);
        bullet4 = createBullet(450, 360);
        bullet5 = createBullet(150, 160);

        sword = game.add.sprite(player.x, player.y, 'sWeap');
        sword.animations.add('swingL', [0,2], 15, true);
        sword.animations.add('swingR', [3,5], 15, true);
        game.physics.enable(sword, Phaser.Physics.ARCADE);
        sword.body.velocity = 0;


        
        keys = {
            attackL: game.input.keyboard.addKey(Phaser.Keyboard.A),
            attackR: game.input.keyboard.addKey(Phaser.Keyboard.D)
        };

        cursors = game.input.keyboard.createCursorKeys();

    }
    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );
        if(cursors.left.isDown){
            player.body.velocity.x = -400;
            player.play('left');
        }
        else if(cursors.right.isDown){
            player.body.velocity.x = 400;
            player.play('right');
        }
    
        else{
            player.body.velocity.x = 0;
            player.play('still');
        }

         if(cursors.up.isDown ){
            player.body.velocity.y = -300;
        }
        if(keys.attackR.isDown){
            sword.animations.play('swingR');
            swingR();
            var snd = game.add.audio("swingNoise");
            snd.play();
        }
        else if(keys.attackL.isDown){
            sword.animations.play('swingL');
            swingL();
            var snd = game.add.audio("swingNoise");
            snd.play();
        }

        game.physics.arcade.collide(
            player,
            bullet1,
            game.Death,
            null,
            this)

        game.physics.arcade.collide(
            player,
            bullet2,
            game.Death,
            null,
            this)

        game.physics.arcade.collide(
            player,
            bullet3,
            game.Death,
            null,
            this)

        game.physics.arcade.collide(
            player,
            bullet4,
            game.Death,
            null,
            this)

        game.physics.arcade.collide(
            player,
            bullet5,
            game.Death,
            null,
            this)

//SWORDS COLLISION
        game.physics.arcade.collide(
            sword,
            bullet2,
            game.Death,
            null,
            this)

        game.physics.arcade.collide(
            sword,
            bullet3,
            game.Death,
            null,
            this)

        game.physics.arcade.collide(
            sword,
            bullet4,
            game.Death,
            null,
            this)

        game.physics.arcade.collide(
            sword,
            bullet5,
            game.Death,
            null,
            this)

        game.physics.arcade.collide(
            sword,
            bullet1,
            game.Death,
            null,
            this)



    }

    function Death(){
        game.physics.stop();
    }


function createBullet(x, y){
    var bullet = game.add.sprite(x, y, 'bullet');
    game.physics.enable(bullet, Phaser.Physics.ARCADE);
    bullet.checkWorldBounds = true;
    bullet.body.collideWorldBounds = true;
    bullet.body.bounce.set(1);
    bullet.body.velocity.x = -400;   

    return bullet;
}

function swingR(){
    sword.x = player.x + 100;
    sword.y = player.y + 32;

}

function swingL(){
    sword.x = player.x - 50;
    sword.y = player.y + 32;
}


};




