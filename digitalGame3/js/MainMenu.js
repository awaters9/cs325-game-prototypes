"use strict";

BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		this.music = this.add.audio('titleMusic');
		this.music.play();

		var background = this.add.sprite(-100, 0, 'titlePage');
		background.scale.setTo(4,4);
		var dino = this.add.sprite(100,100, 'dino');
		dino.scale.setTo(.6, .6);

		var style = { font: "50px Verdana", fill: "#ffffff", align: "center" };
		var text = this.game.add.text(100, 20, "FIRST DINO OF SUMMER", style);

		this.playButton = this.add.button( 303, 450, 'playButton', this.startGame, this, 'over', 'out', 'down');

	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		this.music.stop();

		//	And start the actual game
		this.state.start('Game');

	}

};
