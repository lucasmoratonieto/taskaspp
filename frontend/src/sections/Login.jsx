import { useReducer, useRef } from 'react';
import './login.css';

function App() {

  const userNameRef = useRef(null)
  const passwordRef = useRef(null)
     
  function submitInfo(e){
    e.preventDefault()
    const userName = userNameRef.current.value
    const password = passwordRef.current.value

    const userCredentials = {
      "userName":"",
      "userPassword":""
    }

    userCredentials.userName = userName
    userCredentials.userPassword = password
  
    console.log(userCredentials)

    async function getHolaNode() {
      const res = await fetch('http://localhost:3000/getData',
        {
          method:'POST',
          headers:{
             "Content-Type": 'application/json'
          },
          body:JSON.stringify({
            user: userCredentials
          })
        }
      )
      const data = await res.json()
      console.log(data)
    }

    getHolaNode()

  }


  

  return (
    <div className="body">
      <label className='welcome-msg'>
        <span>Welcome, please sign in </span>
      </label>
      <div className=''>
        <div className='user-pasword login-area'>
          <label className='login-text'>
            <span>User Name</span>
          </label>
          <input className='text-area login' placeholder='User Name' required ref={userNameRef}></input>
        </div>
        <div className='user-pasword
         password-area'>
          <label className='login-text'>
            <span>Password</span>
          </label>
          <input className='text-area password' placeholder='Password' autoComplete='off' required ref={passwordRef}></input>
        </div>
        <div>
          <button className='button-submit' onClick={submitInfo}>
            <span>submit</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
