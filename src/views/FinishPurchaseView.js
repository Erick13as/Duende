function FinalizarCompraView(props) {
    const {
        comprobante,
        navigate,
        email,
        handleContinuar,
        handleImageChange,

    } = props;

//En el formTotal puse un texto con $100 solo para ver como se veria con el monto, pero ahí se cambiaría por la variable que tenga el total
    return (
        <div className='eliminarCategoria-container'>
            <form className='formTopOA'>
                <div>
                    <button onClick={()=>navigate('/galeriaCliente')} className='botonOA'>Inicio</button>
                    <button onClick={() => navigate('/AccederTiendaCliente', { state: { correo: email } })} className='botonOA'>Tienda</button>     
                </div>
                <div className="botonBarra-container">
                    <button onClick={() => navigate('/login')} className='botonOA2'>Cerrar sesión</button>
                </div>
            </form>

            <form className='formCC'>
                <h1 className="titleImagen">Detalles de Compra</h1>
                <div className='centrar'>
                    <h3 className='text'>Comprobante de Pago</h3>
                    <h4 className='textP'>Realiza el pago por SinpeMóvil por el monto del total para finalizar la compra.</h4>
                    <form className="formTotal">
                        <p className="textPP">Total</p>
                        <p>$ 100</p> 
                    </form>

                   
                    <div className="espaciado"></div>
                    <h4 className='text'>Adjunta imagen del comprobante de pago.</h4>
                    <label for="fileInput" class="custom-file-upload">
                        <input type="file" id="fileInput" accept="image/*" onChange={handleImageChange} />
                        Subir archivo
                    </label>
                    <div className="espaciado"></div>

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

export default FinalizarCompraView;