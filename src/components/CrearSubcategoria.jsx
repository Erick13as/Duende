import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase/firebaseConfig';
import 'firebase/firestore';

const CrearSubcategoria = () => {
    const [nombreC, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [errorText, setErrorText] = useState("");
    const [uploading, setUploading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);

    const handleNameChange = (e) => {
        setNombre(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescripcion(e.target.value);
    };

    useEffect(() => {
        const fetchCategories = async () => {
        const categoryQuery = query(collection(db, 'categoria'));
        const categorySnapshot = await getDocs(categoryQuery);
        const categoryData = categorySnapshot.docs.map((doc) => doc.data().nombre);
        setCategories(categoryData);
        };

        fetchCategories();

    }, []);

    const handleNewSCategory = async (e) => {
        e.preventDefault();
        var errorMessage = document.getElementById('errorLogin');
        if (!nombreC || !descripcion || !selectedCategory) {
            setErrorText('Complete el nombre, la descripción y la categoria antes de subir la Subcategoría.');
            errorMessage.style.display = "block";
            return; 
        }
        
        errorMessage.style.display = "none";
        setUploading(true);
        setErrorText(""); 
        
        try {
            const docRef = await addDoc(collection(db, 'subcategoria'), {
            nombre: nombreC,
            descripcion: descripcion,
            categoria: selectedCategory,
          });
        
          console.log('SubCategoría creada con éxito. ID del documento:', docRef.id);
          setNombre('');
          setDescripcion('');
        } catch (error) {
            console.error('Error al crear la Subcategoría:', error);
            setErrorText('Hubo un error al crear la subcategoría. Por favor, inténtelo nuevamente.');
        } finally {
            setUploading(false);
        }
      };

      const navigate = useNavigate();

      return(
        <div className='crearCategoria-containter'>
          <form className='formTopOA'>
            <div>
              <button onClick={()=>navigate('/galeriaAdmin')} className='botonOA'>Galería</button>     
            </div>
          </form>
  
          <form className='formCC'>
            <h1 className="titleImagen">Crear nueva Subcategoría</h1>
            <h3 className='text'>Nombre de la Subcategoria:</h3>
            <textarea
              className="textBoxCC textarea-description"
              placeholder="Subcategoría"
              value={nombreC}
              onChange={handleNameChange}
              rows="1"
            ></textarea>
            <h3 className='text'>Descripción:</h3>
            <textarea
              className="textBoxCC textarea-description"
              placeholder="Descripción"
              value={descripcion}
              onChange={handleDescriptionChange}
            ></textarea>
            <div className='select-container'>
                    <label htmlFor='categorySelect'></label>
                    <select
                        id='categorySelect'
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
            <div>
              <button onClick={handleNewSCategory} className='botonCC'>
                Crear Subategoria
              </button>
            </div>
            <div id="errorLogin" style={{ display: 'none' }}></div>
          </form>
        </div>
      );

};

export default CrearSubcategoria;