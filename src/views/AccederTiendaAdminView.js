import React from 'react';
import { Carousel } from 'react-responsive-carousel';

function AccederTiendaAdminView(props) {
  const {
    productos,
    handleNavigate,
  } = props;

  return (
    <div className="main_page-container">
      {/* Contenedor rectangular en la parte superior con tres botones */}
      <div className="header-container">
        <button className="header-button inicio-button" id="inicio-buttonAdmin" onClick={() => handleNavigate('/')}>
          Inicio
        </button>
        <button className="header-button" id="ordenes-buttonAdmin" onClick={() => handleNavigate('/OrdenesPendientes')}>
          Gestión Ordenes
        </button>
        <button className="header-button" id="carrito-buttonAdmin" onClick={() => handleNavigate('/AgregarProducto')}>
          Añadir Producto
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
                <button className="botonImagen2" onClick={() => handleNavigate(`/EditarProductoAdmin/${product.id}`)}>
                  Editar Producto
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AccederTiendaAdminView;
