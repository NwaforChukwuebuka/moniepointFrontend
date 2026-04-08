function processGreet(name, callback) {
    return callback(name);
}

function greet(name) {
    return `Hello, ${name}!`;
}

const result = processGreet("Alice", greet);
console.log(result);

exports.processGreet = processGreet;
exports.greet = greet;