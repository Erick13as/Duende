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
        <div className="header-containerDetallesOrden">
            <button className="header-buttonOrden"onClick={() => handleNavigate('/AccederTiendaAdmin')}>
                Inicio</button>
        </div>
        <div className="order-details-container">
            <h1>Detalles de la Orden</h1>
            <p>Número de Orden: {order.numeroOrden}</p>
            <p>Comprobante de Pago:</p>
            <img src={order.comprobante} alt="Comprobante de Pago" />
            <p>Total de la Compra: ${calcularTotalCompra()}</p>
            <button onClick={confirmarOrden}>Confirmar</button>
            <button onClick={rechazarOrden}>Rechazar</button>
        </div>
        </div>
    );
}
export default CerrarCompraView;