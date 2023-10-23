import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

function CerrarCompra() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const rechazarOrden = async () => {
    try {
      const orderDoc = doc(db, 'orden', id);
      await updateDoc(orderDoc, {
        estado: 'rechazada',
      });
      console.log('Orden rechazada con éxito');
      // Redirige a la página OrdenesPendientes
      window.location.href = '/OrdenesPendientes';
    } catch (error) {
      console.error('Error al rechazar la orden:', error);
    }
  };

  const confirmarOrden = async () => {
    try {
      const orderDoc = doc(db, 'orden', id);
      await updateDoc(orderDoc, {
        estado: 'confirmada',
      });
      console.log('Orden confirmada con éxito');
      // Redirige a la página OrdenesPendientes
      window.location.href = '/OrdenesPendientes';
    } catch (error) {
      console.error('Error al confirmar la orden:', error);
    }
  };

  useEffect(() => {
    // Obtener la orden seleccionada desde la base de datos
    const getOrderDetails = async () => {
      try {
        const orderDoc = doc(db, 'orden', id);
        const orderSnapshot = await getDoc(orderDoc);
        if (orderSnapshot.exists()) {
          const orderData = orderSnapshot.data();
          setOrder(orderData);
        } else {
          console.log('La orden no se encontró en la base de datos.');
        }
      } catch (error) {
        console.error('Error al obtener detalles de la orden:', error);
      }
    };

    getOrderDetails();
  }, [id]);

  if (!order) {
    return <div>No se encontró la orden o ocurrió un error.</div>;
  }

  const calcularTotalCompra = () => {
    if (order && order.ListaProductos && typeof order.ListaProductos === 'object') {
      const productList = Object.values(order.ListaProductos);
      return productList.reduce((total, producto) => {
        return total + producto.cantidad * producto.precio;
      }, 0);
    } else {
      return 0;
    }
  };

  return (
    <div className="CerrarCompra-container">
      <div className="header-containerDetallesOrden">
        <button className="header-buttonOrden">Inicio</button>
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

export default CerrarCompra;
