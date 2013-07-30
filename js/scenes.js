// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
    // Draw some text for the player to see in case the file
    //  takes a noticeable amount of time to load
    Crafty.e('2D, DOM, Text')
        .text('Loading...')
        .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
        .css($text_css);

    // Load our sprite map image
    Crafty.load(['assets/heroine01.png', 'assets/background.jpg'], function(){
        // Once the image is loaded...

        // Define the individual sprites in the image
        // Each one (spr_tree, etc.) becomes a component
        // These components' names are prefixed with "spr_"
        //  to remind us that they simply cause the entity
        //  to be drawn with a certain sprite
        Crafty.sprite(32, 'assets/heroine01.png', {
            spr_witch:  [2, 2]
        });

        // Now that our sprites are ready to draw, start the game
        Crafty.scene('Game');
    })
});

// Main game scene
// ---------------
Crafty.scene('Game', function() {
    // background
    Crafty.e('2D, Canvas, Image').image('assets/background.jpg');

    // generate map
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
                map.addObject('Tree', x, y);
            }
        }
    }

    // ?? wave: place the boss at the start of the path
    var boss = map.addObject('Witch', map.start.x, map.start.y);
    boss.animate_along(map.getPath());
});