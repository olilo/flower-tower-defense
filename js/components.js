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
        this.image("assets/sprite.png").tint("#969696", 0.15);
    }
});

tween_targets = [];
function tween_handler() {
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
