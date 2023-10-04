import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Agenda from './components/Agenda';
import SubirImagen from './components/SubirImagen';
import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import "./components/Design.css"

const App = () => {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path='/registro' element={<SignUp />} />
        <Route path='duende/' element={<SignIn />} /> 
        <Route path='/agenda' element={<Agenda />} />
        <Route path='/subirImagen' element={<SubirImagen />} />
      </Routes>
    </div>
    </BrowserRouter>
  )
}


export default App;