import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useParams } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
function DetallesOrden() {
  const { numeroOrden } = useParams();
  const [orden, setOrden] = useState(null);
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state && location.state.correo;

  const handleNavigate = (route) => {
    navigate(route);
  };
  useEffect(() => {
    const fetchOrden = async () => {
      try {
        const ordenQuery = query(collection(db, 'orden'), where('numeroOrden', '==', numeroOrden));
        const ordenSnapshot = await getDocs(ordenQuery);

        if (ordenSnapshot.size === 1) {
          const ordenDoc = ordenSnapshot.docs[0];
          const ordenData = ordenDoc.data();
          setOrden(ordenData);
          const productosData = ordenData.ListaProductos;
          setProductos(productosData);

          // Convertir el mapa en una matriz de objetos
          const productosArray = Object.values(productosData);
          setProductos(productosArray);

          // Calcular el total de la orden
          let totalOrden = 0;
          const productosConDetalles = await Promise.all(
            productosArray.map(async (producto) => {
              // Consultar Firestore para obtener la información del producto por el atributo "id"
              const productoQuery = query(collection(db, 'productos'), where('id', '==', producto.id));
              const productoSnapshot = await getDocs(productoQuery);

              if (productoSnapshot.size === 1) {
                const productoDoc = productoSnapshot.docs[0];
                const productoData = productoDoc.data();
                const subtotal = producto.precio * producto.cantidad;
                totalOrden += subtotal;
                // Agregar el nombre y la imagen al objeto producto
                return {
                  ...producto,
                  nombre: productoData.nombre,
                  imagen: productoData.imagen,
                };
              }
              return producto; // En caso de no encontrar información del producto
            })
          );

          setTotal(totalOrden);
          setProductos(productosConDetalles);
        } else {
          console.error('La orden no existe o hay duplicados con el mismo número de orden');
        }
      } catch (error) {
        console.error('Error al obtener la orden:', error);
      }
    };

    fetchOrden();
  }, [numeroOrden]);

  // ...

return (
    <div className="vmasC-container">
      <form className="formBarra">
        <button onClick={()=>navigate('/AccederTiendaCliente', { state: { correo: email } })} className='botonOA'>Tienda</button>
        <div className="botonBarra-container">
            <button onClick={() => navigate('/login')} className='botonOA2'>Cerrar sesión</button>
        </div>
      </form>
      {orden && (
        <div>
          <h1>Número de Orden: {orden.numeroOrden}</h1>
          <table>
            <thead>
              <tr>
                <th className="table-cell">Producto</th>
                <th className="table-cell">Nombre</th>
                <th className="table-cell">Cantidad</th>
                <th className="table-cell">Precio Unitario</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr className="table-row" key={producto.id}>
                  <td className="table-cell"><img src={producto.imagen} alt={producto.nombre} /></td>
                  <td className="table-cell">{producto.nombre}</td>
                  <td className="table-cell">{producto.cantidad}</td>
                  <td className="table-cell">{producto.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <h2>Dirección de entrega: {orden.direccionEntrega}</h2>
          <h2>Estado: {orden.estado}</h2>
          <h2>Total: {total}</h2>
          
        </div>
      )}
    </div>
  );
  
}

export default DetallesOrden;
