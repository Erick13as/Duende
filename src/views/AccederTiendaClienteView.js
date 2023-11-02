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
      {/* Contenedor rectangular en la parte superior con tres botones */}
      <div className="header-container">
        <button className="header-button inicio-button" id="inicio-button" onClick={() => handleNavigate('/duende')}>
          Inicio
        </button>
        <button className="header-button" id="ordenes-button" onClick={() => handleNavigate('/')}>
          Ordenes
        </button>
        <span className="button-space-tienda"></span>
        <button className="header-button" id="carrito-button" onClick={navigateToCarrito}>
          Mi Carrito
        </button>
      </div>

      

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
