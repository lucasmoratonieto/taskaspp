import { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import './main.css'
import DatePicker from "react-datepicker";

import { useNavigate } from 'react-router-dom';
import { threeDots } from '../../assets/icons/icons.js';
import { baseURL } from '../../assets/constanst/constants.js'



function Main() {


  const [allTasks, setAllTasks] = useState([])
  const [userNameState, setUserNameState] = useState('Not Registre, Please log in')
  const navigate = useNavigate();
  // let userName = ''

  const [startDate, setStartDate] = useState(new Date());

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
    const res = await fetch(baseURL + '/userName',
      {
        method: 'GET'
      }
    )
    const status = await res.status

    if (status !== 400) {

      // console.log(status)
      const getUserNameGet = await res.json()
      const userName = getUserNameGet[0].userName

      setUserNameState(userName);
      getTasks()
    } else if (status === 400) {
      navigate('/login')
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


  const updateTasKName = async (changeTaskName) => {
    const id = changeTaskName.id
    const updatedTasKName = changeTaskName.value
    console.log(id)
    console.log(updatedTasKName)
    const res = await fetch(baseURL + '/changeTaskName',
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
    getTasks()

  }



  const updateTasKStatus = async (event) => {
    const changedStatus = event.target.value;
    const id = event.target.id;
    console.log(changedStatus)
    console.log(id)

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
    console.log(changedRelevance)
    console.log(id)

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

  const updateTasKDate = async (date, event) => {

    //Esto funciona, pero el poblema es que datepicker cambia los nomnbres y el event.target no tiene id.
    setStartDate(date);
    const week = event.target.parentElement;
    const month = week.parentElement;
    const monthContainer = month.parentElement;
    const calendar = monthContainer.parentElement;
    const style = calendar.parentElement;
    const pooper = style.parentElement;
    const loop = pooper.parentElement;
    const test = loop.parentElement.className;
    const id = test[test.length - 1]


    const changedDateText = event.target.ariaLabel;
    const changedDateTextth = changedDateText.substr(7)
    const removeOrdinal = (changedDateTextth) => changedDateTextth.replace(/(\d+)(st|nd|rd|th)/, "$1");
    const changedDate = removeOrdinal(changedDateTextth);

    const parsedDate = new Date(changedDate.replace(/^\w+, /, ""));
    const formattedDate = parsedDate.toLocaleDateString({

      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });


    console.log(id)
    console.log(formattedDate)


    const dateValue = document.getElementsByClassName(`react-datepicker ${id}`)[0].value
    console.log('This is the date value', dateValue)


    const res = await fetch(baseURL + '/changeDate',
      {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          id: id,
          taskDate: formattedDate
        })
      }
    )
    const postChangeDate = await res.json()
    console.log(postChangeDate)
    getTasks()

  }
  function handleEnter(event) {
    const changedRelevance = event.target;

    if (event.keyCode === 13 || event.wich === 13) {
      updateTasKName(changedRelevance)
    }
  }

  function addNewTask() {

    const task = {
      "taskName": "",
      "taskStatus": "To do",
      "taskRelevance": "Low"
    }

    async function postNewTask() {
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
    }
    postNewTask()
    setTimeout(() => {
      getTasks()
    }, 200)
  }

  async function deleteTaskFunction(event) {
    const id = event.target.id;
    console.log(id)
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

          <tr key={task.id} className={`each-task task-${task.id}`} >
            <td className={`each-task-id`}>
              {number + 1}
            </td>
            <td className={`each-task-name`}>
              <input type="text" defaultValue={task.taskName} onKeyUp={handleEnter} /*onChange={handleMouse} */ className='input-task-name' id={`${task.id}`} />
            </td>
            <td className={`each-task-status`}>
              <select name='status' id={`status ${task.id}`} defaultValue={task.taskStatus} onChange={updateTasKStatus}  >
                <option value="To do">To do</option>
                <option value="Doing" >Doing</option>
                <option value="Done">Done</option>
              </select>

            </td>
            <td className={`each-task-relevance`}>
              <select name='relevance' className='relevance' id={`${task.id}`} defaultValue={task.taskRelevance} onChange={updateTasKRelevance} >
                <option value="Low">low</option>
                <option value="Medium" >Medium</option>
                <option value="High">High</option>
              </select>
            </td>
            <td className={`each-task-date ${task.id}`}>
              <DatePicker placeholderText="Selecciona una fecha" className={`react-datepicker ${task.id}`} selected={startDate} onChange={updateTasKDate} dateFormat="dd-MM-yyyy" // Configura el formato deseado
              />
            </td>
            <td>
              <button className={`delete-button ${task.id}`} id={task.id} onClick={deleteTaskFunction}>
                <img src={threeDots} alt={`button${task.id}`} />
              </button>
            </td>
          </tr>
        ))}
        <div className='añadir-tarea'>
          <button className='button-añadir-tarea' onClick={addNewTask}>
            Añadir tarea...
          </button>
        </div>
      </table>
    </section>

  )
}

export default Main;
