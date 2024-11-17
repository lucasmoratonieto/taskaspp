import { useEffect, useReducer, useRef, useState } from 'react';
import './main.css'

import { useNavigate } from 'react-router-dom';



function Main() {

  const [allTasks, setAllTasks] = useState([])
  const [userNameState, setUserNameState] = useState('Not Registre, Please log in')
  const navigate = useNavigate();
  let userName = ''


  useEffect(() => {


    const getUserName = async () => {
      const res = await fetch('http://localhost:3500/userName',
        {
          method: 'GET'
        }
      )
      const status = await res.status

      if (status != 400) {

        // console.log(status)
        const getUserNameGet = await res.json()
        userName = getUserNameGet[0].userName

        setUserNameState(userName);
      } else if (status == 400) {
        navigate('/login')
      }
    }


    const getTasks = async () => {
      const res = await fetch('http://localhost:3500/getTasks',
        {
          method: 'GET'
        }
      )
      const allTasks = await res.json()
      setAllTasks(allTasks);

    }
    getUserName()


    getTasks()
  }, [])


  const updateTasKName = async (changeTaskName) => {

    const id = changeTaskName.id[changeTaskName.id.length - 1]
    const updatedTasKName = changeTaskName.value
    console.log(id)
    console.log(updatedTasKName)

    const res = await fetch('http://localhost:3500/changeTaskName',
      {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          id: id,
          taskName: updatedTasKName
        })
      }
    )
    const postChangeTaskName = await res.json()
    console.log(postChangeTaskName)

  }



  const updateTasKStatus = async (event) => {
    const changedStatus = event.target.value;
    const id = event.target.id[event.target.id.length - 1];
    console.log(changedStatus)
    console.log(id)

    const res = await fetch('http://localhost:3500/changeStatus',
      {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          id: id,
          taskStatus: changedStatus
        })
      }
    )
    const postChangeStatus = await res.json()
    console.log(postChangeStatus)

  }


  const updateTasKRelevance = async (event) => {
    const changedRelevance = event.target.value;
    const id = event.target.id[event.target.id.length - 1];
    console.log(changedRelevance)
    console.log(id)

    const res = await fetch('http://localhost:3500/changeRelevance',
      {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          id: id,
          taskRelevance: changedRelevance
        })
      }
    )
    const postChangeRelevance = await res.json()
    console.log(postChangeRelevance)

  }

  function handleEnter(event) {
    const changedRelevance = event.target;
    // console.log(changedRelevance)
    if (event.keyCode === 13 || event.wich === 13) {
      updateTasKName(changedRelevance)
    }
  }
  function handleMouse(event) {
    const changedRelevance = event.target;
    // console.log(changedRelevance)
    updateTasKName(changedRelevance)

  }
  function addNewTask() {

    const task = {
      "taskName": "",
      "taskStatus": "To do",
      "taskRelevance": "Low"
    }

    async function postNewTask() {
      const res = await fetch('http://localhost:3500/newTask',
        {
          method: 'POST',
          headers: {
            "Content-Type": 'application/json'
          },
          body: JSON.stringify({
            newTask: task

          })
        }
      )
    }
    postNewTask()
  }

  return (
    <section>
      <h1>
        Welcome to Task App {userNameState} 👋
      </h1>
      <h2>These are the all the tasks from the dataBase</h2>
      <div className='products'>
        {allTasks.map((task) => (
          <div key={task.id} className={`each-product product-${task.id}`} >
            <div className={`each-product-id`}>
              {task.id}
            </div>
            <div className={`each-product-name`}>
              <input type="text" defaultValue={task.taskName} onKeyUp={handleEnter} /*onChange={handleMouse} */ className='input-task-name' id={`${task.id}`} />
            </div>
            <div className={`each-product-status`}>
              <select name='status' id={`status ${task.id}`} defaultValue={task.taskStatus} onChange={updateTasKStatus}  >
                <option value="To do">To do</option>
                <option value="Doing" >Doing</option>
                <option value="Done">Done</option>
              </select>

            </div>
            <div className={`each-product-relevance`}>
              <select name='relevance' className='relevance' id={`${task.id}`} defaultValue={task.taskRelevance} onChange={updateTasKRelevance} >
                <option value="Low">low</option>
                <option value="Medium" >Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        ))}
        <div className='añadir-tarea'>
          <button className='button-añadir-tarea' onClick={addNewTask}>
            Añadir tarea...
          </button>
        </div>
      </div>
    </section>

  )
}

export default Main;
