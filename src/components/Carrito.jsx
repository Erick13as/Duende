import React from 'react';

function Carrito({ carrito, removeFromCart }) {
  return (
    <div>
      <h2>Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <ul>
          {carrito.map((producto) => (
            <li key={producto.id}>
              {producto.nombre} - ${producto.precio}
              <button onClick={() => removeFromCart(producto)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Carrito;