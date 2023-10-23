function EliminarCategoriaView(props) {
    const {
        selectedCategory,
        setSelectedCategory,
        categories,
        navigate,
        handleDeleteCategory,
    
    } = props;

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

export default EliminarCategoriaView;