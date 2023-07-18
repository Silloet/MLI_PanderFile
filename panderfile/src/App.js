import React from 'react'
import './App.css';
import Login from './Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './index.css'
import Signup from './Signup'
import Dashboard from './Dashboard'
import ForgotPassword from './ForgotPassword'



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
