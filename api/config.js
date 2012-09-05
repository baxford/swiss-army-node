/*
 * Simple config object that allows us to define different config for local dev/test/live.
 */
//Setup logging for the application based on different environments.
var winston = require('winston');

module.exports = function() {
    // common values here
    var conf = {
        serverName : 'mongo-api',
        listenPort: 3001,
        tcpPort: 20000,
        tcpHost: '127.0.0.1',
        heartbeat: {
            url: 'http://localhost:2000',
            interval: 1000
        },
        redis :{
            host: 'localhost',
            port: 6379
        },
        mongo: {
            url : 'localhost:27017/training'
        }
    };
    // setup a logger for use within the app
    conf.logger = new (winston.Logger)({
        transports : [ new (winston.transports.Console)({
            level : 'debug',
            emitErrs : false
        }) ]
    });
    return conf;
}();