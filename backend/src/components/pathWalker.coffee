# The PathWalker component allows an entity to move along a path,
# given as an array of objects with x and y attributes
Crafty.c 'PathWalker',
  init: ->
  animate_along: (path, speed) ->
    if !speed
      speed = 1
    animation =
      actor: this
      speed: speed
      steps: []
    i = 0
    while i < path.length
      animation.steps.push
        x: path[i].x * Game.map_grid.tile.width
        y: path[i].y * Game.map_grid.tile.height
      #console.log("Tweening to x=" + path[i].x + ", y=" + path[i].y);
      i++
    Tweening.targets.push animation
    this
  animate_to: (x, y, speed) ->
    @animate_along [ {
      x: x
      y: y
    } ], speed
  destroy_after_animation: ->
    that = this
    Crafty.bind 'TweenEnded', (actor) ->
      if actor == that
        that.destroy()
      return
    this