import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useParams } from 'react-router-dom';

function ListaOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const q = query(collection(db, 'orden'), where('idCliente', '==', userId));
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
  }, [userId]);

  const handleOrdenSelection = (ordenId) => {
    setSelectedOrden(ordenId);
  };

  return (
    <div className="pendientes-container">
      <div className="header-containerOrdenesPendientes">
        <button className="header-buttonProducto">Inicio</button>
      </div>
      <h1>Lista de Órdenes del Cliente</h1>
      <ul>
        {ordenes.map((orden) => (
          <li key={orden.id} className="orden-container">
            <p>Número de Orden: {orden.numeroOrden}</p>
            <p>Fecha de Emisión: {orden.fechaEmision}</p>
            <button className="header-buttonProducto" onClick={() => handleOrdenSelection(orden.id)}>Seleccionar Orden</button>
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

export default ListaOrdenes;
