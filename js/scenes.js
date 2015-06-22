// Difficulty selection scene
// --------------------------
// User can decide on his difficulty here
Crafty.scene('Difficulty', function() {
    Crafty.e('2D, DOM, Text, Mouse')
        .text('Easy')
        .attr({ x: 0, y: Game.height()/4 - 24, w: Game.width(), h: 50 })
        .textFont(Game.difficultyFont)
        .textColor('green')
        .css(Game.difficultyCss)
        .bind('MouseOver', function() {
            this.textColor('black');
        })
        .bind('MouseOut', function() {
            this.textColor('green');
        })
        .bind('Click', function() {
            Game.money = 25;
            Game.lifes = 15;
            Game.moneyAfterWave = 7;
            Game.towers = {
                'FlowerTower': 10
            };
            Crafty.scene('Loading');
        });

    Crafty.e('2D, DOM, Text, Mouse')
        .text('Normal')
        .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width(), h: 50 })
        .textFont(Game.difficultyFont)
        .textColor('yellow')
        .css(Game.difficultyCss)
        .bind('MouseOver', function() {
            this.textColor('black');
        })
        .bind('MouseOut', function() {
            this.textColor('yellow');
        })
        .bind('Click', function() {
            Game.money = 20;
            Game.lifes = 10;
            Game.moneyAfterWave = 4;
            Game.towers = {
                'FlowerTower': 11
            };
            Crafty.scene('Loading');
        });

    Crafty.e('2D, DOM, Text, Mouse')
        .text('Hard')
        .attr({ x: 0, y: Game.height()*3/4 - 24, w: Game.width(), h: 50 })
        .textFont(Game.difficultyFont)
        .textColor('red')
        .css(Game.difficultyCss)
        .bind('MouseOver', function() {
            this.textColor('black');
        })
        .bind('MouseOut', function() {
            this.textColor('red');
        })
        .bind('Click', function() {
            Game.money = 15;
            Game.lifes = 10;
            Game.moneyAfterWave = 2;
            Game.towers = {
                'FlowerTower': 12
            };
            Crafty.scene('Loading');
        });
});


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

    Game.enemyCount = 0;
    Game.currentWave = 1;
    Game.selectedTower = 'FlowerTower';
    Game.towerCost = 0;

    // HUD
    Crafty.e('HudElement').observe('Money', 'money').at(0);
    Crafty.e('HudElement').observe('Lifes', 'lifes').at(1);
    Crafty.e('HudElement').observe('Enemies', 'enemyCount').at(2);
    Crafty.e('HudElement').observe('Wave', 'currentWave').at(3);
    Crafty.e('HudElement').observe('Cost', 'towerCost').at(4);

    // win/lose conditions
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

    // generate path
    Game.path = new Path(Game.map_grid);
    Game.path.generatePath();

    // Place a tree at every edge square on our grid
    for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y < Game.map_grid.height; y++) {
            if (Game.path.isOnEdge(x, y)) {
                // Place a tree entity at the current tile
                Crafty.e('Tree').at(x, y);
            } else if (Game.path.isOnPath(x, y)) {
                Crafty.e('Path').at(x, y);
            } else {
                Crafty.e('TowerPlace').at(x, y);
            }
        }
    }

    Crafty.e('Wave');
});


// Finish scenes: GameOver and Won

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