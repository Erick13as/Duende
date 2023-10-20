import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Agenda from './components/Agenda';
import SubirImagen from './components/SubirImagen';
import GaleriaSinLogin from './components/GaleriaSinLogin';
import GaleriaAdmin from './components/GaleriaAdmin';
import GaleriaCliente from './components/GaleriaCliente';
import InfoImagenAdmin from './components/InfoImagenAdmin';
import InfoImagenCliente from './components/InfoImagenCliente';
import VerMasCliente from './components/VerMasCliente';
import { AccederTiendaClienteController } from './controllers/AccederTiendaClienteController';
import CrearCategoria from './components/CrearCategoria';
import { ImageGalleryController } from './controllers/ImageGalleryController';
import { Prueba } from './controllers/ImageGalleryController';
import AgregarProducto  from './components/AgregarProducto';
import MostrarOpcionesAdmin from './components/MostrarOpcionesAdmin';
import EliminarCategoria from './components/EliminarCategoria';
import EliminarSubCategoria from './components/EliminarSubCategoria';
import CrearSubcategoria from './components/CrearSubcategoria';
import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import "./components/Design.css"

const App = () => {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path='/registro' element={<SignUp />} />
        <Route path='/login' element={<SignIn />} /> 
        <Route path='/agenda' element={<Agenda />} />
        <Route path='/subirImagen' element={<SubirImagen />} />
        <Route path='duende/' element={<GaleriaSinLogin />} />
        <Route path='/galeriaAdmin' element={<GaleriaAdmin />} />
        <Route path='/galeriaCliente' element={<GaleriaCliente />} />
        <Route path='/infoImagenAdmin' element={<InfoImagenAdmin />} />
        <Route path='/infoImagenCliente' element={<InfoImagenCliente />} />
        <Route path='AccederTiendaClienteController/' element={<AccederTiendaClienteController />}/>
        <Route path='/VerMasCliente/:id' element={<VerMasCliente />}  />
        <Route path='/crearCategoria' element={<CrearCategoria/>}/>
        <Route path='/ImageGalleryController' element={<ImageGalleryController/>}/>
        <Route path='/Prueba' element={<Prueba/>}/>
        <Route path='/AgregarProducto' element={<AgregarProducto/>}/>
        <Route path='/opcionesAdmin' element={<MostrarOpcionesAdmin />} />
        <Route path='/eliminarCategoria' element={<EliminarCategoria />} />
        <Route path='/eliminarSubcategoria' element={<EliminarSubCategoria />} />
        <Route path='/crearSubcategoria' element={<CrearSubcategoria />} />
      </Routes>
    </div>
    </BrowserRouter>
  )
}


export default App;