var dbSetup = require('./dbSetup.js');

// if executed via the command line, do what they asked:
var args = process.argv;
if (args.length <= 2) {
    console.log('Please specify a task, either clean, install, or scripts');
    process.exit(1);
} else {
    var cmd = args[2];
    console.log('Processing ' + cmd);
    if ('clean' === cmd) {
        dbSetup.clean(function(err, result) {
            if (err) {
                console.log('Error: ' + err);
                
            } else {
                console.log('Completed: ' + result);
            }
        });
    }
    if ('install' === cmd) {
        dbSetup.install(function(err, result) {
            if (err) {
                console.log('Error: ' + err);
                
            } else {
                console.log('Completed: ' + result);
            }
        });
    }
    if ('scripts' === cmd) {
        dbSetup.runScripts(function(err, result) {
            if (err) {
                console.log('Error: ' + err);
                
            } else {
                console.log('Completed: ' + result);
            }
        });
    }
}