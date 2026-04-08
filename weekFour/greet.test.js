const greet = require('./greet');
test('greets Alice correctly', () => {
    expect(greet('Alice')).toBe('Hello, Alice!');
});

test('greets Bob correctly', () => {
    expect(greet('Bob')).toBe('Hello, Bob!');
});