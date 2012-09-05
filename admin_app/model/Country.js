var conf = require('../config.js');
var log = conf.logger;
var Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Country', {
        code: { type: Sequelize.STRING, primaryKey: true, allowNull: false, unique: true},
        name: { type: Sequelize.String, allowNull: false},
        description: { type: Sequelize.String}
    });
};
  
