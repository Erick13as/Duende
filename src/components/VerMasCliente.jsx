import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { collection, onSnapshot } from 'firebase/firestore'; // Importar las funciones necesarias desde Firebase
import { db } from '../firebase/firebaseConfig';

function VerMasCliente() {
    const { id } = useParams();
    const [productos, setProductos] = useState([]);
    const [product, setProduct] = useState(null);
  
    useEffect(() => {
      const q = collection(db, 'productos');
        
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const products = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          products.push(data);
          console.log('products', products)
        });
         
        setProductos(products);
        console.log('productos', productos)
      });
  
      return () => unsubscribe();
    }, []);
  
    // Filtrar el producto por ID
    useEffect(() => {
      if (id) {
        console.log('Filtrar el producto por ID')
        const selectedProduct = productos.find((product) => product.id === id);
        setProduct(selectedProduct);
        console.log('selectedProduct', selectedProduct)
      }
    }, [id, productos]);
  
    if (!product) {
        return <div>No se encontró el producto o ocurrió un error.</div>;
      }

  const settings = {
    dots: true,
    infinite: true,
    vertical: true,
    verticalSwiping: true,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <div className="vmasC-container">
      <div className="product-info">
        <h1>Detalles del Producto</h1>
        <h2>Nombre del Producto: {product.nombre}</h2>
        <p>Precio: {product.precio}</p>
        <p>Descripción: {product.descripcion}</p>
        <p>Cantidad: {product.cantidad}</p>
        <p>Marca: {product.marca}</p>
      </div>
      <div className="product-images">
        <Slider {...settings}>
          {product.imagenes.map((image) => (
            <div key={image.id}>
              <img src={image.src} alt={`Imagen ${image.id}`} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default VerMasCliente;