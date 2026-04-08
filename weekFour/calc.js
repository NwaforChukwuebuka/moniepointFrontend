function calculate() {
    function getSum(a, b) {
        return a + b;
    }

    function getSubtract(a, b) {
        return a - b;
    }

    return { getSum, getSubtract };
}

module.exports = calculate();