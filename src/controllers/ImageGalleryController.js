import React, { useEffect, useState } from 'react';
import { onSnapshot, collection, query, getDocs, where, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import GaleriaSinLoginView from '../views/ImageGalleryView';
import GaleriaAdminView from '../views/ImageGalleryAdminView';
import InfoImagenAdminView from '../views/ImageGalleryAdminUpdateView';
import GaleriaClientView from '../views/ImageGalleryClientView';
import SubirImagenView from '../views/ImageGalleryAddImageView';

function GaleriaSinLogin() {
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
    <GaleriaSinLoginView
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

function GaleriaAdmin() {
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
      navigate('/infoImagenAdmin', { state: { imagenUrl: currentFilteredImage.url } });
    }
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateToOpciones = () => {
    navigate('/opcionesAdmin');
  };

  const navigateToTienda = () => {
    navigate('/AccederTiendaAdminController');
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleIndex = (index) => {
    setCurrentImageIndex(index);
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
  };

  return (
    <GaleriaAdminView
      imageUrls={imageUrls}
      selectedCategory={selectedCategory}
      selectedSubcategory={selectedSubcategory}
      categories={categories}
      subcategories={subcategories}
      handleCategoryChange={handleCategoryChange}
      handleSubcategoryChange={handleSubcategoryChange}
      navigateToLogin={navigateToLogin}
      handleVerInfo={handleVerInfo}
      navigateToOpciones={navigateToOpciones}
      navigateToTienda={navigateToTienda}
      handleIndex={handleIndex}
    />
  );
}

function InfoImagenAdmin() {
  const location = useLocation();
  const imagenUrl = location.state && location.state.imagenUrl;
  const imagenQuery = query(collection(db, 'imagen'), where('imagenUrl', '==', imagenUrl));
  const [descripcion, setDescripcion] = useState("");
  const [listaEtiquetas, setListaEtiquetas] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState("");

  // Estado para almacenar las categorías y subcategorías de la imagenQuery
  const [categoriaEncontrada, setCategoriaEncontrada] = useState("");
  const [subcategoriaEncontrada, setSubcategoriaEncontrada] = useState("");

  const [subcategoriaAnterior, setSubcategoriaAnterior] = useState("");
  const navigate = useNavigate();
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    // Realiza la consulta para obtener la descripción y etiquetas solo cuando se monta el componente
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(imagenQuery);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setDescripcion(data.descripcion || "");
          // Convierte el array de etiquetas en una cadena separada por espacios
          setListaEtiquetas(data.etiquetas ? data.etiquetas.join(' ') : "");

          // Obtener categoría y subcategoría relacionadas
          setCategoriaEncontrada(data.categoria);
          setSubcategoriaEncontrada(data.subcategoria);
          setCategoriaSeleccionada(data.categoria);
          setSubcategoriaSeleccionada(data.subcategoria);
        } 
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Consulta todas las categorías desde Firestore
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categoriasRef = collection(db, 'categoria');
        const categoriasSnapshot = await getDocs(categoriasRef);
        const categoriasData = categoriasSnapshot.docs.map((doc) => doc.data().nombre);
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  // Consulta todas las subcategorías desde Firestore
  useEffect(() => {
    const fetchSubcategorias = async () => {
      try {
        // Verifica si se ha seleccionado una categoría
        if (categoriaSeleccionada) {
          const subcategoriasRef = collection(db, 'subcategoria');
          const subcategoriasQuery = query(subcategoriasRef, where('categoria', '==', categoriaSeleccionada));
          const subcategoriasSnapshot = await getDocs(subcategoriasQuery);
          const subcategoriasData = subcategoriasSnapshot.docs.map((doc) => doc.data().nombre);
          if ((categoriaEncontrada !== categoriaSeleccionada && subcategoriaEncontrada !== "...")) {
            setSubcategoriaAnterior(subcategoriaEncontrada);
            setSubcategoriaEncontrada("...");
          }
          if (categoriaEncontrada === categoriaSeleccionada && subcategoriaEncontrada === "...") {
            setSubcategoriaAnterior(subcategoriaSeleccionada);
          }
          setSubcategorias(subcategoriasData);
        } else {
          // Si no se ha seleccionado una categoría, muestra todas las subcategorías
          const subcategoriasRef = collection(db, 'subcategoria');
          const subcategoriasSnapshot = await getDocs(subcategoriasRef);
          const subcategoriasData = subcategoriasSnapshot.docs.map((doc) => doc.data().nombre);
          setSubcategorias(subcategoriasData);
        }
      } catch (error) {
        console.error("Error al obtener subcategorías:", error);
      }
    };
    fetchSubcategorias();
  }, [categoriaSeleccionada, categoriaEncontrada, subcategoriaEncontrada, subcategoriaAnterior, subcategoriaSeleccionada]);

  const handleEliminarClick = async () => {
  try {
    const querySnapshot = await getDocs(imagenQuery);
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;

      // Obtén la URL de la imagen y el nombre del archivo
      const imagenData = querySnapshot.docs[0].data();
      const imagenPath = imagenData.imagenUrl;
      console.log(imagenPath)

      // Crear una referencia para el archivo en Firebase Storage
      const storageRef = ref(storage, imagenPath);

      // Borra el archivo en Firebase Storage
      await deleteObject(storageRef);
      
      // Borra el documento en Firestore
      await deleteDoc(docRef);

      alert("Imagen eliminada correctamente");
      navigate('/galeriaAdmin'); // Redirige a la página de la galería u otra página según tus necesidades
    }
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
  }
};

  
  const handleActualizarClick = async () => {
    if (
      (categoriaEncontrada !== categoriaSeleccionada && subcategoriaAnterior === subcategoriaSeleccionada) ||
      subcategoriaSeleccionada === "..." ||
      subcategoriaSeleccionada === ".."
    ) {
      alert("Datos inválidos");
    } else {
      try {
        // Actualiza los datos en Firestore
        const querySnapshot = await getDocs(imagenQuery);
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          // Divide la cadena de etiquetas en un arreglo
          const etiquetas = listaEtiquetas.split(' ');

          // Actualiza el documento
          await updateDoc(docRef, {
            descripcion,
            etiquetas,
            categoria: categoriaSeleccionada,
            subcategoria: subcategoriaSeleccionada,
          });
          alert("Datos actualizados correctamente");
        }
      } catch (error) {
        console.error("Error al actualizar datos:", error);
      }
    }
  };

  // Lógica para construir las opciones de categoría y subcategoría
  const categoriasOptions = [
    <option key={categoriaEncontrada} value={categoriaEncontrada}>
      {categoriaEncontrada}
    </option>,
    ...categorias
      .filter((categoria) => categoria !== categoriaEncontrada)
      .map((categoria) => (
        <option key={categoria} value={categoria}>
          {categoria}
        </option>
      ))
  ];

  const subcategoriasOptions = [
    <option key={subcategoriaEncontrada} value={subcategoriaEncontrada}>
      {subcategoriaEncontrada}
    </option>,
    ...subcategorias
      .filter((subcategoria) => subcategoria !== subcategoriaEncontrada)
      .map((subcategoria) => (
        <option key={subcategoria} value={subcategoria}>
          {subcategoria}
        </option>
      ))
  ];

  const handleCambiarClick = () => {
    const fileInput = document.getElementById('imageInput');
    fileInput.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleReemplazarImagen = async () => {
    if (newImage) {
      try {
        const querySnapshot = await getDocs(imagenQuery);
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;

          // Obtén la URL de la imagen actual para eliminarla
          const imagenData = querySnapshot.docs[0].data();
          const imagenPath = imagenData.imagenUrl;

          // Borra el archivo anterior en Firebase Storage
          const storageRef = ref(storage, imagenPath);
          await deleteObject(storageRef);

          // Sube la nueva imagen a Firebase Storage
          const newImageRef = ref(storage, `imagen/${newImage.name}`);
          await uploadBytes(newImageRef, newImage);

          // Obtiene la nueva URL de la imagen
          const newImageUrl = await getDownloadURL(newImageRef);

          // Actualiza la URL de la imagen en Firestore
          await updateDoc(docRef, { imagenUrl: newImageUrl });

          alert("Imagen reemplazada correctamente");
          navigate('/galeriaAdmin');
        }
      } catch (error) {
        console.error("Error al reemplazar la imagen:", error);
      }
    } else {
      alert("Por favor, selecciona una nueva imagen.");
    }
  };

  const navigateToGallery = () => {
    navigate('/galeriaAdmin');
  };

  const handleCategoryChange = (e) => {
    setCategoriaSeleccionada(e.target.value);
  };

  const handleSubcategoryChange = (e) => {
    setSubcategoriaSeleccionada(e.target.value);
  };

  const handleDescripcionChange = (e) => {
    setDescripcion(e.target.value);
  };

  const handleEtiquetasChange = (e) => {
    setListaEtiquetas(e.target.value);
  };

  return (
    <InfoImagenAdminView
      imagenUrl={imagenUrl}
      descripcion={descripcion}
      listaEtiquetas={listaEtiquetas}
      categoriaSeleccionada={categoriaSeleccionada}
      subcategoriaSeleccionada={subcategoriaSeleccionada}
      newImage={newImage}
      handleEliminarClick={handleEliminarClick}
      handleCambiarClick={handleCambiarClick}
      handleReemplazarImagen={handleReemplazarImagen}
      handleImageChange={handleImageChange}
      categoriasOptions={categoriasOptions}
      subcategoriasOptions={subcategoriasOptions}
      handleActualizarClick={handleActualizarClick}
      handleDescripcionChange={handleDescripcionChange}
      handleEtiquetasChange={handleEtiquetasChange}
      handleCategoryChange={handleCategoryChange}
      handleSubcategoryChange={handleSubcategoryChange}
      navigateToGallery={navigateToGallery}
    />
  );
}

function GaleriaCliente() {
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

  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateToTienda = () => {
    navigate('/AccederTiendaClienteController');
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleIndex = (index) => {
    setCurrentImageIndex(index);
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
  };


  return (
    <GaleriaClientView
      imageUrls={imageUrls}
      selectedCategory={selectedCategory}
      selectedSubcategory={selectedSubcategory}
      categories={categories}
      subcategories={subcategories}
      handleCategoryChange={handleCategoryChange}
      handleSubcategoryChange={handleSubcategoryChange}
      navigateToLogin={navigateToLogin}
      handleVerInfo={handleVerInfo}
      navigateToTienda={navigateToTienda}
      handleIndex={handleIndex}
    />
  );
}

function SubirImagen() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [etiquetas, setEtiquetas] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [subcategorias, setSubcategorias] = useState([]);
  const [selectedSubcategoria, setSelectedSubcategoria] = useState("");
  const [errorText, setErrorText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories when the component mounts
    const fetchCategorias = async () => {
      try {
        const categoriaCollection = collection(db, 'categoria');
        const categoriaSnapshot = await getDocs(categoriaCollection);
        const categoriaData = categoriaSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategorias(categoriaData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    // Fetch subcategories when the selectedCategoria changes
    const fetchSubcategorias = async () => {
      try {
        if (selectedCategoria) {
          const subcategoriaCollection = collection(db, 'subcategoria');
          console.log('nombre:', selectedCategoria);
          const subcategoriaQuery = query(subcategoriaCollection, where('categoria', '==', selectedCategoria));
          const unsubscribe = onSnapshot(subcategoriaQuery, (snapshot) => {
            const subcategoriaData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setSubcategorias(subcategoriaData);
            setSelectedSubcategoria(""); // Clear selectedSubcategoria when changing categories
          });
          return unsubscribe;
        } else {
          setSubcategorias([]);
          setSelectedSubcategoria("");
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubcategorias();
  }, [selectedCategoria]);

  const handleDescriptionChange = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    setDescripcion(textarea.value);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImage(selectedImage);
    }
  };

  const handleUpload = async () => {
    var errorMessage = document.getElementById('errorLogin');
    if (!descripcion || !etiquetas || !selectedCategoria || !selectedSubcategoria || !image) {
      setErrorText('Complete todos los campos antes de subir la imagen.');
      errorMessage.style.display = "block";
      return; // Don't proceed with the upload if any field is missing
    }

    errorMessage.style.display = "none";
    setUploading(true);
    setErrorText(""); // Clear any previous error messages

    try {
      const storageRef = ref(storage, `imagen/${image.name}`);
      await uploadBytes(storageRef, image);

      const downloadURL = await getDownloadURL(storageRef);
      const tagsArray = etiquetas.split(' ');

      const docRef = await addDoc(collection(db, 'imagen'), {
        imagenUrl: downloadURL,
        descripcion: descripcion,
        etiquetas: tagsArray,
        categoria: selectedCategoria,
        subcategoria: selectedSubcategoria,
        fechaSubida: serverTimestamp(),
      });

      setImageUrl(downloadURL);
      console.log('Imagen subida con éxito. ID del documento:', docRef.id);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      setErrorText('Hubo un error al subir la imagen. Por favor, inténtelo nuevamente.');
    } finally {
      setUploading(false);
    }
  };

  const navigateToGallery = () => {
    navigate('/galeriaAdmin');
  };

  const handleCategoryChange = (e) => {
    setSelectedCategoria(e.target.value);
  };

  const handleEtiquetasChange = (e) => {
    setEtiquetas(e.target.value);
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategoria(e.target.value);
  };

  return (
    <SubirImagenView
      descripcion={descripcion}
      handleDescriptionChange={handleDescriptionChange}
      etiquetas={etiquetas}
      selectedCategoria={selectedCategoria}
      categorias={categorias}
      selectedSubcategoria={selectedSubcategoria}
      subcategorias={subcategorias}
      handleImageChange={handleImageChange}
      errorText={errorText}
      handleUpload={handleUpload}
      uploading={uploading}
      imageUrl={imageUrl}
      navigateToGallery={navigateToGallery}
      handleEtiquetasChange={handleEtiquetasChange}
      handleCategoryChange={handleCategoryChange}
      handleSubcategoryChange={handleSubcategoryChange}
    />
  );
}

export { GaleriaSinLogin,  GaleriaAdmin, InfoImagenAdmin, GaleriaCliente, SubirImagen };
