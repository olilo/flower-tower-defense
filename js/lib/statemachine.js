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

StateMachine.prototype.get = function(){
    return this.current;
};

StateMachine.prototype.set = function(state) {
    var previous = this.current;
    this.current = state;
    this.history.push(this.current);
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