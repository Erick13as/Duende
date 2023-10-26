import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  onSnapshot,
  doc,
  getDoc,
  updateDoc, where, deleteDoc // Agregamos deleteDoc para eliminar productos
} from 'firebase/firestore';
import AgregarProductoView from '../views/AgregarProductoView';
import EditarProductoAdminView from '../views/EditarProductoAdminView';

function AgregarProducto() {
  const [productName, setProductName] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productQuantity, setProductQuantity] = useState(0);
  const [productImage, setProductImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorText, setErrorText] = useState('');
  
  const handlesetProductName = (e) => {
    setProductName(e.target.value);
  };
  const handlesetProductBrand = (e) => {
    setProductBrand(e.target.value);
  };
  const handlesetProductDescription = (e) => {
    setProductDescription(e.target.value);
  };
  const handlesetProductPrice = (e) => {
    setProductPrice(e.target.value);
  };
  const handlesetProductQuantity = (e) => {
    setProductQuantity(e.target.value);
  };


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
        handlesetProductName={handlesetProductName}
        handlesetProductBrand={handlesetProductBrand}
        handlesetProductDescription={handlesetProductDescription}
        handlesetProductPrice={handlesetProductPrice}
        handlesetProductQuantity={handlesetProductQuantity}
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
  const handlesetProductos = (e) => {
    setProductos(e.target.value);
  };
  const handlesetProduct = (e) => {
    setProduct(e.target.value);
  };
  const handlesetIsEditing = (e) => {
    setIsEditing(e.target.value);
  };
  const handlesetEditedProduct= (e) => {
    setEditedProduct(e.target.value);
  };
  const handlesetEditedProductImage = (e) => {
    setEditedProductImage(e.target.value);
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
        handlesetProductos={handlesetProductos}
        handlesetProduct={handlesetProduct}
        handlesetIsEditing={handlesetIsEditing}
        handlesetEditedProduct={handlesetEditedProduct}
        handlesetEditedProductImage={handlesetEditedProductImage}
    />
  );
}
export {AgregarProducto,EditarProductoAdmin};