function calculate() {
/*     function getSum(a, b) {
        return a + b;
    }

    function getSubtract(a, b) {
        return a - b;
    } */

    return { getSum:(a, b) => a + b,
             getSubtract:(a, b) => a - b 
            }

}

module.exports = calculate;