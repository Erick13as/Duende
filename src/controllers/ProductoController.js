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
      window.location.href = '/AccederTiendaAdmin';
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
          navigate('/AccederTiendaAdmin'); // Redirige a la página de administración
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
  const [precio, setPrecio] = useState('');
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
      const productQuery = query(collection(db, 'productos'), where('id', '==', id));
      const productSnapshot = await getDocs(productQuery);

      const productData = productSnapshot.docs[0].data();
      const precio = ""+productData.precio;
      setPrecio(precio);
      console.log(precio)
  
      // Primero, consulta la colección 'carrito' para obtener el documento correcto.
      const querySnapshot = await getDocs(query(collection(db, 'carrito'), where('correo', '==', email)));
  
      // Comprueba si existe un documento que cumple con la consulta.
      if (querySnapshot.empty) {
        // Si no existe un documento, puedes crear uno nuevo.
        const newCartDocRef = await addDoc(collection(db, 'carrito'), {
          correo: email,
          listaIdCantidadProductos: [{ id, cantidad: 1, precio }],
        });
        setCarrito([...carrito, product]);
        setIsInCart(true);
      } else {
        // Si existe un documento, obtén su referencia.
        const cartDocRef = querySnapshot.docs[0].ref;
  
        // Actualiza el campo 'listaIdCantidadProductos' utilizando arrayUnion.
        try {
          await updateDoc(cartDocRef, {
            listaIdCantidadProductos: arrayUnion({ id, cantidad: 1, precio }),
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
  const location = useLocation();
  const email = location.state && location.state.correo;
  const [productos, setProductos] = useState([]);
  const [userId, setUserId] = useState(null); // Para almacenar el valor de 'id'
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerIdUsuario = async () => {
      const usuarioQuery = query(collection(db, 'usuario'), where('correo', '==', email));
      const usuarioSnapshot = await getDocs(usuarioQuery);

      if (!usuarioSnapshot.empty) {
        usuarioSnapshot.forEach((doc) => {
          // Obtén el valor del atributo 'id' del documento de usuario
          const data = doc.data();
          const idUsuario = data.id;
          setUserId(idUsuario);
        });
      }
    };

    obtenerIdUsuario();

    // Consulta Firestore para obtener los productos.
    const productosQuery = collection(db, 'productos');
    const productosSnapshot = getDocs(productosQuery);

    productosSnapshot.then((snapshot) => {
      const productList = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        productList.push(data);
      });

      setProductos(productList);
    });
  }, [email]);

  const handleNavigate = (route) => {
    navigate(route);
  };

  const navigateToCarrito = () => {
    navigate('/Carrito', { state: { correo: email, userId: userId } });
  };

  return (
    <AccederTiendaClienteView
      productos={productos}
      handleNavigate={handleNavigate}
      navigateToCarrito={navigateToCarrito}
      email={email}
      navigate={navigate}
      userId={userId}
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

export {AgregarProducto,EditarProductoAdmin,VerMasCliente,AccederTiendaCliente,AccederTiendaAdmin};