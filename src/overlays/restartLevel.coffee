Crafty.c 'RestartLevel',
  init: ->
    @requires 'Overlay'

    @overlayWidth = 300
    @overlayHeight = 90

    @centerOverlayHorizontally()
    @centerOverlayVertically()

    @generateOverlay()

    infoTextContent = 'Really restart this level? You will restart at wave 1 with no towers!'
    tooltipText = Crafty.e('2D, DOM, Text').attr(
      x: @x + 2
      y: @y + 2
      w: @overlayWidth
      h: 50
      z: @baseZ + 20
    ).text(infoTextContent).textFont(Game.overlayInfoFont).textColor(Game.headlineColor).css(Game.centerCss)

    @overlay.attach tooltipText

    confirmButton = Crafty.e('DOMButton').attr(
      x: @x + 2
      y: @y + 50
      w: @overlayWidth
      h: 50
      z: @baseZ + 20
    ).text('Confirm').disableTooltip().bind 'Click', ->
        Crafty.trigger 'RestartLevel'
        return

    @overlay.attach confirmButton
