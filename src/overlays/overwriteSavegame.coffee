Crafty.c 'OverwriteSavegame',
  init: ->
    @requires 'Overlay'

    @overlayWidth = 300
    @overlayHeight = 90

    @centerOverlayHorizontally()
    # y is set outside

  showOverlay: ->
    @generateOverlay()

    infoTextContent = 'Starting a new game will overwrite your already saved game. Continue?'
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
        Crafty.trigger 'OverwriteSavegameConfirmed'
        return

    @overlay.attach confirmButton
