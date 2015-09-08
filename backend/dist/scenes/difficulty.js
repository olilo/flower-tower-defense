// Generated by CoffeeScript 1.10.0
(function() {
  Crafty.scene('Difficulty', function() {
    var e;
    Crafty.background('rgb(169, 153, 145)');
    Crafty.audio.stop();
    Crafty.audio.play('Menu', -1);
    Crafty.e('2D, DOM, Image').image('assets/ftd-logo.jpg').attr({
      x: 80,
      y: Game.height() * 1 / 12 - 24,
      w: Game.width(),
      h: 200
    });
    Crafty.e('2D, DOM, Text').text('Choose your difficulty:').attr({
      x: 0,
      y: Game.height() * 3 / 6 - 24,
      w: Game.width(),
      h: 50
    }).textFont(Game.difficultyFont).textColor(Game.textColor).css(Game.centerCss);
    for (e in Game.difficulties) {
      if (!Game.difficulties.hasOwnProperty(e)) {
        continue;
      }
      Crafty.e('DOMButton').text(e).tooltip(Game.difficulties[e].tooltip).attr({
        x: Game.difficulties[e].x * Game.width() / 2,
        y: (Game.difficulties[e].y * 2 + 7) / 12 * Game.height(),
        w: Game.width() / 2,
        h: 50
      }).textFont(Game.difficultyFont).textColor(Game.difficulties[e].textColor).bind('Click', function() {});
      console.log('Chosen difficulty: ' + this.text());
      Game.setDifficultyProperties(this.text());
      Crafty.scene('MapSelection');
      return;
    }
    Crafty.e('DOMButton').text('Instructions').attr({
      x: 70,
      y: Game.height() - 50,
      w: 200,
      h: 50
    }).tooltip('Click here for some instructions').bind('Click', function() {});
    Crafty.scene('Help', 'Difficulty');
    return;
    Crafty.e('DOMButton').text('Credits').attr({
      x: 280,
      y: Game.height() - 50,
      w: 200,
      h: 50
    }).tooltip('View the credits for this game ^^').bind('Click', function() {});
    Crafty.scene('Credits', 'Difficulty');
    return;
    return Crafty.e('SoundButton').attr({
      x: 470,
      y: Game.height() - 50,
      w: 200,
      h: 50
    });
  });

}).call(this);
