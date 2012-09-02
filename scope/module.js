
// not available outside of this module.
var moduleVar = 'mine';

// exported, so should be available.
exports.all = 'all';

// private function
var sum = function(a, b) {
    return a + b;
};

// global, but not accessible in the parent module that is importing this module.
addition = function(a, b) {
    return sum(a, b);
};

exports.add = function(a, b) {
    return addition(a, b);
};

exports.subtract = function(a, b) {
    // call the global minus function that is defined in the parent module.
    return minus(a, b);
};