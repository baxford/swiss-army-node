var module = require('./module.js');
var assert = require('assert');

// this is effectively global, making it accessible within the module
// globals such as this should be used with care.
minus = function(a, b) {
    return a - b;
};


// this should work as the module exports it
var add = module.add(1,2);
assert.equal(3, add);

assert.equal(module.all, 'all');

assert.throws(function () {
    // not available outside of the module.
    var sum = module.sum(1,2);
});

assert.throws(function () {
    // not available.
    var addition = module.addition(1,2);
});

// subtract is available, and the subtract function calls the global minus function from this module.
var diff = module.subtract(4, 2);
assert.equal(2, diff);