import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom

function ListaOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [selectedOrden, setSelectedOrden] = useState(null);

  useEffect(() => {
    // Consulta Firestore para obtener órdenes con estado "pendiente"
    const q = query(collection(db, 'orden'), where('estado', '==', 'pendiente'));

    getDocs(q)
      .then((querySnapshot) => {
        const ordenesData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          ordenesData.push({
            id: doc.id,
            numeroOrden: data.numeroOrden,
            fechaEmision: data.fechaEmision,
            idCliente: data.idCliente,
          });
        });
        setOrdenes(ordenesData);
      })
      .catch((error) => {
        console.error('Error al obtener las órdenes:', error);
      });
  }, []);

  return (
    <div className="pendientes-container">
      <div className="header-containerOrdenesPendientes">
        <Link to="/AccederTiendaAdminController">
          <button className="header-buttonProducto">Inicio</button>
        </Link>
      </div>
      <h1>Lista de Órdenes Pendientes</h1>
      <ul>
        {ordenes.map((orden) => (
          <li key={orden.id}>
            <p>Número de Orden: {orden.numeroOrden}</p>
            <p>Fecha de Emisión: {orden.fechaEmision}</p>
            <p>ID del Cliente: {orden.idCliente}</p>
            {/* Utiliza Link para enlazar a la página de detalles de la orden */}
            <Link to={`/CerrarCompra/${orden.id}`}>
            <button className="botonImagen2">Seleccionar Orden</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaOrdenes;
