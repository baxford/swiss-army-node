/**
A child process intended to run as a heartbeat back to a parent app.
*/

var restify = require('restify');
var conf = require('../config.js');
var log = conf.logger;

var restClient = restify.createJsonClient({
    url : conf.heartbeat.url,
    version : '*'
});

//handle uncaught exceptions
process.on('uncaughtException', function(err) {
    console.log('redis: Uncaught Exception: ' + err);
    process.send({error: 'Uncaught exception in heartbeat: ' + err});
    return;
});

function sendHeartbeat() {
    log.debug('Process (' + process.pid +') Sending heartbeat');
    restClient.post('/heartbeat', {status:'ok'}, function(err, restReq, restRes, result) {
        log.debug(err + ', ' + JSON.stringify(result));
        if (err) {
            log.error('Unable to post heartbeat: ' + err);
            process.send({error: 'Unable to send heartbeat'});
        } else {
            process.send({message: 'Sent heartbeat'});
            log.debug('Heartbeat posted successfully');
        }
    });
}

// now kick off the heartbeat
var interval = conf.heartbeat.interval ? conf.heartbeat.interval : 10000;
setInterval(
    function() {
        sendHeartbeat();
    }, 
    interval
);