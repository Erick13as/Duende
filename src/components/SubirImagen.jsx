import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [etiquetas, setEtiquetas] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [subcategorias, setSubcategorias] = useState([]);
  const [selectedSubcategoria, setSelectedSubcategoria] = useState("");

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
    if (image) {
      setUploading(true);

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
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="subir_imagen-container">
      <form className="formSignUp">
        <h1 className="titleImagen">Nueva Imagen</h1>
        <h3 className="text">Ingrese la descripción de la imagen</h3>
        <textarea
          className="textBoxSingUp textarea-description" /* Apply the CSS class here */
          placeholder="Descripción"
          value={descripcion}
          onChange={handleDescriptionChange}
          rows="1"
        ></textarea>
        <h3 className="text">Ingrese las etiquetas de la imagen</h3>
        <input
          className="textBoxSingUp"
          type="text"
          placeholder="Etiquetas"
          value={etiquetas}
          onChange={(e) => setEtiquetas(e.target.value)}
        ></input>
        <h3 className="text">Seleccione la categoría</h3>
        <select
          className="textBoxSingUp"
          value={selectedCategoria}
          onChange={(e) => setSelectedCategoria(e.target.value)}
        >
          <option value="">...</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.nombre}>
              {categoria.nombre}
            </option>
          ))}
        </select>
        <h3 className="text">Seleccione la subcategoría</h3>
        <select
          className="textBoxSingUp"
          value={selectedSubcategoria}
          onChange={(e) => setSelectedSubcategoria(e.target.value)}
        >
          <option value="">...</option>
          {subcategorias.map((subcategoria) => (
            <option key={subcategoria.id} value={subcategoria.nombre}>
              {subcategoria.nombre}
            </option>
          ))}
        </select>
        <h3 id="errorLogin" className="message">Error</h3>
        <br id="espace"></br>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </form>
      <button onClick={handleUpload} disabled={uploading} className="botonImagen">
        Subir imagen
      </button>
      <form className="formImagen">
      {uploading && <p>Subiendo imagen...</p>}
      {imageUrl && (
        <div className="imagen-container">
          <img src={imageUrl} alt="Imagen subida" />
        </div>
      )}
      </form>
    </div>
  );
}

export default ImageUpload;
