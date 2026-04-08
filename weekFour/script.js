for (let i = 0; i < 10; i++) {
    console.log(i);
}

console.log("Loop has finished");

let object = {
    name: "John",
    age: 30,
    city: "New York"
};

for (const key in object) {
    const element = object[key];
    console.log(key, element);
}

const user = {
    firstName: "Smallie",
    lastName: "Biggie",
    age: 25,
    sex: "Male",
    hobbies: ["Gaming", "Cooking", "Traveling"],
    isValid: true
}

console.log(user.firstName);
console.log(user["lastName"]);

user.age = 26;
console.log(user.age);

console.log(user);

for (const key in user) {
    const element = user[key];
    console.log(key, element);
}
 // Function declaration
function getSum(a, b) {
    return a + b;
}
const result = getSum(3, 4)
console.log(result);

// Function expression
const getProduct = function(a, b) {
    return a * b;
}
const productResult = getProduct(5, 6);
console.log(productResult);

// Arrow function
const getDifference = (a, b) => {
    return a - b;
}
const diffResult = getDifference(10, 5);
console.log(diffResult);    