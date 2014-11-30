var PhaserPong = {};
PhaserPong.Boot = function(game){};
PhaserPong.Boot.prototype = {
  preload: function(){
    // preload assets needed for loading screen
    this.load.image('loading-bar-frame', 'img/loading-bar-frame.png');
    this.load.image('loading-bar', 'img/loading-bar.png');
    this.load.image('logo', 'img/logo.png');
    this.load.bitmapFont('kindly-rewind', 'fonts/kindly-rewind.png',
        'fonts/kindly-rewind.xml');
    this.load.image('scanlines', 'img/scanlines.png');
  },
  create: function(){
    // set input options
    this.input.maxPointers = 1;
    
    // start the Preloader state
    this.state.start('Preloader');
  }
};