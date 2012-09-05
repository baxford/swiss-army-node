
var dao = require(__dirname + '/../dao/sequelizeDao.js');

/*
 * GET users listing.
 */

exports.list = function(req, res){
    dao.getCountries(function(err, result) {
        res.json(result);
    });
};