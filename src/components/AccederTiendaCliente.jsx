import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [productos, setProductos] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

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
      <form className="formBarra">
        {/* Botones de navegación... */}
      </form>

      <div className="centered-carousel"> {/* Nuevo contenedor para centrar el carrusel */}
        <Carousel
          selectedItem={currentProductIndex}
          onChange={(index) => setCurrentProductIndex(index)}
        >
          {productos.map((product, index) => (
            <div key={index}>
              <h3>{product.nombre}</h3>
              <p>Precio: {product.precio}</p>
              <p>Descripción: {product.descripcion}</p>
              <p>Cantidad: {product.cantidad}</p>
              <p>Marca: {product.marca}</p>
              <div className="imagen-galeria-container">
                <img
                  className="imagen-carrusel" // Clase para hacer la imagen más pequeña
                  src={product.imagen}
                  alt={product.nombre}
                />
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export default HomePage;
