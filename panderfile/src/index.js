import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Login from './Pages/Login';
import ForgotPassword from './Pages/ForgotPassword';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
   <Routes>
    
   <Route path='/' element={<Login />}></Route>
    <Route path='/Signup' element={<Signup />}></Route>
    <Route path='/ForgotPassword' element={<ForgotPassword />}></Route>
    <Route path='/Dashboard' element={<Dashboard />}></Route>
    
   </Routes>
    </BrowserRouter>
 
  );




// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
