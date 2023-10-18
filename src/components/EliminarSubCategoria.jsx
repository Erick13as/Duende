import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '../firebase/firebaseConfig';
import 'firebase/firestore';

const EliminarSubCategoria = () => {
    const [selectedSCategory, setSelectedSCategory] = useState('');
    const [Scategories, setSCategories] = useState([]);
    const navigate = useNavigate();
    const [errorText, setErrorText] = useState("");

    useEffect(() => {
        const fetchSCategories = async () => {
        const ScategoryQuery = query(collection(db, 'subcategoria'));
        const ScategorySnapshot = await getDocs(ScategoryQuery);
        const ScategoryData = ScategorySnapshot.docs.map((doc) => doc.data().nombre);
        setSCategories(ScategoryData);
        };

        fetchSCategories();

    }, []);

    const handleDeleteSCategory = async (e) => {
        e.preventDefault();
        
        if (!selectedSCategory) {
            setErrorText('No se ha seleccionado una Subcategoría para eliminar.');
            return;
        }
        
        try {

            const querySnapshot = await getDocs(collection(db, 'subcategoria'));

            querySnapshot.forEach(async (doc) => {
                const data = doc.data();
                if (data.nombre === selectedSCategory) {
                    const ScategoryRef = doc.ref;

                    await deleteDoc(ScategoryRef);

                    console.log(`Categoría "${selectedSCategory}" eliminada con éxito.`);

                    const updatedCategories = await fetchSCategories();
                    setSCategories(updatedCategories);
                }

            });
        
        } catch (error) {
            // Manejo de errores: muestra un mensaje de error al usuario o realiza cualquier otra acción necesaria.
            console.error('Error al eliminar la subCategoría:', error);
        }
    };

    const fetchSCategories = async () => {
        const ScategoryQuery = query(collection(db, 'subcategoria'));
        const ScategorySnapshot = await getDocs(ScategoryQuery);
        const ScategoryData = ScategorySnapshot.docs.map((doc) => doc.data().nombre);
        return ScategoryData;
    };

    return (
        <div className='eliminarCategoria-container'>
            <form className='formTopOA'>
                <div>
                    <button onClick={()=>navigate('/galeriaAdmin')} className='botonOA'>Galería</button>     
                </div>
            </form>

            <form className='formCC'>
                <h1 className="titleImagen">Eliminar SubCategoría</h1>
                <div className='centrar'>
                    <h3 className='text'>Seleccione la SubCategoría:</h3>
                    <div className='select-container'>
                    <label htmlFor='ScategorySelect'></label>
                    <select
                        id='ScategorySelect'
                        value={selectedSCategory}
                        onChange={(e) => setSelectedSCategory(e.target.value)}
                    >
                        <option value="">...</option>
                        {Scategories.map((Scategory, index) => (
                            <option key={index} value={Scategory}>
                                {Scategory}
                            </option>
                        ))}
                    </select>
                    </div>
                    <div>
                        <button onClick={handleDeleteSCategory} className='botonOOA'>
                            Eliminar
                        </button>
                    </div>
                </div>
            </form>
        </div>

    );

};

export default EliminarSubCategoria;