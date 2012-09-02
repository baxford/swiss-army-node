/*
* Worker process for creating more pHashes in the queue.
*/
var redis = require('redis');
var async = require('async');
var conf = require('../config.js');
var log = conf.logger;
var redisClient = redis.createClient(conf.redis.port, conf.redis.host);

//handle uncaught exceptions
process.on('uncaughtException', function(err) {
    console.log('redis: Uncaught Exception: ' + err);
    return;
});

exports.addFavouriteColour = function(colour, done) {
    log.debug('AddFavouriteColour: ' + colour);
     // use a multi for an atomic operation
     redisClient.multi()
     // increment the hash value for this colour
     .hincrby('favouriteColours', colour, 1)
     // count the number of colours being voted on
     .hlen('favouriteColours')
     // increment the count of total surveys
     .incr('totalSurveys')
     .exec(function(err, result) {
         log.debug('addFavColour: ' + JSON.stringify(result));
         var countForColour = result[0];
         var totalColours = result[1];
         var totalSurveys = result[2];
         done(err, countForColour, totalColours, totalSurveys);
     });
};

exports.getFavouriteColours = function(next) {
    // use a multi for an atomic operation
    redisClient.multi()
        .hgetall('favouriteColours')
        .hkeys('favouriteColours')
        .get('totalSurveys')
        .exec(function(err, result) {
            log.debug('getFavouriteColours: ' + JSON.stringify(result));
            var data = {};
            var colourHash = result[0];
            var colours = result[1];
            var surveyCount = result[2];
            async.forEach(
                colours,
                function(colour, callback) {
                    log.debug('Survey: ' + colour);
                    var colourCount = colourHash[colour];
                    // calc the percentages for each colour
                    var pct = colourCount / surveyCount * 100;
                    data[colour] = pct;
                    callback();
                },
                function(err) {
                    // return the updated survey results.
                    next(err, data);
                });
        });
};
