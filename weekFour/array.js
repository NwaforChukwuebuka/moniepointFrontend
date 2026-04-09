const arr = []  //Array literal
const arr2 = new Array(3) //Array constructor

arr[6] = 'Chinedu' //Adding an element to the array at index 6

console.log(arr) //Output: [ <6 empty items>, 'Chinedu' ]

const items = [2, null,"string", true, undefined, {name: 'Chinedu'}, [1,2,3]] //Array with different data types


//Array methods
// push() - adds an element to the end of the array
items.push('new item')
console.log(items) //Output: [ 2, null, 'string', true, undefined, { name: 'Chinedu' }, [ 1, 2, 3 ], 'new item' ]

//pop()
items.pop() //Removes the last element from the array
console.log(items) //Output: [ 2, null, 'string', true, undefined, { name: 'Chinedu' }, [ 1, 2, 3 ] ]

//shift() - removes the first element from the array
items.shift()
console.log(items) //Output: [ null, 'string', true, undefined, { name: 'Chinedu' }, [ 1, 2, 3 ] ]

//unshift() - adds an element to the beginning of the array
items.unshift('first item')
console.log(items) //Output: [ 'first item', null, 'string', true, undefined, { name: 'Chinedu' }, [ 1, 2, 3 ] ]    

//slice
const slicedItems = items.slice(1, 4) //Returns a shallow copy of a portion of an array into a new array object 
console.log(slicedItems) //Output: [ null, 'string', true ]

//splice() - changes the contents of an array by removing or replacing existing elements and/or adding new elements in place
items.splice(2, 1, 'new string') //Removes 1 element at index 2 and adds 'new string' at index 2
console.log(items) //Output: [ 'first item', null, 'new string', true, undefined, { name: 'Chinedu' }, [ 1, 2, 3 ] ]

const newArr = [2,3,4,5,6,]
const splice = newArr.splice(1, 2) //Removes 2 elements at index 2 and returns the removed elements
console.log(splice) //Output: [ 3, 4 ]  

// add using splice
newArr.splice(1, 0, 'added item',8) //Adds 'added item' at index 1 without removing any element
console.log(newArr) //Output: [ 2, 'added item', 5, 6 ]

//add and remove using splice
newArr.splice(1, 2, 'new item1', 'new item2')


//Advanced Array methods
const numbers = [1, 2, 3, 4, 5]

//forEach  ... does not returns a new array

let  squareNumbers = []
numbers.forEach(num => {
    squareNumbers.push(num * num)
})
console.log(squareNumbers) //Output: [ 1, 4, 9, 16, 25 ]


//map - returns a new array with the results of calling a provided function on every element in the calling array
const squaredNumbers = numbers.map(num => num * num)
console.log(squaredNumbers) //Output: [ 1, 4, 9, 16, 25 ] 

//filter - returns a new array with all elements that pass the test implemented by the provided function
const evenNumbers = numbers.filter(num => num % 2 === 0)
console.log(evenNumbers) //Output: [ 2, 4 ]



