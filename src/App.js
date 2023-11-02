import React, { useState } from 'react';
import './index.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import "./components/Design.css"

import { GaleriaSinLogin, GaleriaAdmin, InfoImagenAdmin, GaleriaCliente, SubirImagen, CrearCategoria, CrearSubcategoria, EliminarCategoria, EliminarSubCategoria, MostrarOpcionesAdmin, InfoImagenCliente, EnviarReferencia } from './controllers/ImageGalleryController';
import { SignIn, SignUp } from './controllers/UserController';
import { AgregarProducto,EditarProductoAdmin,VerMasCliente,AccederTiendaCliente,AccederTiendaAdmin,IngresarDireccion,Carrito} from './controllers/ProductoController';
import { CerrarCompra,OrdenesPendientes} from './controllers/CompraController';
import ComprasRealizadas from './components/ComprasRealizadas';
//import Orden from './components/Orden';

// import Agenda from './components/Agenda';

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
        <Route path='/duende' element={<GaleriaSinLogin />}/>
        <Route path='/galeriaAdmin' element={<GaleriaAdmin />} />
        <Route path='/infoImagenAdmin' element={<InfoImagenAdmin />} />
        <Route path='/galeriaCliente' element={<GaleriaCliente />} />
        <Route path='/subirImagen' element={<SubirImagen />} />
        <Route path='/login' element={<SignIn />} /> 
        <Route path='/registro' element={<SignUp />} />
        <Route path='/AgregarProducto' element={<AgregarProducto />} />
        <Route path='AccederTiendaCliente/' element={<AccederTiendaCliente />}/>
        <Route path='AccederTiendaAdmin/' element={<AccederTiendaAdmin />}/>
        {/* <Route path='/agenda' element={<Agenda />} /> */}
        <Route path='/infoImagenCliente' element={<InfoImagenCliente />} />
        <Route path="/Carrito" element={<Carrito carrito={carrito} removeFromCart={removeFromCart} />} />
        <Route path='/VerMasCliente' element={<VerMasCliente />}  />
        <Route path='/crearCategoria' element={<CrearCategoria/>}/>
        <Route path='/opcionesAdmin' element={<MostrarOpcionesAdmin />} />
        <Route path='/eliminarCategoria' element={<EliminarCategoria />} />
        <Route path='/eliminarSubcategoria' element={<EliminarSubCategoria />} />
        <Route path='/crearSubcategoria' element={<CrearSubcategoria />} />
        <Route path='/EditarProductoAdmin/:id' element={<EditarProductoAdmin />}  />
        <Route path='/enviarReferencia' element={<EnviarReferencia />} />
        <Route path='/OrdenesPendientes' element={<OrdenesPendientes />}  />
        <Route path='/CerrarCompra/:id'element={<CerrarCompra />}  />
        <Route path='/ingresarDireccion' element={<IngresarDireccion />} />
        <Route path='/ComprasRealizadas/:userId'element={<ComprasRealizadas />}  />
        <Route path='/ComprasRealizadas/:orderId'element={<ComprasRealizadas />}  />
      </Routes>
    </div>
    </BrowserRouter>
  )
}


export default App;