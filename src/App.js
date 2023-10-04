import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Agenda from './components/Agenda';
import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import "./components/Design.css"

const App = () => {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path='/signUp' element={<SignUp />} />
        <Route path='duende/' element={<SignIn />} /> 
        <Route path='/agenda' element={<Agenda />} />
      </Routes>
    </div>
    </BrowserRouter>
  )
}


export default App;