import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  query, where, getDocs
} from 'firebase/firestore';
import { db,storage} from '../firebase/firebaseConfig';

function EditarProductoAdmin() {
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [productImage, setEditedProductImage] = useState(null);

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
  };

  
  const handleSaveEdit = async () => {
    const productoId = id;
    const q = query(collection(db, 'productos'), where('id', '==', productoId));
    const querySnapshot = await getDocs(q);
    let productIDFirestore=null;
    


    if (!querySnapshot.empty) {
      // Obtiene el primer documento que coincida (suponiendo que no hay duplicados)
      const productDoc = querySnapshot.docs[0];
    
      // Obtiene el ID asignado por Firestore del documento
      productIDFirestore = productDoc.id;
    
      if (editedProduct) {
        const productDocRef = doc(db, 'productos', productIDFirestore);
        try {
          const storageRef = ref(storage, `imagen/${productImage.name}`);
          await uploadBytes(storageRef, productImage);
          const downloadURL = await getDownloadURL(storageRef);
          await updateDoc(productDocRef, {
            nombre: editedProduct.nombre,
            precio: editedProduct.precio,
            descripcion: editedProduct.descripcion,
            cantidad: editedProduct.cantidad,
            marca: editedProduct.marca,
            imagen: downloadURL,
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
    // Actualiza la URL de la imagen en el objeto editedProduct
    //setEditedProduct({ ...editedProduct, imagen: URL.createObjectURL(newImage) });
    if (newImage) {
      setEditedProductImage(newImage);
    }
  };

  if (!product) {
    return <div>No se encontró el producto o ocurrió un error.</div>;
  }

  return (
    <div className="EditarProducto-container">
      <div className="header-containerEditarProducto">
        <button className="header-buttonProducto">Inicio</button>
      </div>
      <div className="image-info-container">
        <div className="image-button-container">
          <img
            className="imagen-galeria-container2"
            src={isEditing ? editedProduct.imagen : product.imagen}
            alt={isEditing ? editedProduct.nombre : product.nombre}
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          )}
          {!isEditing && (
            <button className="edit-button" onClick={handleEdit}>
              Editar
            </button>
          )}
          {isEditing && (
            <button className="edit-button" onClick={handleSaveEdit}>
              Guardar
            </button>
          )}
          {isEditing && (
            <button className="cancel-button" onClick={handleCancelEdit}>
              Cancelar
            </button>
          )}
        </div>
        <div className="product-info">
          <h1>Detalles del Producto</h1>
          {isEditing ? (
            <div>
              <input
                type="text"
                value={editedProduct.nombre}
                onChange={(e) => setEditedProduct({ ...editedProduct, nombre: e.target.value })}
              />
              <input
                type="number"
                value={editedProduct.precio}
                onChange={(e) => setEditedProduct({ ...editedProduct, precio: parseFloat(e.target.value) })}
              />
              <input
                type="text"
                value={editedProduct.descripcion}
                onChange={(e) => setEditedProduct({ ...editedProduct, descripcion: e.target.value })}
              />
              <input
                type="number"
                value={editedProduct.cantidad}
                onChange={(e) => setEditedProduct({ ...editedProduct, cantidad: parseInt(e.target.value) })}
              />
              <input
                type="text"
                value={editedProduct.marca}
                onChange={(e) => setEditedProduct({ ...editedProduct, marca: e.target.value })}
              />
            </div>
          ) : (
            <div>
              <h2>Nombre del Producto: {product.nombre}</h2>
              <p>Precio: {product.precio}</p>
              <p>Descripción: {product.descripcion}</p>
              <p>Cantidad: {product.cantidad}</p>
              <p>Marca: {product.marca}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditarProductoAdmin;

