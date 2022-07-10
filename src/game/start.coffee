Game.start = ->
  Crafty.init Game.width(), Game.height()
  Crafty.background 'rgb(169, 153, 145)'
  Game.actualFPS = Crafty.e('ActualFPS')

  Crafty.scene 'Loading'

  return
