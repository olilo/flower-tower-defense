/**
 * State machine which allows putting, transitioning and getting current state.
 *
 * Created by Oliver on 06.08.2015.
 */

function StateMachine() {
    this.states = {};
    this.current = undefined
}

StateMachine.prototype.setStart = function(input) {
    this.current = input;
};

function produceStartState(startState, input) {
    if (input === undefined || input === null) {
        return startState;
    } else if (typeof input == 'object' || typeof input == 'array') {
        return startState + "_$$_" + JSON.stringify(input);
    } else {
        return startState + "_$$_" + input;
    }
}

StateMachine.prototype.put = function(startState, input, endState, output, condition) {
    this.states[produceStartState(startState, input)] = {state: endState, output: output, condition: condition};
};

StateMachine.prototype.get = function(){
    return this.current;
};

StateMachine.prototype.transition = function(input) {
    var result = this.states[produceStartState(this.current, input)];
    if (!result) {
        result = this.states[produceStartState(this.current, undefined)];
    }

    if (result !== undefined && (result.condition === undefined || result.condition.call())) {
        this.current = result.state;
        return result;
    } else {
        return undefined;
    }
};