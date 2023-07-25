import React from 'react'
import ReactDOM from 'react-dom/client';
import './App.css';
import Login from './Pages/Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './index.css'
import Signup from './Pages/Signup'
import Dashboard from './Pages/Dashboard'
import ForgotPassword from './Pages/ForgotPassword'



function App() {
  
  return (
  
      
   <BrowserRouter>
   <Routes>
    
    <Route path='/' element={<Login />}></Route>
    <Route path='/Signup' element={<Signup />}></Route>
    <Route path='/ForgotPassword' element={<ForgotPassword />}></Route>
    <Route path='/Dashboard' element={<Dashboard />}></Route>
    
   </Routes>
    </BrowserRouter>
 
  );
}





export default App;
