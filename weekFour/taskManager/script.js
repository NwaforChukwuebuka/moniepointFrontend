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

// delete task using class name
const taskList = document.querySelector('#task-list ul')
taskList.addEventListener('click', (event) =>  {
    console.log(event)
    if(event.target.className === 'delete')    {
        const li = event.target.parentNode
        li.remove()
    }
})

//add task
const form = document.querySelector('#add-task')
form.addEventListener('submit', (event) => {
    event.preventDefault() //Prevents the default action of the form submission
    const taskInput = document.querySelector('#add-task input').value
    console.log(taskInput)
    if(!taskInput)    {
        alert('Please enter a task')
        return
    }


    const liTag = document.createElement('li')
    const firstSpanTag = document.createElement('span')
    const secondSpanTag = document.createElement('span')

    firstSpanTag.textContent = taskInput
    secondSpanTag.textContent = 'delete'

    liTag.appendChild(firstSpanTag)
    liTag.appendChild(secondSpanTag)
    firstSpanTag.classList.add('name')
    secondSpanTag.classList.add('delete')

    taskList.appendChild(liTag)
    form.reset() //Resets the form fields to their default values after submission
})