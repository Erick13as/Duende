import React from 'react';
function VerMasClienteView(props) {
    const {
        id={id},
        product,
        isInCart,
        handleAddToCart,
        handleNavigate,
        navigate,
        email,
    } = props;
    
    return (
        <div className="vmasC-container">
        <form className="formBarra">
            <button onClick={() => navigate('/AccederTiendaCliente', { state: { correo: email } })} className='botonOA'>Tienda</button>
            <div className="botonBarra-container">
                <button onClick={() => handleNavigate('/')} className='botonOA2'>Ordenes</button>
                <button onClick={() => navigate('/Carrito', { state: { correo: email } })} className='botonOA2'>Mi Carrito</button>
            </div>
        </form>

        <div className="image-info-container">
            <div className="image-button-container">
            <img
                className="imagen-galeria-container2"
                src={product.imagen}
                alt={product.nombre}
            />
            <button
                className={`add-to-cart-button ${isInCart ? 'added-to-cart' : ''}`}
                onClick={handleAddToCart}
            >
                {isInCart ? 'Añadido al carrito' : 'Añadir al carrito'}
            </button>
            </div>
            <div className="product-info">
            <h1>Detalles del Producto</h1>
            <h2>Nombre del Producto: {product.nombre}</h2>
            <p>Precio: {product.precio}</p>
            <p>Descripción: {product.descripcion}</p>
            <p>Cantidad: {product.cantidad}</p>
            <p>Marca: {product.marca}</p>
            </div>
        </div>
        </div>
    );
}
export default VerMasClienteView;