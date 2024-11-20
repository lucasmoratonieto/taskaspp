import { useRef, useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../assets/constanst/constants.js'
import LoadingScreen from '../../assets/constanst/LoadingScreen.jsx';


function Login() {
  const [isLoading, setIsloading] = useState(false)
  const userNameRef = useRef(null)
  const passwordRef = useRef(null)

  const [checkPassword, setcheckPassword] = useState(null)

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

    async function checkUser() {
      setIsloading(true)
      try {

        const res = await fetch(baseURL + '/submit',
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
        if (res.status === 200) {
          navigate('/')
        }
        if (res.status === 400) {
          setcheckPassword(true)
        }
      } catch (err) {
        console.log(err)
      }
      setIsloading(true)
    }
    checkUser()

  }

  function createUser(e) {
    e.preventDefault()
    const userName = userNameRef.current.value
    const password = passwordRef.current.value

    const userCredentials = {
      "userName": "",
      "userPassword": ""
    }

    userCredentials.userName = userName
    userCredentials.userPassword = password

    async function postNewUser() {
      const res = await fetch('https://amused-respect-production.up.railway.app/createUser',

        {
          method: 'POST',
          headers: {
            "Content-Type": 'application/json'
          },
          body: JSON.stringify({
            user: {
              userName: userName,
              password: password
            }
          })
        }
      )
      if (res.status === 200) {
        navigate('/')
      }
    }
    postNewUser()
  }


  function handleEnter(event) {
    if (event.keyCode === 13 || event.wich === 13) {
      submitInfo()
    }
  }
  return (
    <section>
      {isLoading ? (<LoadingScreen />) :
        <div className="body">
          <label className='welcome-msg'>
            <h1>Welcome, please sign in </h1>
          </label>
          <div className='form'>
            <div className='user-pasword login-area'>
              <label className='login-text'>
                <span className='text-before-input username-before-input'>Username</span>
              </label>
              <input className='text-area login' placeholder='Username' required ref={userNameRef}></input>
            </div>
            <div className='user-pasword
         password-area'>
              <label className='login-text'>
                <span className='text-before-input password-before-input'>Password</span>
              </label>
              <input className='text-area password' placeholder='Password' autoComplete='off' required ref={passwordRef} onKeyUp={handleEnter} type='password'></input>
            </div>
            <div className='button-area'>
              <div className='button button-submit'>
                <button className='submit-link' onClick={submitInfo}>
                  Submit
                </button>
              </div>
              <div>
                <button className='button button-create' onClick={createUser}>
                  Create User
                </button>
              </div>
            </div>
          </div>
          <div className={`incorrect-password ${checkPassword ? '' : 'hide-incorrect-password'}`}>
            Incorrect Username or Password
          </div>
        </div>
      }
    </section>
  );
}

export default Login;
