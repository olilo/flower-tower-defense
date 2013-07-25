Crafty.scene('Game', function() {
    var map = new Map();
    map.generatePath();

    // Place a tree at every edge square on our grid of 16x16 tiles
    for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y < Game.map_grid.height; y++) {
            var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1,
                on_path = map.isOnPath(x, y),
                near_path = map.isOnPath(x, y + 1) || map.isOnPath(x, y - 1) ||
                    map.isOnPath(x - 1, y) || map.isOnPath(x + 1, y);

            if (at_edge && (x != map.start.x || y != map.start.y) && (x != map.finish.x || y != map.finish.y)) {
                // Place a tree entity at the current tile
                Crafty.e('Tree').at(x, y);
                map.addObject({x: x, y: y})
            } else if (near_path && !on_path) {
                // Place a bush near the path
                Crafty.e('Bush').at(x, y);
                map.addObject({x: x, y: y});
            }
        }
    }
});