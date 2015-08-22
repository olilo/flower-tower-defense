/**
 * State machine which allows putting, transitioning and getting current state.
 *
 * Created by Oliver on 06.08.2015.
 */

function StateMachine() {
    this.states = {};
    this.current = undefined;
    this.history = [];
}

StateMachine.prototype.setStart = function(input) {
    this.current = input;
    this.history.push(this.current);
};

StateMachine.prototype.produceFromState = function(fromState, input) {
    if (input === undefined || input === null) {
        return fromState;
    } else if (typeof input == 'object' || typeof input == 'array') {
        return fromState + "_$$_" + JSON.stringify(input);
    } else {
        return fromState + "_$$_" + input;
    }
};

StateMachine.prototype.put = function(fromState, input, toState, output, condition) {
    this.states[this.produceFromState(fromState, input)] = {state: toState, output: output, condition: condition};
};

StateMachine.prototype.get = function(index){
    if (index === undefined) {
        return this.current;
    } else {
        // get state at the given index position (negative values wrap around to the end,
        // like history[0], history[1], history[2], history [-2], history[-1] could be the history in correct order
        return this.history[(this.history.length + index) % this.history.length];
    }
};

StateMachine.prototype.resetBy = function(index) {
    var previous = this.current;
    for (var i = 0; i < index; i++) {
        this.current = this.history.pop();
    }
    return previous;
};

StateMachine.prototype.transition = function(input) {
    var result = this.states[this.produceFromState(this.current, input)];
    if (!result) {
        result = this.states[this.produceFromState(this.current, undefined)];
    }

    if (result !== undefined && (result.condition === undefined || result.condition.call())) {
        this.current = result.state;
        this.history.push(this.current);
        return result;
    } else {
        return undefined;
    }
};

/**
 * Returns the same output as StateMachine.transition, but without the side effects.
 * @param input
 * @returns {*}
 */
StateMachine.prototype.simulate = function(input) {
    var result = this.states[this.produceFromState(this.current, input)];
    if (!result) {
        result = this.states[this.produceFromState(this.current, undefined)];
    }

    if (result !== undefined && (result.condition === undefined || result.condition.call())) {
        return result;
    } else {
        return undefined;
    }
};