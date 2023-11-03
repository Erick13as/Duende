import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function ListaOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state && location.state.correo;

  const handleNavigate = (route) => {
    navigate(route);
  };
  useEffect(() => {
    const q = query(collection(db, 'orden'), where('idCliente', '==', userId));
    getDocs(q)
      .then((querySnapshot) => {
        const ordenesData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Convierte el timestamp a una cadena de texto con el formato deseado (por ejemplo, 'yyyy-MM-dd')
          const fechaEmision = data.fechaEmision.toDate(); // Convierte el timestamp a un objeto Date
          const fechaEmisionFormateada = fechaEmision.toLocaleDateString(); // Formatea la fecha
          ordenesData.push({
            id: doc.id,
            numeroOrden: data.numeroOrden,
            fechaEmision: fechaEmisionFormateada, // Usa la fecha formateada
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
      <form className="formBarra">
        <button onClick={()=>navigate('/AccederTiendaCliente', { state: { correo: email } })} className='botonOA'>Tienda</button>
        <div className="botonBarra-container">
            <button onClick={() => navigate('/login')} className='botonOA2'>Cerrar sesión</button>
        </div>
      </form>
      <h1>Lista de Órdenes del Cliente</h1>
      <ul>
        {ordenes.map((orden) => (
          <li key={orden.id} className="orden-container">
            <p>Número de Orden: {orden.numeroOrden}</p>
            <p>Fecha de Emisión: {orden.fechaEmision}</p>
            <button className="header-buttonProducto" onClick={() => navigate(`/Orden/${orden.numeroOrden}`, { state: { correo: email } })}>Seleccionar Orden</button>
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
