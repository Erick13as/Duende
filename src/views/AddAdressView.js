function IngresarDireccionView(props) {
    const {
        provincias,
        handleContinuar,
        navigate,
        obtenerProvincias,
        handleProvinciaChange,
        provinciaSeleccionada,
        cantones,
        handleCantonChange,
        cantonSeleccionado,

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
                        <select onChange={handleProvinciaChange} value={provinciaSeleccionada} >
                            {provincias.map(provincia => (
                                <option key={provincia.id} value={provincia.id}>
                                    {provincia.nombre}
                                </option>
                            ))}
                        </select>

                    </div>
                    
                    <h3 className='text'>Seleccione el Cantón:</h3>
                    <div>
                        <select onChange={handleCantonChange} value={cantonSeleccionado} >
                            <option value="">Seleccione un cantón</option>
                            {cantones.map(canton => (
                                <option key={canton.id} value={canton.id}>
                                    {canton.nombre}
                                </option>
                            ))}
                        </select>
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