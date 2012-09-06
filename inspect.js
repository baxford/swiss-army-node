var util = require('util');

var object = {
        name: 'Name',
        action: function() {
            return {action: 'done'};
        },
        id: 'ID'
};

util.debug('object: ' + object);
util.debug('JSON.stringify(object)' + JSON.stringify(object));
util.debug('util.inspect(object): ' + util.inspect(object));
util.debug('util.inspect(object, 2): ' + util.inspect(object, 2));
