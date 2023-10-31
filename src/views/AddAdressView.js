function IngresarDireccionView(props) {
    const {
        provincias,
        handleContinuar,
        navigate,

    } = props;

    return (
        <div className='eliminarCategoria-container'>
            <form className='formTopOA'>
                <div>
                    <button onClick={()=>navigate('/galeriaCliente')} className='botonOA'>Inicio</button>     
                </div>
            </form>

            <form className='formCC'>
                <h1 className="titleImagen">Detalles de Compra</h1>
                <div className='centrar'>
                    <h3 className='text'>Dirección de Envío</h3>
                    <h3 className='text'>Seleccione la Provincia:</h3>
                    <div className='select-container'>
                    <label htmlFor='categorySelect'></label>
                    </div>
                    <div>
                        <button onClick={handleContinuar} className='botonOOA'>
                            Continuar
                        </button>
                    </div>
                </div>
            </form>
        </div>

    );

};

export default IngresarDireccionView;