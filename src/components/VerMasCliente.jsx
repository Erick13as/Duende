import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

function VerMasCliente() {
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [product, setProduct] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [isInCart, setIsInCart] = useState(false);

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

  useEffect(() => {
    if (id) {
      const carritoDocRef = doc(db, 'carrito', 'ID_DEL_USUARIO'); // Reemplaza 'ID_DEL_USUARIO' por el ID de usuario
      getDoc(carritoDocRef)
        .then((carritoDoc) => {
          if (carritoDoc.exists()) {
            const carritoData = carritoDoc.data();
            const listaIdCantidadProductos =
              carritoData.listaIdCantidadProductos || [];

            // Verificar si el producto ya está en el carrito
            const productIndex = listaIdCantidadProductos.findIndex(
              (item) => item.id === id
            );
            if (productIndex !== -1) {
              setIsInCart(true);
            }
          }
        })
        .catch((error) => {
          console.error('Error al verificar el producto en el carrito', error);
        });
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (product) {
      if (isInCart) {
        return;
      }

      const carritoDocRef = doc(db, 'carrito', 'ID_DEL_USUARIO'); // Reemplaza 'ID_DEL_USUARIO' por el ID de usuario
      try {
        await updateDoc(carritoDocRef, {
          listaIdCantidadProductos: arrayUnion({ id: id, cantidad: 1 }),
        });

        setCarrito([...carrito, product]);
        setIsInCart(true);
      } catch (error) {
        console.error('Error al agregar el producto al carrito en la base de datos', error);
      }
    }
  };

  if (!product) {
    return <div>No se encontró el producto o ocurrió un error.</div>;
  }

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
            className={`add-to-cart-button ${isInCart ? 'added-to-cart' : ''}`}
            onClick={handleAddToCart}
          >
            {isInCart ? 'Añadido al carrito' : 'Añadir al carrito'}
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