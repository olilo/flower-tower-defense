// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function() {
    // Draw some text for the player to see in case the file
    //  takes a noticeable amount of time to load
    var loading = Crafty.e('2D, Grid, DOM, Text, Delay')
        .text('Loading...')
        .attr({w: Game.width()})
        .at(0, 5)
        .textFont(Game.loadingFont)
        .textColor(Game.textColor)
        .css(Game.centerCss);

    Crafty.e('Actor, Progress, Text')
        .at(Game.map_grid.width / 2 - 2, 8)
        .textFont(Game.loadingFont)
        .textColor(Game.textColor)
        .text('0%');

    var x = 3;
    loading.delay(function () {
        if (x >= 22) {
            Crafty('flower Loading').destroy();
            x = 3;
        }
        Crafty.e('2D, DOM, Grid, flower, Loading').at(x, 10);

        x += 2;
    }, 500, -1);

    // Load all our assets
    Crafty.load(Game.assets, function () {
        // Now that our sprites are ready to draw, start the game
        Game.endless = false;

        Crafty.scene('MainMenu');
    }, function (progress) {
        Crafty('Progress').text(Math.floor(progress.percent) + "%");
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
        .attr({ x: 80, y: Game.height()*1/12 - 24, w: Game.width(), h: 200 });

    Crafty.e('2D, DOM, Text')
        .text('Choose your difficulty:')
        .attr({ x: 0, y: Game.height()*3/6 - 24, w: Game.width(), h: 50 })
        .textFont(Game.difficultyFont)
        .textColor(Game.textColor)
        .css(Game.centerCss);

    for (var e in Game.difficulties) {
        if (!Game.difficulties.hasOwnProperty(e)) continue; //skip

        Crafty.e('DOMButton')
            .text(e)
            .tooltip(Game.difficulties[e].tooltip)
            .attr({
                x: Game.difficulties[e].x * Game.width() / 2,
                y: ((Game.difficulties[e].y * 2 + 7) / 12) * Game.height(),
                w: Game.width() / 2,
                h: 50
            })
            .textFont(Game.difficultyFont)
            .textColor(Game.difficulties[e].textColor)
            .bind('Click', function() {
                console.log("Chosen difficulty: " + this.text());
                Game.setDifficultyProperties(this.text());
                Crafty.scene('MapSelection');
            });
    }


    Crafty.e('DOMButton')
        .text('Instructions')
        .attr({ x: 70, y: Game.height() - 50, w: 200, h: 50 })
        .tooltip('Click here for some instructions')
        .bind('Click', function() {
            Crafty.scene('Help', 'Difficulty');
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


Crafty.scene('MapSelection', function() {
    Crafty.background('rgb(119, 123, 125)');
    Crafty.audio.stop();
    Crafty.audio.play('Menu', -1);

    var currentPage = 1;

    Crafty.e('2D, DOM, Image')
        .image('assets/ftd-logo.jpg')
        .attr({ x: 80, y: Game.height()*1/12 - 24, w: Game.width(), h: 200 });

    Crafty.e('2D, DOM, Text')
        .text('Choose a map:')
        .attr({ x: 0, y: Game.height()*3/6 - 24, w: Game.width(), h: 50 })
        .textFont(Game.mapSelectionFont)
        .textColor(Game.textColor)
        .css(Game.centerCss);


    // FIXME put prev and next buttons into components
    Crafty.e('DOMButton, Delay, Previous')
        .text('Prev')
        .attr({ x: Game.width() * 1 / 24, y: Game.height() * 8/12 - 24, w: Game.width() * 2 / 24, h: 32})
        .tooltip('Show previous page of levels')
        .disable()
        .bind('Click', function() {
            if (this.buttonEnabled) {
                currentPage--;
                this.disable();
                this.delay(function() {
                    if (currentPage > 1) {
                        this.enable();
                    }
                    Crafty('DOMButton Next').enable();
                }, 1000);
                Crafty('LevelSelector').each(function() {
                    this.moveTo(this.x + Game.width(), this.y, 800);
                });
            }
        });

    Crafty.e('DOMButton, Delay, Next')
        .text('Next')
        .attr({ x: Game.width() * 21 / 24, y: Game.height() * 8/12 - 24, w: Game.width() * 2 / 24, h: 32})
        .tooltip('Show next page of levels')
        .bind('Click', function() {
            if (this.buttonEnabled) {
                currentPage++;
                this.disable();
                this.delay(function() {
                    if (currentPage < Crafty('Level').length / 3.0) {
                        this.enable();
                    }
                    Crafty('DOMButton Previous').enable();
                }, 1000);

                Crafty('LevelSelector').each(function() {
                    this.moveTo(this.x - Game.width(), this.y, 800);
                });
            }
        });

    Crafty.e('LevelSelector')
        .level('1')
        .tooltip('10 Waves of enemies who travel through a large spiral.')
        .attr({ x: Game.width() * 4 / 24, y: Game.height() * 8/12 - 24, w: Game.width() / 6, h: 100 });

    Crafty.e('LevelSelector')
        .level('2')
        .tooltip('15 Waves of enemies who travel from left to right.')
        .attr({ x: Game.width() * 10 / 24, y: Game.height() * 8/12 - 24, w: Game.width() / 6, h: 100 });

    Crafty.e('LevelSelector')
        .level('3')
        .tooltip('15 Waves of enemies who go from top to bottom.')
        .attr({ x: Game.width() * 16 / 24, y: Game.height() * 8/12 - 24, w: Game.width() / 6, h: 100 });

    Crafty.e('LevelSelector')
        .level('4')
        .tooltip('20 Waves in a fast-paced short path.')
        .attr({ x: Game.width() * 28 / 24, y: Game.height() * 8/12 - 24, w: Game.width() / 6, h: 100 });

    Crafty.e('LevelSelector')
        .level('5')
        .tooltip('15 Waves who travel through a maze.')
        .attr({ x: Game.width() * 34 / 24, y: Game.height() * 8/12 - 24, w: Game.width() / 6, h: 100 });

    // idea: level 6 is dual path (two starts, two finishes, two waves each wave, paths don't overlap)

    Crafty.e('DOMButton')
        .text('Instructions')
        .attr({ x: 70, y: Game.height() - 50, w: 200, h: 50 })
        .tooltip('Click here for some instructions')
        .bind('Click', function() {
            Crafty.scene('Help', 'MapSelection');
        });

    Crafty.e('DOMButton')
        .text('Credits')
        .attr({ x: 280, y: Game.height() - 50, w: 200, h: 50 })
        .tooltip('View the credits for this game ^^')
        .bind('Click', function() {
            Crafty.scene('Credits', 'MapSelection');
        });

    Crafty.e('SoundButton')
        .attr({ x: 470, y: Game.height() - 50, w: 200, h: 50 });

});


Crafty.scene('Help', function(targetScene) {
    Crafty.e('2D, DOM, Text')
        .attr({ x: 10, y: 10, w: Game.width() - 20, h: Game.height() })
        .text(
            '<p>Choose a difficulty and select a map. The game starts. You can click anywhere to build the selected tower type. ' +
            'You can find the selected tower type in the lower left of the screen (black is selected).' +
            '</p><p>' +
            'When you click on an already built tower you upgrade that tower. ' +
            'The costs and the current tower level are displayed on mouse over ' +
            'in the top right of the screen (Cost and Level).' +
            '</p><p>' +
            '<em><strong>There are two tower types to choose from, ' +
            'with the first one automatically selected:</strong></em>' +
            '</p><p>' +
            'The first tower type shoots leafs into all 4 directions, which damage the enemy on impact.' +
            'They have a limited range so build these towers near the path.' +
            'Their range increases on higher levels.' +
            '</p><p>' +
            'The second tower shoots all over the map at a single random target.' +
            'The first tower you build of this type is relatively cheap,' +
            'but each one after the first one gets more and more expensive.' +
            'Upgrading, however, always costs the same.<br>' +
            'This tower gains a 2% chance to instantly kill an enemy on its highest level.' +
            '</p><p>' +
            'You have to start the first wave by clicking “Start”. ' +
            'After that the waves come automatically, ' +
            'but you can start the next wave earlier by clicking “Next Wave” again.' +
            '</p><p>' +
            'You win if you finish all 15 waves, but you can challenge yourself ' +
            'and see how far you can get in endless mode after that.' +
            '</p>'
        )
        .textColor(Game.textColor)
        .textFont(Game.explanationFont);

    Crafty.e('DOMButton')
        .text('Back')
        .attr({x: 280, y: Game.height() - 50, w: 200, h: 50})
        .tooltip('Go back to where you came from')
        .bind('Click', function () {
            Crafty.scene(targetScene);
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
Crafty.scene('MainMenu', function() {
    Crafty.background('rgb(169, 153, 145)');
    Crafty.audio.stop();
    Crafty.audio.play('Menu', -1);

    Crafty.e('2D, DOM, Image')
        .image('assets/ftd-logo.jpg')
        .attr({ x: 80, y: Game.height()*1/12 - 24, w: Game.width(), h: 200 });

    var savegame = Crafty.storage('ftd_save1');
    var loadButton = Crafty.e('DOMButton')
        .text('Load Saved game')
        .attr({ x: 0, y: Game.height()*7/12 - 24, w: Game.width(), h: 50, tooltipWidth: 350 })
    if (savegame) {
        loadButton
            .tooltip('Continue the game you played last time ' +
                'with difficulty ' + savegame.difficulty + ' ' +
                'on wave ' + savegame.currentWave)
            .bind('Click', function () {
                Game.difficulty = savegame.difficulty;
                Game.money = savegame.money;
                Game.lifes = savegame.lifes;
                Game.moneyAfterWave = savegame.moneyAfterWave;
                Game.towers = savegame.towers;
                Game.level = savegame.level;

                Game.backgroundAsset = savegame.backgroundAsset;
                Game.waves.current = savegame.waves.current;
                Game.endless = savegame.currentWave >= Game.waves.current.length;
                Game.enemyCount = savegame.enemyCount;
                Game.currentWave = savegame.currentWave;
                Game.selectedTower = savegame.selectedTower;
                Game.sniperTowerInitial = savegame.sniperTowerInitial;
                Game.towerMap = savegame.towerMap;
                Game.path = new Path(Game.map_grid);
                Game.path.copy(savegame.path);

                Crafty.scene('Game');
            });
    } else {
        loadButton
            .tooltip('No savegame exists yet.')
            .disable();
    }

    Crafty.e('DOMButton')
        .text('Start new game')
        .attr({ x: 0, y: Game.height()*9/12 - 24, w: Game.width(), h: 50 })
        .tooltip('Starts a new game. You can select the difficulty on the next screen.')
        .bind('Click', function() {
            if (Crafty.storage('ftd_save1') && !confirm('Starting a new game will overwrite your already saved game. Continue?')) {
                return;
            }
            Crafty.scene('Difficulty');
        });


    Crafty.e('DOMButton')
        .text('Instructions')
        .attr({ x: 70, y: Game.height() - 50, w: 200, h: 50 })
        .tooltip('Click here for some instructions')
        .bind('Click', function() {
            Crafty.scene('Help', 'MainMenu');
        });

    Crafty.e('DOMButton')
        .text('Credits')
        .attr({ x: 280, y: Game.height() - 50, w: 200, h: 50 })
        .tooltip('View the credits for this game ^^')
        .bind('Click', function() {
            Crafty.scene('Credits', 'MainMenu');
        });

    Crafty.e('SoundButton')
        .attr({ x: 470, y: Game.height() - 50, w: 200, h: 50 });
});


// Initialize variables for new game
// ---------------------------------

Crafty.scene('InitializeLevel1', function() {
    // show loading if initialization takes up some time ...
    Crafty.e('2D, DOM, Text')
        .text('Loading...')
        .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
        .textFont(Game.loadingFont)
        .textColor(Game.textColor)
        .css(Game.centerCss);

    Game.level = '1';
    Game.backgroundAsset = 'background1';
    Game.waves.current = Game.waves.level1;
    Game.setGeneralProperties();

    // generate path like this:
    // -  /-----------\
    // |  |           |
    // |  |  /-----\  |
    // |  |  |     |  |
    // |  |  \--\  |  |
    // |  |     |  |  |
    // |  \-----/  |  |
    // |           |  |
    // \-----------/  -

    Game.path = new Path(Game.map_grid);
    Game.path.generateSpiral();

    Crafty.scene('Game');
});


Crafty.scene('InitializeLevel2', function() {
    // show loading if initialization takes up some time ...
    Crafty.e('2D, DOM, Text')
        .text('Loading...')
        .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
        .textFont(Game.loadingFont)
        .textColor(Game.textColor)
        .css(Game.centerCss);

    Game.level = '2';
    Game.backgroundAsset = 'background2';
    Game.waves.current = Game.waves.level2;
    Game.setGeneralProperties();

    // generate path
    Game.path = new Path(Game.map_grid);
    Game.path.generatePath();

    Crafty.scene('Game');
});


Crafty.scene('InitializeLevel3', function() {
    // show loading if initialization takes up some time ...
    Crafty.e('2D, DOM, Text')
        .text('Loading...')
        .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
        .textFont(Game.loadingFont)
        .textColor(Game.textColor)
        .css(Game.centerCss);

    Game.level = '3';
    Game.backgroundAsset = 'background6';
    Game.waves.current = Game.waves.level3;
    Game.setGeneralProperties();

    // generate path
    Game.path = new Path(Game.map_grid);
    Game.path.generateStartOnRow(0);
    Game.path.finish = { x: 14, y: Game.map_grid.height - 1 };
    Game.path.generatePath();

    Crafty.scene('Game');
});


Crafty.scene('InitializeLevel4', function() {
    // show loading if initialization takes up some time ...
    Crafty.e('2D, DOM, Text')
        .text('Loading...')
        .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
        .textFont(Game.loadingFont)
        .textColor(Game.textColor)
        .css(Game.centerCss);

    Game.level = '4';
    Game.backgroundAsset = 'background5';
    Game.waves.current = Game.waves.level4;
    Game.setGeneralProperties();

    // generate path
    var map_config = {
        width: Game.map_grid.width,
        height: Game.map_grid.height,
        tile: Game.map_grid.tile,
        pathMinLength: 5,
        pathMaxLength: 20
    };
    Game.path = new Path(map_config);
    Game.path.start = { x: 9, y: 0 };
    Game.path.finish = { x: 14, y: Game.map_grid.height - 1 };
    Game.path.generatePath();

    Crafty.scene('Game');
});


Crafty.scene('InitializeLevel5', function() {
    // show loading if initialization takes up some time ...
    Crafty.e('2D, DOM, Text')
        .text('Loading...')
        .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
        .textFont(Game.loadingFont)
        .textColor(Game.textColor)
        .css(Game.centerCss);

    Game.level = '5';
    Game.backgroundAsset = 'background9';
    Game.waves.current = Game.waves.level5;
    Game.setGeneralProperties();

    // generate path
    Game.path = new Path(Game.map_grid);
    Game.path.generateStartOnRow(0);
    Game.path.generateFinishInColumn(0);
    Game.path.generateLabyrinth();

    Crafty.scene('Game');
});


// Main game scene
// ---------------
Crafty.scene('Game', function() {
    // background
    Crafty.e('2D, Canvas, ' + Game.backgroundAsset);
    Crafty.audio.stop();
    Crafty.audio.play('Background', -1);

    // HUD
    Crafty.e('HudElement').observe('Money', 'money', '$').at(1);
    Crafty.e('HudElement').observe('Lifes', 'lifes').at(6).alertIfBelow(3);
    Crafty.e('HudElement').observe('Enemies', 'enemyCount').at(10);
    Crafty.e('HudElement').observe('Wave', 'currentWave').at(14);
    Crafty.e('HudElement').observe('FPS', Game.actualFPS.FPS).at(18);

    Crafty.e('DOMButton, Grid')
        .text('Restart level')
        .tooltip('Restart this level with difficulty ' + Game.difficulty + ' at wave 1')
        .textColor(Game.highlightColor)
        .textFont(Game.hudFont)
        .unbind('Click')
        .bind('Click', function() {
            if (window.confirm('Really restart this level? You will restart at wave 1 with no towers!')) {
                console.log('Restarting level ' + Game.level);
                // we need crafty unpaused for initialization
                if (Crafty.isPaused()) {
                    Crafty.pause();
                }
                // reset difficulty-related properties
                Game.setDifficultyProperties(Game.difficulty);
                Crafty.scene('InitializeLevel' + Game.level);
            }
        })
        .at(20, 0)
        .attr({w: 180});

    // tower selectors
    Crafty.e('TowerSelector').forTower('FlowerTower')
        .attr({tooltipWidth: 500, tooltipHeight: 130})
        .tooltip('Click here to select the Flower Tower.<br> If you click anywhere on the map you build this tower.<br>' +
                 'It shoots in all 4 directions with limited range.<br> Gains higher range on upgrade.<br> Hotkey: C')
        .withSprite("flower_tower5").withHotkey('C').at(1, Game.map_grid.height - 1);
    Crafty.e('TowerSelector').forTower('SniperTower')
        .attr({tooltipWidth: 500, tooltipHeight: 130})
        .tooltip('Click here to select the Sniper Tower.<br> If you click anywhere on the map you build this tower.<br> ' +
                 'It shoots anywhere on the map, but cost increases.<br> Gains instant kill on highest level.<br> Hotkey: V')
        .withSprite("sniper_tower4").withHotkey('V').at(3, Game.map_grid.height - 1);

    // win/lose conditions
    Crafty.bind('EnterFrame', function() {
        if (Game.lifes <= 0) {
            Crafty.unbind('EnterFrame');
            Crafty.scene('GameOver');
        }
    });
    Crafty.bind('WaveFinished', function(waveNumber) {
        Crafty.storage('ftd_save1', Game);

        if (Game.lifes > 0 && waveNumber == Game.waves.current.length) {
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
                    .attr({'level': Game.towerMap[x][y].level})
                    .updateTooltip();
            } else {
                Crafty.e('TowerPlace').at(x, y);
            }
        }
    }

    // initialize wave (handles spawning of every wave)
    Crafty.e('Wave').at(Game.map_grid.width - 5, Game.map_grid.height - 1);

    // initialize sidebar
    Crafty.e('Sidebar');

    Crafty.e('DOMButton, Grid')
        .text('Help')
        .textFont(Game.waveFont)
        .at(8, Game.map_grid.height - 1)
        .attr({ w: 100 })
        .tooltip('If you are lost, look here')
        .bind('Click', function() {
            // create an overlay that explains the general concept

            var overlay = document.getElementById('helpOverlay');
            if (overlay) {
                overlay.parentNode.removeChild(overlay);
            } else {
                overlay = document.createElement('div');
                overlay.setAttribute('id', 'helpOverlay');
                overlay.style.position = 'absolute';
                overlay.style.width = (Game.width() - 40) + 'px';
                overlay.style.padding = '10px';
                overlay.style.left = '10px';
                overlay.style.top = '30px';
                overlay.style.border = '1px solid black';
                overlay.style.background = 'grey';
                overlay.style.zIndex = '1000';
                overlay.innerHTML =
                '<p>Click anywhere to build the selected tower type. ' +
                'You can find the selected tower type in the lower left of the screen (black is selected).' +
                '</p><p>' +
                'When you click on an already built tower you upgrade that tower. ' +
                'The costs and the current tower level are displayed on mouse over ' +
                'in the top right of the screen (Cost and Level).' +
                '</p><p>' +
                '<em><strong>There are two tower types to choose from, ' +
                'with the first one automatically selected:</strong></em>' +
                '</p><p>' +
                'The first tower type shoots leafs into all 4 directions, which damage the enemy on impact. ' +
                'They have a limited range so build these towers near the path. ' +
                'Their range increases on higher levels.' +
                '</p><p>' +
                'The second tower shoots all over the map at a single random target.' +
                'The first tower you build of this type is relatively cheap, ' +
                'but each one after the first one gets more and more expensive. ' +
                'Upgrading, however, always costs the same.<br>' +
                'This tower gains a 2% chance to instantly kill an enemy on its highest level.' +
                '</p><p>' +
                'You have to start the first wave by clicking “Start”. ' +
                'After that the waves come automatically, ' +
                'but you can start the next wave earlier by clicking “Next Wave” again.' +
                '</p><p>' +
                'You win if you finish all 15 waves. You can challenge yourself ' +
                'and see how far you can get in endless mode after that.' +
                '</p>';
                document.getElementById('cr-stage').appendChild(overlay);
            }
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
        .attr({ x: 80, y: Game.height()*1/12 - 24, w: Game.width(), h: 200 });

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
        .attr({ x: 80, y: Game.height()*1/12 - 24, w: Game.width(), h: 200 });

    Crafty.e('2D, DOM, Text')
        .text('You Won :)')
        .attr({ x: 0, y: Game.height()*7/12 - 24, w: Game.width(), h: 50 })
        .textFont(Game.wonFont)
        .textColor(Game.textColor)
        .css(Game.centerCss);

    Crafty.e('DOMButton')
        .text('Continue in endless mode?')
        .tooltip('Click here to continue your last game from wave ' + Game.waves.current.length)
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