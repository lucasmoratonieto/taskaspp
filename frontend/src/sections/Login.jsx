import './login.css';

function App() {
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
          <input className='text-area login' placeholder='User Name' required></input>
        </div>
        <div className='user-pasword
         password-area'>
          <label className='login-text'>
            <span>Password</span>
          </label>
          <input className='text-area password' placeholder='Password' autoComplete='off' required></input>
        </div>
      </div>
    </div>
  );
}

export default App;
