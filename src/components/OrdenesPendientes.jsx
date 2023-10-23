import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

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
          // Aquí puedes acceder a los datos de cada orden
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

  const handleOrdenSelection = (ordenId) => {
    setSelectedOrden(ordenId);
  };

  return (
    <div className="pendientes-container">
      <div className="header-containerOrdenesPendientes">
        <button className="header-buttonProducto">Inicio</button>
      </div>
      <h1>Lista de Órdenes Pendientes</h1>
      <ul>
        
        {ordenes.map((orden) => (
          <li key={orden.id}>
            <p>Número de Orden: {orden.numeroOrden}</p>
            <p>Fecha de Emisión: {orden.fechaEmision}</p>
            <p>ID del Cliente: {orden.idCliente}</p>
            <buttonOrdenesPendientes onClick={() => handleOrdenSelection(orden.id)}>Seleccionar Orden</buttonOrdenesPendientes>
          </li>
        ))}
      </ul>

      {selectedOrden && (
        <div>
          <h2Ordenes>Orden seleccionada: {selectedOrden}</h2Ordenes>
          {/* Aquí puedes mostrar más detalles de la orden seleccionada */}
        </div>
      )}
    </div>
  );
}

export default ListaOrdenes;
