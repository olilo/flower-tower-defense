Crafty.c 'MightyWitch', init: ->
  @requires 'Enemy, witch_down, Delay'
  @attr
    health: 100
    reward: 20
    speed: 1.8
    tooltipWidth: 200
    tooltipHeight: 60
    tooltipTextBase: 'Mighty Witch (disables towers)'

  # disable random tower for some time every 5 seconds
  @delay (->
    towers = Crafty('Tower Enabled')
    if towers.length > 0
      tower = towers.get(Math.floor(Math.random() * towers.length))
      tower.disable()
    return
  ), 5000, -1

  return
