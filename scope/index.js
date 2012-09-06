var module = require('./module.js');
var assert = require('assert');

// this is effectively global, making it accessible to other modules
// globals such as this should be used with care.
minus = function(a, b) {
    return a - b;
};

console.log('start tests');

// these should work as the module exports them
var add = module.add(1,2);
assert.equal(3, add);
console.log('module.add(1,2) = 3');

assert.equal(module.all, 'all');
console.log('module.all === "all"');

// this should throw an error as the function is not available
assert.throws(function () {
    // not available outside of the module.
    console.log('checking if module.sum throws error');
    var sum = module.sum(1,2);
});

assert.throws(function () {
    // not available.
    console.log('checking if module.addition throws error');
    var addition = module.addition(1,2);
});

// subtract is available, and the subtract function calls the global minus function from this module.
var diff = module.subtract(4, 2);
assert.equal(2, diff);
console.log('module.sutract(4, 2) == 2');