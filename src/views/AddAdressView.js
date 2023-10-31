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
        handleDistritoChange,
        distritos,
        distritoSeleccionado,
        detalles,
        setDetalles,

    } = props;

    return (
        <div className='eliminarCategoria-container'>
            <form className='formTopOA'>
                <div>
                    <button onClick={()=>navigate('/AccederTiendaCliente')} className='botonOA'>Inicio</button>     
                </div>
            </form>

            <form className='formCCC'>
                <h1 className="titleImagen">Detalles de Compra</h1>
                <div className='centrar'>
                    <h3 className='text'>Dirección de Envío</h3>
                    
                    <div className='select-container'>
                    <label htmlFor='categorySelect'></label>
                    </div>
                    <h4 className='text'>Seleccione la Provincia:</h4>
                    <div>
                        <select onChange={handleProvinciaChange} value={provinciaSeleccionada} >
                        <option value="">Seleccione una Provincia</option>
                            {provincias.map(provincia => (
                                <option key={provincia.id} value={provincia.id}>
                                    {provincia.nombre}
                                </option>
                            ))}
                        </select>

                    </div>
                    
                    <h4 className='text'>Seleccione el Cantón:</h4>
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

                    <h4 className='text'>Seleccione el Distrito:</h4>
                    <div>
                        <select onChange={handleDistritoChange} value={distritoSeleccionado}>
                            <option value="">Seleccione un distrito</option>
                            {distritos.map(distrito => (
                                <option key={distrito.id} value={distrito.id}>
                                    {distrito.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <h4 className='text'>Detalles adicionales:</h4>
                    <div>
                        <textarea
                            className="textBox3 textarea-detalles"
                            id="detalles"
                            value={detalles}
                            onChange={(e) => setDetalles(e.target.value)}
                            placeholder="Ingrese los detalles adicionales"
                        ></textarea>
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