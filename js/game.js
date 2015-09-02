if (!console) {
    console = {
        log: function() {}
    }
}

Game = {
    // This defines our grid's size and the size of each of its tiles
    map_grid: {
        width:  25,
        height: 15,
        tile: {
            width:  32,
            height: 32
        },
        pathMinLength: 70,
        pathMaxLength: 80
    },

    options: {
        bulletImages: true,
        music: true,
        soundEffects: true
    },

    speedup: 1,

    // text colors and fonts (maybe we get fancy later on)
    textColor: 'white',
    highlightColor: 'black',
    disabledColor: 'grey',
    alertColor: 'red',

    centerCss: { 'text-align': 'center'},
    buttonCss: { 'text-align': 'center', 'cursor': 'pointer'},
    generalTooltipCss: { 'padding': '5px', 'border': '1px solid black', 'background-color': 'grey'},
    closeCss: { 'line-height': '16px', 'border': '1px solid black', 'cursor': 'pointer'},

    loadingFont: { 'size': '48px', 'family': 'Arial' },
    hudFont: { 'size': '20px', 'family': 'Comic Sans MS' },
    towerSelectorFont: { 'size': '16px', 'family': 'Arial' },
    explanationFont: { 'size': '16px', 'family': 'Arial' },
    difficultyFont: { 'size': '36px', 'family': 'Comic Sans MS' },
    mapSelectionFont: { 'size': '30px', 'family': 'Comic Sans MS' },
    waveFont: { 'size': '25px', 'family': 'sans-serif', 'weight': 'bold' },
    closeFont: { 'size': '22px', 'family': 'sans-serif', 'line-height': '22px' },
    sidebarFont: { 'size': '25px', 'family': 'sans-serif', 'weight': 'bold' },

    creditsFont: { 'size': '28px', 'family': 'sans-serif', weight: 'bold' },
    creditsTextFont: { 'size': '20px', 'family': 'sans-serif', variant: 'italic' },
    gameOverFont: { 'size': '48px', 'family': 'sans-serif' },
    gameOverColor: 'red',
    wonFont: { 'size': '48px', 'family': 'Comic Sans MS' },
    wonColor: 'rgb(109, 203, 105)',
    continueFont: { 'size': '36px', 'family': 'Comic Sans MS' },
    continueColor: 'brown',
    restartFont: { 'size': '36px', 'family': 'sans-serif' },
    restartColor: 'brown',
    closeColor: 'black',

    generalButtonFont: { 'size': '36px', 'family': 'sans-serif' },
    generalTooltipFont: { 'size': '20px', 'family': 'sans-serif' },

    // handy overview which wave spawns which enemies
    waves: {
        current: [],
        level1: [
            ['Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch'],
            ['Witch', 'Squid', 'Witch', 'Witch', 'Squid', 'Witch', 'Witch', 'Squid', 'Witch', 'Witch', 'Squid'],
            ['Squid', 'Squid', 'Squid', 'FastSquid', 'Squid', 'Squid', 'Squid', 'FastSquid'],
            ['Squid', 'FastSquid', 'Knight', 'Squid', 'FastSquid', 'Squid', 'Knight', 'Squid', 'Knight'],
            ['FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight',
                'FastSquid', 'Knight'],
            ['FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid',
                'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid',
                'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'MightyWitch'],
            ['FastSquid', 'MightyWitch', 'FastSquid', 'Spider', 'Witch', 'FastKnight', 'Knight', 'FastKnight',
                'MightyWitch', 'FastKnight', 'MightyWitch'],
            ['Spider', 'Orc', 'Spider', 'MightyWitch', 'FastSquid', 'FastSquid', 'Spider', 'Orc', 'MightyWitch', 'FastSquid',
                'Spider', 'Orc', 'FastSquid', 'Spider', 'MightyWitch'],
            ['Orc', 'Orc', 'Orc', 'Orc', 'Orc', 'FastSquid', 'FastSquid', 'MightyWitch', 'FastKnight', 'Spider', 'Spider',
                'Spider', 'Spider', 'Orc', 'GreenDragon', 'Spider', 'Orc', 'Spider', 'MightyWitch', 'FastSquid', 'FastSquid',
                'Spider', 'Orc', 'MightyWitch', 'FastSquid', 'Spider', 'Orc', 'MightyWitch', 'FastSquid', 'Spider', 'GreenDragon'],
            ['Spider', 'Orc', 'Spider', 'MightyWitch', 'FastSquid', 'FastSquid', 'Spider', 'Orc', 'MightyWitch', 'FastSquid',
                'Spider', 'Orc', 'MightyWitch', 'FastSquid', 'Spider', 'MightyWitch', 'SilverDragon']
        ],
        level2: [
            ['Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch'],
            ['Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Squid'],
            ['Witch', 'Witch', 'Witch', 'Witch', 'Squid', 'Witch', 'Witch', 'Squid'],
            ['Squid', 'Squid', 'Squid', 'FastSquid'],
            ['Squid', 'FastSquid', 'Knight', 'Squid', 'FastSquid', 'Witch', 'Witch', 'Witch', 'Knight'],
            ['FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight',
                'FastSquid', 'Knight'],
            ['FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid'],
            ['FastSquid', 'Spider', 'FastSquid', 'Spider', 'Witch', 'Witch', 'Knight', 'Knight', 'MightyWitch'],
            ['Spider', 'Witch', 'MightyWitch', 'FastSquid', 'Witch', 'MightyWitch', 'Orc'],
            ['Orc', 'Orc', 'Orc', 'Orc', 'Orc', 'FastSquid', 'FastSquid', 'Witch', 'FastKnight'],
            ['FastKnight', 'FastKnight', 'FastKnight', 'MightyWitch', 'MightyWitch', 'MightyWitch'],
            ['Spider', 'FastSquid', 'Spider', 'FastSquid', 'Orc', 'Orc', 'Squid', 'GreenDragon'],
            ['Spider', 'Spider', 'Orc', 'Orc', 'GreenDragon', 'FastSquid', 'FastSquid', 'Orc', 'GreenDragon'],
            ['Witch', 'Squid', 'FastSquid', 'Knight', 'Spider', 'MightyWitch', 'Orc', 'FastKnight', 'GreenDragon'],
            ['SilverDragon']
        ],
        // FIXME: level 3 should have different waves than level 2
        level3: [
            ['Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch'],
            ['Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Squid'],
            ['Witch', 'Witch', 'Witch', 'Witch', 'Squid', 'Witch', 'Witch', 'Squid'],
            ['Squid', 'Squid', 'Squid', 'FastSquid'],
            ['Squid', 'FastSquid', 'Knight', 'Squid', 'FastSquid', 'Witch', 'Witch', 'Witch', 'Knight'],
            ['FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight',
                'FastSquid', 'Knight'],
            ['FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid'],
            ['FastSquid', 'Spider', 'FastSquid', 'Spider', 'Witch', 'Witch', 'Knight', 'Knight', 'MightyWitch'],
            ['Spider', 'Witch', 'MightyWitch', 'FastSquid', 'Witch', 'MightyWitch', 'Orc'],
            ['Orc', 'Orc', 'Orc', 'Orc', 'Orc', 'FastSquid', 'FastSquid', 'Witch', 'FastKnight'],
            ['FastKnight', 'FastKnight', 'FastKnight', 'MightyWitch', 'MightyWitch', 'MightyWitch'],
            ['Spider', 'FastSquid', 'Spider', 'FastSquid', 'Orc', 'Orc', 'Squid', 'GreenDragon'],
            ['Spider', 'Spider', 'Orc', 'Orc', 'GreenDragon', 'FastSquid', 'FastSquid', 'Orc', 'GreenDragon'],
            ['Witch', 'Squid', 'FastSquid', 'Knight', 'Spider', 'MightyWitch', 'Orc', 'FastKnight', 'GreenDragon'],
            ['SilverDragon']
        ],
        level4: [
            // 1-10
            ['Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch'],
            ['Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Squid'],
            ['Witch', 'Witch', 'Witch', 'Witch', 'Squid', 'Witch', 'Witch', 'Squid'],
            ['Squid', 'Squid', 'Squid', 'FastSquid'],
            ['Witch', 'Witch', 'Squid', 'Witch', 'Witch', 'FastSquid', 'Squid', 'Witch', 'Witch', 'Squid'],
            ['Squid', 'FastSquid', 'Knight', 'Squid', 'FastSquid', 'Witch', 'Witch', 'Witch', 'Knight'],
            ['Squid', 'FastSquid', 'Knight', 'Squid', 'FastSquid', 'Knight', 'Knight'],
            ['FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight'],
            ['FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid'],
            ['FastSquid', 'Spider', 'FastSquid', 'Spider', 'Witch', 'Witch', 'Knight', 'Knight', 'MightyWitch'],
            // 11-20
            ['FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid'],
            ['Spider', 'Witch', 'MightyWitch', 'FastSquid', 'Witch', 'MightyWitch', 'Orc'],
            ['FastSquid', 'FastSquid', 'Spider', 'Orc', 'Knight', 'Knight', 'MightyWitch'],
            ['Orc', 'Orc', 'Orc', 'Orc', 'Orc', 'FastSquid', 'FastSquid', 'Witch', 'FastKnight'],
            ['FastKnight', 'FastKnight', 'FastKnight', 'MightyWitch', 'MightyWitch', 'MightyWitch'],
            ['Spider', 'FastSquid', 'Spider', 'FastSquid', 'Orc', 'Orc', 'Squid', 'GreenDragon'],
            ['Spider', 'Spider', 'Orc', 'Orc', 'GreenDragon', 'FastSquid', 'FastSquid', 'Orc', 'GreenDragon'],
            ['FastKnight', 'FastKnight', 'FastKnight', 'FastKnight', 'FastKnight', 'FastKnight'],
            ['Witch', 'Squid', 'FastSquid', 'Knight', 'Spider', 'MightyWitch', 'Orc', 'FastKnight', 'GreenDragon'],
            ['SilverDragon']
        ],
        level5: [
            ['Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch'],
            ['Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Squid'],
            ['Witch', 'Witch', 'Witch', 'Witch', 'Squid', 'Witch', 'Witch', 'Squid'],
            ['Squid', 'Squid', 'Squid', 'FastSquid'],
            ['Squid', 'FastSquid', 'Knight', 'Squid', 'FastSquid', 'Witch', 'Witch', 'Witch', 'Knight'],
            ['FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight',
                'FastSquid', 'Knight'],
            ['FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid'],
            ['FastSquid', 'Spider', 'FastSquid', 'Spider', 'Witch', 'Witch', 'Knight', 'Knight', 'MightyWitch'],
            ['Spider', 'Witch', 'MightyWitch', 'FastSquid', 'Witch', 'MightyWitch', 'Orc'],
            ['Orc', 'Orc', 'Orc', 'Orc', 'Orc', 'FastSquid', 'FastSquid', 'Witch', 'FastKnight'],
            ['FastKnight', 'FastKnight', 'FastKnight', 'MightyWitch', 'MightyWitch', 'MightyWitch'],
            ['Spider', 'FastSquid', 'Spider', 'FastSquid', 'Orc', 'Orc', 'Squid', 'GreenDragon'],
            ['Spider', 'Spider', 'Orc', 'Orc', 'GreenDragon', 'FastSquid', 'FastSquid', 'Orc', 'GreenDragon'],
            ['Witch', 'Squid', 'FastSquid', 'Knight', 'Spider', 'MightyWitch', 'Orc', 'FastKnight', 'GreenDragon'],
            ['SilverDragon']
        ]
    },

    difficulties: {
        'Easy': {
            textColor: 'green',
            tooltip: '100 lifes, normal prices, lots of money',
            x: 0,
            y: 0,
            money: 60,
            lifes: 100,
            moneyAfterWave: 20,
            towers: {
                'FlowerTower': 10,
                'SniperTower': 20,
                'SniperTowerUpgrade': 20
            }
        },
        'Normal': {
            textColor: 'yellow',
            tooltip: '40 lifes, normal prices, normal amount of money',
            x: 1,
            y: 0,
            money: 30,
            lifes: 40,
            moneyAfterWave: 10,
            towers: {
                'FlowerTower': 10,
                'SniperTower': 20,
                'SniperTowerUpgrade': 20
            }
        },
        'Hard': {
            textColor: 'red',
            tooltip: '15 lifes, normal prices, less money after waves',
            x: 0,
            y: 1,
            money: 25,
            lifes: 15,
            moneyAfterWave: 5,
            towers: {
                'FlowerTower': 12,
                'SniperTower': 20,
                'SniperTowerUpgrade': 25
            }
        },
        'Impossible': {
            textColor: '#880044',
            tooltip: '10 lifes, higher prices, no money after waves',
            x: 1,
            y: 1,
            money: 20,
            lifes: 10,
            moneyAfterWave: 0,
            towers: {
                'FlowerTower': 15,
                'SniperTower': 25,
                'SniperTowerUpgrade': 50
            }
        }
    },

    // sounds, images, spritesheets, all handy at one place
    assets: {
        "audio": {
            "Background": ["assets/sounds/background.wav", "assets/sounds/background.mp3", "assets/sounds/background.ogg"],
            "Boss": ["assets/sounds/boss.wav", "assets/sounds/boss.mp3", "assets/sounds/boss.ogg"],
            "Menu": ["assets/sounds/Menu.mp3", "assets/sounds/Menu.ogg"],
            "Won": ["assets/sounds/Won.mp3", "assets/sounds/Won.ogg", "assets/sounds/Won.wav"],
            "EnemyDead": ["assets/sounds/Shot.mp3", "assets/sounds/Shot.ogg", "assets/sounds/Shot.wav"],
            "LifeLost": ["assets/sounds/LifeLost.mp3", "assets/sounds/LifeLost.ogg", "assets/sounds/LifeLost.wav"]
        },
        "images": ["assets/ftd-logo.jpg", "assets/transparent.png"],
        "sprites": {
            "assets/levels/background.jpg": {
                "tile": 800,
                "tileh": 480,
                "map": {
                    background1: [0, 0]
                }
            },
            "assets/levels/background2.jpg": {
                "tile": 800,
                "tileh": 600,
                "map": {
                    background2: [0, 0],
                    background3: [1, 0],
                    background4: [0, 1],
                    background5: [1, 1]
                }
            },
            "assets/levels/background3.jpg": {
                "tile": 800,
                "tileh": 600,
                "map": {
                    background6: [0, 0]
                }
            },
            "assets/levels/background4.jpg": {
                "tile": 800,
                "tileh": 480,
                "map": {
                    background7: [0, 0],
                    background8: [0, 1]
                }
            },
            "assets/levels/background5.jpg": {
                "tile": 800,
                "tileh": 565,
                "map": {
                    background9: [0, 0]
                }
            },
            "assets/levels/preview-levels.png": {
                "tile": 133,
                "tileh": 80,
                "map": {
                    preview_level1: [0, 0],
                    preview_level2: [0, 1],
                    preview_level3: [0, 2],
                    preview_level4: [0, 3],
                    preview_level5: [0, 4],
                    preview_level6: [1, 0],
                    preview_level7: [1, 1],
                    preview_level8: [1, 2],
                    preview_level9: [1, 3]
                }
            },
            "assets/enemies.png": {
                "tile": 32,
                "tileh": 32,
                "map": {
                    witch_right: [5, 2],
                    witch_up: [3, 0],
                    witch_down: [4, 2],

                    knight_right: [0, 3],
                    knight_left: [1, 3],
                    knight_down: [2, 3],
                    knight_up: [3, 3],

                    green_dragon: [2, 0],
                    silver_dragon: [1, 1],
                    orc: [2, 2],
                    spider: [1, 2],
                    squid: [4, 3]
                }
            },
            "assets/leafs.png": {
                "tile": 16,
                "tileh": 16,
                "map": {
                    leaf_left: [0, 0],
                    leaf_up: [1, 0],
                    leaf_down: [0, 1],
                    leaf_right: [1, 1]
                }
            },
            "assets/flower.png": {
                "tile": 32,
                "tileh": 32,
                "map": {
                    flower: [4, 0],

                    flower_tower1: [0, 0],
                    flower_tower2: [1, 0],
                    flower_tower3: [2, 0],
                    flower_tower4: [3, 0],
                    flower_tower5: [4, 0],
                    sniper_tower1: [5, 0],
                    sniper_tower2: [6, 0],
                    sniper_tower3: [10, 0],
                    sniper_tower4: [11, 0],
                    hero_tower:    [12, 0],
                    spiral_tower:  [14, 0]
                }
            }
        }
    },

    // The total width of the game screen. Since our grid takes up the entire screen
    //  this is just the width of a tile times the width of the grid
    width: function() {
        return this.map_grid.width * this.map_grid.tile.width;
    },

    // The total height of the game screen. Since our grid takes up the entire screen
    //  this is just the height of a tile times the height of the grid
    height: function() {
        return this.map_grid.height * this.map_grid.tile.height;
    },

    setGeneralProperties: function() {
        Game.endless = false;
        Game.enemyCount = 0;
        Game.currentWave = 0;
        Game.selectedTower = 'SniperTower';
        Game.sniperTowerInitial = this.towers['SniperTower'];
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
    },

    setDifficultyProperties: function(difficulty) {
        var config = Game.difficulties[difficulty];

        Game.difficulty = difficulty;
        Game.money = config.money;
        Game.lifes = config.lifes;
        Game.moneyAfterWave = config.moneyAfterWave;
        Game.towers = {
            'FlowerTower': config.towers.FlowerTower,
            'SniperTower': config.towers.SniperTower,
            'SniperTowerUpgrade': config.towers.SniperTowerUpgrade
        };
    },

    // the function that gets the ball rolling
    start: function() {
        Crafty.init(Game.width(), Game.height());
        Crafty.background('rgb(169, 153, 145)');
        Game.actualFPS = Crafty.e('ActualFPS');
        Crafty.scene('Loading');
    }
};
