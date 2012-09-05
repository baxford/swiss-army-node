var chai = require('chai');
chai.Assertion.includeStack = true;
var expect = require('chai').expect;
var assert = require('chai').assert;
var conf = require('../config.js');
var log = conf.logger;
var dao = require('../dao/mysqlDao.js');
//setup our JSON schema validation
var JSV = require("JSV").JSV;
var env = JSV.createEnvironment();


//describe('#Countries', function(){
//    it('should get countries ok', function(done){
//        dao.getCountries(function(err, countries) {
//            log.debug(err + ', countries: ' + JSON.stringify(countries));
//            assert.ok(countries);
//            // now ensure that it's valid against the JSON schema
//            for (var ci in countries) {
//                var country = countries[ci];
//                log.debug('Validate Country JSON: ' + JSON.stringify(country));
//                validateAgainstSchema(country, '../schema/country.json');
//            }
//            done(err);
//        });
//    });
//});

/**
 * This makes sure that the response is valid against the standard response format.
 */
function validateAgainstSchema(json, schemaFile) {
    // convert to and from JSON to make sure it's just JSON and doesn't have other functions etc
   // json = JSON.parse(JSON.stringify(json));
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
