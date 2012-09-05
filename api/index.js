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
var skin = require(__dirname + '/routes/mongoskinRoute.js');
var goose = require(__dirname + '/routes/mongooseRoute.js');

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

// handle POST/PUT/GET
server.post('/mongoskin/user', skin.saveOrUpdateUser);
server.post('/mongoose/user', goose.saveOrUpdateUser);
server.put('/mongoskin/user/:id', skin.saveOrUpdateUser);
server.put('/mongoose/user/:id', goose.saveOrUpdateUser);
server.get('/mongoskin/user/:id', skin.getUser);
server.get('/mongoose/user/:id', goose.getUser);
server.get('/mongoskin/users', skin.getUsers);
server.get('/mongoose/users', goose.getUsers);

// finally start listening.
log.debug(conf.serverName + ' listening on port: ' + conf.listenPort);
server.listen(conf.listenPort);

// and start the TCP server for the survey
var tcpServer = require(__dirname + '/lib/tcpServer.js');

// finally start up the heartbeat using a child process
var cp = require('child_process');
//setup the pHashWorker initially, instead of forking each time.
//TODO BA check about handling failure of child process.
var heartbeat = cp.fork(__dirname + '/lib/heartbeat.js');
console.log('Created heartbeat');
heartbeat.on('message', function(m) {
  console.log('Message from heartbeat:', m);
});
