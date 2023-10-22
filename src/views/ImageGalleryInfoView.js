

function ImageInfoView(props) {
    const {
        location,
        imagenUrl,
        imagenQuery,
        descripcion,
        setDescripcion,
        listaEtiquetas,
        setListaEtiquetas,
        categorias,
        subcategorias,
        categoriaSeleccionada,
        setCategoriaSeleccionada,
        subcategoriaSeleccionada,
        setSubcategoriaSeleccionada,
        categoriaEncontrada,
        subcategoriaEncontrada,
        subcategoriaAnterior,
        navigate,
        newImage,
        handleImageChange,
        handleVerInfo,

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
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <button className="buttons" type="button" onClick={handleVerInfo} >
              Enviar Referencia
            </button>
          </form>
          <div className="formContainerInfo">
            <label htmlFor="descripcion">Descripción:</label>
            <br />
            <input
              className="textBox"
              type="text"
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled
            />
            <br />
            <label htmlFor="etiquetas">Etiquetas:</label>
            <br />
            <input
              className="textBox"
              type="text"
              id="listaEtiquetas"
              value={listaEtiquetas}
              onChange={(e) => setListaEtiquetas(e.target.value)}
              disabled
            />
            <br />
            <label htmlFor="categoria">Categoría:</label>
            <br />
            <input
              className="textBox"
              type="text"
              id="categoria"
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              disabled
            />
            <br />
            <label htmlFor="subcategoria">Subcategoría:</label>
            <br />
            <input
              className="textBox"
              type="text"
              id="subcategoria"
              value={subcategoriaSeleccionada}
              onChange={(e) => setSubcategoriaSeleccionada(e.target.value)}
              disabled
            />
            <br />
      
          </div>
        </div>
      );


};

export default ImageInfoView;