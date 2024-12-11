import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Login from './sections/login/Login';
import Main from './sections/main/Main';
import InactivityHandler from './functions/InactivityHandler ';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <InactivityHandler />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/:userNameURL" element={<Main />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
