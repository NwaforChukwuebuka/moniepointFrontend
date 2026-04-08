const calculate = require("./calc");

test('calculates the sum of 1 and 2 to equal 3', () => {
    const digitOne = 4;
    const digitTwo = 5;
    const result =  calculate.getSum(digitOne, digitTwo);
    expect(result).toBe(9);
});

test('calculates the sum of 1 and 2 to equal 3', () => {
    const digitOne = 4;
    const digitTwo = 5;
    const result =  calculate.getSubtract(digitOne, digitTwo);
    expect(result).toBe(-1);
});