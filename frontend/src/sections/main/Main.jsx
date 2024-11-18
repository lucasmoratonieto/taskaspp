import { useEffect, useReducer, useRef, useState } from 'react';
import './main.css'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

import { useNavigate } from 'react-router-dom';



function Main() {

  const [allTasks, setAllTasks] = useState([])
  const [userNameState, setUserNameState] = useState('Not Registre, Please log in')
  const navigate = useNavigate();
  let userName = ''

  const [startDate, setStartDate] = useState(new Date());




  const getTasks = async () => {
    const res = await fetch('http://localhost:3500/getTasks',
      {
        method: 'GET'
      }
    )
    const allTasks = await res.json()
    setAllTasks(allTasks);

  }

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


    getUserName()


    getTasks()
  }, [])


  const updateTasKName = async (changeTaskName) => {
    const id = changeTaskName.id
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
    getTasks()

  }



  const updateTasKStatus = async (event) => {
    const changedStatus = event.target.value;
    const id = event.target.id;
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
    getTasks()

  }


  const updateTasKRelevance = async (event) => {
    const changedRelevance = event.target.value;
    // const id = event.target.id[event.target.id.length - 1];
    const id = event.target.id;
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
    getTasks()

  }





  const updateTasKDate = async (event) => {
    const changedRelevance = event;
    const id = event.target;
    console.log(changedRelevance)
    console.log(id)

    // const res = await fetch('http://localhost:3500/changeRelevance',
    //   {
    //     method: 'POST',
    //     headers: {
    //       "Content-Type": 'application/json'
    //     },
    //     body: JSON.stringify({
    //       id: id,
    //       taskRelevance: changedRelevance
    //     })
    //   }
    // )
    // const postChangeRelevance = await res.json()
    // console.log(postChangeRelevance)
    // getTasks()

  }









  function handleEnter(event) {
    const changedRelevance = event.target;

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
    setTimeout(() => {
      getTasks()
    }, 200)
  }

  return (
    <section>
      <h1>
        Welcome to Task App {userNameState} 👋
      </h1>
      <h2>These are the all the tasks from the dataBase</h2>
      <div className='products'>
        <div className='table-title'>

          <h4>
            Nº
          </h4>
          <h4 className='table-title-name'>
            Task Name
          </h4>
          <h4 className='table-title-status'>
            Status
          </h4>
          <h4 className='table-title-relevance'>
            Relevance
          </h4>
          <h4 className='table-title-start-date'>
            Start Date
          </h4>
        </div>
        {allTasks.map((task, number) => (

          <div key={task.id} className={`each-product product-${task.id}`} >
            <div className={`each-product-id`}>
              {number + 1}
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
            <div className='each-product-date'>
              <DatePicker placeholderText="Selecciona una fecha" className='react-datepicker' onChange={updateTasKDate} dateFormat="dd-MM-yyyy" // Configura el formato deseado
              />
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
