var conf = require('../config.js');
var log = conf.logger;
var db = conf.mysql.database;

exports.data = 
[
 "delete from " + db + ".countries",
 
 "insert into " + db + ".countries (`code`, `name`, `description`) VALUES('AU', 'Australia', 'A Big Country');",
 "insert into " + db + ".countries (`code`, `name`, `description`) VALUES('NZ', 'New Zealand', 'A Smaller Country');",
 "insert into " + db + ".countries (`code`, `name`, `description`) VALUES('US', 'United States of America', 'Another Big Country');",

];
