const DOWN = 0, BOTTOM = 0, RIGHT = 1, UP = 2, TOP = 2, LEFT = 3;

function pointsEqual(point1, point2) {
    return point1.x == point2.x && point1.y == point2.y;
}

function Path(config) {
    this.width = config.width;
    this.height = config.height;
    this.generateStartInColumn(0);
    this.generateFinishInColumn(config.width - 1);

    // min and max length are not fix values, rather a guideline (actual min and max can vary by 10%)
    this.pathMinLength = config.pathMinLength || 0;
    this.pathMaxLength = config.pathMaxLength || Math.MAX_VALUE;

    this.initialize();
}

Path.prototype.initialize = function() {
    this.top = 1;
    this.left = 1;
    this.bottom = this.height - 2;
    this.right = this.width - 2;

    this.path = new Array(this.width);
    for (var i = 0; i < this.width; i++) {
        this.path[i] = new Array(this.height);
        for (var y = 0; y < this.height; y++) {
            this.path[i][y] = false;
        }
    }

    this.occupied = new Array(this.width);
    for (i = 0; i < this.width; i++) {
        this.occupied[i] = new Array(this.height);
        for (y = 0; y < this.height; y++) {
            this.occupied[i][y] = false;
        }
    }

    this.pointPath = [];
};

Path.prototype.setFinish = function(x, y) {
    this.start = {x: x, y: y};
};

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
    this.pointPath = path.pointPath;
};

Path.prototype.addToPath = function(point) {
    if (point.x < 0 || point.x > this.width - 1) {
        console.log("Illegal point!! at x=" + point.x + ";y=" + point.y);
        return;
    }
    this.path[point.x][point.y] = true;
    this.occupied[point.x][point.y] = true;
    this.pointPath.push({x: point.x, y: point.y});
};

Path.prototype.addObstacle = function(point) {
    if (point.x < 0 || point.x > this.width - 1) {
        console.log("Illegal point for addObstacle!! at x=" + point.x + ";y=" + point.y);
        return;
    }
    this.occupied[point.x][point.y] = true;
};

Path.prototype.remove = function(point) {
    if (point.x < 0 || point.x > this.width - 1) {
        console.log("Illegal point!! at x=" + point.x + ";y=" + point.y);
        return;
    }
    this.path[point.x][point.y] = false;
    this.occupied[point.x][point.y] = false;

    this.pathLength--;

    for (var i = this.pointPath.length - 1; i >= 0; i--) {
        if (this.pointPath[i].x == point.x && this.pointPath[i].y == point.y) {
            this.pointPath.splice(i, 1);
            console.log('Removed ' + point.x + "/" + point.y + " from pointPath");
            return;
        }
    }
    console.log("Could not find point at " + point.x + ", " + point.y + " to remove.");
};

Path.prototype.getPath = function() {
    if (this.pointPath) {
        return this.pointPath;
    }

    // old getPath logic for backwards compatibility
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

Path.prototype.isOccupied = function(x, y) {
    if (typeof x == 'number' && typeof y == 'number' && x < this.occupied.length && x >= 0) {
        return this.occupied[x][y];
    } else {
        return false;
    }
};

Path.prototype.isOnPath = function(x, y) {
    if (typeof x == 'number' && typeof y == 'number' && x < this.path.length && x >= 0) {
        return this.path[x][y];
    } else {
        return false;
    }
};

Path.prototype.getInDirection = function(point, direction) {
    if (point.x < 0 || point.x > this.width - 1) {
        console.log("Illegal point!! at x=" + point.x + ";y=" + point.y);
        return;
    }

    // copy point so we don't change the input
    point = {x: point.x, y: point.y};
    if (direction == BOTTOM) {
        point.y++;
    } else if (direction == RIGHT) {
        point.x++;
    } else if (direction == TOP) {
        point.y--;
    } else if (direction == LEFT) {
        point.x--;
    } else {
        throw 'unknown direction';
    }

    return point;
};

Path.prototype.createPathElement = function(direction, ignoreBorders) {
    if (direction == BOTTOM && (this.current.y < this.bottom || ignoreBorders)) {
        this.current.y++;
        this.addToPath(this.current);
        this.pathLength++;
        return true;
    } else if (direction == RIGHT && (this.current.x < this.right || ignoreBorders)) {
        this.current.x++;
        this.addToPath(this.current);
        this.pathLength++;
        return true;
    } else if (direction == TOP && (this.current.y > this.top || ignoreBorders)) {
        this.current.y--;
        this.addToPath(this.current);
        this.pathLength++;
        return true;
    } else if (direction == LEFT && (this.current.x > this.left || ignoreBorders)) {
        this.current.x--;
        this.addToPath(this.current);
        this.pathLength++;
        return true;
    } else {
        return false;
    }
};

Path.prototype.createPathElementIgnoreBorders = function(direction) {
    this.createPathElement(direction, true);
};

Path.prototype.continuePathTo = function(x, y, ignoreBorders) {
    var directionX, directionY, startTime = new Date().getTime();

    if (x < this.current.x) {
        directionX = LEFT;
    } else {
        directionX = RIGHT;
    }

    if (y < this.current.y) {
        directionY = TOP;
    } else {
        directionY = BOTTOM;
    }

    while (x != this.current.x || y != this.current.y) {
        // timeout handling
        if (new Date().getTime() - startTime > 5000) {
            console.log("Timeout after 5 seconds!! total=" + this.pathLength);
            console.log("current.x=" + this.current.x + "; current.y=" + this.current.y);
            console.log("start.x=" + this.start.x + "; start.y=" + this.start.y);
            console.log("finish.x=" + this.finish.x + "; finish.y=" + this.finish.y);
            break;
        }

        if (x != this.current.x) {
            this.createPathElement(directionX, ignoreBorders);
        }

        if (y != this.current.y) {
            this.createPathElement(directionY, ignoreBorders);
        }
    }
};

Path.prototype.generateSpiral = function() {
    /// FIXME start and finish should be flexible and set outside of this method
    this.start = { x: 0, y: 1 };
    this.finish = { x: this.width - 1, y: this.height - 2 };
    this.current = {x: this.start.x, y: this.start.y};

    var direction = 0;

    // start off at the top left
    this.addToPath(this.current);
    this.pathLength = 1;
    this.createPathElementIgnoreBorders(RIGHT);

    // actually generate the spiral
    console.log("Generating inward spiral");
    direction = this.inwardSpiral(direction);
    console.log("Generating spiral intersection");
    direction = this.spiralIntersection(direction);
    console.log("Generating outward spiral");
    this.outwardSpiral(direction);

    // finish it all off
    this.createPathElementIgnoreBorders(RIGHT);

    console.log("Finished creating spiral, path length is: " + this.pathLength);
};

Path.prototype.inwardSpiral = function(direction) {
    var startTime = new Date().getTime();

    // adjust top and right to be a bit out of bounds, because we reduce them in the first round
    this.top = 1 - 2;
    this.right = this.width - 2 + 2;

    // create spiral by continuously reducing the borders of the bounding rectangle
    // this goes on until our borders collapse, leaving an empty bounding rectangle behind
    while (this.top < this.bottom - 1 && this.left < this.right - 1) {
        // timeout handling
        if (new Date().getTime() - startTime > 5000) {
            console.log("Timeout after 5 seconds!! total=" + this.pathLength);
            console.log("current.x=" + this.current.x + "; current.y=" + this.current.y);
            console.log("start.x=" + this.start.x + "; start.y=" + this.start.y);
            console.log("finish.x=" + this.finish.x + "; finish.y=" + this.finish.y);
            break;
        }

        // create path element; if that fails, rotate direction by 90° and
        // reduce border in that direction to continue spiral
        if (!this.createPathElement(direction)) {
            // rotate direction counter clockwise (e.g. BOTTOM to RIGHT)
            direction = (direction + 1) % 4;

            // reduce border into which we will go next
            switch (direction) {
                case BOTTOM:
                    this.bottom -= 4;
                    break;
                case RIGHT:
                    this.right -= 4;
                    break;
                case TOP:
                    this.top += 4;
                    break;
                case LEFT:
                    this.left += 4;
                    break;
            }
        }
    }

    return direction;
};

Path.prototype.spiralIntersection = function(direction) {
    // shift borders so that the path in outwardSpiral spirals
    // into the gaps that inwardSpiral created (or rather left behind)
    switch (direction) {
        case BOTTOM:
            this.top += 2;
            this.bottom += 2;
            this.left -= 2;
            this.right -= 2;
            break;
        case RIGHT:
            this.top += 2;
            this.bottom += 2;
            this.left += 2;
            this.right += 2;
            break;
        case TOP:
            this.top -= 2;
            this.bottom -= 2;
            this.left += 2;
            this.right += 2;
            break;
        case LEFT:
            this.top -= 2;
            this.bottom -= 2;
            this.left -= 2;
            this.right -= 2;
            break;
    }

    // rotate direction clockwise (e.g. BOTTOM to LEFT)
    direction = (direction + 3) % 4;

    // continue path for 2 more steps to fill the gap
    this.createPathElementIgnoreBorders(direction);
    this.createPathElementIgnoreBorders(direction);

    return direction;
};

Path.prototype.outwardSpiral = function(direction) {
    var startTime = new Date().getTime();

    // create spiral by continuously expanding the borders of the bounding rectangle
    // this goes on until we reach the finish point
    while (this.current.x < this.finish.x - 1 || this.current.y < this.finish.y) {
        // timeout handling
        if (new Date().getTime() - startTime > 5000) {
            console.log("Timeout after 5 seconds!! total=" + this.pathLength);
            console.log("current.x=" + this.current.x + "; current.y=" + this.current.y);
            console.log("start.x=" + this.start.x + "; start.y=" + this.start.y);
            console.log("finish.x=" + this.finish.x + "; finish.y=" + this.finish.y);
            break;
        }

        // create path element; if that fails, rotate direction by 90° and
        // expand border in that direction to continue spiral
        if (!this.createPathElement(direction)) {
            // rotate direction clockwise (e.g. BOTTOM to LEFT)
            direction = (direction + 3) % 4;

            // expand border into which we will go next
            switch (direction) {
                case BOTTOM:
                    this.bottom += 4;
                    break;
                case RIGHT:
                    this.right += 4;
                    break;
                case TOP:
                    this.top -= 4;
                    break;
                case LEFT:
                    this.left -= 4;
                    break;
            }
        }
    }

    return direction;
};

Path.prototype.generateLabyrinth = function() {
    this.current = {x: this.start.x, y: this.start.y};
    this.addToPath(this.current);
    this.pathLength = 1;

    this.left = 3;
    this.top = 3;
    this.right = this.width - 4;
    this.bottom = this.height - 4;

    var stateMachine = new StateMachine(),
        startTime = new Date().getTime(),
        retryCount = 0;
    stateMachine.setStart('start');

    if (this.current.x == 0) {
        stateMachine.put('start', undefined, 'goright', 1);
    } else if (this.current.y == 0) {
        stateMachine.put('start', undefined, 'godown', 0);
    } else if (this.current.y == this.height - 1) {
        stateMachine.put('start', undefined, 'goup', 2);
    } else if (this.current.x == this.width - 1) {
        stateMachine.put('start', undefined, 'goleft', 3);
    }

    stateMachine.put('goright', DOWN, 'godown_or_right');
    stateMachine.put('goright', RIGHT, 'goright');
    stateMachine.put('goright', UP, 'goup_or_right');

    stateMachine.put('godown', RIGHT, 'godown_or_right');
    stateMachine.put('godown', DOWN, 'godown');
    stateMachine.put('godown', LEFT, 'godown_or_left');

    stateMachine.put('goup', RIGHT, 'goup_or_right');
    stateMachine.put('goup', UP, 'goup');
    stateMachine.put('goup', LEFT, 'goup_or_left');

    stateMachine.put('goleft', DOWN, 'godown_or_left');
    stateMachine.put('goleft', LEFT, 'goleft');
    stateMachine.put('goleft', UP, 'goup_or_left');

    stateMachine.put('godown_or_left', DOWN, 'godown');
    stateMachine.put('godown_or_left', LEFT, 'goleft');

    stateMachine.put('godown_or_right', DOWN, 'godown');
    stateMachine.put('godown_or_right', RIGHT, 'goright');

    stateMachine.put('goup_or_left', UP, 'goup');
    stateMachine.put('goup_or_left', LEFT, 'goleft');

    stateMachine.put('goup_or_right', RIGHT, 'goright');
    stateMachine.put('goup_or_right', UP, 'goup');

    while (this.pathLength < 0.95 * this.pathMaxLength &&
            !pointsEqual(this.getInDirection(this.current, UP), this.finish) &&
            !pointsEqual(this.getInDirection(this.current, RIGHT), this.finish) &&
            !pointsEqual(this.getInDirection(this.current, DOWN), this.finish) &&
            !pointsEqual(this.getInDirection(this.current, LEFT), this.finish)) {
        // timeout handling
        if (new Date().getTime() - startTime > 5000) {
            console.log("Timeout after 5 seconds!! total=" + this.pathLength);
            console.log("current.x=" + this.current.x + "; current.y=" + this.current.y);
            console.log("start.x=" + this.start.x + "; start.y=" + this.start.y);
            console.log("finish.x=" + this.finish.x + "; finish.y=" + this.finish.y);
            break;
        }

        var direction = Math.floor(Math.random() * 4),
            point1 = this.getInDirection(this.current, direction),
            point2 = this.getInDirection(point1, direction),
            point3 = this.getInDirection(point1, (direction + 1) % 4),
            point4 = this.getInDirection(point1, (direction + 3) % 4);

        // backtracking
        if (retryCount > 15) {
            this.remove(this.current);
            this.addObstacle(this.current);
            stateMachine.resetBy(1);

            // we search for the next adjacent path tile and move there.
            // this works because in this part we don't let the path cross itself.
            if (this.isOnPath(this.current.x - 1, this.current.y)) {
                this.current.x--;
            } else if (this.isOnPath(this.current.x + 1, this.current.y)) {
                this.current.x++;
            } else if (this.isOnPath(this.current.x, this.current.y - 1)) {
                this.current.y--;
            } else if (this.isOnPath(this.current.x, this.current.y + 1)) {
                this.current.y++;
            }

            retryCount = 0;
            continue;
        }

        retryCount++;

        if (this.isOccupied(point1.x, point1.y) || this.isOnPath(point2.x, point2.y) ||
            this.isOnPath(point3.x, point3.y) || this.isOnPath(point4.x, point4.y)) {

            continue;
        }

        if (this.pathLength >= 0.9 * this.pathMinLength) {
            this.left = 1;
            this.top = 1;
            this.right = this.width - 2;
            this.bottom = this.height - 2;

            if (direction == RIGHT && this.finish.x == 0) {
                continue;
            }
        }

        var result = stateMachine.transition(direction), created;
        if (result !== undefined && result.output !== undefined) {
            created = this.createPathElement(result.output);
        } else if (result !== undefined) {
            created = this.createPathElement(direction);
        }

        if (created) {
            retryCount = 0;
        }
    }

    // continue to finish
    var finishX = Math.max(this.left, Math.min(this.finish.x, this.right)),
        finishY = Math.max(this.top, Math.min(this.finish.y, this.bottom));

    this.continuePathTo(finishX, finishY);
    this.continuePathTo(this.finish.x, this.finish.y, true);

    if (this.pathLength >= this.pathMinLength) {
        console.log("Finished creating random labyrinth path \\o/ (length=" + this.pathLength + ")");
    } else {
        this.initialize();
        this.generateLabyrinth();
    }
};


Path.prototype.generatePath = function() {
    this.current = {x: this.start.x, y: this.start.y};
    this.horizontal = this.start.x == 0;
    this.generateNextPart();
};

Path.prototype.generatePartInRandomDirection = function (lastDir, preLastDir) {
    // go up? or right? or down?
    // but we never go back (been down one time, been down two times, never going back agaaain ^^)
    var direction = Math.floor(Math.random() * 3),
        toFinishAttr = this.horizontal ? 'x' : 'y',
        varAttr = this.horizontal ? 'y' : 'x',
        boundary1 = this.horizontal ? 'width' : 'height';

    // TODO transform this switch statement into using a state machine
    switch (direction) {
        case 0:
            if ((lastDir === null || lastDir == 0 || lastDir == 1) &&
                (preLastDir === null || preLastDir == 0 || preLastDir == 1) &&
                (this.current[toFinishAttr] < this[boundary1] - 3 || this.finish[varAttr] < this.current[varAttr]) &&
                (this.pathLength <= this.pathMaxLength || this.finish[varAttr] < this.current[varAttr])) {

                if (this.createPathElement(this.horizontal ? TOP : LEFT)) {
                    this.generateNextPart(direction, lastDir);
                    return false;
                }
            }
            break;
        case 1:
            if (this.current[toFinishAttr] < this[boundary1] / 3 || this.pathLength >= this.pathMinLength || Math.random() < 0.05) {

                if (this.createPathElement(this.horizontal ? RIGHT : BOTTOM)) {
                    this.generateNextPart(direction, lastDir);
                    return false;
                }
            }
            break;
        case 2:
            if ((lastDir === null || lastDir == 2 || lastDir == 1) &&
                (preLastDir === null || preLastDir == 2 || preLastDir == 1) &&
                (this.current[toFinishAttr] < this[boundary1] - 3 || this.finish[varAttr] > this.current[varAttr]) &&
                (this.pathLength <= this.pathMaxLength || this.finish[varAttr] > this.current[varAttr])) {

                if (this.createPathElement(this.horizontal ? BOTTOM : RIGHT)) {
                    this.generateNextPart(direction, lastDir);
                    return false;
                }
            }
            break;
    }

    return true;
};

Path.prototype.generateNextPart = function(lastDir, preLastDir) {
    var needToFindNext = true,
        startTime = new Date().getTime(),
        toFinishAttr = this.horizontal ? 'x' : 'y',
        varAttr = this.horizontal ? 'y' : 'x';

    // start: go right
    if (this.current.x == this.start.x && this.current.y == this.start.y) {
        console.log('Started generating path ' + (this.horizontal ? 'horizontally' : 'vertically'));
        this.addToPath(this.current);
        this.pathLength = 1;
        this.createPathElement(this.horizontal ? RIGHT : BOTTOM);
        setTimeout(this.generateNextPart(RIGHT), 50);
        return;
    }

    // Finish recursive path generation
    if (this.current[toFinishAttr] == this.finish[toFinishAttr] - 1 && this.current[varAttr] == this.finish[varAttr]) {
        this.current[toFinishAttr] += 1;
        this.addToPath(this.current);
        console.log("Finished creating random path \\o/ (length=" + this.pathLength + ")");
        return;
    }

    // go in a random direction (we repeat this step until we found a direction we can really go to)
    while(needToFindNext) {
        // timeout handling
        if (new Date().getTime() - startTime > 5000) {
            console.log("Timeout after 5 seconds!! total=" + this.pathLength);
            console.log("current.x=" + this.current.x + "; current.y=" + this.current.y);
            console.log("start.x=" + this.start.x + "; start.y=" + this.start.y);
            console.log("finish.x=" + this.finish.x + "; finish.y=" + this.finish.y);
            break;
        }

        needToFindNext = this.generatePartInRandomDirection(lastDir, preLastDir);
    }
};