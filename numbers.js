var assert = require('assert');


// integers about a certain value are rounded by javascript.
var bigint1 = 839299365868340223;
var bigint2 = 839299365868340200;

console.log(bigint1 + ' should not equal ' + bigint2);
if (bigint1 == bigint2) {
    console.log('Error, numbers are different but deemed equal');
} else {
    console.log('Correct, the numbers are different');
}


// Floating point numbers can have rounding errors
var a = 0.1;
var b = 0.2;  
if (a + b == .3) {
    console.log('No floating point error: ' + a + ' + ' + b + ' = is exactly .3');
} else {
    console.log('Floating point error: ' + a + ' + ' + b + ' = ' + (a + b));
}


// rounding - javascript uses Half-up, Other languages use Half-to-even
function round(num, places) {
    var mult = Math.pow(10, places);
    return Math.round(num * mult) / mult;
}
assert.equal(0.5, round(.495, 2));
assert.equal(0.49, round(.494, 2));
assert.equal(0.48, round(.476, 2));
assert.equal(0.48, round(.475, 2));
assert.equal(0.47, round(.474, 2));


// parseInt - make sure ti include the radix

var num1 = parseInt('08');
var num2 = parseInt('08', 10);
if (num1 == num2) {
    console.log('PareInt result: ' + num1 + ' = ' + num2);
} else {
    console.log('ParseInt result: ' + num1 + ' != ' + num2);
}