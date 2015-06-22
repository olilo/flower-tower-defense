// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
    // Draw some text for the player to see in case the file
    //  takes a noticeable amount of time to load
    Crafty.e('2D, DOM, Text')
        .text('Loading...')
        .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
        .textFont(Game.loadingFont)
        .textColor(Game.textColor)
        .css(Game.loadingCss);

    // Load all our assets
    Crafty.load(Game.assets, function() {
        // Now that our sprites are ready to draw, start the game
        Crafty.scene('Game');
    });
});

// Main game scene
// ---------------
Crafty.scene('Game', function() {
    // background
    Crafty.e('2D, Canvas, Image').image('assets/background.jpg');

    Game.money = 20;
    Game.lifes = 10;
    Game.enemyCount = 0;
    Game.currentWave = 1;
    Game.moneyAfterWave = 5;
    Game.towers = {
        'FlowerTower': 11
    };
    Game.selectedTower = 'FlowerTower';

    // HUD
    Crafty.e('HudElement').observe('Money', 'money').at(0);
    Crafty.e('HudElement').observe('Lifes', 'lifes').at(1);
    Crafty.e('HudElement').observe('Enemies', 'enemyCount').at(2);
    Crafty.e('HudElement').observe('Wave', 'currentWave').at(3);

    Crafty.bind('EnterFrame', function() {
        if (Game.lifes <= 0) {
            Crafty.unbind('EnterFrame');
            Crafty.scene('GameOver');
        }
        if (Game.currentWave > Game.waves.length) {
            Crafty.unbind('EnterFrame');
            Crafty.scene('Won');
        }
    });

    // bind pause/unpause key 'p'
    Crafty.e('Keyboard').bind('KeyDown', function() {
        if (this.isDown('P')) {
            Crafty.pause();
        }
    });

    // generate map
    Game.path = new Path(Game.map_grid);
    Game.path.generatePath();

    // Place a tree at every edge square on our grid of 16x16 tiles
    for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y < Game.map_grid.height; y++) {
            if (Game.path.isOnEdge(x, y)) {
                // Place a tree entity at the current tile
                Crafty.e('Tree').at(x, y);
            } else if (!Game.path.isOnPath(x, y)) {
                Crafty.e('TowerPlace').at(x, y);
            }
        }
    }

    // start wave 1 (everything else is handled by Wave1)
    Crafty.e('Wave');
});

Crafty.scene('GameOver', function() {
    // show GameOver screen, with "start again" button
    Crafty.e('2D, DOM, Text')
        .text('Game over')
        .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
        .textFont(Game.gameOverFont)
        .textColor(Game.gameOverColor)
        .css(Game.gameOverCss);

    Crafty.e('RestartButton');
});

Crafty.scene('Won', function() {
    // show GameOver screen, with "start again" button
    Crafty.e('2D, DOM, Text')
        .text('You Won :)')
        .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
        .textFont(Game.wonFont)
        .textColor(Game.wonColor)
        .css(Game.wonCss);

    Crafty.e('RestartButton');
});