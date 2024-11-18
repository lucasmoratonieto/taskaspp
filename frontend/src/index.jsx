import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './sections/login/Login';
import Main from './sections/main/Main';

// Punto de entrada donde se renderiza la app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Definir rutas para cada componente */}
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Main />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
