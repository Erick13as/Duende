

function SendReferenceView(props) {
    const {
        state,
        imagenUrl,
        imagenQuery,
        navigate,
        newImage,
        descripcion,
        setDescripcion,
        errorText,
        uploading,
        handleCambiarClick,
        handleImageChange,
        handleEnviarRef,

    } = props;

    return (
        <div className="info-container">
          <form className='formTopOA'>
            <div>
              <button className="botonFijo" onClick={() => navigate('/galeriaCliente')}>
                Galería
              </button>
              <button className="botonOA" onClick={() => navigate('/AccederTiendaClienteController')}>
                Tienda
              </button>      
            </div>
          </form>
    
          <form className="formImagenInfo">
            <div className="imagen-container-info">
              {newImage ? (
                <img src={URL.createObjectURL(newImage)} alt="Nueva Imagen" />
              ) : (
                imagenUrl ? (
                  <img src={imagenUrl} alt="Imagen Actual" />
                ) : (
                  <p>No se ha proporcionado una URL de imagen válida.</p>
                )
              )}
            </div>
            
            <button className="buttons" type="button" onClick={handleCambiarClick} >
              Seleccionar nueva Imagen
            </button>
            <input
                type="file"
                id="imageInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
            />
          </form>
          <div className="formContainerInfo">
            <label htmlFor="descripcion">Descripción:</label>
            <br />
            <textarea
                className="textBox2"
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
            ></textarea>
            <button onClick={handleEnviarRef} className="buttons">Enviar Referencia</button>
            <div id="errorLogin" style={{ display: 'none' }}></div>
        
          </div>
        </div>
    );


};

export default SendReferenceView;