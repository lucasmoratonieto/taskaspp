import { useEffect, useReducer, useRef, useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  let serverAnwserToEnter = ''
  let userDataPosted = ''
  let getURL = ''

  const userNameRef = useRef(null)
  const passwordRef = useRef(null)
  // const [handleSubmit, setHandleSubmit] = useState(null)

  const navigate = useNavigate();

  function submitInfo(e) {
    const userName = userNameRef.current.value
    const password = passwordRef.current.value

    const userCredentials = {
      "userName": "",
      "userPassword": ""
    }

    userCredentials.userName = userName
    userCredentials.userPassword = password

    console.log(userCredentials)

    async function checkUser() {
      const res = await fetch('http://localhost:3500/submit',
        {
          method: 'POST',
          headers: {
            "Content-Type": 'application/json'
          },
          body: JSON.stringify({
            user: userCredentials
          })
        }
      )
      serverAnwserToEnter = await res.json()
      console.log(serverAnwserToEnter)
      console.log('This is the ress: ', res.status)

      if (res.status == 200) {
        navigate('/')
      }
    }
    checkUser()
  }

  function createUser(e) {
    // e.preventDefault()
    const userName = userNameRef.current.value
    const password = passwordRef.current.value

    const userCredentials = {
      "userName": "",
      "userPassword": ""
    }

    userCredentials.userName = userName
    userCredentials.userPassword = password

    console.log(userCredentials)

    async function postNewUser() {
      const res = await fetch('http://localhost:3500/createUser',
        {
          method: 'POST',
          headers: {
            "Content-Type": 'application/json'
          },
          body: JSON.stringify({
            user: userCredentials
          })
        }
      )
      userDataPosted = await res.json()
      console.log(userDataPosted)

    }
    postNewUser()
  }


  function handleEnter(event) {
    if (event.keyCode === 13 || event.wich === 13) {
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
          <div className='button button-submit'>
            <a href='#' className='submit-link' onClick={submitInfo}>
              Submit
            </a>
          </div>
          <div>
            <a href="/" className='button button-create' onClick={createUser}>
              Create User
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
