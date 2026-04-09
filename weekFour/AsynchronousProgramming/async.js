// console.log("I am the first");


// setTimeout(() => {
//     console.log("I am the second")
// }, 2000)

// setTimeout(() => {
//     console.log("I am the third")
// }, 4000)

// console.log("I am the fourth") 

// Could be GET or POST/PUT/PATCH/DELETE

const PRODUCT_URL = 'https://dummyjson.com/test';



function getProducts(PRODUCT_URL) {
    fetch(PRODUCT_URL)
        .then(res => res.json())
        .then(console.log);
}
getProducts(PRODUCT_URL);

