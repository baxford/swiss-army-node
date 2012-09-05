var conf = require('../config.js');
var log = conf.logger;
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.heartbeat = function(req, res) {
    log.debug('Got Heartbeat: ' + JSON.stringify(req.body));
    res.json({status:'ok'});
};