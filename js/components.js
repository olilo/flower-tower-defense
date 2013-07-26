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

Crafty.c('Bush', {
    init: function() {
        this.requires('Actor, Color');
        this.color('rgb(20, 185, 40)');
    }
});

Crafty.c('Path', {
    init: function() {
        this.requires('Actor, Color');
        this.color('rgb(240, 160, 125)');
    }
});

Crafty.c('Enemy', {
    init: function() {
        this.requires('Actor, Collision, Tween');
    },

    // animate this Enemy along the given path
    animate_along: function(path, i) {
        if (!i) {
            // skip first entry
            i = 1;
        }
        if (i == path.length) {
            return;
        }
        // TODO this does not work that well ... implement tweening with own function that handles all movement
        this.tween({x: path[i].x * Game.map_grid.tile.width, y: path[i].y * Game.map_grid.tile.height}, 20).
            bind('TweenEnd', function() {this.animate_along(path, i + 1)});
        console.log("Tweening to x=" + path[i].x + ", y=" + path[i].y);
    }
});

Crafty.c('Boss', {
    init: function() {
        this.requires('Enemy, Text');
        this.text("@").textFont({size: '14px', weight: 'bold'});
    }
})
