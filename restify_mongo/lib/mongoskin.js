var errors = require('node-errors')('../errorTable.js');

var mongo = require('mongoskin');
var conf = require('../config.js');
var log = conf.logger;
var db = mongo.db(conf.mongo.url);


exports.getUsers = function(req, res) {
    db.collection('users').find({}).toArray(function(err, result) {
        log.debug('err: ' + err);
        if (err) {
            res.send(400, errors.errorByCode(err, 2001, 'unable to get users'));
        } else {
            for (var ui in result) {
                var row = result[ui];
                log.debug('users: ' + row);
            }
            res.send(200, result);
        }
    });
};

exports.saveOrUpdateUser = function(req, res) {
    var user = {
            familyName: req.params.familyName,
            givenName: req.params.givenName,
            username: req.params.username,
            email: req.params.email
    };
    log.debug('Saving User: ' + JSON.stringify(user));
    db.collection('users').insert(user, {}, function(err, result) {
        log.debug(err + ' = err, result= ' + result);
        var user = result[0];
        if (err || !user) {
            log.debug('Error inserting user');
            res.send(400, errors.errorByCode(err, 2000, 'unable to save user'));
        } else {
            res.send(200, user);
        }
    });
};

exports.getUser = function(req, res) {
    var id = req.params.id;
    log.debug('userId: ' + id);
    db.collection('users').findById(id, function(err, user) {
        log.verbose("found user: " + JSON.stringify(user));
        if (err) {
            res.send(400, errors.errorByCode(err, 2001));
        } else if (!user) {
            res.send(404, errors.errorByCode(err, 2001));
        } else {
            res.json(user);
        }
    });
};