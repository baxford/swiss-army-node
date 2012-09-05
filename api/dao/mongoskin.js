var errors = require('node-errors')('../errorTable.js');

var mongo = require('mongoskin');
var conf = require('../config.js');
var log = conf.logger;
var db = mongo.db(conf.mongo.url);


exports.getUsers = function(done) {
    db.collection('users').find({}).toArray(function(err, users) {
        log.debug('err: ' + err);
        if (err) {
            done(err);
        } else {
            done(null, users);
        }
    });
};

exports.saveOrUpdateUser = function(user, id, done) {
    log.debug('Mongoskin Saving User: ' + JSON.stringify(user));
    // TODO, implement the update if ID is provided.
    db.collection('users').insert(user, {}, function(err, result) {
        log.debug(err + ' = err, result= ' + result);
        if (err) {
            done(err);
        } else if (!result) {
            done(err, null);
        } else {
            var user = result[0];
            done(null, user);
        }
    });
};

exports.getUser = function(id, done) {
    log.debug('userId: ' + id);
    db.collection('users').findById(id, function(err, user) {
        log.verbose("found user: " + JSON.stringify(user));
        if (err) {
            done(err);
        } else {
            done(null, user);
        }
    });
};