function FinalizarCompraView(props) {
    const {
        comprobante,
        navigate,
        email,

    } = props;

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

        </div>
    );


};

export default FinalizarCompraView;