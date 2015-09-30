Crafty.c 'Enabled',
  init: ->
    @requires 'Color, Mouse'
    @color '#ffffff', 0.0
    @bind 'MouseOver', ->
      @color '#6666b6', 0.2
      return
    @bind 'MouseOut', ->
      @color '#ffffff', 0.0
      return
    return
  disable: ->
    @removeComponent 'Enabled'
    @addComponent 'Disabled'
    return


Crafty.c 'Disabled', init: ->
  @requires 'Color, Mouse, Delay'
  @color '#ff0000', 0.5
  @bind 'MouseOut', ->
    @color '#ff0000', 0.5
    return
  @delay (->
    @removeComponent 'Disabled'
    @addComponent 'Enabled'
    return
  ), 20000, 0
  return


Crafty.c 'Tower',
  init: ->
    @requires 'Actor, Mouse, Tooltip, Color, Delay, Enabled'
    @attr
      level: 1
      tooltipWidth: 250
      tooltipHeight: 110
    if Crafty.mobile
      @bind 'MouseUp', ->
        if @previousMouseUp
          @upgrade()
        else
          @previousMouseUp = true
        return
    else
      @bind 'Click', ->
        if Crafty('Sidebar').selectedTower == this
          @upgrade()
        else
          Crafty('Sidebar').openFor this
        return
    return
  isUpgradable: ->
    @level < @maxLevel
  upgrade: ->
    upgradeCost = @getUpgradeCost()
    if @isUpgradable()
      if Game.money >= upgradeCost
        @level++
        Game.money -= upgradeCost
        Game.towerCost = @getUpgradeCost()
        Game.towerLevel = @level
        Crafty.trigger 'TowerUpgraded', this
      console.log 'Upgraded tower (' + @at().x + '/' + @at().y + ') for ' + upgradeCost
    else
      console.log 'Tower (' + @at().x + '/' + @at().y + ') at max level, can\'t upgrade it'
    return
  getUpgradeText: ->
    if @isUpgradable()
      '(Upgrade costs ' + @getUpgradeCost() + '$) <br>'
    else
      '(maximum level reached)'
  sell: ->
    Game.money += @getSellValue()
    Crafty.trigger 'TowerSold', this
    @destroy()
    console.log 'Sold tower for ' + @getSellValue() + '$'
    return
  getSellValue: ->
    totalCost = 0
    level = 1
    while level <= @level
      levelCost = @getUpgradeCost(level)
      if levelCost != 'MAX'
        totalCost += levelCost
      level++
    Math.floor totalCost * 0.5