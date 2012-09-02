var errors = require('node-errors')('../errorTable.js');
var conf = require('../config.js');
var log = conf.logger;
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var db = mongoose.createConnection(conf.mongo.url);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // yay!
});
var userSchema = mongoose.Schema(
        {
            familyName: 'string', 
            givenName: 'string', 
            username: 'string', 
            email: 'string', 
            
        }
    );
var User = db.model('User', userSchema);

exports.getUsers = function(req, res) {
    User.find(function(err, result) {
        log.debug('got users: ' + JSON.stringify(result));
        res.json(result);
    });
};

exports.getUser = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        log.debug(err + ' = err, findbyId: ' + user);
        if (err) {
            res.send(400, errors.errorByCode(err, 2001));
        } else if (!user) {
            res.send(404, errors.errorByCode(err, 2001));
        } else {
            res.json(user);
        }
    });
};

exports.saveOrUpdateUser = function(req, res) {
    var user = new User({
        familyName: req.params.familyName,
        givenName: req.params.givenName,
        username: req.params.username,
        email: req.params.email
    });
    log.debug('Mongoose saving User: ' + JSON.stringify(user));
    user.save(function (err) {
        log.debug("saved user: " + JSON.stringify(user));
        if (err) {
            res.send(400, errors.errorByCode(err, 2001));
        } else {
            res.send(200, user);
        }
    });
};