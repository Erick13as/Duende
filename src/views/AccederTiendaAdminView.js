import React from 'react';
import { Carousel } from 'react-responsive-carousel';

function AccederTiendaAdminView(props) {
  const {
    productos,
    handleNavigate,
  } = props;

  return (
    <div className="main_page-container">
      <form className="formBarra">
        <button onClick={()=>handleNavigate('/galeriaAdmin')} className='botonOA'>Galería</button>
        <div className="botonBarra-container">
            <button onClick={() => handleNavigate('/OrdenesPendientes')} className='botonOA2'>Gestión Ordenes</button>
            <button onClick={() => handleNavigate('/AgregarProducto')} className='botonOA2'>Añadir Producto</button>
            <button onClick={() => handleNavigate('/login')} className='botonOA2'>Cerrar sesión</button>
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
