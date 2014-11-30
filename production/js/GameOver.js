PhaserPong.GameOver = function(game){};
PhaserPong.GameOver.prototype = {
  create: function() {
    var cacheLogo = this.game.cache.getImage('logo');
    var spriteLogo = this.add.sprite(
        this.game.world.centerX - cacheLogo.width / 2,
        this.game.height / 4, 'logo');

    // +20 to compensate for outer glow
    var textScore = this.game.add.bitmapText(this.game.world.centerX,
        spriteLogo.y + spriteLogo.height * 1.25,
        'kindly-rewind-glow',
        this.scores.player + " - " + this.scores.computer,
        112);
    textScore.x -= textScore.width / 2;

    var resultString = (parseInt(this.scores.player) >
          parseInt(this.scores.computer))? "win!" : "lose";
    var textResult = this.game.add.bitmapText(this.game.world.centerX,
        textScore.y + textScore.height,
        'kindly-rewind-glow',
        resultString,
        50);
    textResult.x -= textResult.width / 2;

    // add the button that will start the game
    var cacheButton = this.game.cache.getImage('button');
    var button = this.add.button(this.game.world.centerX,
        textResult.y + textResult.height * 1.33, 'button',
        this.startGame, this, 1, 0, 2, 1);
    button.x -= button.width / 2;

    var textStart = this.game.add.bitmapText(button.x + button.width / 2,
          button.y + button.height / 2,
          'kindly-rewind','Restart', 36);
    textStart.x -= textStart.width / 2;
    textStart.y -= textStart.height / 1.75;

    // Adjust text so it looks like it's moving with the button
    button.onInputDown.add(function() {
      textStart.y += 5;
    });
    button.onInputUp.add(function() {
      textStart.y -= 5;
    });

    this.add.sprite(0, 0, 'scanlines');
  },
  startGame: function() {
    // start the Game state
    this.state.start('Game');
  }
};