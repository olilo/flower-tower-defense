Crafty.c 'Actor', init: ->
  @requires '2D, Canvas, Grid'

Crafty.c 'Bullet', init: ->
  @requires 'Actor, Collision, PathWalker'
  @attr damage: 1

Crafty.c 'Tree', init: ->
  @requires 'Actor, Color'
  @color 'rgb(20, 125, 40)'

Crafty.c 'Path', init: ->
  @requires 'Actor, Image, Color'
  @image('assets/transparent.png').color '#969600', 0.42
