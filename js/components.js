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

    // animate this Enemy along the given path
    animate_along: function(path) {
        var animation = {
            actor: this,
            steps: []
        };
        for (var i = 0; i < path.length; i++) {
            animation.steps.push({
                x: path[i].x * Game.map_grid.tile.width,
                y: path[i].y * Game.map_grid.tile.height
            });
            console.log("Tweening to x=" + path[i].x + ", y=" + path[i].y);
        }
        tween_targets.push(animation);
    }
});

Crafty.c('Actor', {
    init: function() {
        this.requires('2D, Canvas, Grid');
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
        this.requires('Actor, Image, Tint');
        this.image("assets/transparent.png").tint("#969696", 0.15);
    }
});

Crafty.c('TowerPlace', {
    init: function() {
        this.requires('Actor, Mouse, Image, Tint');
        this.image("assets/transparent.png").tint("#ffffff", 0.0);
        this.bind('MouseOver', function() {
            this.tint("#b66666", 0.15);
        });
        this.bind('MouseOut', function() {
            this.tint("#ffffff", 0.0);
        });
        this.bind('Click', function() {
            Crafty.e('FlowerTower').at(this.at().x, this.at().y).shoot();
        });
    }
});

Crafty.c('FlowerTower', {
    init: function() {
        this.requires('Actor, Image');
        this.image("assets/flower.png");
        // TODO AI that only shoots when an enemy is near
    },

    shoot: function() {
        this.timeout(function() {
            Crafty.e('LeafUp').at(this.at().x, this.at().y).animate_along([{x: this.x, y: this.y - 100}]);
            Crafty.e('LeafRight').at(this.at().x, this.at().y).animate_along([{x: this.x + 100, y: this.y}]);
            Crafty.e('LeafDown').at(this.at().x, this.at().y).animate_along([{x: this.x, y: this.y + 100}]);
            Crafty.e('LeafLeft').at(this.at().x, this.at().y).animate_along([{x: this.x - 100, y: this.y}]);
        }, 1000, -1);
    }
});

Crafty.c('LeafUp', {
    init: function() {
        this.requires('Actor, Collision, PathWalker, spr_leaf_up');
    }
});

Crafty.c('LeafRight', {
    init: function() {
        this.requires('Actor, Collision, PathWalker, spr_leaf_right');
    }
});

Crafty.c('LeafDown', {
    init: function() {
        this.requires('Actor, Collision, PathWalker, spr_leaf_down');
    }
});

Crafty.c('LeafLeft', {
    init: function() {
        this.requires('Actor, Collision, PathWalker, spr_leaf_left');
    }
});

Crafty.c('Enemy', {
    init: function() {
        this.requires('Actor, Collision, PathWalker');
    }
});

Crafty.c('Witch', {
    init: function() {
        this.requires('Enemy, spr_witch');
        this.attr({
            health: 100
        });
    }
});


// --------------
// custom Tween handling
// --------------

tween_targets = [];
function tween_handler() {
    if (Crafty.isPaused()) {
        return;
    }

    for (var i = 0; i < tween_targets.length; i++) {
        var current = tween_targets[i];
        if (current.actor.x != current.steps[0].x ||
                current.actor.y != current.steps[0].y) {
            var newX = current.actor.x,
                newY = current.actor.y;
            if (current.actor.x < current.steps[0].x) {
                newX++;
            } else if (current.actor.x > current.steps[0].x) {
                newX--;
            }
            if (current.actor.y < current.steps[0].y) {
                newY++;
            } else if (current.actor.y > current.steps[0].y) {
                newY--;
            }
            current.actor.attr({x: newX, y: newY});
        } else {
            console.log("Arrived at x=" + current.actor.x + ", y=" + current.actor.y);
            current.steps.shift();
        }
        if (current.steps.length == 0) {
            tween_targets.splice(i, 1);
            i--;
        }
    }
}
setInterval(tween_handler, 15);
