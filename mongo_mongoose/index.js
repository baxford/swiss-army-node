/**
 * This is a JSON REST API for saving and reading install data to a database (ie
 * redis). This API is to be used by internal clients, not exposed externally
 * (hence iapi).
 */
// use winston for logging instead of console.log
var restify = require('restify'),
conf = require('./config.js'),
// use the logger setup in conf
log = conf.logger;
var skin = require('./routes/mongoskin.js');
var goose = require('./routes/mongoose.js');

// create the server.
var server = restify.createServer({
    name : conf.serverName
});

// set up bodyparser and queryparser
server.use(restify.queryParser());
server.use(restify.bodyParser());

// handle uncaught exceptions
process.on('uncaughtException', function(err) {
    log.error(conf.serverName + ' Uncaught Exception: ' + err);
    return;
});


// get countries
server.get('/mongoskin', skin.getUsers);
server.get('/mongoose', goose.getUsers);

// finally start listening.
log.debug(conf.serverName + ' listening on port: ' + conf.listenPort);
server.listen(conf.listenPort);