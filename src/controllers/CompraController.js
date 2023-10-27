import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom
import CerrarCompraView from '../views/CerrarCompraView';
import { useParams } from 'react-router-dom';
import {  doc, getDoc, updateDoc } from 'firebase/firestore';

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
    <CerrarCompraView
        id={id}
        order={order}
        rechazarOrden={rechazarOrden}
        confirmarOrden={confirmarOrden}
        calcularTotalCompra={calcularTotalCompra}
    />
  );
}
export {CerrarCompra};
