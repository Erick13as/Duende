import React from 'react';

function ListaOrdenesView(props) {
    const {
      navigate,
      ordenes,
      selectedOrden,
      email,
    } = props;
    
return (
    <div className="pendientes-container">
      <form className="formBarra">
        <button onClick={()=>navigate('/AccederTiendaCliente', { state: { correo: email } })} className='botonOA'>Tienda</button>
        <div className="botonBarra-container">
            <button onClick={() => navigate('/login')} className='botonOA2'>Cerrar sesión</button>
        </div>
      </form>
      <h1>Lista de Órdenes del Cliente</h1>
      <ul>
        {ordenes.map((orden) => (
          <li key={orden.id} className="orden-container">
            <p>Número de Orden: {orden.numeroOrden}</p>
            <p>Fecha de Emisión: {orden.fechaEmision}</p>
            <button className="header-buttonProducto" onClick={() => navigate(`/Orden/${orden.numeroOrden}`, { state: { correo: email } })}>Seleccionar Orden</button>
          </li>
        ))}
      </ul>
      {selectedOrden && (
        <div>
          <h2>Orden seleccionada: {selectedOrden}</h2>
        </div>
      )}
    </div>
  );
}

export default ListaOrdenesView;