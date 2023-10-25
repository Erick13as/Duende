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
  query, where, getDocs, deleteDoc // Agregamos deleteDoc para eliminar productos
} from 'firebase/firestore';
import { db, storage } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';

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
    <div className="vmasC-container">
      <div className="header-container">
        <button className="header-button inicio-button" onClick={() => handleNavigate('/AccederTiendaAdminController')}>
          Inicio
        </button>
        <button className="header-button" id="ordenes-button" >
          Gestion Ordenes
        </button>
        <button className="header-button" id="carrito-button">
          Añadir Producto
        </button>
      </div>

      <div className="image-info-container">
        <div className="image-button-container">
          <img
            className="imagen-galeria-container2"
            src={isEditing ? editedProductImage ? URL.createObjectURL(editedProductImage) : editedProduct.imagen : product.imagen}
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
              Editar Producto
            </button>
          )}
          {!isEditing && (
            <button className="cancel-button" onClick={handleDelete}>
              Eliminar Producto
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
            <div className="input-field">
              <label htmlFor="nombre">Nombre del Producto:</label>
              <input
                type="text"
                value={editedProduct.nombre}
                onChange={(e) => setEditedProduct({ ...editedProduct, nombre: e.target.value })}
              />
            </div>
            <div className="input-field">
              <label htmlFor="precio">Precio:</label>
              <input
                type="number"
                value={editedProduct.precio}
                onChange={(e) => setEditedProduct({ ...editedProduct, precio: parseFloat(e.target.value) })}
              />
            </div>
            <div className="input-field">
              <label htmlFor="descripcion">Descripción:</label>
              <input
                type="text"
                value={editedProduct.descripcion}
                onChange={(e) => setEditedProduct({ ...editedProduct, descripcion: e.target.value })}
              />
            </div>
            <div className="input-field">
              <label htmlFor="cantidad">Cantidad:</label>
              <input
                type="number"
                value={editedProduct.cantidad}
                onChange={(e) => setEditedProduct({ ...editedProduct, cantidad: parseInt(e.target.value) })}
              />
            </div>
            <div className="input-field">
              <label htmlFor="marca">Marca:</label>
              <input
                type="text"
                value={editedProduct.marca}
                onChange={(e) => setEditedProduct({ ...editedProduct, marca: e.target.value })}
              />
            </div>
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
