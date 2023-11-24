import React from 'react';
function CerrarCompraView(props) {
    const {
        order,
        rechazarOrden,
        confirmarOrden,
        calcularTotalCompra,
        handleNavigate
    } = props;
    
    return (
        <div className="CerrarCompra-container">
        <form className="formBarra">
            <button onClick={()=>handleNavigate('/AccederTiendaAdmin')} className='botonOA'>Tienda</button>
            <div className="botonBarra-container">
                <button onClick={() => handleNavigate('/login')} className='botonOA2'>Cerrar sesión</button>
            </div>
        </form>
        <div className="order-details-container">
            <h1>Detalles de la Orden</h1>
            <p>Número de Orden: {order.numeroOrden}</p>
            <p>Comprobante de Pago:</p>
            <img src={order.comprobante} alt="Comprobante de Pago" />
            <p>Total de la Compra + envío:: ${calcularTotalCompra()}</p>
            <button onClick={confirmarOrden}className='botonOA'>Confirmar</button>
            <button onClick={rechazarOrden}className='botonOA'>Rechazar</button>
        </div>
        </div>
    );
}
export default CerrarCompraView;