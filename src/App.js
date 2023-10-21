import React, { useState } from 'react';
import './index.css';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Agenda from './components/Agenda';
import SubirImagen from './components/SubirImagen';
import GaleriaSinLogin from './components/GaleriaSinLogin';
import GaleriaAdmin from './components/GaleriaAdmin';
import GaleriaCliente from './components/GaleriaCliente';
import AgregarProducto from './components/AgregarProducto';
import InfoImagenAdmin from './components/InfoImagenAdmin';
import InfoImagenCliente from './components/InfoImagenCliente';
import VerMasCliente from './components/VerMasCliente';
import Carrito from './components/Carrito';
import CrearCategoria from './components/CrearCategoria';
import { ImageGalleryController } from './controllers/ImageGalleryController';
import MostrarOpcionesAdmin from './components/MostrarOpcionesAdmin';
import EliminarCategoria from './components/EliminarCategoria';
import EliminarSubCategoria from './components/EliminarSubCategoria';
import CrearSubcategoria from './components/CrearSubcategoria';
import EnviarReferencia from './components/EnviarReferencia';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { AccederTiendaClienteController } from './controllers/AccederTiendaClienteController';
import { AccederTiendaAdminController } from './controllers/AccederTiendaAdminController';
import { Prueba } from './controllers/ImageGalleryController';
import "./components/Design.css"


const App = () => {
  const [carrito, setCarrito] = useState([]);
  const removeFromCart = (producto) => {
    const updatedCarrito = carrito.filter((item) => item.id !== producto.id);
    setCarrito(updatedCarrito);
  };

  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path='/AgregarProducto' element={<AgregarProducto />} />
        <Route path='AccederTiendaClienteController/' element={<AccederTiendaClienteController />}/>
        <Route path='AccederTiendaAdminController/' element={<AccederTiendaAdminController />}/>
        <Route path='/registro' element={<SignUp />} />
        <Route path='/login' element={<SignIn />} /> 
        <Route path='/agenda' element={<Agenda />} />
        <Route path='/subirImagen' element={<SubirImagen />} />
        <Route path='duende/' element={<GaleriaSinLogin />} />
        <Route path='/galeriaAdmin' element={<GaleriaAdmin />} />
        <Route path='/galeriaCliente' element={<GaleriaCliente />} />
        <Route path='/infoImagenAdmin' element={<InfoImagenAdmin />} />
        <Route path='/infoImagenCliente' element={<InfoImagenCliente />} />
        <Route path="/Carrito" element={<Carrito carrito={carrito} removeFromCart={removeFromCart} />} />
        <Route path='/VerMasCliente/:id' element={<VerMasCliente />}  />
        <Route path='/crearCategoria' element={<CrearCategoria/>}/>
        <Route path='/ImageGalleryController' element={<ImageGalleryController/>}/>
        <Route path='/Prueba' element={<Prueba/>}/>
        <Route path='/opcionesAdmin' element={<MostrarOpcionesAdmin />} />
        <Route path='/eliminarCategoria' element={<EliminarCategoria />} />
        <Route path='/eliminarSubcategoria' element={<EliminarSubCategoria />} />
        <Route path='/crearSubcategoria' element={<CrearSubcategoria />} />
        <Route path='/enviarReferencia' element={<CrearCategoria />} />
      </Routes>
    </div>
    </BrowserRouter>
  )
}


export default App;