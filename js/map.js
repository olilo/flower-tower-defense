function Map() {
    this.start = {x: 0, y: 1 + Math.floor(Math.random() * (Game.map_grid.height - 2))};
    this.finish = {x: Game.map_grid.width - 1, y: 1 + Math.floor(Math.random() * (Game.map_grid.height - 2))};

    // TODO make pathMinLength configurable
    // min and max length are not fix values, rather a guideline (actual min and max can vary by 10%)
    this.pathMinLength = 80;
    this.pathMaxLength = 90;

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

Map.prototype.addObject = function(type, x, y) {
    this.occupied[x][y] = true;
    return Crafty.e(type).at(x, y);
};

Map.prototype.addToPath = function(point) {
    if (point.x < 0 || point.x > Game.map_grid.width - 1) {
        console.log("Illegal point!! at x=" + point.x + ";y=" + point.y);
        return;
    }
    Crafty.e('Path').at(point.x, point.y);
    this.path[point.x][point.y] = true;
    this.occupied[point.x][point.y] = true;
};

Map.prototype.getPath = function() {
    var returnPath = [this.start];
    var x = this.start.x,
        y = this.start.y,
        prevDirection = 1,
        startTime = new Date().getTime();

    while (x != this.finish.x || y != this.finish.y) {
        if (new Date().getTime() - startTime > 5000) {
            console.log("Timeout!!!");
            break;
        }
        console.log("Currently at: x=" + x + ", y=" + y);
        if (x < Game.map_grid.width - 1 && this.path[x + 1][y]) {
            x++;
            prevDirection = 1;
        } else if (y > 0 && this.path[x][y - 1] && prevDirection != 2) {
            y--;
            prevDirection = 0;
        } else if (y < Game.map_grid.height - 1 && this.path[x][y + 1] && prevDirection != 0) {
            y++;
            prevDirection = 2;
        } else {
            console.log("Help, invalid state at: x=" + x + ", y=" + y);
        }
        returnPath.push({x: x, y: y});
    }

    return returnPath;
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

Map.prototype.decideNextPartDirection = function (current, lastDir, preLastDir) {
    // go up? or right? or down?
    // but we never go back (too complicated - been down one time, been down two times, never going back agaaain ^^)
    var direction = Math.floor(Math.random() * 3),
        needToFindNext = true;
    switch (direction) {
        case 0:
            if (current.y > 1 &&
                (lastDir === null || lastDir == 0 || lastDir == 1) &&
                (preLastDir === null || preLastDir == 0 || preLastDir == 1) &&
                (current.x < Game.map_grid.width - 3 || this.finish.y < current.y) &&
                (this.pathLength <= this.pathMaxLength || this.finish.y < current.y)) {

                current.y -= 1;
                this.addToPath(current);
                needToFindNext = false;
                this.generateNextPart(current, direction, lastDir);
            }
            break;
        case 1:
            if (current.x < Game.map_grid.width - 2 &&
                (current.x < Game.map_grid.width / 3 || this.pathLength >= this.pathMinLength || Math.random() < 0.2)) {

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
                (current.x < Game.map_grid.width - 3 || this.finish.y > current.y) &&
                (this.pathLength <= this.pathMaxLength || this.finish.y > current.y)) {

                current.y += 1;
                this.addToPath(current);
                needToFindNext = false;
                this.generateNextPart(current, direction, lastDir);
            }
            break;
    }
    return needToFindNext;
};

Map.prototype.generateNextPart = function(current, lastDir, preLastDir) {
    // start: go right
    if (current.x == 0) {
        this.addToPath(current);
        current.x += 1;
        this.addToPath(current);
        this.pathLength = 2;
        this.generateNextPart(current, 1);
        return;
    } else {
        this.pathLength++;
    }

    // Finish recursive path generation
    if (current.x == this.finish.x - 1 && current.y == this.finish.y) {
        current.x += 1;
        this.addToPath(current);
        console.log("Finished \\o/ (length=" + this.pathLength + ")");
        return;
    }

    var needToFindNext = true,
        startTime = new Date().getTime(),
        curPathIter = this.pathLength - 0,
        startCopy = {x: current.x, y: current.y};
    while(needToFindNext) {
        // timeout handling
        if (new Date().getTime() - startTime > 5000) {
            console.log("Timeout after 5 seconds!! current=" + curPathIter + " of total=" + this.pathLength);
            console.log("start.x=" + startCopy.x + "; start.y=" + startCopy.y);
            console.log("finish.x=" + this.finish.x + "; finish.y=" + this.finish.y);
            break;
        }

        needToFindNext = this.decideNextPartDirection(current, lastDir, preLastDir);
    }
};