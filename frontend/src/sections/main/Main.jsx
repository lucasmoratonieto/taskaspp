import { useEffect, useReducer, useRef, useState } from 'react';
import './main.css'


function Main() {

  const [allTasks, setAllTasks] = useState([])
  const [userName, setUserName] = useState('hola')



  useEffect(() => {

    const getUserName = async () => {
      const res = await fetch('http://localhost:3500/userName',
        {
          method: 'GET'
        }
      )
      const getUserName = await res.json()
      const userName = getUserName[0].userName

      setUserName(userName);
    }



    const getTasks = async () => {
      const res = await fetch('http://localhost:3500/getTasks',
        {
          method: 'GET'
        }
      )
      const allTasks = await res.json()
      console.log(allTasks)
      console.log(allTasks[0].id)

      setAllTasks(allTasks);

    }
    getUserName()
    getTasks()
  }, [])

  return (
    <section>
      <h1>
        Welcome to Task App {userName}
      </h1>
      <ul>
        {allTasks.map((task) => (
          <li key={task.id} className='product'>
            {task.taskName}
            {task.taskRelevance}
          </li>
        ))}
      </ul>
    </section>

  )
}

export default Main;
