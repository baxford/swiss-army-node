var restify = require('restify');
var conf = require('../config.js');
var log = conf.logger;
var net = require('net');
var async = require('async');

var restClient = restify.createJsonClient({
    url : conf.userApi.url,
    version : '*'
});

/*
 * GET users listing.
 */

exports.getUser = function(req, res) {
    var id = req.query.id;
    if (id) {
        restClient.get('/mongoose/user' + id, function(err, restReq, restRes, result) {
            log.debug(err + ' = err, Got User: ' + JSON.stringify(result));
            var params = { 
                title: 'User', 
                user: result 
            };
            res.render('user', params);
        });
    } else {
        res.render('editUser', {title: 'User'});
    }
};

exports.saveUser = function(req, res) {
    var id = req.params.id;
    var user = {
            username: req.body.username,
            familyName: req.body.familyName,
            givenName: req.body.givenName,
            email: req.body.email
    };
    log.debug('Saving user: ' + JSON.stringify(user));
    async.parallel({
         saveUser: function(callback) {
             if (id) {
                 restClient.put('/mongoose/user' + id, user, function(err, restReq, restRes, result) {
                     log.debug(err + ' = err, PUT User: ' + JSON.stringify(result));
                     callback(err, result);
                 });
             } else {
                 restClient.post('/mongoose/user', user, function(err, restReq, restRes, result) {
                     log.debug(err + ' = err, POST User: ' + JSON.stringify(result));
                     callback(err, result);
                 });
             }
         },
         submitSurvey: function(callback) {
             // use the TCP Api to update survey results.
             submitSurvey(req.body.favouriteColour, callback);
         }
        },
        function(err, result) {
            // now that both parts of the parallel are complete, render the results.
            // the results are available based on the names of the functions from above
            log.debug(err + '=err, done paralle : ' + JSON.stringify(result));
            var user = result.saveUser;
            log.debug(err + '=err, done paralle : ' + JSON.stringify(user));
            var surveyResults = result.submitSurvey;
            var params = {
                    title: 'User',
                    user: user,
                    surveyResults: surveyResults
            };
            res.render('user', params);
        }
    );
};

exports.list = function(req, res){
  restClient.get('/mongoose/users', function(err, restReq, restRes, result) {
      log.debug(err + ' = err, Got Users: ' + JSON.stringify(result));
      var params = { 
          title: 'Users', 
          users: result 
      };
      res.render('users', params);
  });
};

//request a message from the Edge API
function submitSurvey(favouriteColour, done) {
    // create a TCP socket client and request a message:
    var client = new net.Socket();
    // Add a 'data' event handler for the client socket
    // data is what the server sent to this socket
    client.on('data', function(response) {
        log.debug('TCP Client DATA: ' + response);
        var data = JSON.parse(response);
        done(null, data);
        client.destroy();
    });
    
    // now connect to the TCP server.
    log.debug('CONNECTING TO: ' + conf.tcpPort + ':' + conf.tcpHost);
    client.connect(conf.tcpPort, conf.tcpHost, function() {
        log.debug('CONNECTED TO: ' + conf.tcpPort + ':' + conf.tcpHost);
        var data = {
                favouriteColour: favouriteColour
            };
        // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
        client.write(JSON.stringify(data));
    });

    // Add a 'close' event handler for the client socket
    client.on('close', function() {
        log.debug('Connection closed');
    });
};