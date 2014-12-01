PhaserPong.Game = function(game){
  // define needed variables for PhaserPong.Game
  this.playerScore_ = null;
  this.computerScore_ = null;

  this.player_ = null;
  this.computer_ = null;
  this.ball_ = null;
  this.pauseOverlay_ = null;

  // Game over at this score
  this.MAX_SCORE = 10;
};
PhaserPong.Game.prototype = {
  create: function(){
    this.addSprites_();
    this.enablePhysics_();

    // Pause handlers
    this.game.onPause.add(this.managePause_, this);
    this.game.onResume.add(this.manageResume_, this);

    // Sounds
    this.music = this.game.add.audio('in-game');
    this.music.play('',0,1,true);
    this.sfx = {};
    this.sfx["ping"] = this.game.add.audio('ping');
    this.sfx["pong"] = this.game.add.audio('pong');
    this.sfx["point"] = this.game.add.audio('point');


    if(window.DEBUG) {
      // for fps measuring
      this.game.time.advancedTiming = true;
      // override the original render() method 
      this.game.state.onRenderCallback = function() {
        this.game.debug.text('fps: '+ this.game.time.fps, 32, 20);
      }
    }
  },
  addSprites_: function() {
    // Add all sprites
    var cacheNet = this.game.cache.getImage('net');
    var spriteNet = this.add.sprite(
        this.game.world.centerX - cacheNet.width / 2,
        0, 'net');

    var cacheBat = this.game.cache.getImage('bat');
    this.player_ = this.add.sprite(0,
        this.game.world.centerY - cacheBat.height / 2, 'bat');
    this.computer_ = this.add.sprite(this.game.world.width - cacheBat.width,
        this.game.world.centerY - cacheBat.height / 2, 'bat');

    this.playerScore_ = this.game.add.bitmapText(this.game.world.centerX, 0,
        'kindly-rewind-glow','0', 170);
    this.playerScore_.y += this.playerScore_.height / 4;
    // Bitmap font width calculation errors...
    this.playerScore_.x -= this.playerScore_.width / 2.8;
    this.playerScore_.x -= this.playerScore_.width;

    this.computerScore_ = this.game.add.bitmapText(this.game.world.centerX, 0,
        'kindly-rewind-glow','0', 170);
    this.computerScore_.y += this.computerScore_.height / 4;
    this.computerScore_.x -= this.computerScore_.width / 2.8;
    this.computerScore_.x += this.computerScore_.width;

    var cacheBall = this.game.cache.getImage('ball');
    this.ball_ = this.add.sprite(this.game.world.centerX - cacheBall.width / 2,
        this.game.world.centerY - cacheBall.height / 2, 'ball');

    this.pauseOverlay_ = this.add.sprite(0, 0, 'paused-overlay');
    this.pauseOverlay_.visible = false;
    this.add.sprite(0, 0, 'scanlines');
  },
  enablePhysics_: function() {
    // start the physics engine
    this.physics.startSystem(Phaser.Physics.ARCADE);

    //  No auto checking collisions vs left or right walls
    this.game.physics.arcade.checkCollision.left = false;
    this.game.physics.arcade.checkCollision.right = false;

    this.game.physics.enable(this.player_, Phaser.Physics.ARCADE);
    this.game.physics.enable(this.computer_, Phaser.Physics.ARCADE);
    this.game.physics.enable(this.ball_, Phaser.Physics.ARCADE);

    this.player_.body.collideWorldBounds = true;
    this.player_.body.bounce.set(0);
    this.player_.body.immovable = true;
    this.player_.body.setSize(18, 126, 20, 20);

    this.computer_.body.collideWorldBounds = true;
    this.computer_.body.bounce.set(0);
    this.computer_.body.immovable = true;
    this.computer_.body.setSize(18, 126, 20, 20);

    //this.ball_.anchor.set(0.5);
    this.ball_.checkWorldBounds = true;
    this.ball_.body.collideWorldBounds = true;
    this.ball_.body.bounce.set(1);
    this.ball_.body.setSize(18, 18, 20, 20);

    // Point scored when ball goes out of bounds
    this.ball_.events.onOutOfBounds.add(this.pointScored_, this);

    // Initial velocity for ball
    this.reset_();
  },
  managePause_: function() {
    this.pauseOverlay_.visible = true;
    // pause the game
    
  },
  manageResume_: function() {
    this.pauseOverlay_.visible = false;
    // pause the game
  },
  update: function() {
    // Move player
    this.player_.y = this.game.input.y - 20;

    if(this.player_.y + this.player_.height > this.game.height) {
      this.player_.y = this.game.height - this.player_.height;
    }

    // Collide ball and paddles
    this.game.physics.arcade.collide(this.ball_,
        this.player_, this.ballHitBat_.bind(this, this.ball_, this.player_),
        null, this);

    this.game.physics.arcade.collide(this.ball_,
        this.computer_, this.ballHitBat_.bind(this, this.ball_, this.computer_),
        null, this);

    // AI
    var computerCenterY = this.computer_.y + this.computer_.height / 2;
    if(Math.abs(computerCenterY - this.ball_.y) < this.computer_.height / 10
        || this.ball_.x < this.game.world.width / 2) {
      return;
    }

    // Track ball
    if(computerCenterY < this.ball_.y) {
      this.computer_.y += 10 + Math.random() * 20;
    }
    else {
      this.computer_.y -= 10 + Math.random() * 20;
    }

    // Keep AI from going off the screen
    if(this.computer_.y < 0) {
      this.computer_.y = 0;
    }
    if(this.computer_.y + this.computer_.height > this.game.height) {
      this.computer_.y = this.game.height - this.computer_.height;
    }
  },
  ballHitBat_: function(ball, bat) {
    var ballTotalVelocity = Math.abs(ball.body.velocity.x)
        + Math.abs(ball.body.velocity.y);

    var diffMax = bat.body.height / 2;
    var diff = (ball.body.y + ball.body.height / 2)
        - (bat.body.y + bat.body.height / 2);
    var diffComponent = diff / diffMax;

    // Prevent from going too vertical
    diffComponent = (diffComponent > 0.7)? 0.7 : diffComponent;
    diffComponent = (diffComponent < -0.7)? -0.7 : diffComponent;

    // Prevent from going to horizontal
    diffComponent =
        (diffComponent > 0 && diffComponent < 0.2)? 0.2 : diffComponent;
    diffComponent =
        (diffComponent < 0 && diffComponent > -0.2)? -0.2 : diffComponent;

    // Final y velocity
    var finalYVelocity = ballTotalVelocity * diffComponent;
    var finalXVelocity = ballTotalVelocity - Math.abs(finalYVelocity);

    // Adjust XVelocity back to original direction
    finalXVelocity *= (ball.body.velocity.x < 1)? -1 : 1;

    // Apply adjusted velocities
    ball.body.velocity.x = finalXVelocity;
    ball.body.velocity.y = finalYVelocity;

    // Play SFX
    (ball.x < this.world.width / 2)?
        this.sfx["ping"].play() : this.sfx["pong"].play()

    // Speed up
    ball.body.velocity.y *= 1.3;
    ball.body.velocity.x *= 1.3;
  },
  pointScored_: function() {
    var newScore;
    // Who scored?
    if(this.ball_.body.x < this.game.world.centerX) {
      // Computer
      newScore = parseInt(this.computerScore_.text) + 1;
      this.computerScore_.text = "" + newScore;
    }
    if(this.ball_.body.x > this.game.world.centerX) {
      // Player
      newScore = parseInt(this.playerScore_.text) + 1;
      this.playerScore_.text = "" + newScore;
    }

    // Play SFX
    this.sfx["point"].play();

    // Reset or game over
    (newScore >= this.MAX_SCORE)? this.gameOver_() : this.reset_();
  },
  reset_: function() {
    this.computer_.x = this.game.world.width - this.computer_.width;
    this.computer_.y = this.game.world.centerY - this.player_.height / 2;
    this.computer_.body.velocity.y = 0;

    this.ball_.x = this.game.world.centerX - this.ball_.width;
    this.ball_.y = this.game.world.centerY - this.ball_.height;

    this.ball_.body.velocity.x = -Math.random() * 100 + 250;
    this.ball_.body.velocity.y = Math.random() * 100 + 250;
  },
  gameOver_: function() {
    // Send data over to next state
    this.game.state.states['GameOver'].scores = {
      player: this.playerScore_.text,
      computer: this.computerScore_.text
    };
    // Stop music
    this.music.stop();

    this.state.start('GameOver');
  }
};