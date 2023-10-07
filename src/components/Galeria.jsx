import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

function ImageGallery() {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    // Consulta Firestore para obtener las URL de las imágenes.
    const q = collection(db, 'imagen');

    // Escuchar cambios en la colección de imágenes.
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const urls = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.imagenUrl) {
          urls.push(data.imagenUrl);
        }
      });
      setImageUrls(urls);
    });

    // Limpia el efecto cuando el componente se desmonta.
    return () => unsubscribe();
  }, []);

  return (
    <div className="galeria-container">
      <div className="carousel-container">
        <Carousel>
          {imageUrls.map((imageUrl, index) => (
            <div key={index} className="imagen-galeria-container">
              <img src={imageUrl} alt={`Imagen ${index}`} />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export default ImageGallery;
