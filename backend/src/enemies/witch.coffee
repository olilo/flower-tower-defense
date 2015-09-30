Crafty.c 'Witch', init: ->
  @requires 'Enemy, witch_right'
  @attr
    health: 5
    reward: 1
    speed: 1.8
    tooltipTextBase: 'Witch'
  return