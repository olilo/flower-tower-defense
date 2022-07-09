(function() {
  var console;

  if (!console) {
    console = {
      log: function() {}
    };
  }

}).call(this);

(function() {
  Crafty.c('Actor', {
    init: function() {
      return this.requires('2D, Canvas, Grid');
    }
  });

}).call(this);

(function() {
  Crafty.c('ActualFPS', (function() {
    var currentFPS, frames, start;
    start = void 0;
    frames = void 0;
    currentFPS = void 0;
    return {
      init: function() {
        start = (new Date()).getTime();
        frames = 0;
        this.bind('ExitFrame', function() {
          var newTime;
          newTime = (new Date()).getTime();
          if (newTime - start >= 1000) {
            currentFPS = frames;
            frames = 0;
            start = newTime;
          } else {
            frames++;
          }
        });
      },
      FPS: function() {
        return currentFPS;
      }
    };
  })());

}).call(this);

(function() {
  Crafty.c('Bullet', {
    init: function() {
      this.requires('Actor, Collision, PathWalker');
      return this.attr({
        damage: 1
      });
    }
  });

}).call(this);

(function() {
  // The button component styles a (text) component as a button
  Crafty.c('Button', {
    init: function() {
      this.requires('2D, Text, Mouse, Tooltip');
      // override textColor method to save used text colors
      this.overrideTextColorFunction();
      this._highlightColor = Game.highlightColor;
      this.textFont(Game.generalButtonFont);
      this.enable();
      if (Crafty.mobile) {
        this.bind('MouseUp', function(e) {
          if (this._previousMouseUp) {
            this.trigger('Click', e);
          } else {
            this._previousMouseUp = true;
          }
        });
      }
    },
    overrideTextColorFunction: function() {
      this._previousColors = [];
      this._previousTextColor = this.textColor;
      this.textColor = function(newColor) {
        this._previousTextColor.call(this, newColor);
        this._previousColors.unshift(newColor);
        if (this._previousColors.length > 5) {
          this._previousColors.pop();
        }
        return this;
      };
    },
    mouseOverHandler: function() {
      this._previousTextColor.call(this, this._highlightColor);
    },
    mouseOutHandler: function() {
      this.textColor(this._previousColors[0]);
      this._previousMouseUp = false;
    },
    enable: function() {
      // highlight on mouse over, but don't save the highlight color as "used text color"
      this.textColor(Game.textColor);
      this.bind('MouseOver', this.mouseOverHandler);
      this.bind('MouseOut', this.mouseOutHandler);
      this.attr({
        buttonEnabled: true
      });
      return this;
    },
    disable: function() {
      this.unbind('MouseOver', this.mouseOverHandler);
      this.unbind('MouseOut', this.mouseOutHandler);
      this.textColor(Game.disabledColor);
      this.attr({
        buttonEnabled: false
      });
      return this;
    },
    highlightColor: function(color) {
      this._highlightColor = color;
      return this;
    },
    withImage: function(imageUrl) {
      var image;
      image = Crafty.e('2D, Image, ' + (this.has('Canvas') ? 'Canvas' : 'DOM'));
      image.image(imageUrl).attr({
        x: this.x,
        y: this.y
      });
      this.attach(image);
      return this;
    },
    withSprite: function(spriteId) {
      this.addComponent(spriteId);
      return this;
    }
  });

}).call(this);

(function() {
  Crafty.c('DOMButton', {
    init: function() {
      var originalText;
      this.requires('Button, DOM');
      this.css(Game.buttonCss);
      originalText = this.text;
      this.text = function(text) {
        if (typeof text === 'undefined' || text === null) {
          return this._text;
        }
        originalText.call(this, text);
        this._element.innerHTML = this._text;
        return this;
      };
      this.enable = function() {
        this.attr({
          buttonEnabled: true
        });
        this.removeComponent('disabledButton');
        return this;
      };
      this.disable = function() {
        this.attr({
          buttonEnabled: false
        });
        this.addComponent('disabledButton');
        return this;
      };
    }
  });

}).call(this);

(function() {
  Crafty.c('Enemy', {
    init: function() {
      var that;
      this.requires('Actor, Collision, PathWalker, Delay, Tooltip');
      this.attr({
        tooltipWidth: 150,
        tooltipHeight: 30
      });
      Game.enemyCount++;
      this.checkHits('Bullet');
      this.bind('HitOn', function(hitData) {
        this.hitWithDamage(hitData[0].obj.damage);
        hitData[0].obj.destroy();
      });
      that = this;
      this.delay((function() {
        that.tooltip((that.tooltipTextBase ? that.tooltipTextBase + ' with ' : '') + this.health + ' HP');
      }), 100, -1);
      this.bind('TweenEnded', function(actor) {
        if (that === actor) {
          Game.lifes -= this.livesTaken || 1;
          this.kill(false);
          Crafty.audio.play('LifeLost', 1);
        }
      });
    },
    hitWithDamage: function(damage) {
      if (this.health <= 0) {
        return;
      }
      this.attr({
        health: this.health - damage
      });
      if (this.health <= 0) {
        Game.money += this.reward;
        this.kill();
      }
      console.log('Health: ' + this.health);
    },
    kill: function(playAudio) {
      if (playAudio === void 0) {
        playAudio = true;
      }
      if (this.dead) {
        return;
      }
      this.dead = true;
      Game.enemyCount--;
      this.destroy();
      Crafty.trigger('EnemyKilled', this);
      if (playAudio) {
        Crafty.audio.play('EnemyDead', 1);
      }
    }
  });

}).call(this);

(function() {
  // The Grid component allows an element to be located
  //  on a grid of tiles
  Crafty.c('Grid', {
    init: function() {
      this.attr({
        w: Game.map_grid.tile.width,
        h: Game.map_grid.tile.height
      });
    },
    at: function(x, y) {
      if (x === void 0 && y === void 0) {
        return {
          x: this.x / Game.map_grid.tile.width,
          y: this.y / Game.map_grid.tile.height
        };
      } else {
        this.attr({
          x: x * Game.map_grid.tile.width,
          y: y * Game.map_grid.tile.height
        });
        return this;
      }
    }
  });

}).call(this);

(function() {
  Crafty.c('HudElement', {
    init: function() {
      this.requires('2D, DOM, Grid, Text');
      this.attr({
        x: 0,
        y: 0,
        w: Game.width()
      });
      this.textFont(Game.hudFont);
      this.textColor(Game.textColor);
    },
    observe: function(prefix, observable, suffix) {
      if (suffix === void 0) {
        suffix = '';
      }
      this.observable = observable;
      this.bind('EnterFrame', function() {
        var newValue;
        newValue = void 0;
        if (typeof this.observable === 'function') {
          newValue = this.observable.call();
        } else {
          newValue = Game[this.observable];
        }
        if (this.oldValue !== newValue) {
          this.trigger('ValueChanged', newValue);
          this.oldValue = newValue;
        }
      });
      this.bind('ValueChanged', function(data) {
        this.text(prefix + ': ' + data + suffix);
      });
      return this;
    },
    alertIfBelow: function(threshold) {
      this.bind('ValueChanged', function(data) {
        if (data < threshold) {
          this.textColor(Game.alertColor);
        } else {
          this.textColor(Game.textColor);
        }
      });
      return this;
    },
    highlight: function() {
      this.bind('ValueChanged', function(data) {
        if (data > 0) {
          this.textColor(Game.highlightColor);
        } else {
          this.textColor(Game.textColor);
        }
      });
      return this;
    }
  });

}).call(this);

(function() {
  Crafty.c('LevelSelector', {
    init: function() {
      this.requires('DOMButton, TweenXY');
    },
    level: function(level) {
      this.text('Level ' + level);
      this.addComponent('preview_level' + level);
      this.bind('Click', function() {
        Crafty.scene('InitializeLevel' + level);
      });
      return this;
    }
  });

}).call(this);

(function() {
  Crafty.c('Path', {
    init: function() {
      this.requires('Actor, Image, Color');
      return this.image('assets/transparent.png').color('#969600', 0.42);
    }
  });

}).call(this);

(function() {
  // The PathWalker component allows an entity to move along a path,
  // given as an array of objects with x and y attributes
  Crafty.c('PathWalker', {
    init: function() {},
    animate_along: function(path, speed) {
      var animation, i, tweening;
      if (!speed) {
        speed = 1;
      }
      animation = {
        actor: this,
        speed: speed,
        steps: []
      };
      i = 0;
      while (i < path.length) {
        animation.steps.push({
          x: path[i].x * Game.map_grid.tile.width,
          y: path[i].y * Game.map_grid.tile.height
        });
        //console.log("Tweening to x=" + path[i].x + ", y=" + path[i].y);
        i++;
      }
      tweening = Crafty.e('TweeningHandler');
      tweening.targets.push(animation);
      return this;
    },
    animate_to: function(x, y, speed) {
      return this.animate_along([
        {
          x: x,
          y: y
        }
      ], speed);
    },
    destroy_after_animation: function() {
      var that;
      that = this;
      Crafty.bind('TweenEnded', function(actor) {
        if (actor === that) {
          that.destroy();
        }
      });
      return this;
    }
  });

}).call(this);

(function() {
  Crafty.c('RestartButton', {
    init: function() {
      this.requires('DOMButton');
      this.text('Start again?');
      this.tooltip('Clicking this button starts another game');
      this.attr({
        x: 0,
        y: Game.height() - 100,
        w: Game.width(),
        h: 50
      });
      this.textFont(Game.restartFont);
      this.textColor(Game.restartColor);
      this.bind('Click', function() {
        console.log('Restaaaaaart');
        if (Crafty.isPaused()) {
          Crafty.pause();
        }
        Crafty.scene('Difficulty');
      });
    }
  });

}).call(this);

(function() {
  Crafty.c('Sidebar', {
    init: function() {
      var closeButton, sidebar;
      this.requires('2D, DOM, Mouse,  Color');
      this.attr({
        x: 0,
        y: Game.map_grid.tile.height,
        w: 170,
        h: Game.height() - (2 * Game.map_grid.tile.height),
        z: 100
      });
      this.color('#777777', 0.42);
      this.bind('MouseOver', function(e) {
        e.preventDefault();
      });
      sidebar = this;
      closeButton = Crafty.e('DOMButton').attr({
        x: sidebar.w - 27,
        y: this.y,
        w: 25,
        h: 25,
        z: 101,
        tooltipWidth: 50,
        tooltipHeight: 75
      }).textFont(Game.closeFont).css(Game.closeCss).text('x').tooltip('Closes the sidebar').bind('Click', function() {
        sidebar.close();
      });
      this.upgradeHeadline = Crafty.e('2D, DOM, Text').attr({
        x: 0,
        y: 70,
        w: sidebar.w,
        z: 101
      }).textColor(Game.textColor).textFont(Game.sidebarFont);
      this.upgradeButton = Crafty.e('DOMButton').attr({
        x: 0,
        y: 160,
        w: sidebar.w,
        h: 40,
        z: 101
      }).bind('Click', function() {
        sidebar.selectedTower.upgrade();
      });
      this.sellHeadline = Crafty.e('2D, DOM, Text').attr({
        x: 0,
        y: 260,
        w: sidebar.w,
        z: 101
      }).textColor(Game.textColor).textFont(Game.sidebarFont);
      this.sellButton = Crafty.e('DOMButton').attr({
        x: 0,
        y: 330,
        w: sidebar.w,
        h: 40,
        z: 101
      }).bind('Click', function() {
        Crafty.e('TowerPlace').at(sidebar.selectedTower.at().x, sidebar.selectedTower.at().y);
        sidebar.selectedTower.sell();
        sidebar.close();
      });
      this.attach(closeButton);
      this.attach(this.upgradeHeadline);
      this.attach(this.upgradeButton);
      this.attach(this.sellHeadline);
      this.attach(this.sellButton);
      this.close();
      this.bind('TowerUpgraded', function() {
        sidebar.updateTexts();
      });
    },
    highlightTower: function() {
      Crafty('Sidebar').selectedTower.color('#ffffff', 0.3);
    },
    openFor: function(selectedTower) {
      if (this.selectedTower) {
        this.selectedTower.unbind('MouseOut', this.highlightTower);
        this.selectedTower.color('#ffffff', 0.0);
      }
      this.selectedTower = selectedTower;
      this.selectedTower.bind('MouseOut', this.highlightTower);
      if (this.selectedTower.x < Game.width() / 2) {
        this.x = Game.width() - this.w - Game.map_grid.tile.width;
      } else {
        this.x = Game.map_grid.tile.width;
      }
      this.updateTexts();
    },
    updateTexts: function() {
      var towerType;
      towerType = this.selectedTower.has('SniperTower') ? 'Sniper Tower' : 'Flower Tower';
      if (this.selectedTower.isUpgradable()) {
        this.upgradeHeadline.text('Upgrade ' + towerType + ' to level ' + (this.selectedTower.level + 1) + ':');
        this.upgradeButton.text('-' + this.selectedTower.getUpgradeCost() + '$').tooltip('Upgrade ' + towerType + ' at position (' + this.selectedTower.at().x + '/' + this.selectedTower.at().y + ')' + ' to level ' + (this.selectedTower.level + 1) + ' for ' + this.selectedTower.getUpgradeCost() + '$');
      } else {
        this.upgradeHeadline.text(towerType + ': Maximum level reached');
        this.upgradeButton.text('-').tooltip('Maximum level reached, can\'t upgrade tower');
      }
      this.sellHeadline.text('Sell ' + towerType + ':');
      this.sellButton.text('+' + this.selectedTower.getSellValue() + '$').tooltip('Sell ' + towerType + ' at position (' + this.selectedTower.at().x + '/' + this.selectedTower.at().y + ')' + ' to get back ' + this.selectedTower.getSellValue() + '$');
    },
    close: function() {
      this.x = -this.w - 50;
      if (this.selectedTower) {
        this.selectedTower.unbind('MouseOut', this.highlightTower);
        this.selectedTower.color('#ffffff', 0.0);
      }
      this.selectedTower = null;
    }
  });

}).call(this);

(function() {
  Crafty.c('SoundButton', {
    init: function() {
      this.requires('DOMButton');
      if (Crafty.storage('muted')) {
        Crafty.audio.mute();
        this.text('Sound: Off');
        this.tooltip('Sound is off. Click to turn it on.');
      } else {
        this.text('Sound: On');
        this.tooltip('Sound is on. Click to turn it off.');
      }
      this.bind('Click', function() {
        if (Crafty.audio.muted) {
          Crafty.audio.unmute();
          this.text('Sound: On');
          this.tooltip('Sound is on. Click to turn it off.');
          Crafty.storage('muted', false);
        } else {
          Crafty.audio.mute();
          this.text('Sound: Off');
          this.tooltip('Sound is off. Click to turn it on.');
          Crafty.storage('muted', true);
        }
      });
    }
  });

}).call(this);

(function() {
  Crafty.c('Tooltip', {
    init: function() {
      this.requires('Mouse');
      this.tooltipText = 'Tooltip-Text here';
      this._tooltip = null;
      this.tooltipWidth = 300;
      this.tooltipHeight = 50;
      this.bind('MouseOver', this.createTooltip);
      this.bind('MouseOut', this.destroyTooltip);
    },
    createTooltip: function() {
      var tooltipText, x, y;
      x = Math.min(Game.width() - this.tooltipWidth - 10, Math.max(0, this.x + (this.w - this.tooltipWidth) / 2));
      y = Math.max(0, this.y - this.tooltipHeight - 10);
      if (this.y < this.h + this.tooltipHeight) {
        y = this.y + this.h;
      }
      this._tooltip = Crafty.e('2D, DOM, Mouse').attr({
        x: x,
        y: y,
        w: this.tooltipWidth,
        h: this.tooltipHeight,
        z: 500
      }).css(Game.generalTooltipCss);
      tooltipText = Crafty.e('2D, DOM, Text').attr({
        x: x + 2,
        y: y + 2,
        w: this.tooltipWidth,
        h: this.tooltipHeight,
        z: 520
      }).text(this.tooltipText).textFont(Game.generalTooltipFont).textColor(Game.textColor).css(Game.centerCss);
      this._tooltip.attach(tooltipText);
      this.attach(this._tooltip);
    },
    destroyTooltip: function() {
      this._tooltip.destroy();
    },
    tooltip: function(text) {
      this.tooltipText = text;
      if (this._tooltip && this._tooltip._children.length > 0) {
        this._tooltip._children[0].text(text);
      }
      return this;
    }
  });

}).call(this);

(function() {
  Crafty.c('Tree', {
    init: function() {
      this.requires('Actor, Color');
      return this.color('rgb(20, 125, 40)');
    }
  });

}).call(this);

(function() {
  Crafty.c('TweenXY', {
    init: function() {
      this.requires('2D');
    },
    moveTo: function(x, y, ms) {
      var animation, speed, timePerFrame, tweening;
      timePerFrame = 1000 / Crafty.timer.FPS();
      speed = Math.max(Math.abs(x - this.x), Math.abs(y - this.y)) * timePerFrame / ms;
      animation = {
        actor: this,
        speed: speed,
        steps: [
          {
            x: x,
            y: y
          }
        ]
      };
      tweening = Crafty.e('TweeningHandler');
      tweening.targets.push(animation);
      return this;
    }
  });

}).call(this);

(function() {
  // -------------------------------------
  // custom Tween handling (only movement)
  // -------------------------------------
  Crafty.c('TweeningHandler', {
    init: function() {
      this.requires('Keyboard');
      this.attr({
        targets: [],
        stepsPerGrid: 25
      });
      this.bind('EnterFrame', this.tweenHandler);
    },
    moveActor: function(current, distanceX, distanceY) {
      var newX, newY;
      newX = current.actor.x;
      newY = current.actor.y;
      if (current.actor.x < current.steps[0].x) {
        newX = Math.min(current.actor.x + distanceX, current.steps[0].x);
      } else if (current.actor.x > current.steps[0].x) {
        newX = Math.max(current.actor.x - distanceX, current.steps[0].x);
      }
      if (current.actor.y < current.steps[0].y) {
        newY = Math.min(current.actor.y + distanceY, current.steps[0].y);
      } else if (current.actor.y > current.steps[0].y) {
        newY = Math.max(current.actor.y - distanceY, current.steps[0].y);
      }
      current.actor.attr({
        x: newX,
        y: newY
      });
    },
    triggerDirectionChanged: function(current) {
      if (current.steps.length === 0) {
        return;
      }
      if (current.steps[0].x < current.actor.x) {
        Crafty.trigger('TweenDirectionChanged', current.actor, 'left');
      } else if (current.steps[0].x > current.actor.x) {
        Crafty.trigger('TweenDirectionChanged', current.actor, 'right');
      } else if (current.steps[0].y < current.actor.y) {
        Crafty.trigger('TweenDirectionChanged', current.actor, 'up');
      } else if (current.steps[0].y > current.actor.y) {
        Crafty.trigger('TweenDirectionChanged', current.actor, 'down');
      }
    },
    tweenHandler: function() {
      var current, distanceX, distanceY, i;
      if (Crafty.isPaused()) {
        return;
      }
      i = 0;
      while (i < this.targets.length) {
        current = this.targets[i];
        distanceX = current.speed * Game.map_grid.tile.width / this.stepsPerGrid;
        distanceY = current.speed * Game.map_grid.tile.height / this.stepsPerGrid;
        if (current.actor.x !== current.steps[0].x || current.actor.y !== current.steps[0].y) {
          this.moveActor(current, distanceX, distanceY);
        } else {
          // remove this step from steps, so we can continue with next step
          current.steps.shift();
          this.triggerDirectionChanged(current);
        }
        // no more steps to take for current target: remove it from tween_targets array
        if (current.steps.length === 0) {
          this.targets.splice(i, 1);
          i--;
          Crafty.trigger('TweenEnded', current.actor);
        }
        i++;
      }
    }
  });

}).call(this);

(function() {
  Crafty.c('Wave', {
    init: function() {
      this.requires('DOMButton, Grid, Delay');
      this.attr({
        w: 150,
        tooltipWidth: 350,
        clickEnabled: true
      });
      this.text('Start');
      this.tooltip('Starts the next wave of enemies. Click here once you placed your towers.');
      this.textFont(Game.waveFont);
      this.currentWave = Game.currentWave;
      this.blinkBeforeStart();
      this.automaticallyStartNextWave();
      this.startNextWaveOnClick();
    },
    blinkBeforeStart: function() {
      var highlighted;
      highlighted = false;
      this.delay((function() {
        if (!this.waveStarted) {
          if (highlighted) {
            this.textColor(Game.textColor);
          } else {
            this.textColor(Game.highlightColor);
          }
          highlighted = !highlighted;
        }
      }), 1000, -1);
    },
    automaticallyStartNextWave: function() {
      this.bind('EnterFrame', function() {
        var flowerTowers, i;
        if (this.isWaveFinished()) {
          if (!this.finishedEventTriggered) {
            Crafty.trigger('WaveFinished', this.currentWave);
            this.finishedEventTriggered = true;
            flowerTowers = Crafty('FlowerTower');
            i = 0;
            if (flowerTowers.length > 0) {
              this.delay((function() {
                flowerTowers.get(i).shoot();
                i++;
              }), 500, flowerTowers.length - 1);
            }
          }
          if (this.isNextWavePossible()) {
            Game.money += Game.moneyAfterWave;
            this.startNextWave();
            console.log('Started wave ' + this.currentWave);
            this.finishedEventTriggered = false;
          }
        }
      });
    },
    startNextWaveOnClick: function() {
      this.bind('Click', function() {
        if (this.clickEnabled) {
          this.clickEnabled = false;
          this.text('Next Wave');
          this.textColor(Game.disabledColor);
          this.tooltip('Button currently disabled.');
          if (this.currentWave > 0) {
            Game.money += Game.moneyAfterWave;
          }
          this.startNextWave();
          this.delay((function() {
            this.clickEnabled = true;
            this.textColor(Game.textColor);
            this.tooltip('Start next wave early to get wave finished bonus gold.');
          }), 10000, 0);
        }
      });
    },
    isWaveFinished: function() {
      return Game.enemyCount === 0 && this.spawnFinished;
    },
    isNextWavePossible: function() {
      if (Game.lifes === 0) {
        return false;
      }
      return Game.endless || this.currentWave < Game.waves.current.length;
    },
    startNextWave: function() {
      var enemies, i, interval;
      this.spawnFinished = false;
      this.waveStarted = true;
      i = 0;
      enemies = this.getEnemies();
      interval = 3000;
      if (this.currentWave > Game.waves.current.length) {
        interval = Math.max(200, 3000 - ((this.currentWave - Game.waves.current.length) * 50));
      }
      this.delay((function() {
        var diff, enemy;
        enemy = Crafty.e(enemies[i]).at(Game.path.start.x, Game.path.start.y);
        this.delay((function() {
          enemy.animate_along(Game.path.getPath(), enemy.speed);
        }), 500, 0);
        // special handling for all waves after standard waves: increase health
        if (this.currentWave > Game.waves.current.length) {
          diff = this.currentWave - Game.waves.current.length;
          enemy.attr({
            health: Math.floor((1 + diff * 0.05) * enemy.health + 5 * diff)
          });
          console.log('new health: ' + enemy.health);
        }
        i++;
        if (i === enemies.length) {
          this.spawnFinished = true;
          console.log('spawn finished');
        }
      }), interval, enemies.length - 1);
      if (this.currentWave === Game.waves.current.length - 1) {
        Crafty.audio.stop();
        Crafty.audio.play('Boss', -1);
      }
      this.currentWave++;
      Game.currentWave = this.currentWave;
    },
    getEnemies: function() {
      var enemies, i;
      if (this.currentWave < Game.waves.current.length) {
        return Game.waves.current[this.currentWave];
      } else {
        // TODO auto generate waves randomly, based on reward
        enemies = ['GreenDragon', 'Orc'];
        i = 0;
        while (i < this.currentWave - Game.waves.current.length) {
          enemies.push(i % 10 === 4 ? 'SilverDragon' : i % 6 === 2 ? 'GreenDragon' : i % 4 === 0 ? 'MightyWitch' : i % 4 === 2 ? 'FastKnight' : 'FastSquid');
          i++;
        }
        enemies.push('GreenDragon');
        return enemies;
      }
    }
  });

}).call(this);

(function() {
  Crafty.c('FastKnight', {
    init: function() {
      this.requires('Enemy, knight_right');
      this.attr({
        health: 65,
        reward: 15,
        speed: 2.7,
        tooltipWidth: 200,
        tooltipTextBase: 'Fast Knight'
      });
    }
  });

}).call(this);

(function() {
  Crafty.c('FastSquid', {
    init: function() {
      this.requires('Enemy, squid');
      this.attr({
        health: 23,
        reward: 5,
        speed: 2.5,
        tooltipWidth: 200,
        tooltipTextBase: 'Fast Squid'
      });
    }
  });

}).call(this);

(function() {
  Crafty.c('GreenDragon', {
    init: function() {
      this.requires('Enemy, green_dragon');
      this.attr({
        health: 200,
        reward: 50,
        speed: 1.5,
        livesTaken: 3,
        noInstantKill: true,
        tooltipHeight: 60,
        tooltipTextBase: 'Green Dragon'
      });
    }
  });

}).call(this);

(function() {
  Crafty.c('Knight', {
    init: function() {
      this.requires('Enemy, knight_right');
      this.attr({
        health: 50,
        reward: 10,
        speed: 1.3,
        tooltipWidth: 200,
        tooltipTextBase: 'Knight'
      });
    }
  });

}).call(this);

(function() {
  Crafty.c('MightyWitch', {
    init: function() {
      this.requires('Enemy, witch_down, Delay');
      this.attr({
        health: 100,
        reward: 20,
        speed: 1.8,
        tooltipWidth: 200,
        tooltipHeight: 60,
        tooltipTextBase: 'Mighty Witch (disables towers)'
      });
      this.delay((function() {
        var tower, towers;
        // disable random tower for some time
        towers = Crafty('Tower Enabled');
        if (towers.length > 0) {
          tower = towers.get(Math.floor(Math.random() * towers.length));
          tower.disable();
        }
      }), 5000, -1);
    }
  });

}).call(this);

(function() {
  Crafty.c('Orc', {
    init: function() {
      this.requires('Enemy, orc');
      this.attr({
        health: 200,
        reward: 30,
        speed: 0.8,
        livesTaken: 2,
        tooltipTextBase: 'Orc'
      });
    }
  });

}).call(this);

(function() {
  Crafty.c('SilverDragon', {
    init: function() {
      this.requires('Enemy, silver_dragon');
      this.attr({
        health: 800,
        reward: 150,
        speed: 1.8,
        livesTaken: 7,
        noInstantKill: true,
        tooltipHeight: 60,
        tooltipTextBase: 'Silver Dragon'
      });
    }
  });

}).call(this);

(function() {
  Crafty.c('Spider', {
    init: function() {
      this.requires('Enemy, spider');
      this.attr({
        health: 60,
        reward: 5,
        speed: 1.7,
        tooltipTextBase: 'Spider'
      });
    }
  });

}).call(this);

(function() {
  Crafty.c('Squid', {
    init: function() {
      this.requires('Enemy, squid');
      this.attr({
        health: 30,
        reward: 3,
        speed: 1.0,
        tooltipTextBase: 'Squid'
      });
    }
  });

}).call(this);

(function() {
  Crafty.c('Witch', {
    init: function() {
      this.requires('Enemy, witch_right');
      this.attr({
        health: 5,
        reward: 1,
        speed: 1.8,
        tooltipTextBase: 'Witch'
      });
    }
  });

}).call(this);

(function() {
  Crafty.scene('Credits', function(targetScene) {
    Crafty.e('2D, DOM, Text').text('Programming:').textFont(Game.creditsFont).textColor(Game.highlightColor).css(Game.centerCss).attr({
      x: 0,
      y: 30,
      w: Game.width(),
      h: 50
    });
    // FIXME generate links outside
    Crafty.e('2D, DOM, Text').text('Game-Framework is Crafty (<a target="_blank" href="http://craftyjs.com">http://craftyjs.com</a>)<br>' + 'Programming is done by me (<a target="_blank" href="http://www.github.com/olilo/flower-tower-defense/">' + 'http://www.github.com/olilo/flower-tower-defense/</a>)').textFont(Game.creditsTextFont).textColor(Game.textColor).css(Game.centerCss).attr({
      x: 0,
      y: 70,
      w: Game.width(),
      h: 100
    });
    Crafty.e('2D, DOM, Text').text('Graphics:').textFont(Game.creditsFont).textColor(Game.highlightColor).css(Game.centerCss).attr({
      x: 0,
      y: 140,
      w: Game.width(),
      h: 50
    });
    // FIXME link to https://opengameart.org/content/roguelike-bosses
    Crafty.e('2D, DOM, Text').text('roguelikebosses (orc, dragons, spider) by @JoeCreates<br>' + 'Witch graphic by Heather Harvey - cind_rella@hotmail.com<br>' + 'Generally: art from <a href="http://opengameart.org">http://opengameart.org</a><br>' + 'Knight and flowers by me ^^ (license-free)').textFont(Game.creditsTextFont).textColor(Game.textColor).css(Game.centerCss).attr({
      x: 0,
      y: 180,
      w: Game.width(),
      h: 120
    });
    Crafty.e('2D, DOM, Text').text('Music:').textFont(Game.creditsFont).textColor(Game.highlightColor).css(Game.centerCss).attr({
      x: 0,
      y: 300,
      w: Game.width(),
      h: 50
    });
    Crafty.e('2D, DOM, Text').text('Title-Song and Won-Song generated by Music Maker Jam<br>' + 'Game-Music by <a target="_blank" href="http://opengameart.org/users/tkz-productions">WakianTech</a>').textFont(Game.creditsTextFont).textColor(Game.textColor).css(Game.centerCss).attr({
      x: 0,
      y: 340,
      w: Game.width(),
      h: 100
    });
    if (targetScene.text) {
      Crafty.e('DOMButton').text(targetScene.text).attr({
        x: 280,
        y: Game.height() - 50,
        w: 200,
        h: 50
      }).tooltip('Continue to next screen').bind('Click', function() {
        Crafty.scene(targetScene.scene);
      });
    } else {
      Crafty.e('DOMButton').text('Back').attr({
        x: 280,
        y: Game.height() - 50,
        w: 200,
        h: 50
      }).tooltip('Go back to where you came from').bind('Click', function() {
        Crafty.scene(targetScene);
      });
    }
    Crafty.e('SoundButton').attr({
      x: 470,
      y: Game.height() - 50,
      w: 200,
      h: 50,
      blablubb: 10
    });
  });

}).call(this);

(function() {
  // Difficulty selection scene
  // --------------------------
  // User can decide on his difficulty here
  Crafty.scene('Difficulty', function() {
    var e;
    Crafty.background('rgb(169, 153, 145)');
    Crafty.audio.stop();
    Crafty.audio.play('Menu', -1);
    Crafty.e('2D, DOM, Image').image('assets/ftd-logo.jpg').attr({
      x: 80,
      y: Game.height() * 1 / 12 - 24,
      w: Game.width(),
      h: 200
    });
    Crafty.e('2D, DOM, Text').text('Choose your difficulty:').attr({
      x: 0,
      y: Game.height() * 3 / 6 - 24,
      w: Game.width(),
      h: 50
    }).textFont(Game.difficultyFont).textColor(Game.textColor).css(Game.centerCss);
    for (e in Game.difficulties) {
      if (!Game.difficulties.hasOwnProperty(e)) {
        continue;
      }
      //skip
      Crafty.e('DOMButton').text(e).tooltip(Game.difficulties[e].tooltip).attr({
        x: Game.difficulties[e].x * Game.width() / 2,
        y: (Game.difficulties[e].y * 2 + 7) / 12 * Game.height(),
        w: Game.width() / 2,
        h: 50
      }).textFont(Game.difficultyFont).textColor(Game.difficulties[e].textColor).bind('Click', function() {
        console.log('Chosen difficulty: ' + this.text());
        Game.setDifficultyProperties(this.text());
        Crafty.scene('MapSelection');
      });
    }
    Crafty.e('DOMButton').text('Instructions').attr({
      x: 70,
      y: Game.height() - 50,
      w: 200,
      h: 50
    }).tooltip('Click here for some instructions').bind('Click', function() {
      Crafty.scene('Help', 'Difficulty');
    });
    Crafty.e('DOMButton').text('Credits').attr({
      x: 280,
      y: Game.height() - 50,
      w: 200,
      h: 50
    }).tooltip('View the credits for this game ^^').bind('Click', function() {
      Crafty.scene('Credits', 'Difficulty');
    });
    return Crafty.e('SoundButton').attr({
      x: 470,
      y: Game.height() - 50,
      w: 200,
      h: 50
    });
  });

}).call(this);

(function() {
  // Main game scene
  // ---------------
  Crafty.scene('Game', function() {
    var pauseOverlay, x, y;
    // background
    Crafty.e('2D, Canvas, ' + Game.backgroundAsset);
    Crafty.audio.stop();
    Crafty.audio.play('Background', -1);
    // HUD
    Crafty.e('HudElement').observe('Money', 'money', '$').at(1);
    Crafty.e('HudElement').observe('Lifes', 'lifes').at(6).alertIfBelow(3);
    Crafty.e('HudElement').observe('Enemies', 'enemyCount').at(10);
    Crafty.e('HudElement').observe('Wave', 'currentWave').at(14);
    Crafty.e('HudElement').observe('FPS', Game.actualFPS.FPS).at(18);
    Crafty.e('DOMButton, Grid').text('Restart level').tooltip('Restart this level with difficulty ' + Game.difficulty + ' at wave 1').textColor(Game.highlightColor).textFont(Game.hudFont).unbind('Click').bind('Click', function() {
      if (window.confirm('Really restart this level? You will restart at wave 1 with no towers!')) {
        console.log('Restarting level ' + Game.level);
        // we need crafty unpaused for initialization
        if (Crafty.isPaused()) {
          Crafty.pause();
        }
        // reset difficulty-related properties
        Game.setDifficultyProperties(Game.difficulty);
        Crafty.scene('InitializeLevel' + Game.level);
      }
    }).at(20, 0).attr({
      w: 180
    });
    // tower selectors
    Crafty.e('TowerSelector').forTower('FlowerTower').attr({
      tooltipWidth: 500,
      tooltipHeight: 130
    }).tooltip('Click here to select the Flower Tower.<br> If you click anywhere on the map you build this tower.<br>' + 'It shoots in all 4 directions with limited range.<br> Gains higher range on upgrade.<br> Hotkey: C').withSprite('flower_tower5').withHotkey('C').at(1, Game.map_grid.height - 1);
    Crafty.e('TowerSelector').forTower('SniperTower').attr({
      tooltipWidth: 500,
      tooltipHeight: 130
    }).tooltip('Click here to select the Sniper Tower.<br> If you click anywhere on the map you build this tower.<br> ' + 'It shoots anywhere on the map, but cost increases.<br> Gains instant kill on highest level.<br> Hotkey: V').withSprite('sniper_tower4').withHotkey('V').at(3, Game.map_grid.height - 1);
    // win/lose conditions
    Crafty.bind('EnterFrame', function() {
      if (Game.lifes <= 0) {
        Crafty.unbind('EnterFrame');
        Crafty.scene('GameOver');
      }
    });
    Crafty.bind('WaveFinished', function(waveNumber) {
      Crafty.storage('ftd_save1', Game);
      if (Game.lifes > 0 && waveNumber === Game.waves.current.length) {
        Crafty.unbind('EnterFrame');
        Crafty.scene('Won');
      }
    });
    // necessary event handling
    Crafty.bind('TowerCreated', function(tower) {
      var i, towerNames;
      // insert in tower map
      towerNames = ['FlowerTower', 'SniperTower'];
      i = 0;
      while (i < towerNames.length) {
        if (tower.has(towerNames[i])) {
          Game.towerMap[tower.at().x][tower.at().y].name = towerNames[i];
          Game.towerMap[tower.at().x][tower.at().y].level = 1;
          return;
        }
        i++;
      }
    });
    Crafty.bind('TowerUpgraded', function(tower) {
      // update tower map
      Game.towerMap[tower.at().x][tower.at().y].level = tower.level;
    });
    // Populate our playing field with trees, path tiles, towers and tower places
    // we need to reset sniper tower cost, because when placing them in the loop the cost goes up again
    Game.towers['SniperTower'] = Game.sniperTowerInitial;
    //console.log(Game.towerMap);
    x = 0;
    while (x < Game.map_grid.width) {
      y = 0;
      while (y < Game.map_grid.height) {
        if (Game.path.isOnEdge(x, y)) {
          Crafty.e('Tree').at(x, y);
        } else if (Game.path.isOnPath(x, y)) {
          Crafty.e('Path').at(x, y);
        } else if (Game.towerMap[x][y].level > 0) {
          Crafty.e(Game.towerMap[x][y].name).at(x, y).attr({
            'level': Game.towerMap[x][y].level
          }).updateTooltip();
        } else {
          Crafty.e('TowerPlace').at(x, y);
        }
        y++;
      }
      x++;
    }
    // initialize wave (handles spawning of every wave)
    Crafty.e('Wave').at(Game.map_grid.width - 5, Game.map_grid.height - 1);
    // initialize sidebar
    Crafty.e('Sidebar');
    // help button
    Crafty.e('DOMButton, Grid').text('Help').textFont(Game.waveFont).at(8, Game.map_grid.height - 1).attr({
      w: 100
    }).tooltip('If you are lost, look here').bind('Click', function() {
      var overlay;
      // create an overlay that explains the general concept
      overlay = document.getElementById('helpOverlay');
      if (overlay) {
        return overlay.parentNode.removeChild(overlay);
      } else {
        overlay = document.createElement('div');
        overlay.setAttribute('id', 'helpOverlay');
        overlay.style.position = 'absolute';
        overlay.style.width = Game.width() - 40 + 'px';
        overlay.style.padding = '10px';
        overlay.style.left = '10px';
        overlay.style.top = '30px';
        overlay.style.border = '1px solid black';
        overlay.style.background = 'grey';
        overlay.style.zIndex = '1000';
        overlay.innerHTML = '<p>Click anywhere to build the selected tower type. ' + 'You can find the selected tower type in the lower left of the screen (black is selected).' + '</p><p>' + 'When you click on an already built tower you upgrade that tower. ' + 'The costs and the current tower level are displayed on mouse over ' + 'in the top right of the screen (Cost and Level).' + '</p><p>' + '<em><strong>There are two tower types to choose from, ' + 'with the first one automatically selected:</strong></em>' + '</p><p>' + 'The first tower type shoots leafs into all 4 directions, which damage the enemy on impact. ' + 'They have a limited range so build these towers near the path. ' + 'Their range increases on higher levels.' + '</p><p>' + 'The second tower shoots all over the map at a single random target.' + 'The first tower you build of this type is relatively cheap, ' + 'but each one after the first one gets more and more expensive. ' + 'Upgrading, however, always costs the same.<br>' + 'This tower gains a 2% chance to instantly kill an enemy on its highest level.' + '</p><p>' + 'You have to start the first wave by clicking "Start". ' + 'After that the waves come automatically, ' + 'but you can start the next wave earlier by clicking "Next Wave" again.' + '</p><p>' + 'You win if you finish all 15 waves. You can challenge yourself ' + 'and see how far you can get in endless mode after that.' + '</p>';
        return document.getElementById('cr-stage').appendChild(overlay);
      }
    });
    pauseOverlay = document.createElement('div');
    pauseOverlay.style.border = '1px solid black';
    pauseOverlay.style.backgroundColor = 'grey';
    pauseOverlay.style.display = 'none';
    pauseOverlay.style.position = 'absolute';
    pauseOverlay.style.padding = '10px';
    pauseOverlay.style.left = '350px';
    pauseOverlay.style.top = '200px';
    pauseOverlay.style.font = 'bold 36px "sans-serif"';
    pauseOverlay.style.color = 'white';
    pauseOverlay.style.zIndex = '900';
    pauseOverlay.innerHTML = 'Paused';
    document.getElementById('cr-stage').appendChild(pauseOverlay);
    Crafty.e('DOMButton, Grid, Keyboard, Delay').text('Pause').textFont(Game.waveFont).at(11, Game.map_grid.height - 1).attr({
      w: 100,
      h: 50
    }).tooltip('Pause or unpause the game (Hotkey: P)').bind('Click', function() {
      Crafty.pause();
      if (Crafty.isPaused()) {
        return pauseOverlay.style.display = 'block';
      } else {
        return pauseOverlay.style.display = 'none';
      }
    }).bind('KeyDown', function() {
      if (this.isDown('P')) {
        Crafty.pause();
        if (Crafty.isPaused()) {
          pauseOverlay.style.display = 'block';
        } else {
          pauseOverlay.style.display = 'none';
        }
      }
    });
    return Crafty.e('SoundButton, Grid').textFont(Game.waveFont).attr({
      w: 150,
      h: 50
    }).at(15, Game.map_grid.height - 1);
  });

}).call(this);

(function() {
  Crafty.scene('GameOver', function() {
    // show GameOver screen, with "start again" button
    Crafty.background('rgb(169, 153, 145)');
    Crafty.audio.stop();
    Crafty.audio.play('Menu', -1);
    Crafty.e('2D, DOM, Image').image('assets/ftd-logo.jpg').attr({
      x: 80,
      y: Game.height() * 1 / 12 - 24,
      w: Game.width(),
      h: 200
    });
    Crafty.e('2D, DOM, Text').text('Game over').attr({
      x: 0,
      y: Game.height() * 3 / 5 - 24,
      w: Game.width()
    }).textFont(Game.gameOverFont).textColor(Game.gameOverColor).css(Game.centerCss);
    return Crafty.e('RestartButton');
  });

}).call(this);

(function() {
  Crafty.scene('Help', function(targetScene) {
    Crafty.e('2D, DOM, Text').attr({
      x: 10,
      y: 10,
      w: Game.width() - 20,
      h: Game.height()
    }).text('<p>Choose a difficulty and select a map. The game starts. You can click anywhere to build the selected tower type. ' + 'You can find the selected tower type in the lower left of the screen (black is selected).' + '</p><p>' + 'When you click on an already built tower you upgrade that tower. ' + 'The costs and the current tower level are displayed on mouse over ' + 'in the top right of the screen (Cost and Level).' + '</p><p>' + '<em><strong>There are two tower types to choose from, ' + 'with the first one automatically selected:</strong></em>' + '</p><p>' + 'The first tower type shoots leafs into all 4 directions, which damage the enemy on impact.' + 'They have a limited range so build these towers near the path. Their range increases on higher levels.' + '</p><p>' + 'The second tower shoots all over the map at a single random target.' + 'The first tower you build of this type is relatively cheap,' + 'but each one after the first one gets more and more expensive.' + 'Upgrading, however, always costs the same.<br>' + 'This tower gains a 2% chance to instantly kill an enemy on its highest level.' + '</p><p>' + 'You have to start the first wave by clicking "Start". ' + 'After that the waves come automatically, but you can start the next wave earlier by clicking "Next Wave" again.' + '</p><p>' + 'You win if you finish all 15 waves, but you can challenge yourself ' + 'and see how far you can get in endless mode after that.' + '</p>').textColor(Game.textColor).textFont(Game.explanationFont);
    Crafty.e('DOMButton').text('Back').attr({
      x: 280,
      y: Game.height() - 50,
      w: 200,
      h: 50
    }).tooltip('Go back to where you came from').bind('Click', function() {
      Crafty.scene(targetScene);
    });
    return Crafty.e('SoundButton').attr({
      x: 470,
      y: Game.height() - 50,
      w: 200,
      h: 50
    });
  });

}).call(this);

(function() {
  // Initialize variables for new game
  // ---------------------------------
  Crafty.scene('InitializeLevel1', function() {
    var loading;
    // show loading if initialization takes up some time ...
    loading = Crafty.e('2D, DOM, Text, Delay').text('Loading level, generating map...').attr({
      x: 0,
      y: Game.height() / 2 - 24,
      w: Game.width()
    }).textFont(Game.loadingFont).textColor(Game.textColor).css(Game.centerCss);
    Game.level = '1';
    Game.backgroundAsset = 'background1';
    Game.waves.current = Game.waves.level1;
    Game.setGeneralProperties();
    // generate path like this:
    // -  /-----------\
    // |  |           |
    // |  |  /-----\  |
    // |  |  |     |  |
    // |  |  \--\  |  |
    // |  |     |  |  |
    // |  \-----/  |  |
    // |           |  |
    // \-----------/  -
    loading.delay((function() {
      Game.path = new Path(Game.map_grid);
      Game.path.generateSpiral();
      Crafty.scene('Game');
    }), 400);
  });

  Crafty.scene('InitializeLevel2', function() {
    var loading;
    // show loading if initialization takes up some time ...
    loading = Crafty.e('2D, DOM, Text, Delay').text('Loading level, generating map...').attr({
      x: 0,
      y: Game.height() / 2 - 24,
      w: Game.width()
    }).textFont(Game.loadingFont).textColor(Game.textColor).css(Game.centerCss);
    Game.level = '2';
    Game.backgroundAsset = 'background2';
    Game.waves.current = Game.waves.level2;
    Game.setGeneralProperties();
    loading.delay((function() {
      // generate path
      Game.path = new Path(Game.map_grid);
      Game.path.generatePath();
      Crafty.scene('Game');
    }), 400);
  });

  Crafty.scene('InitializeLevel3', function() {
    var loading;
    // show loading if initialization takes up some time ...
    loading = Crafty.e('2D, DOM, Text, Delay').text('Loading level, generating map...').attr({
      x: 0,
      y: Game.height() / 2 - 24,
      w: Game.width()
    }).textFont(Game.loadingFont).textColor(Game.textColor).css(Game.centerCss);
    Game.level = '3';
    Game.backgroundAsset = 'background6';
    Game.waves.current = Game.waves.level3;
    Game.setGeneralProperties();
    loading.delay((function() {
      // generate path
      Game.path = new Path(Game.map_grid);
      Game.path.generateStartOnRow(0);
      Game.path.finish = {
        x: 14,
        y: Game.map_grid.height - 1
      };
      Game.path.generatePath();
      Crafty.scene('Game');
    }), 400);
  });

  Crafty.scene('InitializeLevel4', function() {
    var loading;
    // show loading if initialization takes up some time ...
    loading = Crafty.e('2D, DOM, Text, Delay').text('Loading level, generating map...').attr({
      x: 0,
      y: Game.height() / 2 - 24,
      w: Game.width()
    }).textFont(Game.loadingFont).textColor(Game.textColor).css(Game.centerCss);
    Game.level = '4';
    Game.backgroundAsset = 'background5';
    Game.waves.current = Game.waves.level4;
    Game.setGeneralProperties();
    loading.delay((function() {
      var map_config;
      // generate path
      map_config = {
        width: Game.map_grid.width,
        height: Game.map_grid.height,
        tile: Game.map_grid.tile,
        pathMinLength: 5,
        pathMaxLength: 20
      };
      Game.path = new Path(map_config);
      Game.path.start = {
        x: 9,
        y: 0
      };
      Game.path.finish = {
        x: 14,
        y: Game.map_grid.height - 1
      };
      Game.path.generatePath();
      Crafty.scene('Game');
    }), 400);
  });

  Crafty.scene('InitializeLevel5', function() {
    var loading;
    // show loading if initialization takes up some time ...
    loading = Crafty.e('2D, DOM, Text, Delay').text('Loading level, generating map...').attr({
      x: 0,
      y: Game.height() / 2 - 24,
      w: Game.width()
    }).textFont(Game.loadingFont).textColor(Game.textColor).css(Game.centerCss);
    Game.level = '5';
    Game.backgroundAsset = 'background9';
    Game.waves.current = Game.waves.level5;
    Game.setGeneralProperties();
    loading.delay((function() {
      // generate path
      Game.path = new Path(Game.map_grid);
      Game.path.pathMaxLength = 110;
      Game.path.generateStartOnRow(0);
      Game.path.generateFinishInColumn(0);
      Game.path.generateLabyrinth();
      Crafty.scene('Game');
    }), 400);
  });

}).call(this);

(function() {
  // Loading scene
  // -------------
  // Handles the loading of binary assets such as images and audio files
  Crafty.scene('Loading', function() {
    var loading, x;
    // Draw some text for the player to see in case the file
    //  takes a noticeable amount of time to load
    loading = Crafty.e('2D, Grid, DOM, Text, Delay').text('Loading...').attr({
      w: Game.width()
    }).at(0, 5).textFont(Game.loadingFont).textColor(Game.textColor).css(Game.centerCss);
    Crafty.e('Actor, Progress, Text').at(Game.map_grid.width / 2 - 2, 8).textFont(Game.loadingFont).textColor(Game.textColor).text('0%');
    // pre-load some (small) assets that we need immediately
    x = 3;
    Crafty.load(Game.preLoadAssets, function() {
      loading.delay((function() {
        if (x >= 22) {
          Crafty('flower Loading').destroy();
          x = 3;
        }
        Crafty.e('2D, DOM, Grid, flower, Loading').at(x, 10);
        x += 2;
      }), 500, -1);
    });
    // Load all our assets
    Crafty.load(Game.assets, (function() {
      // Now that our sprites are ready to draw, start the game
      Game.endless = false;
      Crafty.scene('MainMenu');
    }), function(progress) {
      Crafty('Progress').text(Math.floor(progress.percent) + '%');
    });
  });

}).call(this);

(function() {
  // Main menu - load old savegame or start new game
  // ----------------------------
  Crafty.scene('MainMenu', function() {
    var loadButton, savegame;
    Crafty.background('rgb(169, 153, 145)');
    Crafty.audio.stop();
    Crafty.audio.play('Menu', -1);
    Crafty.e('2D, DOM, Image').image('assets/ftd-logo.jpg').attr({
      x: 80,
      y: Game.height() * 1 / 12 - 24,
      w: Game.width(),
      h: 200
    });
    savegame = Crafty.storage('ftd_save1');
    loadButton = Crafty.e('DOMButton').text('Load Saved game').attr({
      x: 0,
      y: Game.height() * 7 / 12 - 24,
      w: Game.width(),
      h: 50,
      tooltipWidth: 350
    });
    if (savegame) {
      loadButton.tooltip('Continue the game you played last time ' + 'with difficulty ' + savegame.difficulty + ' ' + 'on wave ' + savegame.currentWave).bind('Click', function() {
        Game.difficulty = savegame.difficulty || 'Normal';
        Game.money = savegame.money;
        Game.lifes = savegame.lifes;
        Game.moneyAfterWave = savegame.moneyAfterWave;
        Game.towers = savegame.towers;
        Game.level = savegame.level || '2';
        Game.backgroundAsset = savegame.backgroundAsset || 'background1';
        Game.waves.current = savegame.waves.current || Game.waves.level2;
        Game.endless = savegame.currentWave >= Game.waves.current.length;
        Game.enemyCount = savegame.enemyCount;
        Game.currentWave = savegame.currentWave;
        Game.selectedTower = savegame.selectedTower;
        Game.sniperTowerInitial = savegame.sniperTowerInitial;
        Game.towerMap = savegame.towerMap;
        Game.path = new Path(Game.map_grid);
        Game.path.copy(savegame.path);
        Crafty.scene('Game');
      });
    } else {
      loadButton.tooltip('No savegame exists yet.').disable();
    }
    Crafty.e('DOMButton').text('Start new game').attr({
      x: 0,
      y: Game.height() * 9 / 12 - 24,
      w: Game.width(),
      h: 50
    }).tooltip('Starts a new game. You can select the difficulty on the next screen.').bind('Click', function() {
      if (Crafty.storage('ftd_save1') && !confirm('Starting a new game will overwrite your already saved game. Continue?')) {
        return;
      }
      Crafty.scene('Difficulty');
    });
    Crafty.e('DOMButton').text('Instructions').attr({
      x: 70,
      y: Game.height() - 50,
      w: 200,
      h: 50
    }).tooltip('Click here for some instructions').bind('Click', function() {
      Crafty.scene('Help', 'MainMenu');
    });
    Crafty.e('DOMButton').text('Credits').attr({
      x: 280,
      y: Game.height() - 50,
      w: 200,
      h: 50
    }).tooltip('View the credits for this game ^^').bind('Click', function() {
      Crafty.scene('Credits', 'MainMenu');
    });
    Crafty.e('SoundButton').attr({
      x: 470,
      y: Game.height() - 50,
      w: 200,
      h: 50
    });
  });

}).call(this);

(function() {
  Crafty.scene('MapSelection', function() {
    var currentPage;
    Crafty.background('rgb(119, 123, 125)');
    Crafty.audio.stop();
    Crafty.audio.play('Menu', -1);
    currentPage = 1;
    Crafty.e('2D, DOM, Image').image('assets/ftd-logo.jpg').attr({
      x: 80,
      y: Game.height() * 1 / 12 - 24,
      w: Game.width(),
      h: 200
    });
    Crafty.e('2D, DOM, Text').text('Choose a map:').attr({
      x: 0,
      y: Game.height() * 3 / 6 - 24,
      w: Game.width(),
      h: 50
    }).textFont(Game.mapSelectionFont).textColor(Game.textColor).css(Game.centerCss);
    // FIXME put prev and next buttons into components
    Crafty.e('DOMButton, Delay, Previous').text('Prev').attr({
      x: Game.width() * 1 / 24,
      y: Game.height() * 8 / 12 - 24,
      w: Game.width() * 2 / 24,
      h: 32
    }).tooltip('Show previous page of levels').disable().bind('Click', function() {
      if (this.buttonEnabled) {
        currentPage--;
        this.disable();
        this.delay((function() {
          if (currentPage > 1) {
            this.enable();
          }
          Crafty('DOMButton Next').enable();
        }), 1000);
        Crafty('LevelSelector').each(function() {
          this.moveTo(this.x + Game.width(), this.y, 800);
        });
      }
    });
    Crafty.e('DOMButton, Delay, Next').text('Next').attr({
      x: Game.width() * 21 / 24,
      y: Game.height() * 8 / 12 - 24,
      w: Game.width() * 2 / 24,
      h: 32
    }).tooltip('Show next page of levels').bind('Click', function() {
      if (this.buttonEnabled) {
        currentPage++;
        this.disable();
        this.delay((function() {
          if (currentPage < Crafty('Level').length / 3.0) {
            this.enable();
          }
          console.log(Crafty('Level').length);
          Crafty('DOMButton Previous').enable();
        }), 1000);
        Crafty('LevelSelector').each(function() {
          this.moveTo(this.x - Game.width(), this.y, 800);
        });
      }
    });
    Crafty.e('LevelSelector').level('1').tooltip('10 Waves of enemies who travel through a large spiral.').attr({
      x: Game.width() * 4 / 24,
      y: Game.height() * 8 / 12 - 24,
      w: Game.width() / 6,
      h: 100
    });
    Crafty.e('LevelSelector').level('2').tooltip('15 Waves of enemies who travel from left to right.').attr({
      x: Game.width() * 10 / 24,
      y: Game.height() * 8 / 12 - 24,
      w: Game.width() / 6,
      h: 100
    });
    Crafty.e('LevelSelector').level('3').tooltip('15 Waves of enemies who go from top to bottom.').attr({
      x: Game.width() * 16 / 24,
      y: Game.height() * 8 / 12 - 24,
      w: Game.width() / 6,
      h: 100
    });
    Crafty.e('LevelSelector').level('4').tooltip('20 Waves in a fast-paced short path.').attr({
      x: Game.width() * 28 / 24,
      y: Game.height() * 8 / 12 - 24,
      w: Game.width() / 6,
      h: 100
    });
    Crafty.e('LevelSelector').level('5').tooltip('15 Waves who travel through a maze.').attr({
      x: Game.width() * 34 / 24,
      y: Game.height() * 8 / 12 - 24,
      w: Game.width() / 6,
      h: 100
    });
    // idea: level 6 is dual path (two starts, two finishes, two waves each wave, paths don't overlap)
    Crafty.e('DOMButton').text('Instructions').attr({
      x: 70,
      y: Game.height() - 50,
      w: 200,
      h: 50
    }).tooltip('Click here for some instructions').bind('Click', function() {
      Crafty.scene('Help', 'MapSelection');
    });
    Crafty.e('DOMButton').text('Credits').attr({
      x: 280,
      y: Game.height() - 50,
      w: 200,
      h: 50
    }).tooltip('View the credits for this game ^^').bind('Click', function() {
      Crafty.scene('Credits', 'MapSelection');
    });
    return Crafty.e('SoundButton').attr({
      x: 470,
      y: Game.height() - 50,
      w: 200,
      h: 50
    });
  });

}).call(this);

(function() {
  // show Won screen, with "start again" button
  Crafty.scene('Won', function() {
    Crafty.background(Game.wonColor);
    Crafty.audio.stop();
    Crafty.audio.play('Won', -1);
    Crafty.e('2D, DOM, Image').image('assets/ftd-logo.jpg').attr({
      x: 80,
      y: Game.height() * 1 / 12 - 24,
      w: Game.width(),
      h: 200
    });
    Crafty.e('2D, DOM, Text').text('You Won :)').attr({
      x: 0,
      y: Game.height() * 7 / 12 - 24,
      w: Game.width(),
      h: 50
    }).textFont(Game.wonFont).textColor(Game.textColor).css(Game.centerCss);
    Crafty.e('DOMButton').text('Continue in endless mode?').tooltip('Click here to continue your last game from wave ' + Game.waves.current.length).attr({
      x: 0,
      y: Game.height() * 9 / 12 - 24,
      w: Game.width(),
      h: 50
    }).textFont(Game.continueFont).textColor(Game.continueColor).bind('Click', function() {
      Game.endless = true;
      Crafty.scene('Game');
    });
    return Crafty.e('RestartButton').attr({
      x: 0,
      y: Game.height() * 11 / 12 - 24,
      w: Game.width(),
      h: 50
    });
  });

}).call(this);

(function() {
  Crafty.c('Disabled', {
    init: function() {
      this.requires('Color, Mouse, Delay');
      this.color('#ff0000', 0.5);
      this.bind('MouseOut', function() {
        this.color('#ff0000', 0.5);
      });
      this.delay((function() {
        this.removeComponent('Disabled');
        this.addComponent('Enabled');
      }), 20000, 0);
    }
  });

}).call(this);

(function() {
  Crafty.c('Enabled', {
    init: function() {
      this.requires('Color, Mouse');
      this.color('#ffffff', 0.0);
      this.bind('MouseOver', function() {
        this.color('#6666b6', 0.2);
      });
      this.bind('MouseOut', function() {
        this.color('#ffffff', 0.0);
      });
    },
    disable: function() {
      this.removeComponent('Enabled');
      this.addComponent('Disabled');
    }
  });

}).call(this);

(function() {
  Crafty.c('FlowerTower', {
    init: function() {
      var enemyNear, i;
      this.requires('Tower, flower_tower1');
      this.range = 4;
      this.maxLevel = 10;
      this.shootingSpeed = 0.4;
      // handle setting range, correct sprite (according to level) and tooltip text
      this.bind('TowerUpgraded', function(actor) {
        if (actor === this) {
          this.handleLevelup();
        }
      });
      // initialize according to level (has to be delayed because level is set after initialization)
      this.delay((function() {
        this.handleLevelup();
      }), 100, 0);
      i = 0;
      enemyNear = true;
      this.delay((function() {
        if (i++ % 4 === 0) {
          enemyNear = this.isEnemyNear();
        }
        if (this.has('Enabled') && enemyNear) {
          this.shoot();
        }
      }), this.shootingSpeed * 1000, -1);
    },
    handleLevelup: function() {
      var i;
      // set range according to level
      if (this.level === this.maxLevel) {
        this.range = 6;
      } else if (this.level >= 4) {
        this.range = 5;
      } else {
        this.range = 4;
      }
      // set sprite according to level
      i = 1;
      while (i < Math.ceil(this.level / 2)) {
        this.removeComponent('flower_tower' + i);
        i++;
      }
      this.addComponent('flower_tower' + Math.ceil(this.level / 2));
      // update tooltip (what a surprise)
      this.updateTooltip();
    },
    updateTooltip: function() {
      this.tooltip('Flower Tower at level ' + this.level + ', <br>' + this.getDamage() + ' damage per petal, <br>' + this.getDamage() / this.shootingSpeed + ' dps in a square of ' + this.range + ' tiles <br>' + this.getUpgradeText());
    },
    shoot: function() {
      var bulletDown, bulletLeft, bulletRight, bulletUp, x, y;
      x = this.at().x;
      y = this.at().y;
      bulletUp = void 0;
      bulletRight = void 0;
      bulletDown = void 0;
      bulletLeft = void 0;
      if (Game.options.bulletImages) {
        bulletUp = Crafty.e('Bullet, leaf_up');
        bulletRight = Crafty.e('Bullet, leaf_right');
        bulletDown = Crafty.e('Bullet, leaf_down');
        bulletLeft = Crafty.e('Bullet, leaf_left');
      } else {
        bulletUp = Crafty.e('Bullet').attr({
          w: 16,
          h: 16
        });
        bulletRight = Crafty.e('Bullet').attr({
          w: 16,
          h: 16
        });
        bulletDown = Crafty.e('Bullet').attr({
          w: 16,
          h: 16
        });
        bulletLeft = Crafty.e('Bullet').attr({
          w: 16,
          h: 16
        });
      }
      bulletUp.attr({
        damage: this.getDamage()
      }).at(x, y).animate_to(x, y - this.range, 4).destroy_after_animation();
      bulletRight.attr({
        damage: this.getDamage()
      }).at(x, y).animate_to(x + this.range, y, 4).destroy_after_animation();
      bulletDown.attr({
        damage: this.getDamage()
      }).at(x, y).animate_to(x, y + this.range, 4).destroy_after_animation();
      bulletLeft.attr({
        damage: this.getDamage()
      }).at(x, y).animate_to(x - this.range, y, 4).destroy_after_animation();
    },
    isEnemyNear: function() {
      var result, x1, x2, y1, y2;
      x1 = this.at().x - this.range - 2;
      x2 = this.at().x + this.range + 2;
      y1 = this.at().y - this.range - 2;
      y2 = this.at().y + this.range + 2;
      result = false;
      Crafty('Enemy').each(function() {
        var at;
        //noinspection JSPotentiallyInvalidUsageOfThis
        at = this.at();
        if (at.x >= x1 && at.x <= x2 && at.y >= y1 && at.y <= y2) {
          result = true;
        }
      });
      return result;
    },
    getDamage: function() {
      if (this.level < 6) {
        return this.level;
      } else {
        return Math.floor(Math.sqrt(this.level - 5) * this.level);
      }
    },
    getUpgradeCost: function(level) {
      if (level === void 0) {
        level = this.level;
      }
      return Math.floor(Game.towers['FlowerTower'] * Math.pow(1.4, level));
    }
  });

}).call(this);

(function() {
  Crafty.c('SniperTower', {
    init: function() {
      this.requires('Tower, SpriteAnimation, sniper_tower1');
      this.attr({
        w: 32,
        h: 32
      });
      this.maxLevel = 6;
      // show correct sprite for level and update tooltip
      this.bind('TowerUpgraded', function(actor) {
        if (actor === this) {
          this.handleLevelup();
        }
      });
      // if this tower is sold we reduce the cost for the next sniper tower again
      this.bind('TowerSold', function(actor) {
        if (actor === this) {
          Game.towers['SniperTower'] = Math.floor(Game.towers['SniperTower'] / 1.25);
        }
      });
      // increase cost for next sniper tower (we don't want to make it tooo easy ;) )
      this.delay((function() {
        Game.towers['SniperTower'] = Math.floor(1.25 * Game.towers['SniperTower']);
        this.handleLevelup();
      }), 100, 0);
      this.delay((function() {
        if (Game.enemyCount > 0 && this.has('Enabled')) {
          this.shoot();
        }
      }), 4000, -1);
    },
    handleLevelup: function() {
      var i;
      // set sprite according to level
      i = 1;
      while (i < Math.ceil((this.level + 1) / 2)) {
        this.removeComponent('sniper_tower' + i);
        i++;
      }
      this.addComponent('sniper_tower' + Math.ceil((this.level + 1) / 2));
      // update tooltip (what a surprise)
      this.updateTooltip();
    },
    updateTooltip: function() {
      this.tooltip('Sniper Tower at level ' + this.level + ', <br>' + this.getDamage() + ' damage per petal, <br>' + this.getDamage() / 4 + ' dps on the whole map <br> ' + this.getUpgradeText());
    },
    shoot: function() {
      var firstEnemy, x, x2, y, y2;
      firstEnemy = Crafty('Enemy').get(0);
      // instant kill with 2% chance on max level
      if (this.level === this.maxLevel && Math.floor(Math.random() * 50) === 0 && !firstEnemy.noInstantKill) {
        console.log('INSTANT KILL!!');
        firstEnemy.kill();
      } else {
        this.delay((function() {
          firstEnemy.hitWithDamage(this.getDamage());
        }), 500, 0);
        x = this.at().x;
        y = this.at().y;
        x2 = Math.floor(firstEnemy.at().x);
        y2 = Math.floor(firstEnemy.at().y);
        if (Game.options.bulletImages) {
          Crafty.e('Bullet, leaf_right').attr({
            damage: 0
          }).at(x, y).animate_to(x2, y2, 35).destroy_after_animation();
        }
      }
    },
    getDamage: function() {
      return this.level * 5;
    },
    getUpgradeCost: function(level) {
      if (level === void 0) {
        level = this.level;
      }
      return Math.floor(Game.towers['SniperTowerUpgrade'] * 1.5 * Math.sqrt(level));
    }
  });

}).call(this);

(function() {
  Crafty.c('Tower', {
    init: function() {
      this.requires('Actor, Mouse, Tooltip, Color, Delay, Enabled');
      this.attr({
        level: 1,
        tooltipWidth: 250,
        tooltipHeight: 110
      });
      if (Crafty.mobile) {
        this.bind('MouseUp', function() {
          if (this.previousMouseUp) {
            this.upgrade();
          } else {
            this.previousMouseUp = true;
          }
        });
      } else {
        this.bind('Click', function() {
          if (Crafty('Sidebar').selectedTower === this) {
            this.upgrade();
          } else {
            Crafty('Sidebar').openFor(this);
          }
        });
      }
    },
    isUpgradable: function() {
      return this.level < this.maxLevel;
    },
    upgrade: function() {
      var upgradeCost;
      upgradeCost = this.getUpgradeCost();
      if (this.isUpgradable()) {
        if (Game.money >= upgradeCost) {
          this.level++;
          Game.money -= upgradeCost;
          Game.towerCost = this.getUpgradeCost();
          Game.towerLevel = this.level;
          Crafty.trigger('TowerUpgraded', this);
        }
        console.log('Upgraded tower (' + this.at().x + '/' + this.at().y + ') for ' + upgradeCost);
      } else {
        console.log('Tower (' + this.at().x + '/' + this.at().y + ') at max level, can\'t upgrade it');
      }
    },
    getUpgradeText: function() {
      if (this.isUpgradable()) {
        return '(Upgrade costs ' + this.getUpgradeCost() + '$) <br>';
      } else {
        return '(maximum level reached)';
      }
    },
    sell: function() {
      Game.money += this.getSellValue();
      Crafty.trigger('TowerSold', this);
      this.destroy();
      console.log('Sold tower for ' + this.getSellValue() + '$');
    },
    getSellValue: function() {
      var level, levelCost, totalCost;
      totalCost = 0;
      level = 1;
      while (level <= this.level) {
        levelCost = this.getUpgradeCost(level);
        if (levelCost !== 'MAX') {
          totalCost += levelCost;
        }
        level++;
      }
      return Math.floor(totalCost * 0.5);
    }
  });

}).call(this);

(function() {
  Crafty.c('TowerPlace', {
    init: function() {
      this.requires('Actor, Delay, Mouse, Image, Color, Tooltip');
      this.image('assets/transparent.png').color('#ffffff', 0.0);
      this.bind('MouseOver', function() {
        this.color('#b66666', 0.2);
      });
      this.bind('MouseOut', function() {
        this.color('#ffffff', 0.0);
        this.previousMouseUp = false;
      });
      if (Crafty.mobile) {
        this.bind('MouseUp', function(e) {
          if (this.previousMouseUp) {
            this.trigger('Click', e);
          } else {
            this.previousMouseUp = true;
          }
        });
      }
      this.tooltip('Build a new ' + Game.selectedTower + ' here for ' + Game.towers[Game.selectedTower] + ' gold');
      this.bind('TowerCreated', function() {
        this.delay((function() {
          this.tooltip('Build a new ' + Game.selectedTower + ' here for ' + Game.towers[Game.selectedTower] + ' gold');
        }), 500, 0);
      });
      this.bind('TowerChanged', function() {
        this.tooltip('Build a new ' + Game.selectedTower + ' here for ' + Game.towers[Game.selectedTower] + ' gold');
      });
      this.bind('Click', function() {
        var tower;
        if (Game.money >= Game.towers[Game.selectedTower]) {
          tower = Crafty.e(Game.selectedTower).at(this.at().x, this.at().y);
          Game.money -= Game.towers[Game.selectedTower];
          Game.towerLevel = 1;
          Crafty.trigger('TowerCreated', tower);
          Crafty('Sidebar').openFor(tower);
          this.destroy();
        }
      });
    }
  });

}).call(this);

(function() {
  Crafty.c('TowerSelector', {
    init: function() {
      this.requires('DOMButton, Grid, Keyboard');
      this.attr({
        x: 0,
        y: Game.height() - Game.map_grid.tile.height,
        z: 100
      });
      this.textFont(Game.towerSelectorFont);
    },
    forTower: function(towerName) {
      this.targetTower = towerName;
      this.bind('EnterFrame', function() {
        if (this.oldValue !== Game.towers[towerName]) {
          this.text(Game.towers[towerName]);
        }
      });
      this.bind('TowerCreated', function() {
        this.text(Game.towers[towerName]);
      });
      if (Game.selectedTower === this.targetTower) {
        this.textColor(Game.highlightColor);
      } else {
        this.textColor(Game.textColor);
      }
      this.bind('TowerChanged', function() {
        if (Game.selectedTower === this.targetTower) {
          this.textColor(Game.highlightColor);
        } else {
          this.textColor(Game.textColor);
        }
      });
      this.bind('Click', function() {
        Game.selectedTower = towerName;
        Crafty.trigger('TowerChanged');
      });
      return this;
    },
    withHotkey: function(hotkey) {
      this.bind('KeyDown', function() {
        if (this.isDown(hotkey)) {
          Game.selectedTower = this.targetTower;
          Crafty.trigger('TowerChanged');
        }
      });
      return this;
    }
  });

}).call(this);
