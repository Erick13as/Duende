import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs, onSnapshot, doc, updateDoc, where, deleteDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AgregarProductoView from '../views/AgregarProductoView';
import EditarProductoAdminView from '../views/EditarProductoAdminView';
import VerMasClienteView from '../views/VerMasClienteView';
import AccederTiendaClienteView from '../views/AccederTiendaClienteView'; 
import AccederTiendaAdminView from '../views/AccederTiendaAdminView';
import IngresarDireccionView from '../views/AddAdressView';
import CarritoView from '../views/CarritoView';


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
    navigate('/carrito', { state: { correo: email } });
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

  const handleContinuar = async (e) => {
    //estoy probando si se guarda la provincia seleccionada. Aquí navega a la siguiente pantalla pero no estoy seguro cuál es.
    e.preventDefault();
    console.log(provinciaSeleccionada);
  }

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
  
  const finalizarCompra = () => {
    navigate('/ingresarDireccion');
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
    finalizarCompra={finalizarCompra}
    handleQuantityChange={handleQuantityChange}

    />
  );
}

export {AgregarProducto,EditarProductoAdmin,VerMasCliente,AccederTiendaCliente,AccederTiendaAdmin,IngresarDireccion,Carrito};