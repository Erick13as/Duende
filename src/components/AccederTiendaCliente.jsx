import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  const handleNavigate = (route) => {
    navigate(route);
  };

  useEffect(() => {
    const q = collection(db, 'productos');

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const products = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        products.push(data);
      });
      setProductos(products);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="main_page-container">
      {/* Contenedor rectangular en la parte superior con tres botones */}
      <div className="header-container">
        <button className="header-button inicio-button" id="inicio-button"  onClick={() => handleNavigate('/')}>
          Inicio
        </button>
        <button className="header-button" id="ordenes-button"  onClick={() => handleNavigate('/ordenes')}>
          Ordenes
        </button>
        <button className="header-button" id="carrito-button"  onClick={() => handleNavigate('/carrito')}>
          Mi Carrito
        </button>
      </div>


      <div className="centered-carousel">
        <div className="productos-container">
          {productos.map((product, index) => (
            <div key={index} className="producto">
              <div className="imagen-container2">
                <img
                  className="imagen-galeria-container2"
                  src={product.imagen}
                  alt={product.nombre}
                />
              </div>
              <div className="details-container">
                <h3 className="titleAccederTienda">{product.nombre}</h3>
                <p className="precio"> ${product.precio}</p>
                <button
                  className="botonImagen2"
                  onClick={() => handleNavigate(`/detalle/${product.id}`)}
                >
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;

