import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase/firebaseConfig';
import 'firebase/firestore';

const EliminarCategoria = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
        const categoryQuery = query(collection(db, 'categoria'));
        const categorySnapshot = await getDocs(categoryQuery);
        const categoryData = categorySnapshot.docs.map((doc) => doc.data().nombre);
        setCategories(categoryData);
        };

        fetchCategories();

    }, []);

    const handleDeleteCategory = async (e) => {

    };

    return (
        <div className='eliminarCategoria-container'>
            <form className='formTopOA'>
                <div>
                    <button onClick={()=>navigate('/galeriaAdmin')} className='botonOA'>Galería</button>     
                </div>
            </form>

            <form className='formCC'>
                <h1 className="titleImagen">Eliminar Categoría</h1>
                <div className='centrar'>
                    <h3 className='text'>Seleccione la Categoría:</h3>
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
                        <button onClick={handleDeleteCategory} className='botonOOA'>
                            Eliminar
                        </button>
                    </div>
                </div>
            </form>
        </div>

    );

};

export default EliminarCategoria;