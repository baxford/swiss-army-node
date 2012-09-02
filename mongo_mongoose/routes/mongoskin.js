var errors = require('node-errors')('../errorTable.js');

exports.getUsers = function(req, res) {
    var error = errors.errorByCode(null, 1000, 'TODO');
    res.json({users: [], error: error.code});
};