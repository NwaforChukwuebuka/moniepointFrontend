// const wrapper = document.getElementById('wrapper');
// console.log(wrapper);

// const title = document.getElementsByClassName('title')
// console.log(title) //Output: HTMLCollection(1) [h2.title]


// const tags = document.getElementsByTagName('li')
// console

// //querySelector() - returns the first element that matches a specified CSS selector(s) in the document
// const firstTitle = document.querySelector('.title')
// console.log(firstTask) //Output: <h2 class="title">Task Manager</h2>

//querySelectorAll() - returns a static NodeList of all elements that match a specified CSS selector(s) in the document
// const allTitles = document.querySelectorAll('.title')
// console.log(allTitles) 


// const taskList = document.querySelector('#task-list ul')
// taskList.addEventListener('click', (event) =>  {
//     console.log(event)
//     if(event.target.textContent === 'delete')    {
//         const li = event.target.parentElement
//         li.remove()
//     }
// })


const taskList = document.querySelector('#task-list ul')
taskList.addEventListener('click', (event) =>  {
    console.log(event)
    if(event.target.className === 'delete')    {
        const li = event.target.parentNode
        li.remove()
    }
})