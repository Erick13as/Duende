function EliminarSubCategoriaView(props) {
    const {
        selectedSCategory,
        setSelectedSCategory,
        Scategories,
        navigate,
        handleDeleteSCategory,

    } = props;

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

export default EliminarSubCategoriaView;