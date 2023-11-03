import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs, onSnapshot, doc, updateDoc, where, deleteDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Modal from 'react-modal'; // Importa react-modal
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AgregarProductoView from '../views/AgregarProductoView';
import EditarProductoAdminView from '../views/EditarProductoAdminView';
import VerMasClienteView from '../views/VerMasClienteView';
import AccederTiendaClienteView from '../views/AccederTiendaClienteView'; 
import AccederTiendaAdminView from '../views/AccederTiendaAdminView';
import IngresarDireccionView from '../views/AddAdressView';
import CarritoView from '../views/CarritoView';
import FinalizarCompraView from '../views/FinishPurchaseView';

Modal.setAppElement('#root');

function AgregarProducto() {
  const [productName, setProductName] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productQuantity, setProductQuantity] = useState(0);
  const [productImage, setProductImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorText, setErrorText] = useState('');
  


  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setProductImage(selectedImage);
    }
  };
  const navigate = useNavigate();

  const handleNavigate = (route) => {
    navigate(route);
  };

  const handleUpload = async () => {
    if (!productName || !productDescription || !productPrice || !productQuantity || !productImage) {
      setErrorText('Complete todos los campos antes de subir el producto.');
      return;
    }

    setErrorText('');
    setUploading(true);

    try {
      // Obtén el número de producto más alto actual
      const productQuery = query(collection(db, 'productos'), orderBy('id', 'desc'), limit(1));
      const productSnapshot = await getDocs(productQuery);
      const latestProduct = productSnapshot.docs[0];
      const latestProductId = latestProduct ? latestProduct.data().id : 0;
      const newProductId = parseInt(latestProductId) + 1;

      const storageRef = ref(storage, `imagen/${productImage.name}`);
      await uploadBytes(storageRef, productImage);

      const downloadURL = await getDownloadURL(storageRef);

      const productData = {
        id: newProductId.toString(), // Asigna el nuevo id
        nombre: productName,
        marca: productBrand,
        descripcion: productDescription,
        precio: productPrice,
        cantidad: productQuantity,
        imagen: downloadURL,
        fechaSubida: serverTimestamp(),
      };

      await addDoc(collection(db, 'productos'), productData);

      console.log('Producto subido con éxito. Nuevo ID del producto:', newProductId);
      window.location.href = '/AccederTiendaAdminController';
    } catch (error) {
      console.error('Error al subir el producto:', error);
      setErrorText('Hubo un error al subir el producto. Por favor, inténtelo nuevamente.');
    } finally {
      setUploading(false);
    }
  };
  return (
    <AgregarProductoView
        productName={productName}
        productBrand={productBrand}
        productDescription={productDescription}
        productPrice={productPrice}
        productQuantity={productQuantity}
        productImage={productImage}
        uploading={uploading}
        errorText={errorText}
        handleImageChange={handleImageChange}
        handleUpload={handleUpload}
        handleNavigate={handleNavigate}
        setProductName={setProductName}
        setProductBrand={setProductBrand}
        setProductDescription={setProductDescription}
        setProductPrice={setProductPrice}
        setProductQuantity={setProductQuantity}
    />
  );
  
}

function EditarProductoAdmin() {
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [editedProductImage, setEditedProductImage] = useState(null);
  const navigate = useNavigate();
  const handleNavigate = (route) => {
    navigate(route);
  };
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
      setEditedProduct({ ...selectedProduct });
    }
  }, [id, productos]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProduct({ ...product });
    setEditedProductImage(null); // Restablece la imagen seleccionada
  };

  const handleSaveEdit = async () => {
    const productoId = id;
    const q = query(collection(db, 'productos'), where('id', '==', productoId));
    const querySnapshot = await getDocs(q);
    let productIDFirestore = null;

    if (!querySnapshot.empty) {
      const productDoc = querySnapshot.docs[0];
      productIDFirestore = productDoc.id;

      if (editedProduct) {
        const productDocRef = doc(db, 'productos', productIDFirestore);
        try {
          if (editedProductImage) {
            const storageRef = ref(storage, `imagen/${editedProductImage.name}`);
            await uploadBytes(storageRef, editedProductImage);
            const downloadURL = await getDownloadURL(storageRef);
            editedProduct.imagen = downloadURL;
          }
          await updateDoc(productDocRef, {
            nombre: editedProduct.nombre,
            precio: editedProduct.precio,
            descripcion: editedProduct.descripcion,
            cantidad: editedProduct.cantidad,
            marca: editedProduct.marca,
            imagen: editedProduct.imagen,
          });
          setIsEditing(false);
        } catch (error) {
          console.error('Error al actualizar el producto en la base de datos', error);
        }
      }
    }
  };

  const handleImageChange = (event) => {
    const newImage = event.target.files[0];
    if (newImage) {
      setEditedProductImage(newImage);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('¿Seguro que quieres eliminar este producto?');

    if (confirmDelete) {
      try {
        const productoId = id;
        const q = query(collection(db, 'productos'), where('id', '==', productoId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const productDoc = querySnapshot.docs[0];
          const productIDFirestore = productDoc.id;
          const productDocRef = doc(db, 'productos', productIDFirestore);

          // Elimina el producto de la base de datos
          await deleteDoc(productDocRef);
          navigate('/AccederTiendaAdminController'); // Redirige a la página de administración
        }
      } catch (error) {
        console.error('Error al eliminar el producto', error);
      }
    }
  };

  if (!product) {
    return <div>No se encontró el producto o ocurrió un error.</div>;
  }

  
  return (
    <EditarProductoAdminView
        id={id}
        productos={productos}
        product={product}
        isEditing={isEditing}
        editedProduct={editedProduct}
        editedProductImage={editedProductImage}
        handleNavigate={handleNavigate}
        handleEdit={handleEdit}
        handleCancelEdit={handleCancelEdit}
        handleSaveEdit={handleSaveEdit}
        handleImageChange={handleImageChange}
        handleDelete={handleDelete}
        setProductos={setProductos}
        setProduct={setProduct}
        setIsEditing={setIsEditing}
        setEditedProduct={setEditedProduct}
        setEditedProductImage={setEditedProductImage}
    />
  );
}

function VerMasCliente() {
  const location = useLocation();
  const email = location.state && location.state.correo;
  const id = location.state && location.state.producto;
  const [productos, setProductos] = useState([]);
  const [product, setProduct] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [isInCart, setIsInCart] = useState(false);
  const navigate = useNavigate();
  const handleNavigate = (route) => {
    navigate(route);
  };
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
    if (id && email) {
      const carritoCollectionRef = collection(db, 'carrito');
      const q = query(carritoCollectionRef, where('correo', '==', email));
      getDocs(q)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const carritoData = doc.data();
            const listaIdCantidadProductos =
              carritoData.listaIdCantidadProductos || [];

            // Verificar si el producto ya está en el carrito
            const productIndex = listaIdCantidadProductos.findIndex(
              (item) => item.id === id
            );
            if (productIndex !== -1) {
              setIsInCart(true);
            }
          });
        })
        .catch((error) => {
          console.error('Error al verificar el producto en el carrito', error);
        });
    }
  }, [id, email]);

  const handleAddToCart = async () => {
    if (product) {
      if (isInCart) {
        return;
      }
  
      // Primero, consulta la colección 'carrito' para obtener el documento correcto.
      const querySnapshot = await getDocs(query(collection(db, 'carrito'), where('correo', '==', email)));
  
      // Comprueba si existe un documento que cumple con la consulta.
      if (querySnapshot.empty) {
        // Si no existe un documento, puedes crear uno nuevo.
        const newCartDocRef = await addDoc(collection(db, 'carrito'), {
          correo: email,
          listaIdCantidadProductos: [{ id, cantidad: 1 }],
        });
        setCarrito([...carrito, product]);
        setIsInCart(true);
      } else {
        // Si existe un documento, obtén su referencia.
        const cartDocRef = querySnapshot.docs[0].ref;
  
        // Actualiza el campo 'listaIdCantidadProductos' utilizando arrayUnion.
        try {
          await updateDoc(cartDocRef, {
            listaIdCantidadProductos: arrayUnion({ id, cantidad: 1 }),
          });
  
          setCarrito([...carrito, product]);
          setIsInCart(true);
        } catch (error) {
          console.error('Error al agregar el producto al carrito en la base de datos', error);
        }
      }
    }
  };  

  if (!product) {
    return <div>No se encontró el producto o ocurrió un error.</div>;
  }

  return (
    <VerMasClienteView
        id={id}
        productos={productos}
        product={product}
        carrito={carrito}
        isInCart={isInCart}
        setProductos={setProductos}
        setProduct={setProduct}
        setCarrito={setCarrito}
        setIsInCart={setIsInCart}
        handleAddToCart={handleAddToCart}
        handleNavigate={handleNavigate}
        navigate={navigate}
        email={email}
    />
  );
}

function AccederTiendaCliente() {
  /*const [model, setModel] = useState(new ProductModel());*/
  const location = useLocation();
  const email = location.state && location.state.correo;
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Consulta Firestore para obtener los productos.
    const q = collection(db, 'productos');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listaproductos = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        listaproductos.push(data);
      });

      setProductos(listaproductos);
    });

    return () => unsubscribe();
  }, []); // Remove productos from the dependency array

  const handleNavigate = (route) => {
    navigate(route);
  };

  const navigateToCarrito = () => {
    navigate('/Carrito', { state: { correo: email } });
  };

  return (
    <AccederTiendaClienteView
      productos={productos}
      handleNavigate={handleNavigate}
      navigateToCarrito={navigateToCarrito}
      email={email}
      navigate={navigate}
    />
  );
}

function AccederTiendaAdmin() {
  /*const [model, setModel] = useState(new ProductModel());*/
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Consulta Firestore para obtener los productos.
    const q = collection(db, 'productos');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listaproductos = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        listaproductos.push(data);
      });

      setProductos(listaproductos);
    });

    return () => unsubscribe();
  }, []); // Remove productos from the dependency array

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <AccederTiendaAdminView
      productos={productos}
      handleNavigate={handleNavigate}
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

        // Obtener la fecha actual
        const fechaEmision = serverTimestamp();
        // Calcular la fecha de entrega como una semana después de la fecha actual
        const fechaEntrega = new Date();
        fechaEntrega.setDate(fechaEntrega.getDate() + 7);

        const facturaCollection = collection(db, 'factura');
        const newFacturaDoc = await addDoc(facturaCollection, {
          comprobante: imageURL,
          email: email,
          totalCompra: totalCompra,
          direccionEntrega: provincia,
          fechaEmision: fechaEmision,
          fechaEntrega: fechaEntrega,
          estado: "pendiente",
          numeroOrden: uniqueNumeroOrden,
        });

        console.log('Imagen subida exitosamente. URL de la imagen:', imageURL);

        // Aquí puedes realizar otras acciones relacionadas con la factura si es necesario.
        setShowSuccessModal(true);

      } catch (error) {
        console.error('Error al subir la imagen:', error);
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

export {AgregarProducto,EditarProductoAdmin,VerMasCliente,AccederTiendaCliente,AccederTiendaAdmin,IngresarDireccion,Carrito,FinalizarCompra};