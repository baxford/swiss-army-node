/**
 * This is a table of error codes and associated messages.
 * All errors returned by the api should be present in this table, so they can be tracked and translated if needed.
 */
var assert = require('assert');

var errors = require('../index.js')('./errorTable.js');

var err = errors.errorByCode(null, 1001, 'details');

console.log('ERR: ' + JSON.stringify(err));

assert.ok(err);
assert.equal(err.code, 1001);