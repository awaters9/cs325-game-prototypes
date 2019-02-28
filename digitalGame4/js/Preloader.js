"use strict";

BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, swap them for your own.
		this.load.image('titlePage', 'assets/TitleScreen.png');
		this.load.atlas('playButton', 'assets/play_button.png', 'assets/play_button.json');
		//	+ lots of other required assets here
        this.load.image( 'logo', 'assets/phaser.png' );

        this.load.image('background', 'assets/Day Sky.png');
        //Loads the player asset
        this.load.image('hippo', 'assets/hippo.png');
        //Loads the objective asset
        this.load.spritesheet('foods', 'assets/HippoFoods.png', 24, 24, 8);

        //Load Level 1 Map
        this.load.tilemap('level1', 'assets/Level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('level2', 'assets/Level2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('level3', 'assets/Level3.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/tileImg.png');

        this.load.audio('eatNoise', 'assets/eat.mp3');
	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.		
			this.ready = true;
			this.state.start('MainMenu');
	}

};
