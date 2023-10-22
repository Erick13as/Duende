
function OpcionesAdminView(props) {
    const {
        navigate,
    } =props;

    return(
        <div className='opcionesAdmin-container'>
            <form className='formTopOA'>
                <div>
                    <button onClick={()=>navigate('/galeriaAdmin')} className='botonOA'>Galería</button>
                    <button onClick={()=>navigate('/opcionesAdmin')} className='botonOA'>Tienda</button>
                    <button onClick={()=>navigate('/opcionesAdmin')} className='botonOA'>Agenda</button>
                    
                </div>
                <button onClick={()=>navigate('/login')} className='botonOA2'>Cerrar sesión</button>
            </form>
            <form className='formBottomOA'>
                <h3 className='text'>Opciones de administrador</h3>
                <div>
                <button onClick={()=>navigate('/subirImagen')} className='botonOOA'>Agregar Imagen</button>
                <button onClick={()=>navigate('/crearCategoria')} className='botonOOA'>Crear Categoría</button>
                <button onClick={()=>navigate('/eliminarCategoria')} className='botonOOA'>Eliminar Categoría</button>
                <button onClick={()=>navigate('/crearSubcategoria')} className='botonOOA'>Crear SubCategoría</button>
                <button onClick={()=>navigate('/eliminarSubcategoria')} className='botonOOA'>Eliminar SubCategoría</button>
                </div>
            </form>
        </div>

    );


};

export default OpcionesAdminView;