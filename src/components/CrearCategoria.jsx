import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db, storage } from '../firebase/firebaseConfig';
import 'firebase/firestore';

 const CrearCategoria = () => {
    const [nombreC, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [errorText, setErrorText] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleNameChange = (e) => {
        setNombre(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescripcion(e.target.value);
    };

    const handleNewCategory = async () => {
        var errorMessage = document.getElementById('errorLogin');
        if (!nombreC || !descripcion) {
          setErrorText('Complete el nombre y la descripción antes de subir la categoría.');
          errorMessage.style.display = "block";
          return; 
        }
      
        errorMessage.style.display = "none";
        setUploading(true);
        setErrorText(""); 
      
        try {
          const docRef = await addDoc(collection(db, 'categoria'), {
            nombre: nombreC,
            descripcion: descripcion,
          });
      
          console.log('Categoría subida con éxito. ID del documento:', docRef.id);
        } catch (error) {
          console.error('Error al subir la categoría:', error);
          setErrorText('Hubo un error al subir la categoría. Por favor, inténtelo nuevamente.');
        } finally {
          setUploading(false);
        }
      };

    return(
        <div className='crearCategoria-containter'>
            <form className='formCC'>
                <h1 className="titleImagen">Crear nueva Categoría</h1>
                <h3 className='text'>Nombre de la categoria:</h3>
                <textarea
                className="textBoxCC textarea-description"
                placeholder="Categoría"
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
                <div>
                <button onClick={handleNewCategory} className='botonCC'>
                    Crear Categoria
                </button>
                </div>
                <div id="errorLogin" style={{ display: 'none' }}></div>
            </form>
        </div>
    );

 };

 export default CrearCategoria;