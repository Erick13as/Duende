import React from 'react';

function CarritoView(props) {
    const {
      navigate,
      email,
      carritoData,
      productData,
      total,
      finalizarCompra,
      handleQuantityChange,
    } = props;
    
return (
    <div className="carrito-container">
        <form className="formBarra">
        <button onClick={() => navigate('/AccederTiendaCliente', { state: { correo: email } })} className='botonOA'>Tienda</button>
        <div className="botonBarra-container">
            <button onClick={() => navigate('/login')} className='botonOA2'>Cerrar sesión</button>
        </div>
        </form>
        <h2>Carrito de Compras</h2>
        <table className="carrito-table" style={{ margin: '0 auto' }}>
        <thead>
            <tr>
            <th>Producto</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            </tr>
        </thead>
        <tbody>
            {carritoData.map((item) => {
            const product = productData.find((p) => p.id === item.id);
            return (
                <tr key={item.id}>
                <td>
                    {product ? <img className="carrito-product-img" src={product.imagen} alt={product.nombre} /> : 'N/A'}
                </td>
                <td>{product ? product.descripcion : 'N/A'}</td>
                <td>
                    <div className="carrito-product-actions">
                    <button
                        onClick={() => handleQuantityChange(item.id, item.cantidad - 1)}
                        className="carrito-quantity-button"
                    >
                        -
                    </button>
                    <input
                        type="text"
                        className="carrito-quantity-input"
                        value={item.cantidad}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        readOnly={true}
                    />
                    <button
                        onClick={() => handleQuantityChange(item.id, item.cantidad + 1)}
                        className="carrito-quantity-button"
                    >
                        +
                    </button>
                    </div>
                </td>
                <td>{product ? `$${product.precio}` : 'N/A'}</td>
                </tr>
            );
            })}
        </tbody>
        </table>
        <div className="carrito-total" style={{ marginTop: '20px' }}>
        Total: ${total}
        </div>
        <button onClick={finalizarCompra} className="botonOA">
        Finalizar Compra
    </button>
    </div>
    );
}

export default CarritoView;