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
        pathMinLength: 80,
        pathMaxLength: 90
    },

    // text colors and fonts (maybe we get fancy later on)
    textColor: 'white',
    highlightColor: 'black',
    disabledColor: 'grey',
    alertColor: 'red',

    centerCss: { 'text-align': 'center'},
    buttonCss: { 'text-align': 'center', 'cursor': 'pointer'},

    loadingFont: { 'size': '48px', 'family': 'Arial' },
    hudFont: { 'size': '20px', 'family': 'Arial' },
    towerSelectorFont: { 'size': '18px', 'family': 'Arial' },
    explanationFont: { 'size': '12px', 'family': 'Arial' },
    difficultyFont: { 'size': '36px', 'family': 'Arial' },
    waveFont: { 'size': '20px', 'family': 'Arial', 'weight': 'bold' },

    gameOverFont: { 'size': '48px', 'family': 'Arial' },
    gameOverColor: 'red',
    wonFont: { 'size': '48px', 'family': 'Arial' },
    wonColor: 'rgb(109, 203, 105)',
    continueFont: { 'size': '36px', 'family': 'Arial' },
    continueColor: 'brown',
    restartFont: { 'size': '36px', 'family': 'Arial' },
    restartColor: 'brown',

    generalButtonFont: { 'size': '36px', 'family': 'Arial' },

    // handy overview which wave spawns which enemies
    waves: [
        ['Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch'],
        ['Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Squid'],
        ['Witch', 'Witch', 'Witch', 'Witch', 'Squid', 'Witch', 'Witch', 'Squid'],
        ['Squid', 'Squid', 'Squid', 'FastSquid'],
        ['Squid', 'FastSquid', 'Knight', 'Squid', 'FastSquid', 'Witch', 'Witch', 'Witch', 'Knight'],
        ['FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight'],
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

    // sounds, images, spritesheets, all handy at one place
    assets: {
        "audio": {
            /*
             "beep": ["beep.wav", "beep.mp3", "beep.ogg"],
             "boop": "boop.wav",
             "slash": "slash.wav"
             */
        },
        "images": ["assets/transparent.png", "assets/background.jpg", "assets/flower.png", "assets/squid.png"],
        "sprites": {
            "assets/witch.png": {
                "tile": 29,
                "tileh": 30,
                "map": {
                    witch_right: [2, 2],
                    witch_up: [0, 0],
                    witch_down: [1, 2]
                },
                "paddingX": 4,
                "paddingY": 3
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
            "assets/knight.png": {
                "tile": 32,
                "tileh": 32,
                "map": {
                    knight_right: [0, 0],
                    knight_left: [1, 0],
                    knight_down: [2, 0],
                    knight_up: [3, 0]
                }
            },
            "assets/roguelikebosses.png": {
                "tile": 32,
                "tileh": 32,
                "map": {
                    green_dragon: [0, 0],
                    silver_dragon: [1, 1],
                    orc: [0, 2],
                    spider: [1, 2]
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
