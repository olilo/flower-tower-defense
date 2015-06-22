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
            this.attr({health: this.health - hitData[0].obj.damage});
            if (this.health <= 0) {
                Game.money += this.reward;
                Game.enemyCount--;
                this.destroy();
            }
            console.log("Health: " + this.health);
        });

        var that = this;
        this.delay(function() {
            that.animate_along(Game.path.getPath(), that.speed);
        }, 500, 0);
        this.bind('TweenEnded', function(actor) {
            if (that == actor) {
                Game.lifes--;
                Game.enemyCount--;
                this.destroy();
            }
        })
    }
});

Crafty.c('Wave', {
    init: function() {
        this.requires('Delay');

        var enemies = Game.waves[Game.currentWave - 1];
        var i = 0;
        this.delay(function() {
            Crafty.e(enemies[i]).at(Game.path.start.x, Game.path.start.y);
            //console.log("Added new " + enemies[i] + " at " + Game.path.start.x + "/" + Game.path.start.y);
            i++;
        }, 3000, enemies.length - 1);

        this.delay(function() {
            this.bind('EnterFrame', function() {
                if (Game.enemyCount == 0) {
                    Game.currentWave++;
                    Game.money += Game.moneyAfterWave;
                    if (Game.currentWave <= Game.waves.length && Game.lifes > 0) {
                        console.log("Started wave " + Game.currentWave);
                        Crafty.e('Wave');
                    } else {
                        console.log("Last wave or lifes reached 0");
                    }
                    this.destroy();
                }
            })
        }, 15000);
    }
});


// ------------------
// UI Elements
// ------------------

Crafty.c('HudElement', {
    init: function() {
        this.requires('2D, DOM, Text');
        this.attr({ x: 0, y: 0, w: 150 });
        this.textFont(Game.hudFont);
        this.textColor(Game.textColor);
    },

    observe: function(prefix, observable) {
        this.bind('EnterFrame', function() {
            this.text(prefix + ": " + Game[observable])
        });
        return this;
    },

    at: function(x) {
        this.attr({ x: x * 150});
        return this;
    }
});

Crafty.c('TowerSelector', {
    init: function() {
        this.requires('2D, DOM, Text, Image, Mouse, Keyboard');
        this.x = 0;
        this.y = Game.height() - Game.map_grid.tile.height;
        this.w = 100;
        this.h = Game.map_grid.tile.height;
        this.textFont(Game.towerSelectorFont);
        this.textColor(Game.textColor);
        this.css(Game.towerSelectorCss);
    },

    forTower: function(towerName) {
        this.targetTower = towerName;
        this.text(Game.towers[towerName]);
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
    },

    at: function(x) {
        this.x = x * 100;
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
        this.css(Game.restartCss);
        this.bind('MouseOver', function() {
            this.textColor('white');
        });
        this.bind('MouseOut', function() {
            this.textColor(Game.restartColor);
        });
        this.bind('Click', function() {
            console.log('Restaaaaaart');
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
        this.image("assets/transparent.png").color("#969696", 0.15);
    }
});

Crafty.c('TowerPlace', {
    init: function() {
        this.requires('Actor, Mouse, Image, Color');
        this.image("assets/transparent.png").color("#ffffff", 0.0);
        this.bind('MouseOver', function() {
            this.color("#b66666", 0.2);
            Game.towerCost = Game.towers[Game.selectedTower];
        });
        this.bind('MouseOut', function() {
            this.color("#ffffff", 0.0);
            Game.towerCost = 0;
        });
        this.bind('Click', function() {
            if (Game.money >= Game.towers[Game.selectedTower]) {
                Crafty.e(Game.selectedTower).at(this.at().x, this.at().y);
                Game.money -= Game.towers[Game.selectedTower];
                this.destroy();
            }
        });
    }
});


// ------
// Towers
// ------

Crafty.c('Upgradable', {
    init: function() {
        this.requires('Mouse, Color');
        this.attr({
            level: 1
        });

        this.bind('MouseOver', function () {
            this.color("#6666b6", 0.2);
            Game.towerCost = this.getUpgradeCost();
        });
        this.bind('MouseOut', function () {
            this.color("#ffffff", 0.0);
            Game.towerCost = 0;
        });
        this.bind('Click', function () {
            var upgradeCost = this.getUpgradeCost();
            if (Game.money >= upgradeCost) {
                this.level++;
                Game.money -= upgradeCost;
                Game.towerCost = this.getUpgradeCost();
            }
        });
    }
});

Crafty.c('FlowerTower', {
    init: function() {
        this.requires('Actor, Image, Delay, Upgradable');
        this.image("assets/flower.png");

        this.delay(function() {
            // TODO AI that only shoots when an enemy is near
            // TODO consider playing field bounds for animation
            var x = this.at().x, y = this.at().y;

            Crafty.e('Bullet, leaf_up').attr({damage: this.level}).at(x, y).animate_to(x, y - 4, 4).destroy_after_animation();
            Crafty.e('Bullet, leaf_right').attr({damage: this.level}).at(x, y).animate_to(x + 4, y, 4).destroy_after_animation();
            Crafty.e('Bullet, leaf_down').attr({damage: this.level}).at(x, y).animate_to(x, y + 4, 4).destroy_after_animation();
            Crafty.e('Bullet, leaf_left').attr({damage: this.level}).at(x, y).animate_to(x - 4, y, 4).destroy_after_animation();
        }, 1000, -1);
    },

    getUpgradeCost: function() {
        return Math.floor(Game.towers['FlowerTower'] * 1.5 * Math.sqrt(this.level));
    }

});

Crafty.c('SniperTower', {
    init: function() {
        this.requires('Actor, leaf_right, SpriteAnimation, Delay, Upgradable');
        // This is the same animation definition, but using the alternative method
        this.attr({w: 32, h: 32});
        this.reel('LeafSpinning', 2000, [[0, 0], [0, 1], [1, 1], [1, 0]]);
        this.animate('LeafSpinning', -1);

        this.delay(function() {
            if (Game.enemyCount == 0) {
                return;
            }

            var firstEnemy = Crafty('Enemy').get(0), damage = this.level * 5;
            var x = this.at().x, y = this.at().y, x2 = Math.floor(firstEnemy.at().x), y2 = Math.floor(firstEnemy.at().y);
            Crafty.e('Bullet, leaf_right').attr({damage: damage}).at(x, y).animate_to(x2, y2, 35).destroy_after_animation();
        }, 5000, -1);
    },

    getUpgradeCost: function() {
        return Math.floor(Game.towers['SniperTower'] * 1.5 * Math.sqrt(this.level));
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
            reward: 7,
            speed: 2.5
        });
    }
});

Crafty.c('Knight', {
    init: function() {
        this.requires('Enemy, knight_right');
        this.attr({
            health: 50,
            reward: 20,
            speed: 1.3
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
            lastExecuted: new Date().getTime(),
            fps: 25,
            speedup: 1
        });

        // bind speedup key 's'
        this.bind('KeyDown', function() {
            if (this.isDown('S')) {
                if (this.speedup == 1) {
                    this.speedup = 4;
                } else {
                    this.speedup = 1;
                }
            }
        });

        this.bind('EnterFrame', this.tween_handler)
    },

    tween_handler: function() {
        var newLastExecuted = new Date().getTime();
        var delay = this.fps * this.speedup * (newLastExecuted - this.lastExecuted) / 1000.0;
        Tweening.lastExecuted = newLastExecuted;

        if (Crafty.isPaused()) {
            return;
        }

        for (var i = 0; i < this.targets.length; i++) {
            var current = this.targets[i],
                distanceX = current.speed * delay * Game.map_grid.tile.width / this.fps,
                distanceY = current.speed * delay * Game.map_grid.tile.height / this.fps;
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