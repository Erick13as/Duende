import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useNavigate } from 'react-router-dom';

function ImageGallery() {
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]); // Estado para almacenar las subcategorías
  const navigate = useNavigate();

  useEffect(() => {
    // Consulta Firestore para obtener las URL de las imágenes.
    const q = collection(db, 'imagen');

    // Escuchar cambios en la colección de imágenes.
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const urls = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.imagenUrl) {
          urls.push({ url: data.imagenUrl, categoria: data.categoria, subcategoria: data.subcategoria });
        }
      });
      setImageUrls(urls);
    });

    // Obtener las categorías de Firestore y llenar el estado categories
    const fetchCategories = async () => {
      const categoryQuery = query(collection(db, 'categoria'));
      const categorySnapshot = await getDocs(categoryQuery);
      const categoryData = categorySnapshot.docs.map((doc) => doc.data().nombre);
      setCategories(categoryData);
    };

    fetchCategories(); // Llama a la función para obtener las categorías

    // Limpia el efecto cuando el componente se desmonta.
    return () => unsubscribe();
  }, []);

  // Función para obtener las subcategorías de la categoría seleccionada
  const fetchSubcategories = async () => {
    if (selectedCategory) {
      const subcategoryQuery = query(collection(db, 'subcategoria'), where('categoria', '==', selectedCategory));
      const subcategorySnapshot = await getDocs(subcategoryQuery);
      const subcategoryData = subcategorySnapshot.docs.map((doc) => doc.data().nombre);
      setSubcategories(subcategoryData);
    } else {
      // Si no hay una categoría seleccionada, vaciar la lista de subcategorías
      setSubcategories([]);
    }
  };

  // Llamar a fetchSubcategories cuando cambie la categoría seleccionada
  useEffect(() => {
    // Restablecer el valor de subcategoría cuando cambie la categoría
    setSelectedSubcategory('');

    // Llamar a fetchSubcategories cuando cambie la categoría seleccionada
    fetchSubcategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  return (
    <div className="galeria-container">
      <form className="formBarra">
        <button className="botonBarra" onClick={() => navigate('/duende')}>
          Cerrar Sesión
        </button>
        <button className="botonBarraIzq1" onClick={() => navigate('/opciones')}>
          Opciones
        </button>
        <button className="botonBarraIzq2" onClick={() => navigate('/tienda')}>
          Tienda
        </button>
      </form>
      <form className="formFiltro">
        <div className="select-container">
          <label htmlFor="categorySelect">Categoría: </label>
          <select
            id="categorySelect"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">...</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="select-container">
          <label htmlFor="subcategorySelect">Subcategoría: </label>
          <select
            id="subcategorySelect"
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
          >
            <option value="">...</option>
            {subcategories.map((subcategory, index) => (
              <option key={index} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
        </div>
      </form>

      <div className="carousel-container">
        <Carousel>
          {imageUrls
            .filter((image) => {
              // Filtrar por categoría y subcategoría seleccionadas
              if (selectedCategory && selectedCategory !== '') {
                if (image.categoria !== selectedCategory) {
                  return false;
                }
              }
              if (selectedSubcategory && selectedSubcategory !== '') {
                if (image.subcategoria !== selectedSubcategory) {
                  return false;
                }
              }
              // Si no se selecciona ninguna categoría ni subcategoría o si la imagen cumple con las condiciones,
              // mostrar la imagen
              return true;
            })
            .map((image, index) => (
              <div key={index} className="imagen-galeria-container">
                <img src={image.url} alt={`Imagen ${index}`} />
              </div>
            ))}
        </Carousel>
      </div>
    </div>
  );
}

export default ImageGallery;
