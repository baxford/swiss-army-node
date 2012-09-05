var errors = require('node-errors')('../errorTable.js');

var net = require('net');
var conf = require('../config.js');
var log = conf.logger;
var redisDao = require('../dao/redisDao.js');
var async = require('async');

var server = net.createServer();
log.debug('Server listening on ' + conf.tcpHost + ':' + conf.tcpPort);
server.listen(conf.tcpPort, conf.tcpHost);
server.on('connection', function(sock) {
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(message) {
        log.debug('DATA ' + sock.remoteAddress + ': ' + sock.remotePort +' =>'+ message);
        try {
            var data = JSON.parse(message);
            // optionally validate the request here.
            async.series([
                    function addFavouriteColour(callback) {
                        redisDao.addFavouriteColour(data.favouriteColour, function(err, countForColour, totalColours, totalSurveys) {
                            // just pass the totalSurveys back to the calling function
                           callback(err, totalSurveys);
                        });
                    },
                    function getFavouriteColours(callback) {
                        redisDao.getFavouriteColours(function(err, result) {
                            log.debug('Got Fav Colours: ' + JSON.stringify(result));
                            callback(err, result);
                        });
                    }
                ],
                function(err, result) {
                log.debug('results of series: ' + JSON.stringify(result));
                    // this result is from the first function in the async.series above
                    var totalSurveys = result[0];
                    // this result is from the second function in the async.series above
                    var surveyResults = result[1];
                    // Write the data back to the socket, the client will receive it as data from the server
                    sock.end(JSON.stringify(surveyResults));
                }
            );
            
        } catch (parseError) {
            console.log('parse ERROR: ' + parseError);
            var error = errors.errorByCode(err, 1001);
            var response = {success: false, error: error};
            sock.write(JSON.stringify(response));
        }
    });
    
});
