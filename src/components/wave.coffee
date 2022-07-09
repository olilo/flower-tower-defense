Crafty.c 'Wave',
  init: ->
    @requires 'Delay'

    @currentWave = Game.currentWave

    @automaticallyStartNextWave()

    return

  automaticallyStartNextWave: ->
    @bind 'EnterFrame', ->
      if @isWaveFinished()
        if !@finishedEventTriggered
          Crafty.trigger 'WaveFinished', @currentWave
          @finishedEventTriggered = true

          flowerTowers = Crafty('FlowerTower')
          i = 0
          if flowerTowers.length > 0
            @delay (->
              flowerTowers.get(i).shoot()
              i++
              return
            ), 500, flowerTowers.length - 1

        if @isNextWavePossible()
          Game.money += Game.moneyAfterWave
          @startNextWave()
          console.log 'Started wave ' + @currentWave
          @finishedEventTriggered = false

      return

    return

  isWaveFinished: ->
    Game.enemyCount == 0 and @spawnFinished

  isNextWavePossible: ->
    if Game.lifes == 0
      return false

    Game.endless or @currentWave < Game.waves.current.length

  startNextWave: ->
    @spawnFinished = false
    @waveStarted = true

    i = 0
    enemies = @getEnemies()
    interval = 3000

    if @currentWave > Game.waves.current.length
      interval = Math.max(200, 3000 - ((@currentWave - (Game.waves.current.length)) * 50))

    @delay (->
      enemy = Crafty.e(enemies[i]).at(Game.path.start.x, Game.path.start.y)
      @delay (->
        enemy.animate_along Game.path.getPath(), enemy.speed
        return
      ), 500, 0

      # special handling for all waves after standard waves: increase health
      if @currentWave > Game.waves.current.length
        diff = @currentWave - (Game.waves.current.length)
        enemy.attr health: Math.floor((1 + diff * 0.05) * enemy.health + 5 * diff)
        console.log 'new health: ' + enemy.health

      i++
      if i == enemies.length
        @spawnFinished = true
        console.log 'spawn finished'

      return
    ), interval, enemies.length - 1

    if @currentWave == Game.waves.current.length - 1
      Crafty.audio.stop()
      Crafty.audio.play 'Boss', -1

    @currentWave++
    Game.currentWave = @currentWave

    return

  getEnemies: ->
    if @currentWave < Game.waves.current.length
      Game.waves.current[@currentWave]
    else
      # TODO auto generate waves randomly, based on reward
      enemies = [
        'GreenDragon'
        'Orc'
      ]

      i = 0
      while i < @currentWave - (Game.waves.current.length)
        enemies.push if i % 10 == 4 then 'SilverDragon' else if i % 6 == 2 then 'GreenDragon' else if i % 4 == 0 then 'MightyWitch' else if i % 4 == 2 then 'FastKnight' else 'FastSquid'
        i++
      enemies.push 'GreenDragon'

      enemies
