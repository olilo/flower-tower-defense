Game = {
    // This defines our grid's size and the size of each of its tiles
    map_grid: {
        width:  24,
        height: 16,
        tile: {
            width:  16,
            height: 16
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

    generatePath: function(start, finish, lastDir, preLastDir) {
        // start: go right
        if (start.x == 0) {
            this.pathIter = 0;
            Crafty.e('Path').at(start.x, start.y);
            start.x += 1;
            Crafty.e('Path').at(start.x, start.y);
            this.generatePath(start, finish, 1);
        } else {
            this.pathIter++;
        }

        // Finish recursive path generation
        if (start.x == finish.x - 1 && start.y == finish.y) {
            start.x += 1;
            Crafty.e('Path').at(start.x, start.y);
            console.log("Finished \\o/");
            return;
        }

        var needToFindNext = true,
            startTime = new Date().getTime(),
            curPathIter = this.pathIter - 0,
            startCopy = {x: start.x, y: start.y};
        while(needToFindNext) {
            // timeout handling
            if (new Date().getTime() - startTime > 5000) {
                console.log("Timeout after 5 seconds!! current=" + curPathIter + " of total=" + this.pathIter);
                console.log("start.x=" + startCopy.x + "; start.y=" + startCopy.y);
                break;
            }

            // go up? or right? or down?
            var direction = Math.floor(Math.random() * 3);
            switch (direction) {
                case 0:
                    if (start.y > 1 &&
                            (lastDir === null || lastDir == 0 || lastDir == 1) &&
                            (preLastDir === null || preLastDir == 0 || preLastDir == 1) &&
                            (start.x < this.map_grid.width - 3 || finish.y < start.y)) {
                        start.y -= 1;
                        Crafty.e('Path').at(start.x, start.y);
                        needToFindNext = false;
                        this.generatePath(start, finish, direction, lastDir);
                    }
                    break;
                case 1:
                    if (start.x < this.map_grid.width - 2) {
                        start.x += 1;
                        Crafty.e('Path').at(start.x, start.y);
                        needToFindNext = false;
                        this.generatePath(start, finish, direction, lastDir);
                    }
                    break;
                case 2:
                    if (start.y < this.map_grid.height - 2 &&
                            (lastDir === null || lastDir == 2 || lastDir == 1) &&
                            (preLastDir === null || preLastDir == 2 || preLastDir == 1) &&
                            (start.x < this.map_grid.width - 3 || finish.y > start.y)) {
                        start.y += 1;
                        Crafty.e('Path').at(start.x, start.y);
                        needToFindNext = false;
                        this.generatePath(start, finish, direction, lastDir);
                    }
                    break;
            }
        }
    },

    start: function() {
        Crafty.init(Game.width(), Game.height());
        Crafty.background('rgb(249, 223, 125)');

        var start = {x: 0, y: 1 + Math.floor(Math.random() * (Game.map_grid.height - 2))},
            finish = {x: Game.map_grid.width - 1, y: 1 + Math.floor(Math.random() * (Game.map_grid.height - 2))};

        Game.generatePath({x: start.x, y: start.y}, finish);

        // Place a tree at every edge square on our grid of 16x16 tiles
        for (var x = 0; x < Game.map_grid.width; x++) {
            for (var y = 0; y < Game.map_grid.height; y++) {
                var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
                //console.log("At edge?: " + at_edge);

                if (at_edge && (x != start.x || y != start.y) && (x != finish.x || y != finish.y)) {
                    // Place a tree entity at the current tile
                    Crafty.e('Tree').at(x, y);
                }
            }
        }
    }
};