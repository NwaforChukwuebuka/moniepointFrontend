// console.log("I am the first");


// setTimeout(() => {
//     console.log("I am the second")
// }, 2000)

// setTimeout(() => {
//     console.log("I am the third")
// }, 4000)

// console.log("I am the fourth") 

// Could be GET or POST/PUT/PATCH/DELETE

const PRODUCT_URL = 'https://dummyjson.com/products';



// function getProducts(PRODUCT_URL) {
//     fetch(PRODUCT_URL)
//         .then(Response => Response.json())
//         .then(data => console.log(data))
//         .catch(error => console.log(error));
// }


// async/await syntax
async function getProducts(PRODUCT_URL) {
    try {
        const response = await fetch(PRODUCT_URL);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}
getProducts(PRODUCT_URL);

