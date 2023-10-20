import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

function VerMasCliente() {
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [product, setProduct] = useState(null);
  const [carrito, setCarrito] = useState([]); // Estado del carrito
  const [addedToCart, setAddedToCart] = useState(false); // Estado para mostrar "Añadido al carrito"

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

  useEffect(() => {
    if (id) {
      const selectedProduct = productos.find((producto) => producto.id === id);
      setProduct(selectedProduct);
    }
  }, [id, productos]);

  if (!product) {
    return <div>No se encontró el producto o ocurrió un error.</div>;
  }

  const handleAddToCart = () => {
    if (product) {
      setCarrito([...carrito, product]);
      setAddedToCart(true); // Cambiar el estado para mostrar "Añadido al carrito"
    }
  };

  return (
    <div className="vmasC-container">
      <div className="image-info-container">
        <div className="image-button-container">
          <img
            className="imagen-galeria-container2"
            src={product.imagen}
            alt={product.nombre}
          />
          <button
            className={`add-to-cart-button ${addedToCart ? 'added' : ''}`} // Agregar clase 'added' si se ha añadido al carrito
            onClick={handleAddToCart}
            disabled={addedToCart} // Deshabilitar el botón si ya se añadió al carrito
          >
            {addedToCart ? 'Añadido al carrito' : 'Añadir al carrito'}
          </button>
        </div>
        <div className="product-info">
          <h1>Detalles del Producto</h1>
          <h2>Nombre del Producto: {product.nombre}</h2>
          <p>Precio: {product.precio}</p>
          <p>Descripción: {product.descripcion}</p>
          <p>Cantidad: {product.cantidad}</p>
          <p>Marca: {product.marca}</p>
        </div>
      </div>
    </div>
  );
}

export default VerMasCliente;