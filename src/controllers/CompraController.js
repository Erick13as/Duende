import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'; // Importa Link desde react-router-dom
import CerrarCompraView from '../views/CerrarCompraView';
import OrdenesPendientesView from '../views/OrdenesPendientesView';
import ListaOrdenesView from '../views/ComprasRealizadasView';
import DetallesOrdenView from '../views/OrdenView';

function CerrarCompra() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const navigate = useNavigate();
    const handleNavigate = (route) => {
        navigate(route);
    };
    const rechazarOrden = async () => {
      try {
        const orderDoc = doc(db, 'orden', id);
        await updateDoc(orderDoc, {
          estado: 'rechazada',
        });
        console.log('Orden rechazada con éxito');
        // Redirige a la página OrdenesPendientes
        window.location.href = '/OrdenesPendientes';
      } catch (error) {
        console.error('Error al rechazar la orden:', error);
      }
    };
  
    const confirmarOrden = async () => {
      try {
        const orderDoc = doc(db, 'orden', id);
        await updateDoc(orderDoc, {
          estado: 'confirmada',
        });
        console.log('Orden confirmada con éxito');
        // Redirige a la página OrdenesPendientes
        window.location.href = '/OrdenesPendientes';
      } catch (error) {
        console.error('Error al confirmar la orden:', error);
      }
    };
  
    useEffect(() => {
      // Obtener la orden seleccionada desde la base de datos
      const getOrderDetails = async () => {
        try {
          const orderDoc = doc(db, 'orden', id);
          const orderSnapshot = await getDoc(orderDoc);
          if (orderSnapshot.exists()) {
            const orderData = orderSnapshot.data();
            setOrder(orderData);
          } else {
            console.log('La orden no se encontró en la base de datos.');
          }
        } catch (error) {
          console.error('Error al obtener detalles de la orden:', error);
        }
      };
  
      getOrderDetails();
    }, [id]);
  
    if (!order) {
      return <div>No se encontró la orden o ocurrió un error.</div>;
    }
  
    const calcularTotalCompra = () => {
      if (order && order.ListaProductos && typeof order.ListaProductos === 'object') {
        const productList = Object.values(order.ListaProductos);
        return productList.reduce((total, producto) => {
          return total + producto.cantidad * producto.precio;
        }, 0);
      } else {
        return 0;
      }
    };

  return (
    <CerrarCompraView
        id={id}
        order={order}
        rechazarOrden={rechazarOrden}
        confirmarOrden={confirmarOrden}
        calcularTotalCompra={calcularTotalCompra}
        handleNavigate={handleNavigate}
    />
  );
}

function OrdenesPendientes() {
    const [ordenes, setOrdenes] = useState([]);
    const [selectedOrden, setSelectedOrden] = useState(null);
    const navigate = useNavigate();
    const handleNavigate = (route) => {
        navigate(route);
    };
    useEffect(() => {
      // Consulta Firestore para obtener órdenes con estado "pendiente"
      const q = query(collection(db, 'orden'), where('estado', '==', 'pendiente'));
  
      getDocs(q)
        .then((querySnapshot) => {
          const ordenesData = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            ordenesData.push({
              id: doc.id,
              numeroOrden: data.numeroOrden,
              fechaEmision: data.fechaEmision.toDate().toLocaleDateString(),
              idCliente: data.idCliente,
            });
          });
          setOrdenes(ordenesData);
        })
        .catch((error) => {
          console.error('Error al obtener las órdenes:', error);
        });
    }, []);
  
    return (
        <OrdenesPendientesView
        ordenes={ordenes}
        setOrdenes={setOrdenes}
        selectedOrden={selectedOrden}
        setSelectedOrden={setSelectedOrden}
        handleNavigate={handleNavigate}
    />
    );
}
  
  function ListaOrdenes() {
    const [ordenes, setOrdenes] = useState([]);
    const [selectedOrden, setSelectedOrden] = useState(null);
    const { userId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state && location.state.correo;
  
    const handleNavigate = (route) => {
      navigate(route);
    };
    useEffect(() => {
      const q = query(collection(db, 'orden'), where('idCliente', '==', userId));
      getDocs(q)
        .then((querySnapshot) => {
          const ordenesData = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Convierte el timestamp a una cadena de texto con el formato deseado (por ejemplo, 'yyyy-MM-dd')
            const fechaEmision = data.fechaEmision.toDate(); // Convierte el timestamp a un objeto Date
            const fechaEmisionFormateada = fechaEmision.toLocaleDateString(); // Formatea la fecha
            ordenesData.push({
              id: doc.id,
              numeroOrden: data.numeroOrden,
              fechaEmision: fechaEmisionFormateada, // Usa la fecha formateada
              idCliente: data.idCliente,
            });
          });
          setOrdenes(ordenesData);
        })
        .catch((error) => {
          console.error('Error al obtener las órdenes:', error);
        });
    }, [userId]);
  
    const handleOrdenSelection = (ordenId) => {
      setSelectedOrden(ordenId);
    };
  
    return (
      <ListaOrdenesView
      navigate={navigate}
      ordenes={ordenes}
      selectedOrden={selectedOrden}
      email={email}
  />
  );
}

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
    <DetallesOrdenView
    navigate={navigate}
    orden={orden}
    productos={productos}
    total={total}
    email={email}
    />
  );
}
  
export {CerrarCompra,OrdenesPendientes,ListaOrdenes,DetallesOrden};
