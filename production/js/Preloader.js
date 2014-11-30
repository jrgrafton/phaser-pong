PhaserPong.Preloader = function(game){
  // define width and height of the game
  PhaserPong.GAME_WIDTH = 1280;
  PhaserPong.GAME_HEIGHT = 768;
};
PhaserPong.Preloader.prototype = {
  preload: function(){
    // set background color and preload image
    this.stage.backgroundColor = '#000';

    // Add preloader assets
    var cacheLogo = this.game.cache.getImage('logo');
    var spriteLogo = this.add.sprite(
        this.game.world.centerX - cacheLogo.width / 2,
        this.game.height / 4, 'logo');

    spriteLogo.alpha = 0;
    this.game.add.tween(spriteLogo).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, false, 0, 1000, false);

    // +20 to compensate for outer glow
    var textLoading = this.game.add.bitmapText(spriteLogo.x + 20,
          spriteLogo.y + spriteLogo.height * 1.25,
          'kindly-rewind','Loading...', 36);

    var spriteLoadingBarFrame = this.game.add.sprite(textLoading.x,
          textLoading.y + textLoading.height * 1.66, 'loading-bar-frame');

    // +3 for border width
    this.cacheLoadingBar = this.game.cache.getImage('loading-bar');
    this.spriteLoadingBar = this.game.add.sprite(spriteLoadingBarFrame.x + 3,
          spriteLoadingBarFrame.y + 3, 'loading-bar');
    this.spriteLoadingBar.crop(new Phaser.Rectangle(
          0, 0, 0, this.spriteLoadingBar.height))

    var scanlines = this.add.sprite(0, 0, 'scanlines');

    // Add file loaded callback
    this.load.onFileComplete.add(this.onFileComplete_.bind(this));

    // load images
    this.load.image('ball', 'img/ball.png');
    this.load.image('bat', 'img/bat.png');
    this.game.load.spritesheet('button',
          'img/button-spritesheet.png', 288, 100);
    this.load.image('loose', 'img/loose.png');
    this.load.image('net', 'img/net.png');
    this.load.image('paused-overlay', 'img/paused-overlay.png');
    this.load.image('win', 'img/win.png');

    // load fonts
    this.load.bitmapFont('kindly-rewind-glow', 'fonts/kindly-rewind-glow.png',
        'fonts/kindly-rewind-glow.xml');
  },
  onFileComplete_ : function(progress) {
    this.spriteLoadingBar.crop(new Phaser.Rectangle(
          0, 0, this.cacheLoadingBar.width * (progress / 100),
          this.spriteLoadingBar.height));
  },
  create: function(){
    // start the MainMenu state
    document.body.classList.add("ready");
    this.state.start('MainMenu');
  }
};