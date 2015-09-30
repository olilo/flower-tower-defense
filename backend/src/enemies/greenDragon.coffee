Crafty.c 'GreenDragon', init: ->
  @requires 'Enemy, green_dragon'
  @attr
    health: 200
    reward: 50
    speed: 1.5
    livesTaken: 3
    noInstantKill: true
    tooltipHeight: 60
    tooltipTextBase: 'Green Dragon'
  return