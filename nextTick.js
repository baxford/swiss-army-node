function second() {
    console.log('second');
}

// using process.nextTick will put the second() function into a callback queue 
// to execute at the start of the next tick

//process.nextTick(second);
second();
console.log('first');

