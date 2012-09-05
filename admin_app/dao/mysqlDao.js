var conf = require('../config.js');
var log = conf.logger;
var mysql = require("mysql");

exports.getCountries = function(done) {
    // for now just return nothing.
    done(null, null);
};