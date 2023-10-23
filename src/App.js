import React, { useState } from 'react';
import './index.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import "./components/Design.css"

import { GaleriaSinLogin, GaleriaAdmin, InfoImagenAdmin, GaleriaCliente, SubirImagen, CrearCategoria, CrearSubcategoria, EliminarCategoria, EliminarSubCategoria, MostrarOpcionesAdmin, InfoImagenCliente, EnviarReferencia } from './controllers/ImageGalleryController';
import { SignIn, SignUp } from './controllers/UserController';

// import Agenda from './components/Agenda';
import AgregarProducto from './components/AgregarProducto';
import VerMasCliente from './components/VerMasCliente';
import Carrito from './components/Carrito';
import { AccederTiendaClienteController } from './controllers/AccederTiendaClienteController';
import { AccederTiendaAdminController } from './controllers/AccederTiendaAdminController';
import EditarProductoAdmin from './components/EditarProductoAdmin';

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
        <Route path='/duende' element={<GaleriaSinLogin />}/>
        <Route path='/galeriaAdmin' element={<GaleriaAdmin />} />
        <Route path='/infoImagenAdmin' element={<InfoImagenAdmin />} />
        <Route path='/galeriaCliente' element={<GaleriaCliente />} />
        <Route path='/subirImagen' element={<SubirImagen />} />
        <Route path='/login' element={<SignIn />} /> 
        <Route path='/registro' element={<SignUp />} />
        <Route path='/AgregarProducto' element={<AgregarProducto />} />
        <Route path='AccederTiendaClienteController/' element={<AccederTiendaClienteController />}/>
        <Route path='AccederTiendaAdminController/' element={<AccederTiendaAdminController />}/>
        {/* <Route path='/agenda' element={<Agenda />} /> */}
        <Route path='/infoImagenCliente' element={<InfoImagenCliente />} />
        <Route path="/Carrito" element={<Carrito carrito={carrito} removeFromCart={removeFromCart} />} />
        <Route path='/VerMasCliente/:id' element={<VerMasCliente />}  />
        <Route path='/crearCategoria' element={<CrearCategoria/>}/>
        <Route path='/opcionesAdmin' element={<MostrarOpcionesAdmin />} />
        <Route path='/eliminarCategoria' element={<EliminarCategoria />} />
        <Route path='/eliminarSubcategoria' element={<EliminarSubCategoria />} />
        <Route path='/crearSubcategoria' element={<CrearSubcategoria />} />
        <Route path='/EditarProductoAdmin/:id' element={<EditarProductoAdmin />}  />
        <Route path='/enviarReferencia' element={<EnviarReferencia />} />
      </Routes>
    </div>
    </BrowserRouter>
  )
}


export default App;