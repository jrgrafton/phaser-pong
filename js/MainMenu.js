PhaserPong.MainMenu = function(game){};
PhaserPong.MainMenu.prototype = {
  create: function() {
    var cacheLogo = this.game.cache.getImage('logo');
    var spriteLogo = this.add.sprite(
        this.game.world.centerX - cacheLogo.width / 2,
        this.game.height / 4, 'logo');

    spriteLogo.alpha = 0;
    this.game.add.tween(spriteLogo).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);

    // +20 to compensate for outer glow
    var textReady = this.game.add.bitmapText(this.game.world.centerX,
          spriteLogo.y + spriteLogo.height * 1.25,
          'kindly-rewind','Ready player one?', 36);
    textReady.x -= textReady.width / 2;

    // add the button that will start the game
    var cacheButton = this.game.cache.getImage('button');
    var button = this.add.button(this.game.world.centerX,
        textReady.y + textReady.height * 2, 'button',
        this.startGame, this, 1, 0, 2, 1);
    button.x -= button.width / 2;

    var textStart = this.game.add.bitmapText(button.x + button.width / 2,
          button.y + button.height / 2,
          'kindly-rewind','Start', 36);
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

    // Music
    this.music = this.game.add.audio('intro');
    this.music.play('',0,1,true);
  },
  startGame: function() {
    // Stop music
    this.music.stop();

    // start the Game state
    this.state.start('Game');
  }
};