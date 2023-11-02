import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

function Carrito({ carrito, removeFromCart }) {
  const [carritoData, setCarritoData] = useState([]);
  const [total, setTotal] = useState(0);
  const [productData, setProductData] = useState([]);
  const location = useLocation();
  const email = location.state && location.state.correo;
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      const carritoQuery = query(collection(db, 'carrito'), where('correo', '==', email));
      getDocs(carritoQuery)
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const carritoData = querySnapshot.docs[0].data();
            setCarritoData(carritoData.listaIdCantidadProductos || []);
          }
        })
        .catch((error) => {
          console.error('Error al cargar el carrito desde la base de datos', error);
        });
    }
  }, [email]);

  useEffect(() => {
    if (carritoData.length > 0) {
      const productIds = carritoData.map((item) => item.id);
      if (productIds.length > 0) {
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

    const carritoDocRef = doc(db, 'carrito', '1');
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

  useEffect(() => {
    const newTotal = carritoData.reduce((acc, item) => {
      const product = productData.find((p) => p.id === item.id);
      if (product) {
        acc += product.precio * item.cantidad;
      }
      return acc;
    }, 0);
    setTotal(newTotal);
  }, [carritoData, productData]);

  return (
    <div className="carrito-container">
      <form className="formBarra">
        <button onClick={() => navigate('/AccederTiendaCliente', { state: { correo: email } })} className='botonOA'>Inicio</button>
        <div className="botonBarra-container">
          <button onClick={() => navigate('/login')} className='botonOA2'>Cerrar sesión</button>
        </div>
      </form>
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
                <td>
                  {product ? <img className="carrito-product-img" src={product.imagen} alt={product.nombre} /> : 'N/A'}
                </td>
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
