import { memo, useState, useEffect } from "react";
import styles from "./taskManager.module.css"
import { mockTaskManager } from "./mockTaskManager";

const TaskManager = () => {

const [tasks, setTasks] = useState([])
const [newTask, setNewTask] = useState("")
const [searchQuery, setSearchQuery] = useState("")

const handleSubmit = (event) => {
    event.preventDefault();
    if(!newTask.trim()) {
        alert("Please enter a task");
        setNewTask("");
        return;
    }
    // creqate a new task object with a unique id and the name of the task
    const taskObj = { id: tasks.length + 1, name: newTask };
    setTasks((prev) => [...prev, taskObj]);
    setNewTask("");
};

const handleDeleteTask = (taskId) => {
    const filteredTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(filteredTasks);
};

const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase())
);

useEffect(() => {
    const fetchTasks = async () => {
        try {
            const tasks = await mockTaskManager();
            setTasks(tasks);
            console.log(tasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    fetchTasks()

}, [])                  // [] ensures the effect runs only once when the component mounts and contains the dependencies for the effect. In this case, since there are no dependencies, it will only run once.

    return (
        <div className={styles.wrapper}>
            <header>
                <div className={styles.pageBanner}>
                    <h1 className={styles.title}>Task Manager</h1>

                    <form className={styles.searchTasks}>
                        <input onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search tasks..." />
                    </form>
                </div>
            </header>

            <div className={styles.taskList}>
                <h2 className={styles.title}>Tasks to Do</h2>

                <ul>
                    {filteredTasks.map((task) => (
                        <li key={task.id}>
                            <span className={styles.name}>{task.name}</span>
                            <span onClick={() => handleDeleteTask(task.id)} className={styles.delete}>delete</span>
                        </li>
                    ))}
                </ul>
            </div>


{/*                     <li>
                        <span className={styles.name}>Practice DOM Manipulation</span>
                        <span className={styles.delete}>delete</span>
                    </li>

                    <li>
                        <span className={styles.name}>Build a mini project</span>
                        <span className={styles.delete}>delete</span>
                    </li>

                    <li>
                        <span className={styles.name}>Revise CSS Flexbox</span>
                        <span className={styles.delete}>delete</span>
                    </li> */}

            <form onSubmit={handleSubmit} className={styles.addTask}>
                <input onChange={(e) => setNewTask(e.target.value.trim())} type="text" placeholder="Add a task..." />
                <button>Add</button>
            </form>

        </div>
    )
}

export default memo(TaskManager)
