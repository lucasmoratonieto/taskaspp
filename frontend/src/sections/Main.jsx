import { useEffect, useReducer, useRef, useState } from 'react';
import './login.css';

function Main() {

  const [allTasks, setAllTasks] = useState([])

  useEffect(()=>{
    const getTasks = async () => {
      const res = await fetch('http://localhost:3500/getTasks',
        {
          method:'GET'
        }
      )
      
      const allTasks = await res.json()
      console.log(allTasks)
      console.log(allTasks[0].id)

      setAllTasks(allTasks); 
      
      // for (let i = 0; i <= allTasks.length - 1; i++){
        //   const eachProductLIP = document.createElement('li');
        //   const eachProductLIPL = document.createElement('div');
        //   eachProductLIP.textContent = `${i + 1}. ${allTasks[i].productName} `
        //   eachProductLIPL.textContent = `${allTasks[i].productPrice}$ left: ${allTasks[i].productCuantity}`
        //   let luList[0].appendChild(eachProductLIP)
        //   eachProductLIP.classList.add('product')
        //   eachProductLIP.appendChild(eachProductLIPL)
        //   eachProductLIPL.classList.add('product-specifications')
        // }
      }
      getTasks()
    }, [])

    return (
      <ul>
        {allTasks.map((task) =>(
          <li key={task.id} className='product'>
            {task.taskName}
            {task.taskRelevance}
          </li>
        ))}
      </ul>
      
    )
}

export default Main;
