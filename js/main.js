window.addEventListener('load',function() {
  window.DEBUG = false;

  // Turn off logging when not in debugging
  if(!window.DEBUG) {
    console.log = function() {}
    console.debug = function() {}
    console.info = function() {}
  }

  // initialize the framework
  var game = new Phaser.Game({
      width: 1280,
      height: 768,
      renderer: Phaser.AUTO,
      parent: document.getElementById('game'),
      enableDebug: window.DEBUG
  });
  //game.debug = { preUpdate: function() {} };

  // add game states
  game.state.add('Boot', PhaserPong.Boot);
  game.state.add('Preloader', PhaserPong.Preloader);
  game.state.add('MainMenu', PhaserPong.MainMenu);
  game.state.add('Game', PhaserPong.Game);
  game.state.add('GameOver', PhaserPong.GameOver);

  // start the Boot state
  game.state.start('Boot');
});