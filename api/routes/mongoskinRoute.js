var conf = require('../config.js');
var log = conf.logger;
var dao = require(__dirname + '/../dao/mongoskin.js');

exports.saveOrUpdateUser = function(req, res) {
    var user = {
            familyName: req.params.familyName,
            givenName: req.params.givenName,
            username: req.params.username,
            email: req.params.email
    };
    var id = req.params.id;
    dao.saveOrUpdateUser(user, id, function(err, result) {
        if (err) {
            res.send(400, errors.errorByCode(err, 2001));
        } else {
            res.send(200, user);
        }
    });
};

exports.getUser = function(req, res) {
    dao.getUser(req.params.id, function(err, user) {
        if (err) {
            res.send(400, errors.errorByCode(err, 2001));
        } else if (!user) {
            res.send(404, errors.errorByCode(err, 2001));
        } else {
            res.json(user);
        }
    });
};
exports.getUsers = function(req, res) {
    dao.getUsers(function(err, users) {
        if (err) {
            res.send(400, errors.errorByCode(err, 2001));
        } else if (!users) {
            res.send(404, errors.errorByCode(err, 2001));
        } else {
            res.json(users);
        }
    });
};