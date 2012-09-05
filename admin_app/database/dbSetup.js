var mysql = require('mysql');
var conf = require('../config.js');
var log = conf.logger;
var async = require('async');


var countriesCreate = "CREATE TABLE IF NOT EXISTS Countries ("
  + " `code` char(2) NOT NULL,"
  + " `name` varchar(100) NOT NULL,"
  + " `description` varchar(1024),"
  + " `createdAt` timestamp, "
  + " `updatedAt` timestamp, "
  + " PRIMARY KEY (`code`)"
  + " ) ENGINE=InnoDB  DEFAULT CHARSET=utf8;";
var countriesDrop = "DROP TABLE IF EXISTS Countries;";
var dropScripts = [
    countriesDrop
];
var createScripts = [
    countriesCreate
];

function createClient() {
    var client = mysql.createConnection({
        host: conf.mysql.host,
        port: conf.mysql.port,
        user: conf.mysql.username,
        password: conf.mysql.password,
        database: conf.mysql.database
    });
    return client;
}
exports.clean = function(done) {
    execScripts(dropScripts, done);
};
exports.install = function(done) {
    execScripts(createScripts, done);
};
exports.runScripts = function(done) {
    log.verbose('doing inserts: ');
    var client = createClient();
    var data = require('./testData.js').data;
    log.verbose('inserts: ' + data);                
    async.forEachSeries(
        data,
        function (insert, insertCB) {
            log.verbose('insert: ' + insert);
            client.query(insert, function(err) {
                log.verbose('done insert ' + err);
                insertCB(err);
            });
        },
        function (err) {
            client.destroy();
            log.verbose('Finished INSERTS: ' + err);
            done(err, data.length);
        }
    ); 
};
    
function execScripts(scripts, done) {
    log.debug('DDL scripts: ' + scripts);
    var client = createClient();
    log.verbose('Created client');
    async.forEachSeries(scripts, 
        function(script, callback) {
              log.verbose('script: ' + script);
              client.query(script, function(err) {
                  log.verbose('script callback: ' + err);
                  callback(err);
              });
        },
        function(err) {
            client.destroy();
            log.debug("Done Data setup");
            done(err);
        }
    );
};

