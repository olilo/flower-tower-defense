function Path(config) {
    this.width = config.width;
    this.height = config.height;
    this.generateStartInColumn(0);
    this.generateFinishInColumn(config.width - 1);

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

Path.prototype.generateStartInColumn = function(column) {
    this.start = {x: column, y: 1 + Math.floor(Math.random() * (this.height - 2))};
};

Path.prototype.generateStartOnRow = function(row) {
    this.start = {x: 1 + Math.floor(Math.random() * (this.width - 2)), y: row};
};

Path.prototype.generateFinishInColumn = function(column) {
    this.finish = {x: column, y: 1 + Math.floor(Math.random() * (this.height - 2))};
};

Path.prototype.generateFinishOnRow = function(row) {
    this.finish = {x: this.start.x + Math.floor(Math.random() * (this.width - this.start.x - 1)), y: row};
};

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
        if (x < this.width - 1 && this.path[x + 1][y] && prevDirection != 3) {
            x++;
            prevDirection = 1;
        } else if (y > 0 && this.path[x][y - 1] && prevDirection != 2) {
            y--;
            prevDirection = 0;
        } else if (y < this.height - 1 && this.path[x][y + 1] && prevDirection != 0) {
            y++;
            prevDirection = 2;
        } else if (x > 0 && this.path[x - 1][y] && prevDirection != 1) {
            x--;
            prevDirection = 3;
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
    this.generateNextPart(startCopy, 1, undefined, this.start.x == 0);
};

Path.prototype.generateSpiral = function() {
    this.start = { x: 0, y: 1 };
    this.finish = { x: this.width - 1, y: this.height - 2 };

    var current = {x: this.start.x, y: this.start.y}, direction = 0, startTime = new Date().getTime(),
        top = 1 - 2, left = 1, bottom = this.height - 2, right = this.width - 2 + 2;

    this.addToPath(current);
    current.x += 1;
    this.addToPath(current);
    this.pathLength = 2;

    // inward spiral
    while (top < bottom - 1 && left < right - 1) {
        // timeout handling
        if (new Date().getTime() - startTime > 5000) {
            console.log("Timeout after 5 seconds!! total=" + this.pathLength);
            console.log("current.x=" + current.x + "; current.y=" + current.y);
            console.log("start.x=" + this.start.x + "; start.y=" + this.start.y);
            console.log("finish.x=" + this.finish.x + "; finish.y=" + this.finish.y);
            break;
        }

        if (direction == 0 && current.y < bottom) {
            current.y++;
            this.addToPath(current);
            this.pathLength++;
        } else if (direction == 1 && current.x < right) {
            current.x++;
            this.addToPath(current);
            this.pathLength++;
        } else if (direction == 2 && current.y > top) {
            current.y--;
            this.addToPath(current);
            this.pathLength++;
        } else if (direction == 3 && current.x > left) {
            current.x--;
            this.addToPath(current);
            this.pathLength++;
        } else {
            direction = (direction + 1) % 4;
            switch (direction) {
                case 0:
                    bottom -= 4;
                    break;
                case 1:
                    right -= 4;
                    break;
                case 2:
                    top += 4;
                    break;
                case 3:
                    left += 4;
                    break;
            }
        }
    }

    // intersection
    switch (direction) {
        case 0:
            top += 2;
            bottom += 2;
            left -= 2;
            right -= 2;
            break;
        case 1:
            right += 2;
            top += 2;
            bottom += 2;
            left += 2;
            break;
        case 2:
            top -= 2;
            bottom -= 2;
            left += 2;
            right += 2;
            break;
        case 3:
            top -= 2;
            bottom -= 2;
            left -= 2;
            right -= 2;
            break;
    }
    direction = (direction + 3) % 4;
    if (direction == 0) {
        current.y++;
        this.addToPath(current);
        this.pathLength++;
        current.y++;
        this.addToPath(current);
        this.pathLength++;
    } else if (direction == 1) {
        current.x++;
        this.addToPath(current);
        this.pathLength++;
        current.x++;
        this.addToPath(current);
        this.pathLength++;
    } else if (direction == 2) {
        current.y--;
        this.addToPath(current);
        this.pathLength++;
        current.y--;
        this.addToPath(current);
        this.pathLength++;
    } else if (direction == 3) {
        current.x--;
        this.addToPath(current);
        this.pathLength++;
        current.x--;
        this.addToPath(current);
        this.pathLength++;
    }

    // outward spiral
    startTime = new Date().getTime();
    while (current.x < this.finish.x - 1 || current.y < this.finish.y) {
        // timeout handling
        if (new Date().getTime() - startTime > 5000) {
            console.log("Timeout after 5 seconds!! total=" + this.pathLength);
            console.log("current.x=" + current.x + "; current.y=" + current.y);
            console.log("start.x=" + this.start.x + "; start.y=" + this.start.y);
            console.log("finish.x=" + this.finish.x + "; finish.y=" + this.finish.y);
            break;
        }

        if (direction == 0 && current.y < bottom) {
            current.y++;
            this.addToPath(current);
            this.pathLength++;
        } else if (direction == 1 && current.x < right) {
            current.x++;
            this.addToPath(current);
            this.pathLength++;
        } else if (direction == 2 && current.y > top) {
            current.y--;
            this.addToPath(current);
            this.pathLength++;
        } else if (direction == 3 && current.x > left) {
            current.x--;
            this.addToPath(current);
            this.pathLength++;
        } else {
            direction = (direction + 3) % 4;
            switch (direction) {
                case 0:
                    bottom += 4;
                    break;
                case 1:
                    right += 4;
                    break;
                case 2:
                    top -= 4;
                    break;
                case 3:
                    left -= 4;
                    break;
            }
        }
    }

    current.x++;
    this.addToPath(current);
    this.pathLength++;

};

Path.prototype.decideNextPartDirection = function (current, lastDir, preLastDir, horizontal) {
    if (horizontal === undefined) {
        horizontal = true;
    }

    // go up? or right? or down?
    // but we never go back (been down one time, been down two times, never going back agaaain ^^)
    var direction = Math.floor(Math.random() * 3),
        needToFindNext = true,
        toFinishAttr = horizontal ? 'x' : 'y',
        varAttr = horizontal ? 'y' : 'x',
        boundary1 = horizontal ? 'width' : 'height',
        boundary2 = horizontal ? 'height' : 'width';
    switch (direction) {
        case 0:
            if (current[toFinishAttr] > 1 && current[varAttr] > 1 &&
                (lastDir === null || lastDir == 0 || lastDir == 1) &&
                (preLastDir === null || preLastDir == 0 || preLastDir == 1) &&
                (current[toFinishAttr] < this[boundary1] - 3 || this.finish[varAttr] < current[varAttr]) &&
                (this.pathLength <= this.pathMaxLength || this.finish[varAttr] < current[varAttr])) {

                current[varAttr] -= 1;

                this.addToPath(current);
                needToFindNext = false;
                this.generateNextPart(current, direction, lastDir, horizontal);
            }
            break;
        case 1:
            if (current[toFinishAttr] < this[boundary1] - 2 &&
                (current[toFinishAttr] < this[boundary1] / 3 || this.pathLength >= this.pathMinLength || Math.random() < 0.05)) {

                current[toFinishAttr] += 1;
                this.addToPath(current);
                needToFindNext = false;
                this.generateNextPart(current, direction, lastDir, horizontal);
            }
            break;
        case 2:
            if (current[toFinishAttr] > 1 && current[varAttr] < this[boundary2] - 2 &&
                (lastDir === null || lastDir == 2 || lastDir == 1) &&
                (preLastDir === null || preLastDir == 2 || preLastDir == 1) &&
                (current[toFinishAttr] < this[boundary1] - 3 || this.finish[varAttr] > current[varAttr]) &&
                (this.pathLength <= this.pathMaxLength || this.finish[varAttr] > current[varAttr])) {

                current[varAttr] += 1;

                this.addToPath(current);
                needToFindNext = false;
                this.generateNextPart(current, direction, lastDir, horizontal);
            }
            break;
    }
    return needToFindNext;
};

Path.prototype.generateNextPart = function(current, lastDir, preLastDir, horizontal) {
    if (horizontal === undefined) {
        horizontal = true;
    }

    //noinspection PointlessArithmeticExpressionJS
    var needToFindNext = true,
        startTime = new Date().getTime(),
        curPathIter = this.pathLength - 0,
        startCopy = {x: current.x, y: current.y},
        toFinishAttr = horizontal ? 'x' : 'y',
        varAttr = horizontal ? 'y' : 'x';

    // start: go right
    if (current[toFinishAttr] == 0) {
        console.log('Started generating path ' + (horizontal ? 'horizontally' : 'vertically'));
        this.addToPath(current);
        current[toFinishAttr] += 1;
        this.addToPath(current);
        this.pathLength = 2;
        setTimeout(this.generateNextPart(current, 1, undefined, horizontal), 50);
        return;
    } else {
        this.pathLength++;
    }

    // Finish recursive path generation
    if (current[toFinishAttr] == this.finish[toFinishAttr] - 1 && current[varAttr] == this.finish[varAttr]) {
        current[toFinishAttr] += 1;
        this.addToPath(current);
        console.log("Finished creating path \\o/ (length=" + this.pathLength + ")");
        return;
    }

    while(needToFindNext) {
        // timeout handling
        if (new Date().getTime() - startTime > 5000) {
            console.log("Timeout after 5 seconds!! current=" + curPathIter + " of total=" + this.pathLength);
            console.log("start.x=" + startCopy.x + "; start.y=" + startCopy.y);
            console.log("finish.x=" + this.finish.x + "; finish.y=" + this.finish.y);
            break;
        }

        needToFindNext = this.decideNextPartDirection(current, lastDir, preLastDir, horizontal);
    }
};