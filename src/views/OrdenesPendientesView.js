import React from 'react';
function OrdenesPendientesView(props) {
    const {
        ordenes,
        setOrdenes,
        selectedOrden,
        setSelectedOrden,
        handleNavigate
    } = props;
    
    return (
        <div className="pendientes-container">
      <div className="header-containerOrdenesPendientes">
            <button className="header-button inicio-button" onClick={() => handleNavigate('/AccederTiendaAdminController')}>
              Inicio
            </button>
      </div>
      <h1>Lista de Órdenes Pendientes</h1>
      <ul>
        {ordenes.map((orden) => (
          <li key={orden.id}>
            <p>Número de Orden: {orden.numeroOrden}</p>
            <p>Fecha de Emisión: {orden.fechaEmision}</p>
            <p>ID del Cliente: {orden.idCliente}</p>
            {/* Utiliza Link para enlazar a la página de detalles de la orden */}
            
            <button className="botonImagen2" onClick={() => handleNavigate(`/CerrarCompra/${orden.id}`)}>
                Seleccionar Orden
            </button>
          </li>
        ))}
      </ul>
    </div>
    );
}
export default OrdenesPendientesView;