import React from 'react';

function DetallesOrdenView(props) {
    const {
      navigate,
      orden,
      productos,
      total,
      email,
    } = props;
    
return (
    <div className="compra-container">
      <form className="formBarra">
        <button onClick={()=>navigate('/AccederTiendaCliente', { state: { correo: email } })} className='botonOA'>Tienda</button>
        <div className="botonBarra-container">
            <button onClick={() => navigate('/login')} className='botonOA2'>Cerrar sesión</button>
        </div>
      </form>
      {orden && (
        <div>
          <h1>Número de Orden: {orden.numeroOrden}</h1>
          <table>
            <thead>
              <tr>
                <th className="table-cell">Producto</th>
                <th className="table-cell">Nombre</th>
                <th className="table-cell">Cantidad</th>
                <th className="table-cell">Precio Unitario</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr className="table-row" key={producto.id}>
                  <td className="table-cell"><img src={producto.imagen} alt={producto.nombre} /></td>
                  <td className="table-cell">{producto.nombre}</td>
                  <td className="table-cell">{producto.cantidad}</td>
                  <td className="table-cell">{producto.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <h2>Dirección de entrega: {orden.direccionEntrega}</h2>
          <h2>Estado: {orden.estado}</h2>
          <h2>Total + envío: {total}</h2>
          
        </div>
      )}
    </div>
  );
  
}

export default DetallesOrdenView;