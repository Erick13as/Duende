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
  const [subcategories, setSubcategories] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filteredImages, setFilteredImages] = useState([]); // Nuevo estado para imágenes filtradas
  const navigate = useNavigate();

  useEffect(() => {
    const q = collection(db, 'imagen');

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

    const fetchCategories = async () => {
      const categoryQuery = query(collection(db, 'categoria'));
      const categorySnapshot = await getDocs(categoryQuery);
      const categoryData = categorySnapshot.docs.map((doc) => doc.data().nombre);
      setCategories(categoryData);
    };

    fetchCategories();

    return () => unsubscribe();
  }, []);

  const fetchSubcategories = async () => {
    if (selectedCategory) {
      const subcategoryQuery = query(collection(db, 'subcategoria'), where('categoria', '==', selectedCategory));
      const subcategorySnapshot = await getDocs(subcategoryQuery);
      const subcategoryData = subcategorySnapshot.docs.map((doc) => doc.data().nombre);
      setSubcategories(subcategoryData);
    } else {
      setSubcategories([]);
    }
  };

  useEffect(() => {
    setSelectedSubcategory('');
    fetchSubcategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  useEffect(() => {
    // Filtrar imágenes según las selecciones de categoría y subcategoría
    const filtered = imageUrls.filter((image) => {
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
      return true;
    });

    // Actualizar el estado de las imágenes filtradas
    setFilteredImages(filtered);
  }, [selectedCategory, selectedSubcategory, imageUrls]);

  const handleVerInfo = () => {
    const currentFilteredImage = filteredImages[currentImageIndex]; // Obtener la imagen filtrada actual

    if (currentFilteredImage) {
      navigate('/infoImagenCliente', { state: { imagenUrl: currentFilteredImage.url } });
    }
  };

  return (
    <div className="galeria-container">
      <form className="formBarra">
        <button className="botonBarra" onClick={() => navigate('/tienda')}>
          Tienda
        </button>
        <div className="botonBarra-container">
          <button className="botonBarra" onClick={() => navigate('/duende')}>
            Cerrar Sesión
          </button>
        </div>
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
      <button className="ver-info-button" onClick={handleVerInfo}>
        Ver información de la imagen
      </button>
      
      <div className="carousel-container">
        <Carousel onChange={index => setCurrentImageIndex(index)}>
          {imageUrls
            .filter((image) => {
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
