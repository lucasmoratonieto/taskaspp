import { useReducer, useRef } from 'react';
import './login.css';

function Login() {

  const userNameRef = useRef(null)
  const passwordRef = useRef(null)
     
  function submitInfo(e){
    // e.preventDefault()
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
      const res = await fetch('http://localhost:3500/submit',
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
      console.log('This is the ress: ', res.status)
      if(res.status == 200){
        const res = await fetch('http://localhost:3500/getData',
          {
            method:'GET'
          }
        )
        const dataGet = await res.json()
        console.log(dataGet)
      }
    }
    getHolaNode()
  }

  function createUser(e){
    // e.preventDefault()
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
      const res = await fetch('http://localhost:3500/createUser',
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
  
  function handleEnter(event) {
    if(event.keyCode === 13 || event.wich === 13){
      submitInfo()
    }
  }
  return (
    <div className="body">
      <label className='welcome-msg'>
        <span>Welcome, please sign in </span>
      </label>
      <div className='form'>
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
          <input className='text-area password' placeholder='Password' autoComplete='off' required ref={passwordRef} onKeyUp={handleEnter} type='password'></input>
        </div>
        <div className='button-area'>
        <button className='button button-submit' onClick={submitInfo}>
            <span>
              <a href="./">Submit</a>
              </span>
          </button>
          <button className='button button-create' onClick={createUser}>
            <span>Create User</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
