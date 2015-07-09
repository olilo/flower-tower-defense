function Path(config) {
    this.start = {x: 0, y: 1 + Math.floor(Math.random() * (config.height - 2))};
    this.finish = {x: config.width - 1, y: 1 + Math.floor(Math.random() * (config.height - 2))};
    this.width = config.width;
    this.height = config.height;

    // min and max length are not fix values, rather a guideline (actual min and max can vary by 10%)
    this.pathMinLength = config.pathMinLength || 0;
    this.pathMaxLength = config.pathMaxLength || Math.MAX_VALUE;

    this.path = new Array(config.width);
    for (var i = 0; i < config.width; i++) {
        this.path[i] = new Array(config.height);
        for (var y = 0; y < config.height; y++) {
            this.path[i][y] = false;
        }
    }

    this.occupied = new Array(config.width);
    for (i = 0; i < config.width; i++) {
        this.occupied[i] = new Array(config.height);
        for (y = 0; y < config.height; y++) {
            this.occupied[i][y] = false;
        }
    }
}

Path.prototype.copy = function(path) {
    this.start = path.start;
    this.finish = path.finish;
    this.width = path.width;
    this.height = path.height;

    this.pathMinLength = path.pathMinLength;
    this.pathMaxLength = path.pathMaxLength;

    // FIXME better make a copy of the arrays
    this.path = path.path;
    this.occupied = path.occupied;
};

Path.prototype.addToPath = function(point) {
    if (point.x < 0 || point.x > this.width - 1) {
        console.log("Illegal point!! at x=" + point.x + ";y=" + point.y);
        return;
    }
    this.path[point.x][point.y] = true;
    this.occupied[point.x][point.y] = true;
};

Path.prototype.getPath = function() {
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
        //console.log("Currently at: x=" + x + ", y=" + y);
        if (x < this.width - 1 && this.path[x + 1][y]) {
            x++;
            prevDirection = 1;
        } else if (y > 0 && this.path[x][y - 1] && prevDirection != 2) {
            y--;
            prevDirection = 0;
        } else if (y < this.height - 1 && this.path[x][y + 1] && prevDirection != 0) {
            y++;
            prevDirection = 2;
        } else {
            console.log("Help, invalid state at: x=" + x + ", y=" + y);
        }
        returnPath.push({x: x, y: y});
    }

    return returnPath;
};

Path.prototype.isOnEdge = function(x, y) {
    if (x == this.start.x && y == this.start.y) {
        return false;
    }
    if (x == this.finish.x && y == this.finish.y) {
        return false;
    }
    return x == 0 || x == this.width - 1 || y == 0 || y == this.height - 1;
};

Path.prototype.isOnPath = function(x, y) {
    if (typeof x == 'number' && typeof y == 'number' && x < this.path.length && x >= 0) {
        return this.path[x][y];
    } else {
        return false;
    }
};

Path.prototype.generatePath = function() {
    var startCopy = {x: this.start.x, y: this.start.y};
    this.generateNextPart(startCopy, 1);
};

Path.prototype.decideNextPartDirection = function (current, lastDir, preLastDir) {
    // go up? or right? or down?
    // but we never go back (been down one time, been down two times, never going back agaaain ^^)
    var direction = Math.floor(Math.random() * 3),
        needToFindNext = true;
    switch (direction) {
        case 0:
            if (current.y > 1 &&
                (lastDir === null || lastDir == 0 || lastDir == 1) &&
                (preLastDir === null || preLastDir == 0 || preLastDir == 1) &&
                (current.x < this.width - 3 || this.finish.y < current.y) &&
                (this.pathLength <= this.pathMaxLength || this.finish.y < current.y)) {

                current.y -= 1;
                this.addToPath(current);
                needToFindNext = false;
                this.generateNextPart(current, direction, lastDir);
            }
            break;
        case 1:
            if (current.x < this.width - 2 &&
                (current.x < this.width / 3 || this.pathLength >= this.pathMinLength || Math.random() < 0.2)) {

                current.x += 1;
                this.addToPath(current);
                needToFindNext = false;
                this.generateNextPart(current, direction, lastDir);
            }
            break;
        case 2:
            if (current.y < this.height - 2 &&
                (lastDir === null || lastDir == 2 || lastDir == 1) &&
                (preLastDir === null || preLastDir == 2 || preLastDir == 1) &&
                (current.x < this.width - 3 || this.finish.y > current.y) &&
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

Path.prototype.generateNextPart = function(current, lastDir, preLastDir) {
    // start: go right
    if (current.x == 0) {
        this.addToPath(current);
        current.x += 1;
        this.addToPath(current);
        this.pathLength = 2;
        setTimeout(this.generateNextPart(current, 1), 50);
        return;
    } else {
        this.pathLength++;
    }

    // Finish recursive path generation
    if (current.x == this.finish.x - 1 && current.y == this.finish.y) {
        current.x += 1;
        this.addToPath(current);
        console.log("Finished creating map \\o/ (length=" + this.pathLength + ")");
        return;
    }

    //noinspection PointlessArithmeticExpressionJS
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