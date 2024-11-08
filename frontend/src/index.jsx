import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css';
import Login from './sections/login/Login';
import Main from './sections/main/Main';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div>
      <Router basename='/'>
        <Routes>
          <Route exact path ='/login'element={
            <Login/>
          }>
          </Route>
            <Route path='/' element={<Main/>}/>
        </Routes>
      </Router>
    </div>
  </React.StrictMode>
);


