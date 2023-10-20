import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

function Carrito({ carrito, removeFromCart }) {
  const [carritoData, setCarritoData] = useState([]);
  const [total] = useState(0);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    if (carrito) {
      const carritoDocRef = doc(db, 'carrito', '1'); // Reemplaza 'ID_DEL_USUARIO' por el ID de usuario
      getDoc(carritoDocRef)
        .then((carritoDoc) => {
          if (carritoDoc.exists()) {
            const carritoData = carritoDoc.data();
            setCarritoData(carritoData.listaIdCantidadProductos || []);
          }
        })
        .catch((error) => {
          console.error('Error al cargar el carrito desde la base de datos', error);
        });
    }
  }, [carrito]);
  
  useEffect(() => {
    if (carritoData.length > 0) { // Asegurarse de que carritoData tenga elementos
      const productIds = carritoData.map((item) => item.id);
      if (productIds.length > 0) { // Asegurarse de que productIds no esté vacío
        const productQuery = query(collection(db, 'productos'), where('id', 'in', productIds));
        getDocs(productQuery)
          .then((querySnapshot) => {
            const products = [];
            querySnapshot.forEach((doc) => {
              products.push(doc.data());
            });
            setProductData(products);
          })
          .catch((error) => {
            console.error('Error al cargar la información de los productos', error);
          });
      }
    }
  }, [carritoData]);

  const handleQuantityChange = async (id, amount) => {
    if (amount < 1) return;

    const carritoDocRef = doc(db, 'carrito', '1'); // Reemplaza 'ID_DEL_USUARIO' por el ID de usuario
    const newCarritoData = carritoData.map((item) => {
      if (item.id === id) {
        item.cantidad = amount;
      }
      return item;
    });

    try {
      await updateDoc(carritoDocRef, {
        listaIdCantidadProductos: newCarritoData,
      });
    } catch (error) {
      console.error('Error al actualizar la cantidad del producto en el carrito', error);
    }
  };

  return (
    <div className="carrito-container" style={{ backgroundColor: 'white', padding: '20px', textAlign: 'center' }}>
      <h2>Carrito de Compras</h2>
      <table className="carrito-table" style={{ margin: '0 auto' }}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
          </tr>
        </thead>
        <tbody>
          {carritoData.map((item) => {
            const product = productData.find((p) => p.id === item.id);
            return (
              <tr key={item.id}>
                <td>{product ? <img className="carrito-product-img" src={product.imagen} alt={product.nombre} /> : 'N/A'}</td>
                <td>{product ? product.descripcion : 'N/A'}</td>
                <td>
                  <div className="carrito-product-actions">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.cantidad - 1)}
                      className="carrito-quantity-button"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="carrito-quantity-input"
                      value={item.cantidad}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    />
                    <button
                      onClick={() => handleQuantityChange(item.id, item.cantidad + 1)}
                      className="carrito-quantity-button"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>{product ? `$${product.precio}` : 'N/A'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="carrito-total" style={{ marginTop: '20px' }}>
        Total: ${total}
      </div>
    </div>
  );
}

export default Carrito;