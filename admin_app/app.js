var conf = require(__dirname + '/config.js');
var log = conf.logger;

/**
 * Module dependencies.
 */
var cluster = require('cluster');
        
if ( cluster.isMaster ) {
    var numCPUs = require('os').cpus().length;
    if (conf.useMultipleCPUs === false) {
        numCPUs = 1;
    }
    for (var i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
} else {
    var express = require('express')
      , routes = require('./routes')
      , user = require('./routes/user')
      , countries = require('./routes/countries')
      , http = require('http')
      , path = require('path')
      , httpProxy = require('http-proxy');

    // ############# HTTP PROXY - this can proxy certain calls directly to the User API
    var userApiProxy = new httpProxy.HttpProxy({
        target: {host: conf.userApi.host, port: conf.userApi.port}
    });
    
    //Proxy requests targeting user API
    function proxyUserApi(pattern) {
        log.debug('Check User API proxy');
        return function(req, res, next) {
            if (req.url.match(pattern)) {
                log.debug('proxying: ' + req.url);
                userApiProxy.proxyRequest(req, res);
            } else {
                next();
            }
        };
    };
    // ####### DONE HTTP PROXY
    
    var app = express();
    app.configure(function(){
      app.set('port', process.env.PORT || conf.listenPort);
      app.set('views', __dirname + '/views');
      app.set('view engine', 'jade');
      // use the proxyUserApi to proxy directly to the userApi
      // make sure this proxy is setup before bodyparser/cookieparser etc
      app.use(proxyUserApi(new RegExp('\/mongoskin/users')));
      app.use(express.favicon());
      app.use(express.logger('dev'));
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(app.router);
      app.use(express.static(path.join(__dirname, 'public')));
    });

    app.configure('development', function(){
      app.use(express.errorHandler());
    });

    app.get('/', routes.index);
    
    // User routes
    app.get('/user', user.getUser);
    app.post('/user', user.saveUser);
    app.get('/users', user.list);
    
    // countries route
    app.get('/countries', countries.list);

    // handler for heartbeat
    app.post('/heartbeat', routes.heartbeat);

    http.createServer(app).listen(app.get('port'), function(){
      //log the pid for debug purposes.
      log.debug("Express server pid(" + process.pid + ") listening on port " + app.get('port'));
    });
}


