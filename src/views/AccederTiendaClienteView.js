import React from 'react';
import { Carousel } from 'react-responsive-carousel';

function AccederTiendaClienteView(props) {
  const {
    productos,
    handleNavigate,
    navigateToCarrito,
    email,
    navigate,
  } = props;

  return (
    <div className="main_page-container">
      <form className="formBarra">
        <button onClick={()=>navigate('/galeriaCliente', { state: { correo: email } })} className='botonOA'>Galería</button>
        <div className="botonBarra-container">
            <button onClick={() => handleNavigate(`/ComprasRealizadas/${"C1"}`)} className='botonOA2'>Ordenes</button>
            <button onClick={navigateToCarrito} className='botonOA2'>Mi Carrito</button>
            <button onClick={() => navigate('/login')} className='botonOA2'>Cerrar sesión</button>
        </div>
      </form>
      

      <div>
        <div className="productos-container">
          {productos.map((product, index) => (
            <div key={index} className="producto">
              <div className="imagen-container2">
                <img className="imagen-galeria-container2" src={product.imagen} alt={product.nombre} />
              </div>
              <div className="details-container">
                <h3 className="titleAccederTienda">{product.nombre}</h3>
                <p className="precio"> ${product.precio}</p>
                <button className="botonImagen2" onClick={() => navigate('/VerMasCliente', { state: { correo: email, producto: product.id } })}>
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AccederTiendaClienteView;
