var conf = require('../config.js');
var log = conf.logger;
var Sequelize = require("sequelize");
log.debug("db: " + JSON.stringify(conf.mysql));
var sequelize = new Sequelize(conf.mysql.database, conf.mysql.username, conf.mysql.password);

var Country = sequelize.import(__dirname + '/../model/Country.js');

exports.getCountries = function(done) {
    log.debug('Sequelize Dao: process(' + process.pid + ') getting countries');
    Country.findAll().success(function(countries) {
        done(null, countries);
    });
};