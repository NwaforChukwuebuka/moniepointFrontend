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

