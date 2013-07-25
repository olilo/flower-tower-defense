function Map() {
    this.start = {x: 0, y: 1 + Math.floor(Math.random() * (Game.map_grid.height - 2))};
    this.finish = {x: Game.map_grid.width - 1, y: 1 + Math.floor(Math.random() * (Game.map_grid.height - 2))};

    this.path = new Array(Game.map_grid.width);
    for (var i = 0; i < Game.map_grid.width; i++) {
        this.path[i] = new Array(Game.map_grid.height);
        for (var y = 0; y < Game.map_grid.height; y++) {
            this.path[i][y] = false;
        }
    }

    this.occupied = new Array(Game.map_grid.width);
    for (i = 0; i < Game.map_grid.width; i++) {
        this.occupied[i] = new Array(Game.map_grid.height);
        for (y = 0; y < Game.map_grid.height; y++) {
            this.occupied[i][y] = false;
        }
    }
}

Map.prototype.addObject = function(point) {
    this.occupied[point.x][point.y] = true;
};

Map.prototype.addToPath = function(point) {
    Crafty.e('Path').at(point.x, point.y);
    this.path[point.x][point.y] = true;
    this.occupied[point.x][point.y] = true;
};

Map.prototype.isOnPath = function(x, y) {
    if (typeof x == 'number' && typeof y == 'number' && x < this.path.length && x >= 0) {
        return this.path[x][y];
    } else {
        return false;
    }
};

Map.prototype.generatePath = function() {
    var startCopy = {x: this.start.x, y: this.start.y};
    this.generateNextPart(startCopy, 1);
};

Map.prototype.generateNextPart = function(current, lastDir, preLastDir) {
    // start: go right
    if (current.x == 0) {
        this.pathIter = 0;
        this.addToPath(current);
        current.x += 1;
        this.addToPath(current);
        this.generateNextPart(current, 1);
        return;
    } else {
        this.pathIter++;
    }

    // Finish recursive path generation
    if (current.x == this.finish.x - 1 && current.y == this.finish.y) {
        current.x += 1;
        this.addToPath(current);
        console.log("Finished \\o/");
        return;
    }

    var needToFindNext = true,
        startTime = new Date().getTime(),
        curPathIter = this.pathIter - 0,
        startCopy = {x: current.x, y: current.y};
    while(needToFindNext) {
        // timeout handling
        if (new Date().getTime() - startTime > 5000) {
            console.log("Timeout after 5 seconds!! current=" + curPathIter + " of total=" + this.pathIter);
            console.log("start.x=" + startCopy.x + "; start.y=" + startCopy.y);
            console.log("finish.x=" + this.finish.x + "; finish.y=" + this.finish.y);
            break;
        }

        // go up? or right? or down?
        var direction = Math.floor(Math.random() * 3);
        switch (direction) {
            case 0:
                if (current.y > 1 &&
                    (lastDir === null || lastDir == 0 || lastDir == 1) &&
                    (preLastDir === null || preLastDir == 0 || preLastDir == 1) &&
                    (current.x < Game.map_grid.width - 3 || this.finish.y < current.y)) {
                    current.y -= 1;
                    this.addToPath(current);
                    needToFindNext = false;
                    this.generateNextPart(current, direction, lastDir);
                }
                break;
            case 1:
                if (current.x < Game.map_grid.width - 2) {
                    current.x += 1;
                    this.addToPath(current);
                    needToFindNext = false;
                    this.generateNextPart(current, direction, lastDir);
                }
                break;
            case 2:
                if (current.y < Game.map_grid.height - 2 &&
                    (lastDir === null || lastDir == 2 || lastDir == 1) &&
                    (preLastDir === null || preLastDir == 2 || preLastDir == 1) &&
                    (current.x < Game.map_grid.width - 3 || this.finish.y > current.y)) {
                    current.y += 1;
                    this.addToPath(current);
                    needToFindNext = false;
                    this.generateNextPart(current, direction, lastDir);
                }
                break;
        }
    }
};