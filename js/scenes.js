// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function() {
    // Draw some text for the player to see in case the file
    //  takes a noticeable amount of time to load
    var loading = Crafty.e('2D, DOM, Text, Delay')
        .text('Loading...')
        .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
        .textFont(Game.loadingFont)
        .textColor(Game.textColor)
        .css(Game.centerCss);

    var x = 3;
    loading.delay(function() {
        if (x >= 22) {
            Crafty('Image Loading').destroy();
            x = 3;
        }
        Crafty.e('2D, DOM, Grid, Image, Loading').image('assets/flower.png').at(x, 10);

        x += 2;
    }, 500, -1);

    // Load all our assets
    Crafty.load(Game.assets, function() {
        // Now that our sprites are ready to draw, start the game
        Game.endless = false;

        var savegame = Crafty.storage('ftd_save1');
        if(savegame){
            // we have a savegame, continue from savegame
            Crafty.scene('LoadSaveGame');
        } else {
            // no savegame, start new game
            Crafty.scene('Difficulty');
        }
    });
});


// Difficulty selection scene
// --------------------------
// User can decide on his difficulty here
Crafty.scene('Difficulty', function() {
    Crafty.background('rgb(169, 153, 145)');
    Crafty.audio.stop();
    Crafty.audio.play('Menu', -1);

    Crafty.e('2D, DOM, Image')
        .image('assets/ftd-logo.jpg')
        .attr({ x: 80, y: Game.height()*1/12 - 24, w: Game.width(), h: 250 });

    Crafty.e('2D, DOM, Text')
        .text('Choose your difficulty:')
        .attr({ x: 0, y: Game.height()*3/6 - 24, w: Game.width(), h: 50 })
        .textFont(Game.difficultyFont)
        .textColor(Game.textColor)
        .css(Game.centerCss);

    Crafty.e('2D, DOM, Text, Mouse')
        .text('Easy')
        .attr({ x: 0, y: Game.height()*4/6 - 24, w: Game.width() / 2, h: 50 })
        .textFont(Game.difficultyFont)
        .textColor('green')
        .css(Game.buttonCss)
        .bind('MouseOver', function() {
            this.textColor(Game.highlightColor);
        })
        .bind('MouseOut', function() {
            this.textColor('green');
        })
        .bind('Click', function() {
            Game.difficulty = "Easy";
            Game.money = 60;
            Game.lifes = 100;
            Game.moneyAfterWave = 20;
            Game.towers = {
                'FlowerTower': 10,
                'SniperTower': 20,
                'SniperTowerUpgrade': 20
            };
            Crafty.scene('InitializeNewGame');
        });

    Crafty.e('2D, DOM, Text, Mouse')
        .text('Normal')
        .attr({ x: Game.width() / 2, y: Game.height()*4/6 - 24, w: Game.width() / 2, h: 50 })
        .textFont(Game.difficultyFont)
        .textColor('yellow')
        .css(Game.buttonCss)
        .bind('MouseOver', function() {
            this.textColor(Game.highlightColor);
        })
        .bind('MouseOut', function() {
            this.textColor('yellow');
        })
        .bind('Click', function() {
            Game.difficulty = "Normal";
            Game.money = 30;
            Game.lifes = 40;
            Game.moneyAfterWave = 10;
            Game.towers = {
                'FlowerTower': 10,
                'SniperTower': 20,
                'SniperTowerUpgrade': 20
            };
            Crafty.scene('InitializeNewGame');
        });

    Crafty.e('2D, DOM, Text, Mouse')
        .text('Hard')
        .attr({ x: 0, y: Game.height()*5/6 - 24, w: Game.width() / 2, h: 50 })
        .textFont(Game.difficultyFont)
        .textColor('red')
        .css(Game.buttonCss)
        .bind('MouseOver', function() {
            this.textColor(Game.highlightColor);
        })
        .bind('MouseOut', function() {
            this.textColor('red');
        })
        .bind('Click', function() {
            Game.difficulty = "Hard";
            Game.money = 25;
            Game.lifes = 15;
            Game.moneyAfterWave = 8;
            Game.towers = {
                'FlowerTower': 12,
                'SniperTower': 20,
                'SniperTowerUpgrade': 25
            };
            Crafty.scene('InitializeNewGame');
        });

    Crafty.e('2D, DOM, Text, Mouse')
        .text('Impossible')
        .attr({ x: Game.width() / 2, y: Game.height()*5/6 - 24, w: Game.width() / 2, h: 50 })
        .textFont(Game.difficultyFont)
        .textColor('black')
        .css(Game.buttonCss)
        .bind('MouseOver', function() {
            this.textColor('#880000');
        })
        .bind('MouseOut', function() {
            this.textColor('black');
        })
        .bind('Click', function() {
            Game.difficulty = "Impossible";
            Game.money = 20;
            Game.lifes = 10;
            Game.moneyAfterWave = 0;
            Game.towers = {
                'FlowerTower': 15,
                'SniperTower': 25,
                'SniperTowerUpgrade': 25
            };
            Crafty.scene('InitializeNewGame');
        });

    Crafty.e('DOMButton')
        .text('Credits')
        .attr({ x: 280, y: Game.height() - 50, w: 200, h: 50 })
        .tooltip('View the credits for this game ^^')
        .bind('Click', function() {
            Crafty.scene('Credits', 'Difficulty');
        });

    Crafty.e('SoundButton')
        .attr({ x: 470, y: Game.height() - 50, w: 200, h: 50 });
});


Crafty.scene('Credits', function(targetScene) {
    // art:
    // @JoeCreates (roguelikebosses)
    // Heather Harvey - cind_rella@hotmail.com (witch, originally named "heroine")
    // ?? (Squid monster)
    // background??

    // programming:
    // Crafty!! craftyjs.com
    // rest by me \o/
    //Crafty.e('Credits');

    Crafty.e('2D, DOM, Text')
        .text('Programming:')
        .textFont(Game.creditsFont)
        .textColor(Game.highlightColor)
        .css(Game.centerCss)
        .attr({ x: 0, y: 30, w: Game.width(), h: 50 });

    Crafty.e('2D, DOM, Text')
        .text('Game-Framework is Crafty (<a target="_blank" href="http://craftyjs.com">http://craftyjs.com</a>)<br>' +
                'Programming is done by me (<a target="_blank" href="http://www.github.com/olilo/flower-tower-defense/">' +
                'http://www.github.com/olilo/flower-tower-defense/</a>)')
        .textFont(Game.creditsTextFont)
        .textColor(Game.textColor)
        .css(Game.centerCss)
        .attr({ x: 0, y: 70, w: Game.width(), h: 100 });

    Crafty.e('2D, DOM, Text')
        .text('Graphics:')
        .textFont(Game.creditsFont)
        .textColor(Game.highlightColor)
        .css(Game.centerCss)
        .attr({ x: 0, y: 140, w: Game.width(), h: 50 });

    Crafty.e('2D, DOM, Text')
        .text('roguelikebosses (orc, dragons, spider) by @JoeCreates<br>' +
                'Witch graphic by Heather Harvey - cind_rella@hotmail.com<br>' +
                'Generally: art from <a href="http://opengameart.org">http://opengameart.org</a><br>' +
                'Knight and flowers by me ^^ (license-free)')
        .textFont(Game.creditsTextFont)
        .textColor(Game.textColor)
        .css(Game.centerCss)
        .attr({ x: 0, y: 180, w: Game.width(), h: 120 });

    Crafty.e('2D, DOM, Text')
        .text('Music:')
        .textFont(Game.creditsFont)
        .textColor(Game.highlightColor)
        .css(Game.centerCss)
        .attr({ x: 0, y: 300, w: Game.width(), h: 50 });

    Crafty.e('2D, DOM, Text')
        .text('Title-Song and Won-Song generated by Music Maker Jam<br>' +
                'Game-Music composed and played by me (license-free)')
        .textFont(Game.creditsTextFont)
        .textColor(Game.textColor)
        .css(Game.centerCss)
        .attr({ x: 0, y: 340, w: Game.width(), h: 100 });

    if (targetScene.text) {
        Crafty.e('DOMButton')
            .text(targetScene.text)
            .attr({x: 280, y: Game.height() - 50, w: 200, h: 50})
            .tooltip('Continue to next screen')
            .bind('Click', function () {
                Crafty.scene(targetScene.scene);
            });
    } else {
        Crafty.e('DOMButton')
            .text('Back')
            .attr({x: 280, y: Game.height() - 50, w: 200, h: 50})
            .tooltip('Go back to where you came from')
            .bind('Click', function () {
                Crafty.scene(targetScene);
            });
    }

    Crafty.e('SoundButton')
        .attr({ x: 470, y: Game.height() - 50, w: 200, h: 50 });
});


// Load variables from savegame
// ----------------------------
Crafty.scene('LoadSaveGame', function() {
    Crafty.background('rgb(169, 153, 145)');
    Crafty.audio.stop();
    Crafty.audio.play('Menu', -1);

    Crafty.e('2D, DOM, Image')
        .image('assets/ftd-logo.jpg')
        .attr({ x: 80, y: Game.height()*1/12 - 24, w: Game.width(), h: 250 });

    Crafty.e('DOMButton')
        .text('Load Saved game')
        .attr({ x: 0, y: Game.height()*7/12 - 24, w: Game.width(), h: 50 })
        .tooltip('Continue the game you played last time with difficulty ' +  Crafty.storage('ftd_save1').difficulty)
        .bind('Click', function() {
            var savegame = Crafty.storage('ftd_save1');

            Game.difficulty = savegame.difficulty;
            Game.money = savegame.money;
            Game.lifes = savegame.lifes;
            Game.moneyAfterWave = savegame.moneyAfterWave;
            Game.towers = savegame.towers;

            Game.endless = savegame.currentWave >= Game.waves.length;
            Game.enemyCount = savegame.enemyCount;
            Game.currentWave = savegame.currentWave;
            Game.selectedTower = savegame.selectedTower;
            Game.sniperTowerInitial = savegame.sniperTowerInitial;
            Game.towerCost = 0;
            Game.towerLevel = 0;
            Game.towerMap = savegame.towerMap;
            Game.path = new Path(Game.map_grid);
            Game.path.copy(savegame.path);

            Crafty.scene('Game');
        });

    Crafty.e('DOMButton')
        .text('Start new game')
        .attr({ x: 0, y: Game.height()*9/12 - 24, w: Game.width(), h: 50 })
        .tooltip('Starts a new game. You can select the difficulty on the next screen.')
        .bind('Click', function() {
            Crafty.scene('Difficulty');
        });

    Crafty.e('DOMButton')
        .text('Credits')
        .attr({ x: 280, y: Game.height() - 50, w: 200, h: 50 })
        .tooltip('View the credits for this game ^^')
        .bind('Click', function() {
            Crafty.scene('Credits', 'LoadSaveGame');
        });

    Crafty.e('SoundButton')
        .attr({ x: 470, y: Game.height() - 50, w: 200, h: 50 });
});

// Initialize variables for new game
// ---------------------------------
Crafty.scene('InitializeNewGame', function() {
    // show loading if initialization takes up some time ...
    Crafty.e('2D, DOM, Text')
        .text('Loading...')
        .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
        .textFont(Game.loadingFont)
        .textColor(Game.textColor)
        .css(Game.centerCss);

    Game.endless = false;
    Game.enemyCount = 0;
    Game.currentWave = 0;
    Game.selectedTower = 'SniperTower';
    Game.sniperTowerInitial = Game.towers['SniperTower'];
    Game.towerCost = 0;
    Game.towerLevel = 0;
    Game.towerMap = new Array(Game.map_grid.width);
    for (var x = 0; x < Game.map_grid.width; x++) {
        Game.towerMap[x] = new Array(Game.map_grid.height);
        for (var y = 0; y < Game.map_grid.height; y++) {
            Game.towerMap[x][y] = {
                name: '',
                level: 0
            };
        }
    }

    // generate path
    Game.path = new Path(Game.map_grid);
    Game.path.generatePath();

    Crafty.scene('Game');
});


// Main game scene
// ---------------
Crafty.scene('Game', function() {
    // background
    Crafty.e('2D, Canvas, Image').image('assets/background.jpg');
    Crafty.audio.stop();
    Crafty.audio.play('Background', -1);

    // HUD
    Crafty.e('HudElement').observe('Money', 'money').at(1);
    Crafty.e('HudElement').observe('Lifes', 'lifes').at(6).alertIfBelow(3);
    Crafty.e('HudElement').observe('Enemies', 'enemyCount').at(10);
    Crafty.e('HudElement').observe('Wave', 'currentWave').at(14);
    Crafty.e('HudElement').observe('Cost', 'towerCost').at(17).highlight();
    Crafty.e('HudElement').observe('Level', 'towerLevel').at(21).highlight();

    // tower selectors
    Crafty.e('TowerSelector').forTower('FlowerTower')
        .attr({tooltipWidth: 500, tooltipHeight: 130})
        .tooltip('Click here to select the Flower Tower.<br> If you click anywhere on the map you build this tower.<br>' +
                 'It shoots in all 4 directions with limited range.<br> Gains higher range on upgrade.<br> Hotkey: C')
        .withImage("assets/flower.png").withHotkey('C').at(1, Game.map_grid.height - 1);
    Crafty.e('TowerSelector').forTower('SniperTower')
        .attr({tooltipWidth: 500, tooltipHeight: 130})
        .tooltip('Click here to select the Sniper Tower.<br> If you click anywhere on the map you build this tower.<br> ' +
                 'It shoots anywhere on the map, but cost increases.<br> Gains instant kill on highest level.<br> Hotkey: V')
        .withImage("assets/leafs.png").withHotkey('V').at(3, Game.map_grid.height - 1);

    // win/lose conditions
    Crafty.bind('EnterFrame', function() {
        if (Game.lifes <= 0) {
            Crafty.unbind('EnterFrame');
            Crafty.scene('GameOver');
        }
    });
    Crafty.bind('WaveFinished', function(waveNumber) {
        Crafty.storage('ftd_save1', Game);

        if (Game.lifes > 0 && waveNumber == Game.waves.length) {
            Crafty.unbind('EnterFrame');
            Crafty.scene('Won');
        }
    });

    // necessary event handling
    Crafty.bind('TowerCreated', function(tower) {
        // insert in tower map
        var towerNames = ['FlowerTower', 'SniperTower'];
        for (var i = 0; i < towerNames.length; i++) {
            if (tower.has(towerNames[i])) {
                Game.towerMap[tower.at().x][tower.at().y].name = towerNames[i];
                Game.towerMap[tower.at().x][tower.at().y].level = 1;
                return;
            }
        }
    });
    Crafty.bind('TowerUpgraded', function(tower) {
        // update tower map
        Game.towerMap[tower.at().x][tower.at().y].level = tower.level;
    });

    // Populate our playing field with trees, path tiles, towers and tower places
    // we need to reset sniper tower cost, because when placing them in the loop the cost goes up again
    Game.towers['SniperTower'] = Game.sniperTowerInitial;
    //console.log(Game.towerMap);
    for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y < Game.map_grid.height; y++) {
            if (Game.path.isOnEdge(x, y)) {
                Crafty.e('Tree').at(x, y);
            } else if (Game.path.isOnPath(x, y)) {
                Crafty.e('Path').at(x, y);
            } else if (Game.towerMap[x][y].level > 0) {
                Crafty.e(Game.towerMap[x][y].name).at(x, y)
                    .attr({'level': Game.towerMap[x][y].level});
            } else {
                Crafty.e('TowerPlace').at(x, y);
            }
        }
    }

    // initialize wave
    Crafty.e('Wave').at(Game.map_grid.width - 5, Game.map_grid.height - 1);

    Crafty.e('DOMButton, Grid')
        .text('Help')
        .textFont(Game.waveFont)
        .at(8, Game.map_grid.height - 1)
        .attr({ w: 100 })
        .tooltip('If you are lost, look here')
        .bind('Click', function() {
            // TODO create an overlay that explains the general concept
        });

    Crafty.e('DOMButton, Grid, Keyboard')
        .text('Pause')
        .textFont(Game.waveFont)
        .at(11, Game.map_grid.height - 1)
        .attr({ w: 100, h: 50})
        .tooltip('Pause or unpause the game (Hotkey: P)')
        .bind('Click', function() {
            Crafty.pause();
        }).bind('KeyDown', function() {
            if (this.isDown('P')) {
                Crafty.pause();
            }
        });

    Crafty.e('SoundButton, Grid')
        .textFont(Game.waveFont)
        .attr({ w: 150, h: 50 })
        .at(15, Game.map_grid.height - 1);
});


// Finish scenes: GameOver and Won
// -------------------------------
Crafty.scene('GameOver', function() {
    // show GameOver screen, with "start again" button
    Crafty.background('rgb(169, 153, 145)');
    Crafty.audio.stop();
    Crafty.audio.play('Menu', -1);

    Crafty.e('2D, DOM, Image')
        .image('assets/ftd-logo.jpg')
        .attr({ x: 80, y: Game.height()*1/12 - 24, w: Game.width(), h: 250 });

    Crafty.e('2D, DOM, Text')
        .text('Game over')
        .attr({ x: 0, y: Game.height()*3/5 - 24, w: Game.width() })
        .textFont(Game.gameOverFont)
        .textColor(Game.gameOverColor)
        .css(Game.centerCss);

    Crafty.e('RestartButton');
});

Crafty.scene('Won', function() {
    // show Won screen, with "start again" button
    Crafty.background(Game.wonColor);
    Crafty.audio.stop();
    Crafty.audio.play('Won', -1);

    Crafty.e('2D, DOM, Image')
        .image('assets/ftd-logo.jpg')
        .attr({ x: 80, y: Game.height()*1/12 - 24, w: Game.width(), h: 250 });

    Crafty.e('2D, DOM, Text')
        .text('You Won :)')
        .attr({ x: 0, y: Game.height()*7/12 - 24, w: Game.width(), h: 50 })
        .textFont(Game.wonFont)
        .textColor(Game.textColor)
        .css(Game.centerCss);

    Crafty.e('DOMButton')
        .text('Continue in endless mode?')
        .attr({x: 0, y: Game.height()*9/12 - 24, w: Game.width(), h: 50 })
        .textFont(Game.continueFont)
        .textColor(Game.continueColor)
        .bind('Click', function() {
            Game.endless = true;
            Crafty.scene('Game');
        });

    Crafty.e('RestartButton')
        .attr({x: 0, y: Game.height()*11/12 - 24, w: Game.width(), h: 50 });
});