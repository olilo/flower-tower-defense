Crafty.c 'Overlay',
  init: ->
    @baseZ = 600
    @css = Game.overlayCss

  centerOverlayHorizontally: ->
    @x = (Game.width() - @overlayWidth) / 2

  centerOverlayVertically: ->
    @y = (Game.height() - @overlayHeight) / 2

  generateOverlay: ->
    @overlay = Crafty.e('2D, DOM').attr(
      x: @x
      y: @y
      w: @overlayWidth
      h: @overlayHeight
      z: @baseZ
    ).css(@css)
