"use strict";

BasicGame.Win = function (game) {

	this.Button = null;
};

BasicGame.Win.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		this.add.sprite(0, 0, 'winBackground');
		this.add.sprite(100, 0, 'dinoWin');

		var style = { font: "64px Verdana", fill: "#ffffff", align: "center" };
		var text = this.game.add.text( 40, 400, "SUMMER BREAK TIME", style );

		this.Button = this.add.button( 303, 500, 'playButton', this.startGame, this, 'over', 'out', 'down');

	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	startGame: function (pointer) {

		//	And start the actual game
		this.state.start('Game');

	}

};