const {getSum, getSubtract} = require("./calc");

test('calculates the sum of 1 and 2 to equal 3', () => {
    const digitOne = 4;
    const digitTwo = 5;
    const result =  getSum(digitOne, digitTwo);
    expect(result).toBe(9);
});

test('calculates the difference of 4 and 5 to equal -1', () => {
    const digitOne = 4;
    const digitTwo = 5;
    const result =  getSubtract(digitOne, digitTwo);
    expect(result).toBe(-1);
});