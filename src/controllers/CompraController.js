import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, getDocs, doc, updateDoc, where, deleteDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Modal from 'react-modal'; // Importa react-modal
import CerrarCompraView from '../views/CerrarCompraView';
import OrdenesPendientesView from '../views/OrdenesPendientesView';
import ListaOrdenesView from '../views/ComprasRealizadasView';
import DetallesOrdenView from '../views/OrdenView';
import IngresarDireccionView from '../views/AddAdressView';
import CarritoView from '../views/CarritoView';
import FinalizarCompraView from '../views/FinishPurchaseView';
import DetallesOrdenAdminView from '../views/AdminOrderView';
import { getMessaging, getToken } from 'firebase/messaging';
import { addDays, setDay, isBefore } from 'date-fns';

Modal.setAppElement('#root');


function CerrarCompra() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [fechaDeEntrega, setFechaDeEntrega] = useState(null);
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

      await addDoc(collection(db, 'notificacion'), {
        userId: order.idCliente,
        mensaje: 'Su orden fue rechazada por inconsistencias en el pago. La administradora estará pronto en contacto con usted.',
        fecha: new Date(),
        ordenId: order.numeroOrden,
        estado: "unread",
      });
      console.log('Orden rechazada con éxito');
      // Redirige a la página OrdenesPendientes
      window.location.href = '/OrdenesPendientes';
    } catch (error) {
      console.error('Error al rechazar la orden:', error);
    }
  };

  const calculateNextDeliveryDate = (approvalDate) => {
    // Obten el día de la semana en que se aprobó el pedido
    const approvalDay = new Date(approvalDate).getDay();
    let nextDeliveryDate = new Date(approvalDate);
  
    if (approvalDay === 2) {
      while (![4, 6].includes(nextDeliveryDate.getDay())) {
        nextDeliveryDate = addDays(nextDeliveryDate, 1);
      }
    } else if (approvalDay === 4) {
      while (![2, 6].includes(nextDeliveryDate.getDay())) {
        nextDeliveryDate = addDays(nextDeliveryDate, 1);
      }
    } else if (approvalDay === 6) {
      while (![2, 4].includes(nextDeliveryDate.getDay())) {
        nextDeliveryDate = addDays(nextDeliveryDate, 1);
      }
    } else {
      while (![2, 4, 6].includes(nextDeliveryDate.getDay())) {
        nextDeliveryDate = addDays(nextDeliveryDate, 1);
      }
    }
  
    // Si es el mismo día, avanza a la próxima semana
    if (approvalDay === nextDeliveryDate.getDay() && isBefore(nextDeliveryDate, new Date(approvalDate))) {
      nextDeliveryDate = addDays(nextDeliveryDate, 7);
    }
  
    return nextDeliveryDate;
  };
  
  
  
  

  const confirmarOrden = async () => {
    try {
      const orderDoc = doc(db, 'orden', id);

      // Obtener la fecha actual
      const currentDate = new Date();

      // Calcula la fecha del próximo martes, jueves o sábado
      const nextDeliveryDate = calculateNextDeliveryDate(currentDate);

      await updateDoc(orderDoc, {
        estado: 'confirmada',
        fechaEntrega: nextDeliveryDate,
      });

      await addDoc(collection(db, 'notificacion'), {
        userId: order.idCliente,
        mensaje: `Su orden fue confirmada. Fecha de entrega del pedido: ${nextDeliveryDate.toLocaleDateString('es-ES')}`,
        fecha: new Date(),
        ordenId: order.numeroOrden,
        estado:"unread",
      });

      console.log('Orden confirmada con éxito');
      // Redirige a la página OrdenesPendientes
      window.location.href = '/OrdenesPendientes';
    } catch (error) {
      console.error('Error al confirmar la orden:', error);
    }
  };

  useEffect(() => {
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
    return order.totalCompra
    /*if (order && order.ListaProductos && typeof order.ListaProductos === 'object') {
      const productList = Object.values(order.ListaProductos);
      return productList.reduce((total, producto) => {
        return total + producto.cantidad * producto.precio;
      }, 0);
    } else {
      return 0;
    }*/
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

          setTotal(ordenData.totalCompra);
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

function DetallesOrdenAdmin() {
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

          setTotal(ordenData.totalCompra);
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
    <DetallesOrdenAdminView
    navigate={navigate}
    orden={orden}
    productos={productos}
    total={total}
    />
  );
}

const IngresarDireccion = () => {
  const [provincias, setProvincias] = useState([]);
  const navigate = useNavigate();
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('');
  const [cantones, setCantones] = useState([]);
  const [cantonSeleccionado, setCantonSeleccionado] = useState('');
  const [distritos, setDistritos] = useState([]);
  const [distritoSeleccionado, setDistritoSeleccionado] = useState('');
  const [detalles, setDetalles] = useState('');
  const location = useLocation();
  const email = location.state && location.state.correo;

  const handleContinuar = async (e) => {
    e.preventDefault();
  
    // Verifica que todos los campos necesarios estén seleccionados
    if (provinciaSeleccionada && cantonSeleccionado && distritoSeleccionado && detalles && email) {
      try {
        // Obtiene los nombres correspondientes de provincia, cantón y distrito
        const provinciaNombre = provincias.find((provincia) => provincia.id === provinciaSeleccionada).nombre;
        const cantonNombre = cantones.find((canton) => canton.id === cantonSeleccionado).nombre;
        const distritoNombre = distritos.find((distrito) => distrito.id === distritoSeleccionado).nombre;
  
        // Crea un objeto con los datos a guardar
        const direccionData = {
          provincia: provinciaNombre,
          canton: cantonNombre,
          distrito: distritoNombre,
          detalles,
          email,
        };
  
        // Consulta para verificar si existe un documento con el mismo email
        const direccionQuery = query(
          collection(db, 'direccion'),
          where('email', '==', email)
        );

        const direccionQuerySnapshot = await getDocs(direccionQuery);

        // Si se encontró algún documento con el mismo email, elimínalo
        direccionQuerySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        // Agrega los datos a la colección "direccion" en Firebase
        const docRef = await addDoc(collection(db, 'direccion'), direccionData);

        // Puedes mostrar un mensaje de éxito o redirigir a la siguiente pantalla aquí
        console.log('Dirección guardada con éxito', docRef.id);

        
        navigate('/finalizarCompra', { state: { correo: email } });
      } catch (error) {
        console.error('Error al guardar la dirección:', error);
      }
    } else {
      console.error('Por favor, completa todos los campos antes de continuar.');
    }
  };

  useEffect(() => {
    obtenerProvincias();
  }, []);

  useEffect(() => {
    if (provinciaSeleccionada !== '') {
      obtenerCantones(provinciaSeleccionada);
    }
  }, [provinciaSeleccionada]);

  useEffect(() => {
    if (cantonSeleccionado !== '') {
      obtenerDistritos(provinciaSeleccionada, cantonSeleccionado);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cantonSeleccionado]);

  const obtenerProvincias = () => {
    fetch('https://ubicaciones.paginasweb.cr/provincias.json')
      .then(response => response.json())
      .then(data => {
        const provinciasArray = Object.entries(data).map(([key, value]) => ({ id: key, nombre: value }));
        setProvincias(provinciasArray);
      })
      .catch(error => {
        console.error('Error al obtener las provincias:', error);
      });
  };

  const obtenerCantones = (provinciaId) => {
    fetch(`https://ubicaciones.paginasweb.cr/provincia/${provinciaId}/cantones.json`)
      .then(response => response.json())
      .then(data => {
        const cantonesArray = Object.entries(data).map(([key, value]) => ({ id: key, nombre: value }));
        setCantones(cantonesArray);
      })
      .catch(error => {
        console.error('Error al obtener los cantones:', error);
      });
  };

  const obtenerDistritos = (provinciaId, cantonId) => {
    fetch(`https://ubicaciones.paginasweb.cr/provincia/${provinciaId}/canton/${cantonId}/distritos.json`)
      .then(response => response.json())
      .then(data => {
        const distritosArray = Object.entries(data).map(([key, value]) => ({ id: key, nombre: value }));
        setDistritos(distritosArray);
      })
      .catch(error => {
        console.error('Error al obtener los distritos:', error);
      });
  };

  const handleProvinciaChange = (event) => {
    const selectedProvincia = event.target.value;
    setProvinciaSeleccionada(selectedProvincia);
    setCantonSeleccionado('');
  };

  const handleCantonChange = (event) => {
    const selectedCanton = event.target.value;
    setCantonSeleccionado(selectedCanton);
    setDistritoSeleccionado('');
  };

  const handleDistritoChange = (event) => {
    const selectedDistrito = event.target.value;
    setDistritoSeleccionado(selectedDistrito);
  };

  return (
    <IngresarDireccionView
    provincias={provincias}
    handleContinuar={handleContinuar}
    navigate={navigate}
    obtenerProvincias={obtenerProvincias}
    handleProvinciaChange={handleProvinciaChange}
    provinciaSeleccionada={provinciaSeleccionada}
    cantones={cantones}
    handleCantonChange={handleCantonChange}
    cantonSeleccionado={cantonSeleccionado}
    handleDistritoChange={handleDistritoChange}
    distritos={distritos}
    distritoSeleccionado={distritoSeleccionado}
    detalles={detalles}
    setDetalles={setDetalles}
    email={email}

    />
  );

}

function Carrito() {
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
    if (amount <= 0) {
      // Si la cantidad es igual o menor que 0, elimina el producto del carrito y de la colección de Firebase.
      const updatedCarritoData = carritoData.filter((item) => item.id !== id);
      setCarritoData(updatedCarritoData);
  
      try {
        const carritoQuery = query(collection(db, 'carrito'), where('correo', '==', email));
        const carritoQuerySnapshot = await getDocs(carritoQuery);
  
        if (carritoQuerySnapshot.size === 0) {
          console.log("No se encontró un carrito para el correo electrónico proporcionado.");
          return;
        }
  
        // Supongo que solo hay un documento 'carrito' por correo electrónico, por lo que tomo el primero.
        const carritoDoc = carritoQuerySnapshot.docs[0];
  
        // Elimina el producto del documento 'carrito' en la colección de Firebase.
        const carritoData = carritoDoc.data();
        const newCarritoData = carritoData.listaIdCantidadProductos.filter((item) => item.id !== id);
  
        // Actualiza el documento 'carrito' en la colección de Firebase sin el producto eliminado.
        await updateDoc(carritoDoc.ref, {
          listaIdCantidadProductos: newCarritoData,
        });
  
        // Elimina el producto de la colección 'productos' en Firebase (opcional).
        // Si deseas mantener un registro de productos eliminados, puedes omitir esta parte.
        const productRef = doc(collection(db, 'productos'), id);
        await deleteDoc(productRef);
      } catch (error) {
        console.error('Error al eliminar el producto del carrito y la colección de Firebase', error);
      }
    } else {
      // Si la cantidad es mayor que 0, actualiza la cantidad en el carrito.
      const updatedCarritoData = carritoData.map((item) => {
        if (item.id === id) {
          item.cantidad = amount;
        }
        return item;
      });
      setCarritoData(updatedCarritoData);
  
      // Actualiza la cantidad en la lista de productos dentro del documento de carrito en Firebase.
      try {
        const carritoQuery = query(collection(db, 'carrito'), where('correo', '==', email));
        const carritoQuerySnapshot = await getDocs(carritoQuery);
  
        if (carritoQuerySnapshot.size === 0) {
          console.log("No se encontró un carrito para el correo electrónico proporcionado.");
          return;
        }
  
        // Supongo que solo hay un documento 'carrito' por correo electrónico, por lo que tomo el primero.
        const carritoDoc = carritoQuerySnapshot.docs[0];
  
        // Actualiza el producto en la lista de productos dentro del documento de carrito en la colección de Firebase.
        const carritoData = carritoDoc.data();
        const newCarritoData = carritoData.listaIdCantidadProductos.map((item) => {
          if (item.id === id) {
            item.cantidad = amount;
          }
          return item;
        });
  
        // Actualiza el documento 'carrito' en la colección de Firebase con la cantidad actualizada.
        await updateDoc(carritoDoc.ref, {
          listaIdCantidadProductos: newCarritoData,
        });
      } catch (error) {
        console.error('Error al actualizar la cantidad en la colección de Firebase', error);
      }
    }
  };
  
  const handlefinalizarCompra = async () => {
    const carritoQuery = query(collection(db, 'carrito'), where('correo', '==', email));

    try {
      const carritoQuerySnapshot = await getDocs(carritoQuery);

      if (carritoQuerySnapshot.empty) {
        console.error('No se encontró un carrito para el correo electrónico proporcionado.');
        return;
      }

      // Supongo que solo hay un documento 'carrito' por correo electrónico, por lo que tomo el primero.
      const carritoDoc = carritoQuerySnapshot.docs[0];

      // Obtiene el carrito actual
      const carritoData = carritoDoc.data();
      const listaIdCantidadProductos = carritoData.listaIdCantidadProductos;

      // Calcula el nuevo total de la compra
      const newTotal = listaIdCantidadProductos.reduce((acc, item) => {
        const product = productData.find((p) => p.id === item.id);
        if (product) {
          acc += product.precio * item.cantidad;
        }
        return acc;
      }, 0);

      // Actualiza el total en el documento 'carrito' en la colección de Firebase
      await updateDoc(carritoDoc.ref, {
        total: newTotal,
      });

      console.log('Total de la compra actualizado con éxito en el carrito:', newTotal);

      // Redirige a la página de ingresar dirección
      navigate('/ingresarDireccion', { state: { correo: email } });
    } catch (error) {
      console.error('Error al finalizar la compra y actualizar el total en el carrito:', error);
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
    <CarritoView
    navigate={navigate}
    email={email}
    carritoData={carritoData}
    productData={productData}
    total={total}
    finalizarCompra={handlefinalizarCompra}
    handleQuantityChange={handleQuantityChange}

    />
  );
}

const FinalizarCompra = () => {
  const [comprobante, setComprobante] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state && location.state.correo;
  const [image, setImage] = useState(null);
  const [totalCompra, setTotalCompra] = useState(0);
  const [provincia, setProvincia] = useState('');
  const [selectedImageURL, setSelectedImageURL] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const calcularMontoAdicional = (provincia) => {
    switch (provincia) {
      case 'San José':
        return 5;
      case 'Alajuela':
        return 10;
      case 'Cartago':
        return 15;
      case 'Heredia':
        return 20;
      case 'Guanacaste':
        return 25;
      case 'Puntarenas':
        return 30;
      case 'Limón':
        return 35;
      default:
        return 0;
    }
  };

  useEffect(() => {
    if (email) {
      // Tu lógica para calcular el total de la compra y la provincia aquí
      const carritoCollection = collection(db, 'carrito');
      const q = query(carritoCollection, where('correo', '==', email));
      getDocs(q)
        .then((querySnapshot) => {
          let total = 0;
          querySnapshot.forEach((doc) => {
            total += doc.data().total;
          });

          const direccionCollection = collection(db, 'direccion');
          const direccionQuery = query(direccionCollection, where('email', '==', email));
          getDocs(direccionQuery)
            .then((direccionSnapshot) => {
              direccionSnapshot.forEach((direccionDoc) => {
                const provincia = direccionDoc.data().provincia;
                const montoAdicional = calcularMontoAdicional(provincia);
                setTotalCompra(total + montoAdicional);
                setProvincia(provincia);
              });
            })
            .catch((error) => {
              console.error('Error obteniendo la provincia:', error);
            });
        })
        .catch((error) => {
          console.error('Error obteniendo el total de la compra:', error);
        });
    }
  }, [email]);

  const checkNumeroOrdenExists = async (numeroOrden) => {
    const ordenCollection = collection(db, 'orden');
  
    // Crea una consulta para buscar documentos con el mismo número de orden.
    const q = query(ordenCollection, where('numeroOrden', '==', numeroOrden));
  
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      // No se encontraron coincidencias, el número de orden es único.
      return numeroOrden;
    } else {
      // El número de orden ya existe, genera uno nuevo y verifica nuevamente.
      const newRandomNumber = generateNewRandomNumber();
      return checkNumeroOrdenExists(newRandomNumber);
    }
  };
  
  const generateNewRandomNumber = () => {
    const min = 1000;
    const max = 9999;
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
  };
  
  // Luego, dentro de tu función handleContinuar, antes de crear la factura, verifica el número de orden.
  const handleContinuar = async (e) => {
    e.preventDefault();
  
    const numeroOrden = generateNewRandomNumber();
    const uniqueNumeroOrden = await checkNumeroOrdenExists(numeroOrden);
  
    if (image) {
      const imageName = `imagen/${image.name}`;
      const imageRef = ref(storage, imageName);
  
      try {
        await uploadBytes(imageRef, image);
        const imageURL = await getDownloadURL(imageRef);
  
        const fechaEmision = serverTimestamp();
        const fechaEntrega = new Date();
        fechaEntrega.setDate(fechaEntrega.getDate() + 7);
  
        const carritoCollection = collection(db, 'carrito');
        const carritoQuery = query(carritoCollection, where('correo', '==', email));
        const carritoSnapshot = await getDocs(carritoQuery);
  
        const userCollection = collection(db, 'usuario');
        const userQuery = query(userCollection, where('correo', '==', email));
        const userSnapshot = await getDocs(userQuery);
  
        if (!carritoSnapshot.empty) {
          const carritoDoc = carritoSnapshot.docs[0];
          const carritoData = carritoDoc.data();
  
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();
  
          const facturaCollection = collection(db, 'orden');
          const newFacturaDoc = await addDoc(facturaCollection, {
            comprobante: imageURL,
            email: email,
            totalCompra: totalCompra,
            direccionEntrega: provincia,
            fechaEmision: fechaEmision,
            fechaEntrega: fechaEntrega,
            estado: "pendiente",
            numeroOrden: uniqueNumeroOrden,
            ListaProductos: carritoData.listaIdCantidadProductos,
            idCliente: "C" + userData.id,
          });
  
          console.log('Imagen subida exitosamente. URL de la imagen:', imageURL);
  
          if (carritoData.listaIdCantidadProductos) {
            // Eliminar el carrito encontrado en la base de datos
            const carritoId = carritoDoc.id;
            const carritoRef = doc(db, 'carrito', carritoId);
            await deleteDoc(carritoRef);
            console.log('Carrito eliminado con éxito.');
          } else {
            console.error('No se encontró un carrito para el usuario actual.');
          }
          
          // Aquí puedes realizar otras acciones relacionadas con la factura si es necesario.
          setShowSuccessModal(true);
        } else {
          console.error('No se encontró un carrito para el usuario actual.');
        }
      } catch (error) {
        console.error('Error al subir la imagen o eliminar el carrito:', error);
      }
    } else {
      console.error('No se ha seleccionado una imagen.');
    }
  }

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const imageURL = URL.createObjectURL(selectedImage);
      setSelectedImageURL(imageURL);
      setImage(selectedImage);
    }
  };

  const redirectToTienda = () => {
    navigate('/AccederTiendaCliente', { state: { correo: email } }); // Ajusta la ruta según tu estructura de rutas
  };

  return (
    <div>
      <FinalizarCompraView
        comprobante={comprobante}
        navigate={navigate}
        email={email}
        handleContinuar={handleContinuar}
        handleImageChange={handleImageChange}
        totalCompra={totalCompra}
        provincia={provincia}
        selectedImageURL={selectedImageURL}
        Modal={Modal}
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
        redirectToTienda={redirectToTienda}
      />
    </div>
  );
};
  
export {CerrarCompra,OrdenesPendientes,ListaOrdenes,DetallesOrden,IngresarDireccion,Carrito,FinalizarCompra,DetallesOrdenAdmin};
