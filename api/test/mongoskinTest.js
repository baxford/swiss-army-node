var chai = require('chai');
chai.Assertion.includeStack = true;
var expect = require('chai').expect;
var assert = require('chai').assert;
var conf = require('../config.js');
var log = conf.logger;
var dao = require('../dao/mongoskin.js');
//setup our JSON schema validation
var JSV = require("JSV").JSV;
var env = JSV.createEnvironment();


describe('#user CRUD()', function(){
    it('should save/read user ok', function(done){
        var user = {
            username: 'user1',
            email: 'email@email.com',
            familyName: 'family',
            givenName: 'given'
        };
        dao.saveOrUpdateUser(user, null, function(err, saved) {
            log.debug(err + ', saved User: ' + JSON.stringify(saved));
            assert.ok(saved._id);
            assert.equal(saved.username, user.username);
            // now ensure that it's valid against the JSON schema
            validateAgainstSchema(saved, '../schema/user.json');
            // now read the user and make sure we can get them from the db again.
            dao.getUser(saved._id, function(err, foundUser) {
                log.verbose('GOT USER: ' + JSON.stringify(foundUser));
                assert.ok(foundUser);
                validateAgainstSchema(foundUser, '../schema/user.json');
                assert.deepEqual(saved, foundUser);
                done(err);
            });
        });
    });
});

/**
 * This makes sure that the response is valid against the standard response format.
 */
function validateAgainstSchema(json, schemaFile) {
	var schema = require(schemaFile);
	var report = env.validate(json, schema);
	//check that JSON is valid against the schema
	for(var ei in report.errors) {
		log.debug('Error: ' +  JSON.stringify(report.errors[ei]));
	}
	assert.ok(report.errors.length === 0, JSON.stringify(report.errors));
	if (json.errors) {
		for (var ei in json.errors) {
			var error = json.errors[ei];
			validateErrorResponse(error);
		}
	}
};
