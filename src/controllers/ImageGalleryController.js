import React, { useEffect, useState } from 'react';
import { onSnapshot, collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // Asegúrate de importar correctamente la configuración de Firebase
import ImageGalleryView from '../views/ImageGalleryView';
import { useNavigate } from 'react-router-dom';

function ImageGalleryController() {
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

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <ImageGalleryView
      imageUrls={imageUrls}
      selectedCategory={selectedCategory}
      selectedSubcategory={selectedSubcategory}
      categories={categories}
      subcategories={subcategories}
      handleCategoryChange={handleCategoryChange}
      handleSubcategoryChange={handleSubcategoryChange}
      navigateToLogin={navigateToLogin}
    />
  );
}

function Prueba(){
    return(
        <div>
            <h1>Prueba</h1>
        </div>
    );
}

export { ImageGalleryController, Prueba };
