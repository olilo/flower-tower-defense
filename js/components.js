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

Crafty.c('Actor', {
    init: function() {
        this.requires('2D, Canvas, Grid');
    }
});

Crafty.c('Bullet', {
    init: function() {
        this.requires('Actor, Collision, PathWalker');
        this.attr({damage: 1});
        this.checkHits('Enemy');
        this.bind('HitOn', function() {
            this.destroy();
        });
    }
});

Crafty.c('Enemy', {
    init: function() {
        this.requires('Actor, Collision, PathWalker, Delay');

        Game.enemyCount++;

        this.checkHits('Bullet');
        this.bind('HitOn', function(hitData) {
            this.hitWithDamage(hitData[0].obj.damage);
        });

        var that = this;
        this.delay(function() {
            that.animate_along(Game.path.getPath(), that.speed);
        }, 500, 0);
        this.bind('TweenEnded', function(actor) {
            if (that == actor) {
                Game.lifes -= this.livesTaken || 1;
                this.kill();
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

    kill: function() {
        Game.enemyCount--;
        this.destroy();
        Crafty.trigger('EnemyKilled', this);
    }
});

Crafty.c('Wave', {
    init: function() {
        this.requires('2D, DOM, Grid, Text, Delay, Mouse');
        this.attr({w: 150, clickEnabled: true});
        this.text('Start');
        this.textFont(Game.waveFont);
        this.textColor(Game.textColor);
        this.css(Game.buttonCss);
        this.bind('Click', function() {
            if (this.clickEnabled) {
                this.clickEnabled = false;
                this.text('Next Wave');
                this.textColor(Game.disabledColor);

                if (this.currentWave > 0) {
                    Game.money += Game.moneyAfterWave;
                }
                this.startNextWave();

                this.delay(function() {
                    this.clickEnabled = true;
                    this.textColor(Game.textColor);
                }, 5000, 0);
            }
        });
        this.currentWave = Game.currentWave;
        this.finishedEventTriggered = false;

        var highlighted = false;
        this.delay(function() {
            if (this.currentWave > 0) {
                return;
            }

            if (highlighted) {
                this.textColor(Game.textColor);
            } else {
                this.textColor(Game.highlightColor);
            }
            highlighted = !highlighted;
        }, 1000, -1);

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

    isWaveFinished: function() {
        return Game.enemyCount == 0 && this.spawnFinished;
    },

    isNextWavePossible: function() {
        if (Game.lifes == 0) {
            return false;
        }
        return Game.endless || this.currentWave < Game.waves.length;
    },

    startNextWave: function() {
        this.spawnFinished = false;

        var i = 0, enemies = this.getEnemies();
        this.delay(function() {
            var enemy = Crafty.e(enemies[i]).at(Game.path.start.x, Game.path.start.y);

            // special handling for all waves after standard waves: increase health
            if (this.currentWave > Game.waves.length) {
                var diff = this.currentWave - Game.waves.length;
                enemy.attr({health: Math.floor((1 + diff * 0.05) * enemy.health + 5 * diff)});
                console.log("new health: " + enemy.health);
            }

            i++;
            if (i == enemies.length) {
                this.spawnFinished = true;
            }
        }, 3000, enemies.length - 1);

        this.currentWave++;
        Game.currentWave = this.currentWave;
    },

    getEnemies: function() {
        if (this.currentWave < Game.waves.length) {
            return Game.waves[this.currentWave];
        } else {
            // TODO auto generate waves randomly, based on reward
            var enemies = ['GreenDragon', 'Orc'];
            for (var i = 0; i < this.currentWave - Game.waves.length; i++) {
                enemies.push(
                    i % 10 == 4 ? 'SilverDragon' :
                        (i % 6 == 2 ? 'GreenDragon' :
                            (i % 4 == 0 ? 'MightyWitch' :
                                'FastSquid')));
            }
            enemies.push('GreenDragon');
            return enemies;
        }
    }
});


// ------------------
// UI Elements
// ------------------

Crafty.c('HudElement', {
    init: function() {
        this.requires('2D, DOM, Text');
        this.attr({ x: 0, y: 0, w: 133 });
        this.textFont(Game.hudFont);
        this.textColor(Game.textColor);
    },

    observe: function(prefix, observable) {
        this.observable = observable;
        this.bind('EnterFrame', function() {
            this.text(prefix + ": " + Game[this.observable])
        });
        return this;
    },

    alertIfBelow: function(threshold) {
        this.bind('EnterFrame', function() {
            if (Game[this.observable] < threshold) {
                this.textColor(Game.alertColor);
            } else {
                this.textColor(Game.textColor);
            }
        });
        return this;
    },

    highlight: function() {
        this.bind('EnterFrame', function() {
            if (Game[this.observable] > 0) {
                this.textColor(Game.highlightColor);
            } else {
                this.textColor(Game.textColor);
            }
        });
        return this;
    },

    at: function(x) {
        this.attr({ x: Game.map_grid.tile.width +  x * 133});
        return this;
    }
});

Crafty.c('TowerSelector', {
    init: function() {
        this.requires('2D, DOM, Grid, Text, Image, Mouse, Keyboard');
        this.x = 0;
        this.y = Game.height() - Game.map_grid.tile.height;
        this.textFont(Game.towerSelectorFont);
        this.textColor(Game.textColor);
        this.css(Game.buttonCss);
    },

    forTower: function(towerName) {
        this.targetTower = towerName;
        this.bind('EnterFrame', function() {
            this.text(Game.towers[towerName]);
            if (Game.selectedTower == this.targetTower) {
                this.textColor(Game.highlightColor);
            } else {
                this.textColor(Game.textColor);
            }
        });
        this.bind('Click', function() {
            Game.selectedTower = towerName;
        });
        return this;
    },

    withImage: function(imageUrl) {
        this.image(imageUrl);
        return this;
    },

    withHotkey: function(hotkey) {
        this.bind('KeyDown', function() {
            if (this.isDown(hotkey)) {
                Game.selectedTower = this.targetTower;
            }
        });
        return this;
    }
});

Crafty.c('RestartButton', {
    init: function() {
        this.requires('2D, DOM, Text, Mouse');
        this.text('Start again?');
        this.attr({ x: 0, y: Game.height() - 100, w: Game.width(), h: 50});
        this.textFont(Game.restartFont);
        this.textColor(Game.restartColor);
        this.css(Game.buttonCss);
        this.bind('MouseOver', function() {
            this.textColor('white');
        });
        this.bind('MouseOut', function() {
            this.textColor(Game.restartColor);
        });
        this.bind('Click', function() {
            console.log('Restaaaaaart');
            if (Crafty.isPaused()) {
                Crafty.pause();
            }
            Crafty.scene('Difficulty');
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
        this.image("assets/transparent.png").color("#969600", 0.15);
    }
});

Crafty.c('TowerPlace', {
    init: function() {
        this.requires('Actor, Mouse, Image, Color');
        this.image("assets/transparent.png").color("#ffffff", 0.0);
        this.bind('MouseOver', function() {
            this.color("#b66666", 0.2);
            Game.towerCost = Game.towers[Game.selectedTower];
            Game.towerLevel = 0;
        });
        this.bind('MouseOut', function() {
            this.color("#ffffff", 0.0);
            Game.towerCost = 0;
        });
        this.bind('Click', function() {
            if (Game.money >= Game.towers[Game.selectedTower]) {
                var tower = Crafty.e(Game.selectedTower).at(this.at().x, this.at().y);
                Game.money -= Game.towers[Game.selectedTower];
                Game.towerLevel = 1;
                Crafty.trigger('TowerCreated', tower);
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
            Game.towerCost = this.getUpgradeCost();
            Game.towerLevel = this.level;
        });
        this.bind('MouseOut', function() {
            this.color("#ffffff", 0.0);
            Game.towerCost = 0;
            Game.towerLevel = 0;
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
        this.requires('Actor, Mouse, Color, Delay, Enabled');
        this.attr({level: 1});

        this.bind('TowerUpgraded', function(actor) {
            if (actor == this) {
                if (this.level == this.maxLevel) {
                    this.disableUpgrade();
                }
            }
        });

        this.bind('Click', function () {
            var upgradeCost = this.getUpgradeCost();
            if (Game.money >= upgradeCost) {
                this.level++;
                Game.money -= upgradeCost;
                Game.towerCost = this.getUpgradeCost();
                Game.towerLevel = this.level;
                Crafty.trigger('TowerUpgraded', this);
            }
        });
    },

    disableUpgrade: function() {
        this.unbind('Click');
    }
});

Crafty.c('FlowerTower', {
    init: function() {
        this.requires('Tower, Image');
        this.image("assets/flower.png");
        this.range = 4;
        this.maxLevel = 10;

        // max level and range increase
        this.bind('TowerUpgraded', function(actor) {
            if (actor == this) {
                if (this.level == 4) {
                    this.range = 5;
                } else if (this.level == this.maxLevel) {
                    this.range = 6;
                    this.disableUpgrade();
                }
            }
        });

        this.delay(function() {
            if (this.has('Enabled') && this.isEnemyNear()) {
                this.shoot();
            }
        }, 700, -1);
    },

    shoot: function() {
        var x = this.at().x, y = this.at().y;

        Crafty.e('Bullet, leaf_up').attr({damage: this.getDamage()}).at(x, y)
            .animate_to(x, y - this.range, 4).destroy_after_animation();
        Crafty.e('Bullet, leaf_right').attr({damage: this.getDamage()}).at(x, y)
            .animate_to(x + this.range, y, 4).destroy_after_animation();
        Crafty.e('Bullet, leaf_down').attr({damage: this.getDamage()}).at(x, y)
            .animate_to(x, y + this.range, 4).destroy_after_animation();
        Crafty.e('Bullet, leaf_left').attr({damage: this.getDamage()}).at(x, y)
            .animate_to(x - this.range, y, 4).destroy_after_animation();
    },

    isEnemyNear: function() {
        var x1 = this.at().x - this.range, x2 = this.at().x + this.range,
            y1 = this.at().y - this.range, y2 = this.at().y + this.range, result = false;
        Crafty('Enemy').each(function() {
            //noinspection JSPotentiallyInvalidUsageOfThis
            if (this.at().x >= x1 && this.at().x <= x2 && this.at().y >= y1 && this.at().y <= y2) {
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

    getUpgradeCost: function() {
        if (this.level < this.maxLevel) {
            return Math.floor(Game.towers['FlowerTower'] * 1.75 * Math.sqrt(this.level));
        } else {
            return "MAX";
        }
    }
});

Crafty.c('SniperTower', {
    init: function() {
        this.requires('Tower, leaf_right, SpriteAnimation');
        // This is the same animation definition, but using the alternative method
        this.attr({w: 32, h: 32});
        this.reel('LeafSpinning', 2000, [[0, 0], [0, 1], [1, 1], [1, 0]]);
        this.animate('LeafSpinning', -1);
        this.maxLevel = 6;

        // increase cost for next sniper tower (we don't want to make it tooo easy ;) )
        this.delay(function() {
            Game.towers['SniperTower'] = Math.floor(1.25 * Game.towers['SniperTower']);
        }, 100, 0);

        this.delay(function() {
            if (Game.enemyCount > 0 && this.has('Enabled')) {
                this.shoot();
            }
        }, 4000, -1);
    },

    shoot: function() {
        var firstEnemy = Crafty('Enemy').get(0), damage = this.level * 5;

        // instant kill with 2% chance on max level
        if (this.level == this.maxLevel && Math.floor(Math.random() * 50) == 0 && !firstEnemy.noInstantKill) {
            console.log("INSTANT KILL!!");
            firstEnemy.kill();
        } else {
            this.delay(function() {
                firstEnemy.hitWithDamage(damage);
            }, 500, 0);
            var x = this.at().x, y = this.at().y, x2 = Math.floor(firstEnemy.at().x), y2 = Math.floor(firstEnemy.at().y);
            Crafty.e('Bullet, leaf_right').attr({damage: 0}).at(x, y).animate_to(x2, y2, 35).destroy_after_animation();
        }
    },

    getUpgradeCost: function() {
        if (this.level < this.maxLevel) {
            return Math.floor(Game.towers['SniperTowerUpgrade'] * 1.5 * Math.sqrt(this.level));
        } else {
            return "MAX";
        }
    }
});

Crafty.c('MoneyTower', {
    init: function() {
        this.requires('Actor, knight_down');
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
            speed: 1.8
        });
    }
});

Crafty.c('MightyWitch', {
    init: function() {
        this.requires('Enemy, witch_down, Delay');
        this.attr({
            health: 50,
            reward: 25,
            speed: 1.8
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
        this.requires('Enemy, Image');
        this.image("assets/squid.png");
        this.attr({
            health: 30,
            reward: 5,
            speed: 1.0
        });
    }
});

Crafty.c('FastSquid', {
    init: function() {
        this.requires('Enemy, Image');
        this.image("assets/squid.png");
        this.attr({
            health: 23,
            reward: 15,
            speed: 2.5
        });
    }
});

Crafty.c('Knight', {
    init: function() {
        this.requires('Enemy, knight_right');
        this.attr({
            health: 50,
            reward: 15,
            speed: 1.3
        });
    }
});

Crafty.c('FastKnight', {
    init: function() {
        this.requires('Enemy, knight_right');
        this.attr({
            health: 55,
            reward: 50,
            speed: 2.2
        });
    }
});

Crafty.c('Spider', {
    init: function() {
        this.requires('Enemy, spider');
        this.attr({
            health: 40,
            reward: 15,
            speed: 1.7
        });
    }
});

Crafty.c('Orc', {
    init: function() {
        this.requires('Enemy, orc');
        this.attr({
            health: 100,
            reward: 50,
            speed: 0.8,
            livesTaken: 2
        });
    }
});

Crafty.c('GreenDragon', {
    init: function() {
        this.requires('Enemy, green_dragon');
        this.attr({
            health: 150,
            reward: 150,
            speed: 1.5,
            livesTaken: 3,
            noInstantKill: true
        });
    }
});

Crafty.c('SilverDragon', {
    init: function() {
        this.requires('Enemy, silver_dragon');
        this.attr({
            health: 500,
            reward: 500,
            speed: 1.8,
            livesTaken: 5,
            noInstantKill: true
        });
    }
});



// ---------------------
// custom Tween handling
// ---------------------

Crafty.c('Tweening', {
    init: function() {
        this.requires('Keyboard');
        this.attr({
            targets: [],
            stepsPerGrid: 25
        });

        this.bind('EnterFrame', this.tween_handler)
    },

    tween_handler: function() {
        if (Crafty.isPaused()) {
            return;
        }

        for (var i = 0; i < this.targets.length; i++) {
            var current = this.targets[i],
                distanceX = current.speed * Game.map_grid.tile.width / this.stepsPerGrid,
                distanceY = current.speed * Game.map_grid.tile.height / this.stepsPerGrid;
            if (current.actor.x != current.steps[0].x ||
                current.actor.y != current.steps[0].y) {
                var newX = current.actor.x,
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
                current.actor.attr({x: newX, y: newY});
            } else {
                //console.log("Arrived at x=" + current.actor.x + ", y=" + current.actor.y);
                current.steps.shift();
                // TODO emit event that tells the actor in which direction we move next (down, up, right, left)
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

Tweening = Crafty.e('Tweening');