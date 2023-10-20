import React, { useEffect, useState } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
/*import { ProductModel } from './productosModel';*/
import AccederTiendaAdminView from '../views/AccederTiendaAdminView'; 
import { useNavigate } from 'react-router-dom';

function AccederTiendaAdminController() {
  /*const [model, setModel] = useState(new ProductModel());*/
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Consulta Firestore para obtener los productos.
    const q = collection(db, 'productos');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listaproductos = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        listaproductos.push(data);
      });

      setProductos(listaproductos);
    });

    return () => unsubscribe();
  }, []); // Remove productos from the dependency array

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <AccederTiendaAdminView
      productos={productos}
      handleNavigate={handleNavigate}
    />
  );
}

export { AccederTiendaAdminController };
