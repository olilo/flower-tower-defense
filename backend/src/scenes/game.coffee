# Main game scene
# ---------------
Crafty.scene 'Game', ->
# background
  Crafty.e '2D, Canvas, ' + Game.backgroundAsset
  Crafty.audio.stop()
  Crafty.audio.play 'Background', -1
  # HUD
  Crafty.e('HudElement').observe('Money', 'money', '$').at 1
  Crafty.e('HudElement').observe('Lifes', 'lifes').at(6).alertIfBelow 3
  Crafty.e('HudElement').observe('Enemies', 'enemyCount').at 10
  Crafty.e('HudElement').observe('Wave', 'currentWave').at 14
  Crafty.e('HudElement').observe('FPS', Game.actualFPS.FPS).at 18
  Crafty.e('DOMButton, Grid').text('Restart level').tooltip('Restart this level with difficulty ' + Game.difficulty + ' at wave 1').textColor(Game.highlightColor).textFont(Game.hudFont).unbind('Click').bind('Click', ->
    if window.confirm('Really restart this level? You will restart at wave 1 with no towers!')
      console.log 'Restarting level ' + Game.level
      # we need crafty unpaused for initialization
      if Crafty.isPaused()
        Crafty.pause()
      # reset difficulty-related properties
      Game.setDifficultyProperties Game.difficulty
      Crafty.scene 'InitializeLevel' + Game.level
    return
  ).at(20, 0).attr w: 180
  # tower selectors
  Crafty.e('TowerSelector').forTower('FlowerTower').attr(
    tooltipWidth: 500
    tooltipHeight: 130).tooltip('Click here to select the Flower Tower.<br> If you click anywhere on the map you build this tower.<br>' + 'It shoots in all 4 directions with limited range.<br> Gains higher range on upgrade.<br> Hotkey: C').withSprite('flower_tower5').withHotkey('C').at 1, Game.map_grid.height - 1
  Crafty.e('TowerSelector').forTower('SniperTower').attr(
    tooltipWidth: 500
    tooltipHeight: 130).tooltip('Click here to select the Sniper Tower.<br> If you click anywhere on the map you build this tower.<br> ' + 'It shoots anywhere on the map, but cost increases.<br> Gains instant kill on highest level.<br> Hotkey: V').withSprite('sniper_tower4').withHotkey('V').at 3, Game.map_grid.height - 1
  # win/lose conditions
  Crafty.bind 'EnterFrame', ->
    if Game.lifes <= 0
      Crafty.unbind 'EnterFrame'
      Crafty.scene 'GameOver'
    return
  Crafty.bind 'WaveFinished', (waveNumber) ->
    Crafty.storage 'ftd_save1', Game
    if Game.lifes > 0 and waveNumber == Game.waves.current.length
      Crafty.unbind 'EnterFrame'
      Crafty.scene 'Won'
    return
  # necessary event handling
  Crafty.bind 'TowerCreated', (tower) ->
# insert in tower map
    towerNames = [
      'FlowerTower'
      'SniperTower'
    ]
    i = 0
    while i < towerNames.length
      if tower.has(towerNames[i])
        Game.towerMap[tower.at().x][tower.at().y].name = towerNames[i]
        Game.towerMap[tower.at().x][tower.at().y].level = 1
        return
      i++
    return
  Crafty.bind 'TowerUpgraded', (tower) ->
# update tower map
    Game.towerMap[tower.at().x][tower.at().y].level = tower.level
    return
  # Populate our playing field with trees, path tiles, towers and tower places
  # we need to reset sniper tower cost, because when placing them in the loop the cost goes up again
  Game.towers['SniperTower'] = Game.sniperTowerInitial
  #console.log(Game.towerMap);
  x = 0
  while x < Game.map_grid.width
    y = 0
    while y < Game.map_grid.height
      if Game.path.isOnEdge(x, y)
        Crafty.e('Tree').at x, y
      else if Game.path.isOnPath(x, y)
        Crafty.e('Path').at x, y
      else if Game.towerMap[x][y].level > 0
        Crafty.e(Game.towerMap[x][y].name).at(x, y).attr('level': Game.towerMap[x][y].level).updateTooltip()
      else
        Crafty.e('TowerPlace').at x, y
      y++
    x++
  # initialize wave (handles spawning of every wave)
  Crafty.e('Wave').at Game.map_grid.width - 5, Game.map_grid.height - 1
  # initialize sidebar
  Crafty.e 'Sidebar'
  # help button
  Crafty.e('DOMButton, Grid').text('Help').textFont(Game.waveFont).at(8, Game.map_grid.height - 1).attr(w: 100).tooltip('If you are lost, look here').bind 'Click', ->
# create an overlay that explains the general concept
    overlay = document.getElementById('helpOverlay')
    if overlay
      overlay.parentNode.removeChild overlay
    else
      overlay = document.createElement('div')
      overlay.setAttribute 'id', 'helpOverlay'
      overlay.style.position = 'absolute'
      overlay.style.width = Game.width() - 40 + 'px'
      overlay.style.padding = '10px'
      overlay.style.left = '10px'
      overlay.style.top = '30px'
      overlay.style.border = '1px solid black'
      overlay.style.background = 'grey'
      overlay.style.zIndex = '1000'
      overlay.innerHTML = '<p>Click anywhere to build the selected tower type. ' +
          'You can find the selected tower type in the lower left of the screen (black is selected).' +
          '</p><p>' + 'When you click on an already built tower you upgrade that tower. ' +
          'The costs and the current tower level are displayed on mouse over ' +
          'in the top right of the screen (Cost and Level).' + '</p><p>' +
          '<em><strong>There are two tower types to choose from, ' +
          'with the first one automatically selected:</strong></em>' + '</p><p>' +
          'The first tower type shoots leafs into all 4 directions, which damage the enemy on impact. ' +
          'They have a limited range so build these towers near the path. ' +
          'Their range increases on higher levels.' + '</p><p>' +
          'The second tower shoots all over the map at a single random target.' +
          'The first tower you build of this type is relatively cheap, ' +
          'but each one after the first one gets more and more expensive. ' +
          'Upgrading, however, always costs the same.<br>' +
          'This tower gains a 2% chance to instantly kill an enemy on its highest level.' + '</p><p>' +
          'You have to start the first wave by clicking “Start”. ' +
          'After that the waves come automatically, ' +
          'but you can start the next wave earlier by clicking “Next Wave” again.' + '</p><p>' +
          'You win if you finish all 15 waves. You can challenge yourself ' +
          'and see how far you can get in endless mode after that.' + '</p>'
      document.getElementById('cr-stage').appendChild overlay

  pauseOverlay = document.createElement('div')
  pauseOverlay.style.border = '1px solid black'
  pauseOverlay.style.backgroundColor = 'grey'
  pauseOverlay.style.display = 'none'
  pauseOverlay.style.position = 'absolute'
  pauseOverlay.style.padding = '10px'
  pauseOverlay.style.left = '350px'
  pauseOverlay.style.top = '200px'
  pauseOverlay.style.font = 'bold 36px "sans-serif"'
  pauseOverlay.style.color = 'white'
  pauseOverlay.style.zIndex = '900'
  pauseOverlay.innerHTML = 'Paused'
  document.getElementById('cr-stage').appendChild pauseOverlay
  Crafty.e('DOMButton, Grid, Keyboard, Delay').text('Pause').textFont(Game.waveFont).at(11, Game.map_grid.height - 1).attr(
    w: 100
    h: 50).tooltip('Pause or unpause the game (Hotkey: P)').bind('Click', ->
    Crafty.pause()
    if Crafty.isPaused()
      pauseOverlay.style.display = 'block'
    else
      pauseOverlay.style.display = 'none'
  ).bind 'KeyDown', ->
    if @isDown('P')
      Crafty.pause()
      if Crafty.isPaused()
        pauseOverlay.style.display = 'block'
      else
        pauseOverlay.style.display = 'none'
    return

  Crafty.e('SoundButton, Grid').textFont(Game.waveFont).attr(
    w: 150
    h: 50).at 15, Game.map_grid.height - 1