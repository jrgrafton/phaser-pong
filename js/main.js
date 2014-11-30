window.addEventListener('load',function() {
  var DEBUG = true;

  // Turn off logging when not in debugging
  if(!DEBUG) {
    console.log = function() {}
    console.debug = function() {}
    console.info = function() {}
  }

  // initialize the framework
  var game = new Phaser.Game(1280, 768, Phaser.AUTO, 'game');

  // add game states
  game.state.add('Boot', PhaserPong.Boot);
  game.state.add('Preloader', PhaserPong.Preloader);
  game.state.add('MainMenu', PhaserPong.MainMenu);
  game.state.add('Game', PhaserPong.Game);
  game.state.add('GameOver', PhaserPong.GameOver);

  // start the Boot state
  game.state.start('Boot');
});