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

    // text colors and fonts (maybe we get fancy later on)
    textColor: 'white',
    highlightColor: 'black',
    disabledColor: 'grey',
    alertColor: 'red',

    centerCss: { 'text-align': 'center'},
    buttonCss: { 'text-align': 'center', 'cursor': 'pointer'},
    generalTooltipCss: { 'padding': '5px', 'border': '1px solid black', 'background-color': 'grey'},

    loadingFont: { 'size': '48px', 'family': 'Arial' },
    hudFont: { 'size': '20px', 'family': 'Comic Sans MS' },
    towerSelectorFont: { 'size': '16px', 'family': 'Arial' },
    explanationFont: { 'size': '16px', 'family': 'Arial' },
    difficultyFont: { 'size': '36px', 'family': 'Comic Sans MS' },
    mapSelectionFont: { 'size': '30px', 'family': 'Comic Sans MS' },
    waveFont: { 'size': '25px', 'family': 'sans-serif', 'weight': 'bold' },

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

    generalButtonFont: { 'size': '36px', 'family': 'sans-serif' },
    generalTooltipFont: { 'size': '20px', 'family': 'sans-serif' },

    // handy overview which wave spawns which enemies
    waves: {
        current: [],
        level1: [
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
        level3: [
            ['Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch'],
            ['Witch', 'Squid', 'Witch', 'Witch', 'Squid', 'Witch', 'Witch', 'Squid', 'Witch', 'Witch', 'Squid'],
            ['Squid', 'Squid', 'Squid', 'FastSquid', 'Squid', 'Squid', 'Squid', 'FastSquid'],
            ['Squid', 'FastSquid', 'Knight', 'Squid', 'FastSquid', 'Squid', 'Knight', 'Squid', 'Knight'],
            ['FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight',
                'FastSquid', 'Knight'],
            ['FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid',
                'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid',
                'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid'],
            ['FastSquid', 'MightyWitch', 'FastSquid', 'Spider', 'MightyWitch', 'MightyWitch', 'Knight', 'FastKnight',
                'MightyWitch', 'FastKnight', 'MightyWitch'],
            ['Spider', 'Orc', 'Spider', 'MightyWitch', 'FastSquid', 'FastSquid', 'Spider', 'Orc', 'MightyWitch', 'FastSquid',
                'Spider', 'Orc', 'MightyWitch', 'FastSquid', 'Spider', 'MightyWitch'],
            ['Orc', 'Orc', 'Orc', 'Orc', 'Orc', 'FastSquid', 'FastSquid', 'MightyWitch', 'FastKnight', 'Spider', 'Spider',
                'Spider', 'Spider', 'Orc', 'GreenDragon', 'Spider', 'Orc', 'Spider', 'MightyWitch', 'FastSquid', 'FastSquid',
                'Spider', 'Orc', 'MightyWitch', 'FastSquid', 'Spider', 'Orc', 'MightyWitch', 'FastSquid', 'Spider', 'GreenDragon'],
            ['Spider', 'Orc', 'Spider', 'MightyWitch', 'FastSquid', 'FastSquid', 'Spider', 'Orc', 'MightyWitch', 'FastSquid',
                'Spider', 'Orc', 'MightyWitch', 'FastSquid', 'Spider', 'MightyWitch', 'SilverDragon']
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
            ['Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch'],
            ['Witch', 'Squid', 'Witch', 'Witch', 'Squid', 'Witch', 'Witch', 'Squid', 'Witch', 'Witch', 'Squid'],
            ['Squid', 'Squid', 'Squid', 'FastSquid', 'Squid', 'Squid', 'Squid', 'FastSquid'],
            ['Squid', 'FastSquid', 'Knight', 'Squid', 'FastSquid', 'Squid', 'Knight', 'Squid', 'Knight'],
            ['FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight'],
            ['FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid',
                'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid', 'FastSquid'],
            ['FastSquid', 'MightyWitch', 'FastSquid', 'Spider', 'MightyWitch', 'MightyWitch', 'Knight', 'FastKnight', 'MightyWitch',
                'FastKnight', 'MightyWitch'],
            ['Spider', 'Orc', 'Spider', 'MightyWitch', 'FastSquid', 'FastSquid', 'Spider', 'Orc', 'MightyWitch', 'FastSquid',
                'Spider', 'Orc', 'MightyWitch', 'FastSquid', 'Spider', 'MightyWitch'],
            ['Orc', 'Orc', 'Orc', 'Orc', 'Orc', 'FastSquid', 'FastSquid', 'MightyWitch', 'FastKnight', 'Spider', 'Spider',
                'Spider', 'Spider', 'Orc', 'GreenDragon', 'Spider', 'Orc', 'Spider', 'MightyWitch', 'FastSquid', 'FastSquid',
                'Spider', 'Orc', 'MightyWitch', 'FastSquid', 'Spider', 'Orc', 'MightyWitch', 'FastSquid', 'Spider', 'GreenDragon'],
            ['Spider', 'Orc', 'Spider', 'MightyWitch', 'FastSquid', 'FastSquid', 'Spider', 'Orc', 'MightyWitch', 'FastSquid',
                'Spider', 'Orc', 'MightyWitch', 'FastSquid', 'Spider', 'MightyWitch', 'SilverDragon']
        ]
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

    // the function that gets the ball rolling
    start: function() {
        Crafty.init(Game.width(), Game.height());
        Crafty.background('rgb(169, 153, 145)');
        Crafty.scene('Loading');
    }
};
