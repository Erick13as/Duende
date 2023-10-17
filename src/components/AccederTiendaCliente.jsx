import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Link } from 'react-router-dom';

function HomePage() {
  const [productos, setProductos] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

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
          showArrows={true} // Opcional: Muestra flechas de navegación
          showStatus={true} // Opcional: Muestra indicador de estado
          showThumbs={false} // Opcional: Desactiva las miniaturas
          dynamicWidth={true} // Permite que el carrusel se adapte al ancho de la pantalla
          centerMode={true} // Centra el carrusel
          centerSlidePercentage={33.33} // Muestra 3 elementos al mismo tiempo
          infiniteLoop={true} // Permite un desplazamiento infinito
        >
          {productos.map((product, index) => (
  <div key={product.id}>
    <h3>{product.nombre}</h3>
    <p>Precio: {product.precio}</p>
    <p>Descripción: {product.descripcion}</p>
    <p>Cantidad: {product.cantidad}</p>
    <p>Marca: {product.marca}</p>
    <div className="imagen-galeria-container">
      <img
        className="imagen-carrusel"
        src={product.imagen}
        alt={product.nombre}
        
      />
    </div>
    <Link to={`/VerMasCliente/${index}`}>Ver Más</Link>
  </div>
))}
        </Carousel>
      </div>
    </div>
  );
}

export default HomePage;
