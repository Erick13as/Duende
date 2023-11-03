import React from 'react';

const FinalizarCompraView = (props) => {
  const {
    comprobante,
    navigate,
    email,
    handleContinuar,
    handleImageChange,
    totalCompra,
    selectedImageURL,
    provincia,
    Modal,
    showSuccessModal,
    setShowSuccessModal,
    redirectToTienda,
  } = props;

  return (
    <div className='pago-container'>
      <form className="formBarra">
        <button onClick={() => navigate('/AccederTiendaCliente', { state: { correo: email } })} className='botonOA'>Tienda</button>
        <div className="botonBarra-container">
            <button onClick={() => navigate('/login')} className='botonOA2'>Cerrar sesión</button>
        </div>
      </form>

      <form className='formCCPago'>
        <h1 className="titleImagen">Detalles de Compra</h1>
        <div className='centrar'>
          <h3 className='text'>Comprobante de Pago</h3>
          <h4 className='textP'>Realiza el pago por SinpeMóvil por el monto del total con envío para finalizar la compra.</h4>
          <form className="formTotal">
            <p className="textPP">Total</p>
            <p>$ {totalCompra}</p>
          </form>

          <div className="espaciado"></div>
          <h4 className='text'>Adjunta imagen del comprobante de pago.</h4>
          <label htmlFor="fileInput" className="custom-file-upload">
            <input type="file" id="fileInput" accept="image/*" onChange={handleImageChange} />
            Subir archivo
          </label>
          {selectedImageURL && (
            <img src={selectedImageURL} alt="Comprobante de pago" className="selected-image" />
          )}
          <div className="espaciado"></div>

          <div>
            <button onClick={handleContinuar} className='botonOOA'>
              Continuar
            </button>
          </div>
        </div>
      </form>
      <Modal
        isOpen={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
        contentLabel="Compra Realizada con Éxito"
      >
        <h2>Compra realizada con éxito</h2>
        <button className='botonOOA' onClick={() => {
          setShowSuccessModal(false);
          redirectToTienda();
        }}>
          Cerrar
        </button>
      </Modal>
    </div>
  );
};

export default FinalizarCompraView;
