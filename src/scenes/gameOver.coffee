Crafty.scene 'GameOver', ->
  # show GameOver screen, with "start again" button
  Crafty.background 'rgb(169, 153, 145)'
  Crafty.audio.stop()
  Crafty.audio.play 'Menu', -1

  Crafty.e('2D, DOM, Image').image('assets/ftd-logo.jpg').attr
    x: 80
    y: Game.height() * 1 / 12 - 24
    w: Game.width()
    h: 200

  Crafty.e('2D, DOM, Text').text('Game over').attr(
    x: 0
    y: Game.height() * 3 / 5 - 24
    w: Game.width()).textFont(Game.gameOverFont).textColor(Game.gameOverColor).css Game.centerCss

  Crafty.e 'RestartButton'
