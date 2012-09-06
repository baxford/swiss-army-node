// Process a command
function processCommand(command, callback) {
    if (command.operation === 'multiply') {
        var result = command.a * command.b;
        callback(null, result);
    } else {
        callback('Invalid operation');
    }
}
// Callback to handle the results of an async function
function resultCallback(err, result) {
    if (err) {
        console.log('Error: ' + err);
    } else {
        console.log('Result: ' + result);
    }
}
// process the function in a synchronous manner.
function processSync(command) {
    processCommand(command, resultCallback);
}
// process the function in an async manner.
function processAsync(command) {
    // do the calculation on the next tick to make it asynchronous
    process.nextTick(
        function() {
            processCommand(command, resultCallback);
        }
    );
}

// ############## Run some tests ###################
// now try some different values
// should return 4
processAsync({operation: 'multiply', a: 2, b: 2});

// should return NaN (but not an error) as no operaters defined
processAsync({operation: 'multiply'});

// should throw an error and be caught by the try/catch block as it's synchronous
try {
    processSync();
} catch (error) {
    console.log('An Error has occurred');
}
// should throw an error which can't be caught by the try/catch block as it's executing asynchronously
try {
    processAsync();
    console.log("I'D PREFER IF THIS CODE DIDN'T EXECUTE AS THERE'S AN ERROR");
} catch (error) {
    console.log('An Error has occurred');
}