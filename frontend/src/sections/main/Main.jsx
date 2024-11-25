import { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import './main.css'
import DatePicker from "react-datepicker";
import { loader } from '../../assets/svg/icons.js';

import { useNavigate } from 'react-router-dom';
import { threeDots } from '../../assets/svg/icons.js';
import { baseURL } from '../../assets/constanst/constants.js'





function Main() {


  const [allTasks, setAllTasks] = useState([])
  const [userNameState, setUserNameState] = useState('Not Registre, Please log in')
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState(null);

  const [date, setDate] = useState(null);

  const getTasks = async () => {
    const res = await fetch(baseURL + '/getTasks',
      {
        method: 'GET'
      }
    )
    const allTasks = await res.json()
    setAllTasks(allTasks);

  }
  const getUserName = async () => {
    try {

      const res = await fetch(baseURL + '/userName',
        {
          method: 'GET'
        }
      )
      const status = res.status

      if (status !== 400) {

        const getUserNameGet = await res.json()
        const userName = getUserNameGet[0].userName

        setUserNameState(userName);
        getTasks()
      } else if (status === 400) {
        navigate('/login')
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getUserName()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function logOffFunction() {
    async function logOff() {
      const res = await fetch(baseURL + '/logOff',
        {
          method: 'GET'
        }
      )
      const logOffMessage = await res.json()
      console.log(logOffMessage)
    }
    logOff()
    navigate('/login')
  }

  function updateTaskNameTimer(e) {
    const id = e.target.id
    const updatedTasKName = e.target.value

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const newTimeout = setTimeout(() => {
      updateTasKName(id, updatedTasKName);
    }, 1000);
    setTypingTimeout(newTimeout);
  }

  const updateTasKName = async (id, updatedTasKName) => {

    try {
      await fetch(baseURL + '/changeTaskName',
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
    } catch (err) {
      console.log(err)
    }
    getTasks()
  }


  function handleEnter(e) {
    const id = e.target.id
    const updatedTasKName = e.target.value


    if (e.keyCode === 13 || e.wich === 13) {
      updateTasKName(id, updatedTasKName)
    }
  }



  const updateTasKStatus = async (event) => {
    const changedStatus = event.target.value;
    const id = event.target.id;


    const res = await fetch(baseURL + '/changeStatus',
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

    getTasks()

  }


  const updateTasKRelevance = async (event) => {
    const changedRelevance = event.target.value;
    // const id = event.target.id[event.target.id.length - 1];
    const id = event.target.id;


    const res = await fetch(baseURL + '/changeRelevance',
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
    getTasks()


  }

  const updateTasKDate = async (id, newDate) => {


    console.log(id)
    console.log(newDate)

    const res = await fetch(baseURL + '/changeDate',
      {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          id: id,
          taskDate: newDate
        })
      }
    )
    const postChangeDate = await res.json()
    console.log(postChangeDate)
    getTasks()

  }


  async function addNewTask() {
    setIsloading(true)

    const task = {
      "taskName": "",
      "taskStatus": "To do",
      "taskRelevance": "Low"
    }
    try {

      await fetch(baseURL + '/newTask',
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
      getTasks()
      setIsloading(false)
    } catch (err) {
      console.log(err)
    }

  }

  function handleOptionsTask(event) {
    const id = event.target.id;

    const setVisibleOptionTask = document.getElementById('options' + id)
    setVisibleOptionTask.classList.toggle('hiden-optionsTaskMenu')
    setVisibleOptionTask.classList.toggle('optionsTaskMenu')
  }

  async function deleteTaskFunction(event) {
    const id = event.target.id;

    const deleteTask = await fetch(baseURL + '/deleteTask',
      {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          id: id
        })
      })
    const taskDeleted = await deleteTask.json()
    console.log(taskDeleted)
    getTasks()
  }



  // ----------------------------------------------------------
  // ----------------------------------------------------------
  // ----------------------------------------------------------
  // ----------------------------------------------------------
  // ----------------------------------------------------------
  // ----------------------------------------------------------
  return (
    <section>
      <div className='log-off'>
        <button onClick={logOffFunction}>
          <div className='log-off-div'>
            Log off
          </div>
        </button>
      </div>
      <h1>
        Welcome to Task App {userNameState} 👋
      </h1>
      <h2>These are the all the tasks from the dataBase</h2>
      <table className='tasks'>
        <tr className='table-title'>

          <th>
            Nº
          </th>
          <th className='table-title-name'>
            Task Name
          </th>
          <th className='table-title-status'>
            Status
          </th>
          <th className='table-title-relevance'>
            Relevance
          </th>
          <th className='table-title-start-date'>
            Start Date
          </th>
        </tr>
        {allTasks.map((task, number) => (

          <tr key={task.taskId} className={`each-task task-${task.taskId}`} >
            <td className={`each-task-id`}>
              {number + 1}
            </td>
            <td className={`each-task-name`}>
              <input type="text" defaultValue={task.taskName} onKeyUp={handleEnter} onChange={updateTaskNameTimer}
                className='input-task-name' id={`${task.taskId}`} />
            </td>
            <td className={`each-task-status`}>
              <select name='status' id={`status ${task.taskId}`} defaultValue={task.taskStatus} onChange={updateTasKStatus}  >
                <option value="To do">To do</option>
                <option value="Doing" >Doing</option>
                <option value="Done">Done</option>
              </select>

            </td>
            <td className={`each-task-relevance`}>
              <select name='relevance' className='relevance' id={`${task.taskId}`} defaultValue={task.taskRelevance} onChange={updateTasKRelevance} >
                <option value="Low">low</option>
                <option value="Medium" >Medium</option>
                <option value="High">High</option>
              </select>
            </td>
            <td className={`each-task-date ${task.taskId}`}>
              <DatePicker placeholderText="Selecciona una fecha" className={`react-datepicker ${task.taskId}`} selected={date} value={task.taskStartDate} onChange={(newDate) => updateTasKDate(task.taskId, newDate)} dateFormat="dd-MM-yyyy"
              />
            </td>
            <td className='options'>

              <button className={`delete-button ${task.taskId}`} id={task.taskId} onClick={handleOptionsTask}>
                <img id={task.taskId} src={threeDots} alt={`button${task.taskId}`} />
              </button>
              <div id={`options${task.taskId}`} className={`hiden-optionsTaskMenu`}>
                <button id={`${task.taskId}`} onClick={deleteTaskFunction}>
                  Delete Task
                </button>
              </div>
            </td>
          </tr>
        ))}
        <div className='añadir-tarea'>
          {isLoading ? <img className='loader' src={loader} alt={loader} width={50} /> :
            <button className='button-añadir-tarea' onClick={addNewTask}>
              Añadir tarea...
            </button>
          }
        </div>
      </table>
    </section>

  )
}

export default Main;
