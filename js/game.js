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
    loadingFont: { 'size': '48px', 'family': 'Arial' },
    loadingCss: { 'text-align': 'center'},
    hudFont: { 'size': '20px', 'family': 'Arial' },
    difficultyFont: { 'size': '36px', 'family': 'Arial' },
    difficultyCss: { 'text-align': 'center', 'cursor': 'pointer'},
    gameOverFont: { 'size': '48px', 'family': 'Arial' },
    gameOverCss: { 'text-align': 'center'},
    gameOverColor: 'red',
    wonFont: { 'size': '48px', 'family': 'Arial' },
    wonCss: { 'text-align': 'center'},
    wonColor: 'green',
    restartFont: { 'size': '36px', 'family': 'Arial' },
    restartCss: { 'text-align': 'center', 'cursor': 'pointer'},
    restartColor: 'brown',

    // handy overview which wave spawns which enemies
    waves: [
        ['Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch'],
        ['Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Witch', 'Squid'],
        ['Witch', 'Witch', 'Witch', 'Witch', 'Squid', 'Witch', 'Witch', 'Squid'],
        ['Squid', 'Squid', 'Squid', 'FastSquid'],
        ['Squid', 'FastSquid', 'Knight', 'Squid', 'FastSquid', 'Knight'],
        ['FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight', 'FastSquid', 'Knight']
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
                    "witch_right": [2, 2],
                    "witch_up": [0, 0]
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
        Crafty.scene('Difficulty');
    }
};
