// ------------------
// General Components
// ------------------

// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
    init: function() {
        this.attr({
            w: Game.map_grid.tile.width,
            h: Game.map_grid.tile.height
        })
    },

    // Locate this entity at the given position on the grid
    at: function(x, y) {
        if (x === undefined && y === undefined) {
            return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
        } else {
            this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
            return this;
        }
    }
});

// The PathWalker component allows an entity to move along a path,
// given as an array of objects with x and y attributes
Crafty.c('PathWalker', {
    init: function() {
    },

    // animate this entity along the given path
    animate_along: function(path, speed) {
        if (!speed) speed = 1;
        var animation = {
            actor: this,
            speed: speed,
            steps: []
        };
        for (var i = 0; i < path.length; i++) {
            animation.steps.push({
                x: path[i].x * Game.map_grid.tile.width,
                y: path[i].y * Game.map_grid.tile.height
            });
            //console.log("Tweening to x=" + path[i].x + ", y=" + path[i].y);
        }
        Tweening.targets.push(animation);
        return this;
    },

    animate_to: function(x, y, speed) {
        return this.animate_along([{x: x, y: y}], speed);
    },

    destroy_after_animation: function() {
        var that = this;
        Crafty.bind("TweenEnded", function(actor) {
            if (actor == that) {
                that.destroy();
            }
        });
        return this;
    }
});

Crafty.c('TweenXY', {
    init: function() {
        this.requires('2D');
    },

    moveTo: function(x, y, ms) {
        var timePerFrame = 1000 / Crafty.timer.FPS();
        var speed = Math.max(Math.abs(x - this.x), Math.abs(y - this.y)) * timePerFrame / ms;

        var animation = {
            actor: this,
            speed: speed,
            steps: [{x: x, y: y}]
        };

        Tweening.targets.push(animation);
        return this;
    }
});

Crafty.c('Tooltip', {
    init: function() {
        this.requires('Mouse');
        this.tooltipText = "Tooltip-Text here";
        this._tooltip = null;
        this.tooltipWidth = 300;
        this.tooltipHeight = 50;

        this.bind('MouseOver', this.createTooltip);
        this.bind('MouseOut', this.destroyTooltip);
    },

    createTooltip: function() {
        var x = Math.min(Game.width() - this.tooltipWidth - 10, Math.max(0, this.x + (this.w - this.tooltipWidth) / 2)),
            y = Math.max(0, this.y - this.tooltipHeight - 10);

        if (this.y < this.h + this.tooltipHeight) {
            y = this.y + this.h;
        }

        this._tooltip = Crafty.e('2D, DOM, Mouse')
            .attr({x: x, y: y, w: this.tooltipWidth, h: this.tooltipHeight, z: 500})
            .css(Game.generalTooltipCss);

        var tooltipText = Crafty.e('2D, DOM, Text')
            .attr({x: x + 2, y: y + 2, w: this.tooltipWidth, h: this.tooltipHeight, z: 520})
            .text(this.tooltipText)
            .textFont(Game.generalTooltipFont)
            .textColor(Game.textColor)
            .css(Game.centerCss);

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
        this.attr({buttonEnabled: true});
        return this;
    },

    disable: function() {
        this.unbind('MouseOver', this.mouseOverHandler);
        this.unbind('MouseOut', this.mouseOutHandler);
        this.textColor(Game.disabledColor);
        this.attr({buttonEnabled: false});
        return this;
    },

    highlightColor: function(color) {
        this._highlightColor = color;
        return this;
    },

    withImage: function(imageUrl) {
        var image = Crafty.e('2D, Image, ' + (this.has('Canvas') ? 'Canvas' : 'DOM'));
        image.image(imageUrl).attr({x: this.x, y: this.y});
        this.attach(image);
        return this;
    },

    withSprite: function(spriteId) {
        this.addComponent(spriteId);
        return this;
    }
});

Crafty.c('DOMButton', {
    init: function() {
        this.requires('Button, DOM');
        this.css(Game.buttonCss);

        var originalText = this.text;
        this.text = function(text) {
            if (typeof text === "undefined" || text === null) return this._text;

            originalText.call(this, text);
            this._element.innerHTML = this._text;
            return this;
        };

        this.enable = function() {
            this.removeComponent('disabledButton');
            return this;
        };

        this.disable = function() {
            this.addComponent('disabledButton');
            return this;
        };
    }
});


Crafty.c('Actor', {
    init: function() {
        this.requires('2D, Canvas, Grid');
    }
});

Crafty.c('Bullet', {
    init: function() {
        this.requires('Actor, Collision, PathWalker');
        this.attr({damage: 1});
    }
});

Crafty.c('Enemy', {
    init: function() {
        this.requires('Actor, Collision, PathWalker, Delay, Tooltip');
        this.attr({tooltipWidth: 150, tooltipHeight: 30});

        Game.enemyCount++;

        this.checkHits('Bullet');
        this.bind('HitOn', function(hitData) {
            this.hitWithDamage(hitData[0].obj.damage);
            hitData[0].obj.destroy();
        });

        var that = this;
        this.delay(function() {
            that.tooltip((that.tooltipTextBase ? that.tooltipTextBase + " with " : "") + this.health + " HP");
        }, 100, -1);
        this.bind('TweenEnded', function(actor) {
            if (that == actor) {
                Game.lifes -= this.livesTaken || 1;
                this.kill(false);
                Crafty.audio.play('LifeLost', 1);
            }
        })
    },

    hitWithDamage: function(damage) {
        if (this.health <= 0) {
            return;
        }

        this.attr({health: this.health - damage});
        if (this.health <= 0) {
            Game.money += this.reward;
            this.kill();
        }
        console.log("Health: " + this.health);
    },

    kill: function(playAudio) {
        if (playAudio === undefined) {
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
            Crafty.audio.play("EnemyDead", 1);
        }
    }
});

Crafty.c('ActualFPS', (function() {
    var start, frames, currentFPS;

    return {
        init: function () {
            start = new Date().getTime();
            frames = 0;

            this.bind('ExitFrame', function () {
                var newTime = new Date().getTime();
                if (newTime - start >= 1000) {
                    currentFPS = frames;
                    frames = 0;
                    start = newTime;
                } else {
                    frames++;
                }
            })
        },

        FPS: function () {
            return currentFPS;
        }
    };
})());

// ---------------------
// Singleton UI Elements
// ---------------------

Crafty.c('Wave', {
    init: function() {
        this.requires('DOMButton, Grid, Delay');
        this.attr({w: 150, tooltipWidth: 350, clickEnabled: true});
        this.text('Start');
        this.tooltip("Starts the next wave of enemies. Click here once you placed your towers.");
        this.textFont(Game.waveFont);
        this.currentWave = Game.currentWave;
        this.blinkBeforeStart();
        this.automaticallyStartNextWave();
        this.startNextWaveOnClick();
    },

    blinkBeforeStart: function() {
        var highlighted = false;
        this.delay(function() {
            if (!this.waveStarted) {
                if (highlighted) {
                    this.textColor(Game.textColor);
                } else {
                    this.textColor(Game.highlightColor);
                }
                highlighted = !highlighted;
            }
        }, 1000, -1);
    },

    automaticallyStartNextWave: function() {
        this.bind('EnterFrame', function() {
            if (this.isWaveFinished()) {
                if (!this.finishedEventTriggered) {
                    Crafty.trigger("WaveFinished", this.currentWave);
                    this.finishedEventTriggered = true;

                    var flowerTowers = Crafty('FlowerTower'), i = 0;
                    if (flowerTowers.length > 0) {
                        this.delay(function () {
                            flowerTowers.get(i).shoot();
                            i++;
                        }, 500, flowerTowers.length - 1);
                    }
                }

                if (this.isNextWavePossible()) {
                    Game.money += Game.moneyAfterWave;
                    this.startNextWave();
                    console.log("Started wave " + this.currentWave);
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
                this.tooltip("Button currently disabled.");

                if (this.currentWave > 0) {
                    Game.money += Game.moneyAfterWave;
                }
                this.startNextWave();

                this.delay(function() {
                    this.clickEnabled = true;
                    this.textColor(Game.textColor);
                    this.tooltip("Start next wave early to get wave finished bonus gold.");
                }, 10000, 0);
            }
        });
    },

    isWaveFinished: function() {
        return Game.enemyCount == 0 && this.spawnFinished;
    },

    isNextWavePossible: function() {
        if (Game.lifes == 0) {
            return false;
        }
        return Game.endless || this.currentWave < Game.waves.current.length;
    },

    startNextWave: function() {
        this.spawnFinished = false;
        this.waveStarted = true;

        var i = 0, enemies = this.getEnemies(), interval = 3000;

        if (this.currentWave > Game.waves.current.length) {
            interval = Math.max(200, 3000 - (this.currentWave - Game.waves.current.length) * 50);
        }

        this.delay(function() {
            var enemy = Crafty.e(enemies[i]).at(Game.path.start.x, Game.path.start.y);
            this.delay(function() {
                enemy.animate_along(Game.path.getPath(), enemy.speed);
            }, 500, 0);

            // special handling for all waves after standard waves: increase health
            if (this.currentWave > Game.waves.current.length) {
                var diff = this.currentWave - Game.waves.current.length;
                enemy.attr({health: Math.floor((1 + diff * 0.05) * enemy.health + 5 * diff)});
                console.log("new health: " + enemy.health);
            }

            i++;
            if (i == enemies.length) {
                this.spawnFinished = true;
                console.log("spawn finished");
            }
        }, interval, enemies.length - 1);

        if (this.currentWave == Game.waves.current.length - 1) {
            Crafty.audio.stop();
            Crafty.audio.play('Boss', -1);
        }

        this.currentWave++;
        Game.currentWave = this.currentWave;
    },

    getEnemies: function() {
        if (this.currentWave < Game.waves.current.length) {
            return Game.waves.current[this.currentWave];
        } else {
            // TODO auto generate waves randomly, based on reward
            var enemies = ['GreenDragon', 'Orc'];
            for (var i = 0; i < this.currentWave - Game.waves.current.length; i++) {
                enemies.push(
                    i % 10 == 4 ? 'SilverDragon' :
                        (i % 6 == 2 ? 'GreenDragon' :
                            (i % 4 == 0 ? 'MightyWitch' :
                                (i % 4 == 2 ? 'FastKnight' :
                                    'FastSquid'))));
            }
            enemies.push('GreenDragon');
            return enemies;
        }
    }
});

Crafty.c('Sidebar', {
    init: function() {
        this.requires('2D, DOM, Mouse,  Color');
        this.attr({
            x: 0,
            y: Game.map_grid.tile.height,
            w: 170,
            h: Game.height() - 2 * Game.map_grid.tile.height,
            z: 100
        });
        this.color("#777777", 0.42);

        this.bind('MouseOver', function(e) {
            e.preventDefault();
        });

        var sidebar = this;
        var closeButton = Crafty.e('DOMButton')
            .attr({x: sidebar.w - 27, y: this.y, w: 25, h: 25, z: 101, tooltipWidth: 50, tooltipHeight: 75})
            .textFont(Game.closeFont)
            .css(Game.closeCss)
            .text('x')
            .tooltip('Closes the sidebar')
            .bind('Click', function() {
                sidebar.close();
            });

        this.upgradeHeadline = Crafty.e('2D, DOM, Text')
            .attr({x: 0, y: 70, w: sidebar.w, z: 101})
            .textColor(Game.textColor)
            .textFont(Game.sidebarFont);
        this.upgradeButton = Crafty.e('DOMButton')
            .attr({x: 0, y: 160, w: sidebar.w, h: 40, z: 101})
            .bind('Click', function() {
                sidebar.selectedTower.upgrade();
            });
        this.sellHeadline = Crafty.e('2D, DOM, Text')
            .attr({x: 0, y: 260, w: sidebar.w, z: 101})
            .textColor(Game.textColor)
            .textFont(Game.sidebarFont);
        this.sellButton = Crafty.e('DOMButton')
            .attr({x: 0, y: 330, w: sidebar.w, h: 40, z: 101})
            .bind('Click', function() {
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
        Crafty('Sidebar').selectedTower.color("#ffffff", 0.3);
    },

    openFor: function(selectedTower) {
        if (this.selectedTower) {
            this.selectedTower.unbind('MouseOut', this.highlightTower);
            this.selectedTower.color("#ffffff", 0.0);
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
        var towerType = this.selectedTower.has('SniperTower') ? 'Sniper Tower' : 'Flower Tower';

        if (this.selectedTower.isUpgradable()) {
            this.upgradeHeadline.text('Upgrade ' + towerType + ' to level ' + (this.selectedTower.level + 1) + ':');
            this.upgradeButton
                .text('-' + this.selectedTower.getUpgradeCost() + '$')
                .tooltip('Upgrade ' + towerType +
                ' at position (' + this.selectedTower.at().x + '/' + this.selectedTower.at().y + ')' +
                ' to level ' + (this.selectedTower.level + 1) + ' for ' + this.selectedTower.getUpgradeCost() + '$');
        } else {
            this.upgradeHeadline.text(towerType + ': Maximum level reached');
            this.upgradeButton
                .text('-')
                .tooltip('Maximum level reached, can\'t upgrade tower');
        }

        this.sellHeadline.text('Sell ' + towerType + ':');
        this.sellButton
            .text('+' + this.selectedTower.getSellValue() + '$')
            .tooltip('Sell ' + towerType +
            ' at position (' + this.selectedTower.at().x + '/' + this.selectedTower.at().y + ')' +
            ' to get back ' + this.selectedTower.getSellValue() + '$');
    },

    close: function() {
        this.x = -this.w - 50;
        if (this.selectedTower) {
            this.selectedTower.unbind('MouseOut', this.highlightTower);
            this.selectedTower.color("#ffffff", 0.0);
        }
        this.selectedTower = null;
    }
});

// ------------------
// UI Elements
// ------------------

Crafty.c('HudElement', {
    init: function() {
        this.requires('2D, DOM, Grid, Text');
        this.attr({ x: 0, y: 0, w: Game.width() });
        this.textFont(Game.hudFont);
        this.textColor(Game.textColor);
    },

    observe: function(prefix, observable, suffix) {
        if (suffix === undefined) {
            suffix = '';
        }

        this.observable = observable;
        this.bind('EnterFrame', function() {
            var newValue;
            if (typeof this.observable == 'function') {
                newValue = this.observable.call();
            } else {
                newValue = Game[this.observable];
            }

            if (this.oldValue != newValue) {
                this.trigger('ValueChanged', newValue);
                this.oldValue = newValue;
            }
        });
        this.bind('ValueChanged', function(data) {
            this.text(prefix + ": " + data + suffix);
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

Crafty.c('TowerSelector', {
    init: function() {
        this.requires('DOMButton, Grid, Keyboard');
        this.attr({x: 0, y: Game.height() - Game.map_grid.tile.height, z: 100});
        this.textFont(Game.towerSelectorFont);
    },

    forTower: function(towerName) {
        this.targetTower = towerName;
        this.bind('EnterFrame', function() {
            if (this.oldValue != Game.towers[towerName]) {
                this.text(Game.towers[towerName]);
            }
        });
        this.bind('TowerCreated', function() {
            this.text(Game.towers[towerName]);
        });

        if (Game.selectedTower == this.targetTower) {
            this.textColor(Game.highlightColor);
        } else {
            this.textColor(Game.textColor);
        }
        this.bind('TowerChanged', function() {
            if (Game.selectedTower == this.targetTower) {
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

Crafty.c('RestartButton', {
    init: function() {
        this.requires('DOMButton');
        this.text('Start again?');
        this.tooltip('Clicking this button starts another game');
        this.attr({ x: 0, y: Game.height() - 100, w: Game.width(), h: 50});
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

Crafty.c('Tree', {
    init: function() {
        this.requires('Actor, Color');
        this.color('rgb(20, 125, 40)');
    }
});

Crafty.c('Path', {
    init: function() {
        this.requires('Actor, Image, Color');
        this.image("assets/transparent.png").color("#969600", 0.42);
    }
});

Crafty.c('TowerPlace', {
    init: function() {
        this.requires('Actor, Delay, Mouse, Image, Color, Tooltip');
        this.image("assets/transparent.png").color("#ffffff", 0.0);
        this.bind('MouseOver', function() {
            this.color("#b66666", 0.2);
        });
        this.bind('MouseOut', function() {
            this.color("#ffffff", 0.0);
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
            this.delay(function() {
                this.tooltip('Build a new ' + Game.selectedTower + ' here for ' + Game.towers[Game.selectedTower] + ' gold');
            }, 500, 0);
        });
        this.bind('TowerChanged', function() {
            this.tooltip('Build a new ' + Game.selectedTower + ' here for ' + Game.towers[Game.selectedTower] + ' gold');
        });
        this.bind('Click', function() {
            if (Game.money >= Game.towers[Game.selectedTower]) {
                var tower = Crafty.e(Game.selectedTower).at(this.at().x, this.at().y);
                Game.money -= Game.towers[Game.selectedTower];
                Game.towerLevel = 1;
                Crafty.trigger('TowerCreated', tower);
                Crafty('Sidebar').openFor(tower);
                this.destroy();
            }
        });
    }
});


// ------
// Towers
// ------

Crafty.c('Enabled', {
    init: function() {
        this.requires('Color, Mouse');
        this.color("#ffffff", 0.0);

        this.bind('MouseOver', function() {
            this.color("#6666b6", 0.2);
        });
        this.bind('MouseOut', function() {
            this.color("#ffffff", 0.0);
        });
    },

    disable: function() {
        this.removeComponent('Enabled');
        this.addComponent('Disabled');
    }
});

Crafty.c('Disabled', {
    init: function() {
        this.requires('Color, Mouse, Delay');
        this.color('#ff0000', 0.5);

        this.bind('MouseOut', function() {
            this.color('#ff0000', 0.5);
        });

        this.delay(function() {
            this.removeComponent('Disabled');
            this.addComponent('Enabled');
        }, 20000, 0);
    }
});

Crafty.c('Tower', {
    init: function() {
        this.requires('Actor, Mouse, Tooltip, Color, Delay, Enabled');
        this.attr({level: 1, tooltipWidth: 250, tooltipHeight: 110});

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
                if (Crafty('Sidebar').selectedTower == this) {
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
        var upgradeCost = this.getUpgradeCost();
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
            return "(Upgrade costs " + this.getUpgradeCost() + "$) <br>";
        } else {
            return "(maximum level reached)";
        }
    },

    sell: function() {
        Game.money += this.getSellValue();
        Crafty.trigger('TowerSold', this);
        this.destroy();
        console.log('Sold tower for ' + this.getSellValue() + "$");
    },

    getSellValue: function() {
        var totalCost = 0;
        for (var level = 1; level <= this.level; level++) {
            var levelCost = this.getUpgradeCost(level);
            if (levelCost != 'MAX') {
                totalCost += levelCost;
            }
        }
        return Math.floor(totalCost * 0.5);
    }
});

Crafty.c('FlowerTower', {
    init: function() {
        this.requires('Tower, flower_tower1');
        this.range = 4;
        this.maxLevel = 10;
        this.shootingSpeed = 0.4;

        // handle setting range, correct sprite (according to level) and tooltip text
        this.bind('TowerUpgraded', function(actor) {
            if (actor == this) {
                this.handleLevelup();
            }
        });

        // initialize according to level (has to be delayed because level is set after initialization)
        this.delay(function() {
            this.handleLevelup();
        }, 100, 0);

        var i = 0, enemyNear = true;

        this.delay(function() {
            if (i++ % 4 == 0) {
                enemyNear = this.isEnemyNear();
            }
            if (this.has('Enabled') && enemyNear) {
                this.shoot();
            }
        }, this.shootingSpeed * 1000, -1);
    },

    handleLevelup: function() {
        // set range according to level
        if (this.level == this.maxLevel) {
            this.range = 6;
        } else if (this.level >= 4) {
            this.range = 5;
        } else {
            this.range = 4;
        }

        // set sprite according to level
        for (var i = 1; i < Math.ceil(this.level / 2); i++) {
            this.removeComponent('flower_tower' + i);
        }
        this.addComponent('flower_tower' + Math.ceil(this.level / 2));

        // update tooltip (what a surprise)
        this.updateTooltip();
    },

    updateTooltip: function() {
        this.tooltip(
            "Flower Tower at level " + this.level + ", <br>" +
            this.getDamage() + " damage per petal, <br>" +
            (this.getDamage() / this.shootingSpeed) + " dps in a square of " + this.range + " tiles <br>" +
            this.getUpgradeText()
        );
    },

    shoot: function() {
        var x = this.at().x, y = this.at().y,
            bulletUp, bulletRight, bulletDown, bulletLeft;

        if (Game.options.bulletImages) {
            bulletUp = Crafty.e('Bullet, leaf_up');
            bulletRight = Crafty.e('Bullet, leaf_right');
            bulletDown = Crafty.e('Bullet, leaf_down');
            bulletLeft = Crafty.e('Bullet, leaf_left');
        } else {
            bulletUp = Crafty.e('Bullet').attr({w: 16, h: 16});
            bulletRight = Crafty.e('Bullet').attr({w: 16, h: 16});
            bulletDown = Crafty.e('Bullet').attr({w: 16, h: 16});
            bulletLeft = Crafty.e('Bullet').attr({w: 16, h: 16});
        }

        bulletUp.attr({damage: this.getDamage()}).at(x, y).animate_to(x, y - this.range, 4).destroy_after_animation();
        bulletRight.attr({damage: this.getDamage()}).at(x, y).animate_to(x + this.range, y, 4).destroy_after_animation();
        bulletDown.attr({damage: this.getDamage()}).at(x, y).animate_to(x, y + this.range, 4).destroy_after_animation();
        bulletLeft.attr({damage: this.getDamage()}).at(x, y).animate_to(x - this.range, y, 4).destroy_after_animation();
    },

    isEnemyNear: function() {
        var x1 = this.at().x - this.range - 2, x2 = this.at().x + this.range + 2,
            y1 = this.at().y - this.range - 2, y2 = this.at().y + this.range + 2, result = false;
        Crafty('Enemy').each(function() {
            //noinspection JSPotentiallyInvalidUsageOfThis
            var at = this.at();
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
        if (level === undefined) {
            level = this.level;
        }

        return Math.floor(Game.towers['FlowerTower'] * Math.pow(1.4, level));
    }
});

Crafty.c('SniperTower', {
    init: function() {
        this.requires('Tower, SpriteAnimation, sniper_tower1');
        this.attr({w: 32, h: 32});
        //this.reel('LeafSpinning', 2000, [[0, 0], [0, 1], [1, 1], [1, 0]]);
        //this.animate('LeafSpinning', -1);
        this.maxLevel = 6;

        // show correct sprite for level and update tooltip
        this.bind('TowerUpgraded', function(actor) {
            if (actor == this) {
                this.handleLevelup();
            }
        });
        // if this tower is sold we reduce the cost for the next sniper tower again
        this.bind('TowerSold', function(actor) {
            if (actor == this) {
                Game.towers['SniperTower'] = Math.floor(Game.towers['SniperTower'] / 1.25);
            }
        });

        // increase cost for next sniper tower (we don't want to make it tooo easy ;) )
        this.delay(function() {
            Game.towers['SniperTower'] = Math.floor(1.25 * Game.towers['SniperTower']);
            this.handleLevelup();
        }, 100, 0);

        this.delay(function() {
            if (Game.enemyCount > 0 && this.has('Enabled')) {
                this.shoot();
            }
        }, 4000, -1);
    },

    handleLevelup: function() {
        // set sprite according to level
        for (var i = 1; i < Math.ceil((this.level + 1) / 2); i++) {
            this.removeComponent('sniper_tower' + i);
        }
        this.addComponent('sniper_tower' + Math.ceil((this.level + 1) / 2));

        // update tooltip (what a surprise)
        this.updateTooltip();
    },

    updateTooltip: function() {
        this.tooltip(
            "Sniper Tower at level " + this.level + ", <br>" +
            this.getDamage() + " damage per petal, <br>" +
            (this.getDamage() / 4) + " dps on the whole map <br> " +
            this.getUpgradeText()
        );
    },

    shoot: function() {
        var firstEnemy = Crafty('Enemy').get(0);

        // instant kill with 2% chance on max level
        if (this.level == this.maxLevel && Math.floor(Math.random() * 50) == 0 && !firstEnemy.noInstantKill) {
            console.log("INSTANT KILL!!");
            firstEnemy.kill();
        } else {
            this.delay(function() {
                firstEnemy.hitWithDamage(this.getDamage());
            }, 500, 0);
            var x = this.at().x, y = this.at().y, x2 = Math.floor(firstEnemy.at().x), y2 = Math.floor(firstEnemy.at().y);

            if (Game.options.bulletImages) {
                Crafty.e('Bullet, leaf_right').attr({damage: 0}).at(x, y).animate_to(x2, y2, 35).destroy_after_animation();
            }
        }
    },

    getDamage: function() {
        return this.level * 5;
    },

    getUpgradeCost: function(level) {
        if (level === undefined) {
            level = this.level;
        }

        return Math.floor(Game.towers['SniperTowerUpgrade'] * 1.5 * Math.sqrt(level));
    }
});


// -------
// Enemies
// -------

Crafty.c('Witch', {
    init: function() {
        this.requires('Enemy, witch_right');
        this.attr({
            health: 5,
            reward: 1,
            speed: 1.8,
            tooltipTextBase: "Witch"
        });
    }
});

Crafty.c('MightyWitch', {
    init: function() {
        this.requires('Enemy, witch_down, Delay');
        this.attr({
            health: 100,
            reward: 20,
            speed: 1.8,
            tooltipWidth: 200,
            tooltipHeight: 60,
            tooltipTextBase: "Mighty Witch (disables towers)"
        });

        this.delay(function() {
            // disable random tower for some time
            var towers = Crafty('Tower Enabled');
            if (towers.length > 0) {
                var tower = towers.get(Math.floor(Math.random() * towers.length));
                tower.disable();
            }
        }, 5000, -1);
    }
});

Crafty.c('Squid', {
    init: function() {
        this.requires('Enemy, squid');
        this.attr({
            health: 30,
            reward: 3,
            speed: 1.0,
            tooltipTextBase: "Squid"
        });
    }
});

Crafty.c('FastSquid', {
    init: function() {
        this.requires('Enemy, squid');
        this.attr({
            health: 23,
            reward: 5,
            speed: 2.5,
            tooltipWidth: 200,
            tooltipTextBase: "Fast Squid"
        });
    }
});

Crafty.c('Knight', {
    init: function() {
        this.requires('Enemy, knight_right');
        this.attr({
            health: 50,
            reward: 10,
            speed: 1.3,
            tooltipWidth: 200,
            tooltipTextBase: "Knight"
        });
    }
});

Crafty.c('FastKnight', {
    init: function() {
        this.requires('Enemy, knight_right');
        this.attr({
            health: 65,
            reward: 15,
            speed: 2.7,
            tooltipWidth: 200,
            tooltipTextBase: "Fast Knight"
        });
    }
});

Crafty.c('Spider', {
    init: function() {
        this.requires('Enemy, spider');
        this.attr({
            health: 60,
            reward: 5,
            speed: 1.7,
            tooltipTextBase: "Spider"
        });
    }
});

Crafty.c('Orc', {
    init: function() {
        this.requires('Enemy, orc');
        this.attr({
            health: 200,
            reward: 30,
            speed: 0.8,
            livesTaken: 2,
            tooltipTextBase: "Orc"
        });
    }
});

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
            tooltipTextBase: "Green Dragon"
        });
    }
});

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
            tooltipTextBase: "Silver Dragon"
        });
    }
});



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

        this.bind('EnterFrame', this.tweenHandler)
    },

    moveActor: function (current, distanceX, distanceY) {
        var newX = current.actor.x, newY = current.actor.y;

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
        current.actor.attr({x: newX, y: newY});
    },

    triggerDirectionChanged: function (current) {
        if (current.steps.length == 0) {
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
        if (Crafty.isPaused()) {
            return;
        }

        for (var i = 0; i < this.targets.length; i++) {
            var current = this.targets[i],
                distanceX = current.speed * Game.map_grid.tile.width / this.stepsPerGrid,
                distanceY = current.speed * Game.map_grid.tile.height / this.stepsPerGrid;

            if (current.actor.x != current.steps[0].x || current.actor.y != current.steps[0].y) {
                this.moveActor(current, distanceX, distanceY);
            } else {
                // remove this step from steps, so we can continue with next step
                current.steps.shift();

                this.triggerDirectionChanged(current);
            }

            // no more steps to take for current target: remove it from tween_targets array
            if (current.steps.length == 0) {
                this.targets.splice(i, 1);
                i--;
                Crafty.trigger("TweenEnded", current.actor);
            }
        }
    }
});

Tweening = Crafty.e('TweeningHandler');