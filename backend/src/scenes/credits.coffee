Crafty.scene 'Credits', (targetScene) ->
# art:
# @JoeCreates (roguelikebosses)
# Heather Harvey - cind_rella@hotmail.com (witch, originally named "heroine")
# ?? (Squid monster)
# background??
# programming:
# Crafty!! craftyjs.com
# rest by me \o/
#Crafty.e('Credits');
  Crafty.e('2D, DOM, Text').text('Programming:').textFont(Game.creditsFont).textColor(Game.highlightColor).css(Game.centerCss).attr
    x: 0
    y: 30
    w: Game.width()
    h: 50
  Crafty.e('2D, DOM, Text').text('Game-Framework is Crafty (<a target="_blank" href="http://craftyjs.com">http://craftyjs.com</a>)<br>' + 'Programming is done by me (<a target="_blank" href="http://www.github.com/olilo/flower-tower-defense/">' + 'http://www.github.com/olilo/flower-tower-defense/</a>)').textFont(Game.creditsTextFont).textColor(Game.textColor).css(Game.centerCss).attr
    x: 0
    y: 70
    w: Game.width()
    h: 100
  Crafty.e('2D, DOM, Text').text('Graphics:').textFont(Game.creditsFont).textColor(Game.highlightColor).css(Game.centerCss).attr
    x: 0
    y: 140
    w: Game.width()
    h: 50
  Crafty.e('2D, DOM, Text').text('roguelikebosses (orc, dragons, spider) by @JoeCreates<br>' + 'Witch graphic by Heather Harvey - cind_rella@hotmail.com<br>' + 'Generally: art from <a href="http://opengameart.org">http://opengameart.org</a><br>' + 'Knight and flowers by me ^^ (license-free)').textFont(Game.creditsTextFont).textColor(Game.textColor).css(Game.centerCss).attr
    x: 0
    y: 180
    w: Game.width()
    h: 120
  Crafty.e('2D, DOM, Text').text('Music:').textFont(Game.creditsFont).textColor(Game.highlightColor).css(Game.centerCss).attr
    x: 0
    y: 300
    w: Game.width()
    h: 50
  Crafty.e('2D, DOM, Text').text('Title-Song and Won-Song generated by Music Maker Jam<br>' + 'Game-Music composed and played by me (license-free)').textFont(Game.creditsTextFont).textColor(Game.textColor).css(Game.centerCss).attr
    x: 0
    y: 340
    w: Game.width()
    h: 100
  if targetScene.text
    Crafty.e('DOMButton').text(targetScene.text).attr(
      x: 280
      y: Game.height() - 50
      w: 200
      h: 50).tooltip('Continue to next screen').bind 'Click', ->
    Crafty.scene targetScene.scene
    return
  else
    Crafty.e('DOMButton').text('Back').attr(
      x: 280
      y: Game.height() - 50
      w: 200
      h: 50).tooltip('Go back to where you came from').bind 'Click', ->
    Crafty.scene targetScene
    return
  Crafty.e('SoundButton').attr
    x: 470
    y: Game.height() - 50
    w: 200
    h: 50
  return
