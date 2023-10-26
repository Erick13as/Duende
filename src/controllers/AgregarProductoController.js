import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';
import AgregarProductoView from '../views/AgregarProductoView';
import { useNavigate } from 'react-router-dom';

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

export {AgregarProducto};