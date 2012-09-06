var errors = require('node-errors')('../errorTable.js');
var conf = require('../config.js');
var log = conf.logger;
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var db = mongoose.createConnection(conf.mongo.url);
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
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

exports.getUsers = function(done) {
    User.find(function(err, result) {
        log.debug('got users: ' + JSON.stringify(result));
        done(err, result);
    });
};

exports.getUser = function(id, done) {
    User.findById(id, function(err, user) {
//        log.debug(err + ' = err, findbyId: ' + user);
        if (err) {
            done(err);
        } else {
            done(null, user);
        }
    });
};

exports.saveOrUpdateUser = function(user, id, done) {
    var toSave = new User({
        familyName: user.familyName,
        givenName: user.givenName,
        username: user.username,
        email: user.email
    });
    log.debug('Mongoose saving User: ' + JSON.stringify(user));
    toSave.save(function (err) {
        done(err, toSave);
    });
};