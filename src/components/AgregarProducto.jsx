import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';

function ProductUpload() {
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

  const handleUpload = async () => {
    if (!productName || !productDescription || !productPrice || !productQuantity || !productImage) {
      setErrorText('Complete todos los campos antes de subir el producto.');
      return;
    }

    setErrorText('');
    setUploading(true);

    try {
      const storageRef = ref(storage, `imagen/${productImage.name}`);
      await uploadBytes(storageRef, productImage);

      const downloadURL = await getDownloadURL(storageRef);

      const productData = {
        nombre: productName,
        descripcion: productDescription,
        precio: productPrice,
        cantidad: productQuantity,
        imagenUrl: downloadURL,
        fechaSubida: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'productos'), productData);

      console.log('Producto subido con éxito. ID del documento:', docRef.id);
    } catch (error) {
      console.error('Error al subir el producto:', error);
      setErrorText('Hubo un error al subir el producto. Por favor, inténtelo nuevamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="main-containerProduct">
      <div className="header-containerProducto">
        <button className="header-buttonProducto">Inicio</button>
        <button className="header-buttonProducto" >Gestión de Órdenes</button>
      </div>
      <div className="subir_producto-container">
        <form className="formUploadProducto">
          <h1 className="titleSu birProducto">Nuevo Producto</h1>
          <div className="input-containerProducto">
            <label htmlFor="productName">Nombre:</label>
            <input
              className="textBoxUploadProducto"
              type="text"
              placeholder="Nombre del Producto"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="input-containerProducto">
            <label htmlFor="productDescription">Descripción:</label>
            <textarea
              className="textBoxUploadProducto"
              placeholder="Descripción del Producto"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>
          <div className="input-containerProducto">
            <label htmlFor="productBrand">Marca:</label>
            <input
              className="textBoxUploadProducto"
              type="text"
              placeholder="Marca del Producto"
              value={productBrand}
              onChange={(e) => setProductBrand(e.target.value)}
            />
          </div>
          <div className="input-containerProducto">
            <label htmlFor="productPrice">Precio:</label>
            <input
              className="textBoxUploadProducto"
              type="number"
              placeholder="Precio"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </div>
          <div className="input-containerProducto">
            <label htmlFor="productCantidad">Cantidad disponible:</label>
            <input
              className="textBoxUploadProducto"
              type="number"
              placeholder="Cantidad"
              value={productQuantity}
              onChange={(e) => setProductQuantity(e.target.value)}
            />
          </div>
          <input type="file" accept="imagen/*" onChange={handleImageChange} />
          <h3 className="messageProducto">{errorText}</h3>
        </form>
        <button onClick={handleUpload} disabled={uploading} className="botonSubirProducto">
          Subir Producto
        </button>
        {uploading && <p>Subiendo producto...</p>}
      </div>
    </div>
  );
}

export default ProductUpload;
