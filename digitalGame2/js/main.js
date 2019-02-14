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
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    var player;

    function preload() {
        game.load.tilemap('tilemap', 'assets/levelMap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/tileMap.png');
        game.load.image('player', 'assets/PlayerChar.png');
        game.load.audio('loseNoise', 'assets/airHorn.mp3');
        game.load.audio('winNoise', 'assets/winNoise.mp3');
    }
    
    
    var map;

    //layers
    var oneWayLayers = [];
    var longLayers = [];
    var tallLayers = [];

    //map Extenders
    var oneWayExt = [];
    var tallExt = [];
    var longExt = [];

    //map score boxes
    var win;
    var losePts = [];

    //score stuff
    var score = 130;
    var scoreTxt;

    function create() {
        game.world.setBounds(0,0, 2048, 1024);
        //game.stage.backgroundColor = "#4488AA";    
        game.stage.backgroundColor = "#ffddee";    

        map = game.add.tilemap('tilemap');
        map.addTilesetImage('world', 'tiles');

        oneWayLayers.push(map.createLayer('0'));
        oneWayLayers.push(map.createLayer('1'));
        oneWayLayers.push(map.createLayer('2'));
        oneWayLayers.push(map.createLayer('3'));
        oneWayLayers.push(map.createLayer('4'));
        oneWayLayers.push(map.createLayer('5'));
        oneWayLayers.push(map.createLayer('6'));
        oneWayLayers.push(map.createLayer('7'));
        oneWayLayers.push(map.createLayer('8'));
        oneWayLayers.push(map.createLayer('9'));
        oneWayLayers.push(map.createLayer('10'));
        oneWayLayers.push(map.createLayer('11'));
        oneWayLayers.push(map.createLayer('12'));
        oneWayLayers.push(map.createLayer('13'));
        oneWayLayers.push(map.createLayer('14'));
        oneWayLayers.push(map.createLayer('15'));
        oneWayLayers.push(map.createLayer('16'));
        oneWayLayers.push(map.createLayer('17'));
        oneWayLayers.push(map.createLayer('18'));
        oneWayLayers.push(map.createLayer('19'));
        oneWayLayers.push(map.createLayer('20'));
        oneWayLayers.push(map.createLayer('21'));
        oneWayLayers.push(map.createLayer('22'));
        for(var i = 0; i < oneWayLayers.length; i++){
            oneWayLayers[i].alpha = 0;
        }

        longLayers.push(map.createLayer('L0'));
        longLayers.push(map.createLayer('L1'));
        longLayers.push(map.createLayer('L2'));
        longLayers.push(map.createLayer('L3'));
        longLayers.push(map.createLayer('L4'));
        longLayers.push(map.createLayer('L5'));
        longLayers.push(map.createLayer('L6'));
        longLayers.push(map.createLayer('L7'));
        longLayers.push(map.createLayer('L8'));
        longLayers.push(map.createLayer('L9'));
        longLayers.push(map.createLayer('L10'));
        longLayers.push(map.createLayer('L11'));
        longLayers.push(map.createLayer('L12'));
        longLayers.push(map.createLayer('L13'));
        longLayers.push(map.createLayer('L14'));
        longLayers.push(map.createLayer('L15'));
        longLayers.push(map.createLayer('L16'));
        longLayers.push(map.createLayer('L17'));
        longLayers.push(map.createLayer('L18'));
        longLayers.push(map.createLayer('L19'));
        longLayers.push(map.createLayer('L20'));
        for(var i = 0; i < longLayers.length; i++){
            longLayers[i].alpha = 0;
        }

        tallLayers.push(map.createLayer('T0'));
        tallLayers.push(map.createLayer('T1'));
        tallLayers.push(map.createLayer('T2'));
        tallLayers.push(map.createLayer('T3'));
        tallLayers.push(map.createLayer('T4'));
        tallLayers.push(map.createLayer('T5'));
        tallLayers.push(map.createLayer('T6'));
        tallLayers.push(map.createLayer('T7'));
        tallLayers.push(map.createLayer('T8'));
        tallLayers.push(map.createLayer('T9'));
        tallLayers.push(map.createLayer('T10'));
        tallLayers.push(map.createLayer('T11'));
        tallLayers.push(map.createLayer('T12'));
        tallLayers.push(map.createLayer('T13'));
        tallLayers.push(map.createLayer('T14'));
        tallLayers.push(map.createLayer('T15'));
        for(var i = 0; i < tallLayers.length; i++){
            tallLayers[i].alpha = 0;
        }

        map.createLayer('Start');
        
        
        for (var i = 0; i < map.objects["OneWay"].length; i++){
            var temp = map.objects["OneWay"][i];
            oneWayExt.push(new Phaser.Rectangle(temp.x, temp.y, temp.width, temp.height));
        }
        
        for (var i = 0; i < map.objects["TallCorners"].length; i++){
            var temp = map.objects["TallCorners"][i];
            tallExt.push(new Phaser.Rectangle(temp.x, temp.y, temp.width, temp.height));
        }
        for (var i = 0; i < map.objects["WideCorners"].length; i++){
            var temp = map.objects["WideCorners"][i];
            longExt.push(new Phaser.Rectangle(temp.x, temp.y, temp.width, temp.height));
        }

        var temp = map.objects["WinStates"][0];
        win = new Phaser.Rectangle(temp.x, temp.y, temp.width, temp.height);

        for (var i = 1; i < map.objects["WinStates"].length; i++) {
            var temp = map.objects["WinStates"][i];
            losePts.push(new Phaser.Rectangle(temp.x, temp.y, temp.width, temp.height));   
        }

        //score text stuff
        scoreTxt = game.add.text(200, 10, "SCORE: " + score, {font: "32px Arial", fill: "#ff0000", align: "left"});
        scoreTxt.fixedToCamera = true;
        scoreTxt.cameraOffset.setTo(400, 20);

        //place the player at the start position and center its anchor
        player = game.add.sprite(1072, 528, 'player');
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;

        game.input.mouse.capture = true; //helps find the mouse coordinates
        game.input.onTap.add(movePlayer, this); //adds an onTap event for when the left mouse button is pressed
        game.camera.follow(player);
    }
    
    function update(){

    }

    function movePlayer(){
        var x, y;
        x = game.input.activePointer.worldX;
        y = game.input.activePointer.worldY;
        player.x = x;
        player.y = y;
        checkExpansion();
    }

    function checkExpansion(){
        for(var i = 0; i < oneWayExt.length; i++){
            if(oneWayExt[i].contains(player.x, player.y)){
                if(oneWayLayers[i] !== null){
                    oneWayLayers[i].alpha = 1;
                }
            }
        }

        for(var i = 0; i < tallExt.length; i++){
            if(tallExt[i].contains(player.x, player.y)){
                if(tallLayers[i] !== null){
                    tallLayers[i].alpha = 1;
                }
            }
        }

        for(var i = 0; i < longExt.length; i++){
            if(longExt[i].contains(player.x, player.y)){
                if(longLayers[i] !== null){
                    longLayers[i].alpha = 1;
                }
            }
        }

        for (var i = 0; i < losePts.length; i++) {
            if(losePts[i].contains(player.x, player.y)){
                score -= 10;
                scoreTxt.setText("SCORE: " + score);
                var snd = game.add.audio("loseNoise");
                snd.play();
            }
        }

        if(win.contains(player.x, player.y)){
            var snd = game.add.audio("winNoise");
            snd.play();
            alert("YOU WIN!");
        }
    }
};