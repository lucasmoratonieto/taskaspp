import { useEffect, useReducer, useRef, useState } from 'react';
import './main.css'

import { useNavigate } from 'react-router-dom';



function Main() {

  const [allTasks, setAllTasks] = useState([])
  const [userNameState, setUserNameState] = useState('Not Registre, Please log in')

  const [valorSeleccionado, setValorSeleccionado] = useState(null)
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

        console.log(status)
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
      console.log(allTasks)
      console.log(allTasks[0].id)

      setAllTasks(allTasks);

    }
    getUserName()


    getTasks()
  }, [])

  function relevanceSelection() {
    let selectedRelevance = document.querySelectorAll("select")[0].value;
    console.log(selectedRelevance)
    document.getElementById('relevance').value = selectedRelevance
    console.log('This is 1', document.querySelectorAll("select")[0])
    setValorSeleccionado(selectedRelevance)

  }
  console.log('This is 2', document.querySelectorAll("select")[0])

  return (
    <section>
      <h1>
        Welcome to Task App {userNameState} 👋
      </h1>
      <h2>This are the all the tasks from the dataBase</h2>
      <div className='products'>
        {allTasks.map((task) => (
          <div key={task.id} className={`each-product product-${task.id}`} >
            <div className={`each-product-id`}>
              {task.id}
            </div>
            <div className={`each-product-name`}>
              {task.taskName}

            </div>
            <div className={`each-product-relevance`}>
              <select name='relevance' id="relevance" value={valorSeleccionado === null ? task.taskRelevance : document.querySelectorAll("select")[0].value} onChange={relevanceSelection}>
                <option id='1' value="Low">low</option>
                <option value="Medium" >Medium</option>
                <option value="High">High</option>
              </select>

            </div>
          </div>
        ))}
      </div>
    </section>

  )
}

export default Main;
