import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '..//assets/constanst/constants'

const InactivityHandler = ({ timeout = 300000 }) => { // Timeout in milliseconds (5 minutes default)
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let logoutTimer;

    // Reset the timer when user interacts
    const resetTimer = () => {
      setIsActive(true);
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
        setIsActive(false);
        handleLogout();
      }, timeout);
    };

    // Function to handle user logout
    const handleLogout = () => {
      console.log("User logged out due to inactivity.");
      // Clear user session (localStorage, cookies, etc.)
      localStorage.removeItem("user");
      navigate("/login");
    };

    // Add event listeners for user activity
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);
    window.addEventListener("click", resetTimer);

    // Initialize the timer
    resetTimer();

    // Cleanup event listeners and timer on component unmount
    return () => {
      clearTimeout(logoutTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [timeout, navigate]);

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

  return isActive ? (
    ''
  ) : (
    <div>Session expired. Redirecting to login...</div>
  );
};

export default InactivityHandler;
