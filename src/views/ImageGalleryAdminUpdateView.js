import React from 'react';

function InfoImagenAdminView(props) {
  const {
    imagenUrl,
    descripcion,
    listaEtiquetas,
    categoriaSeleccionada,
    subcategoriaSeleccionada,
    newImage,
    handleEliminarClick,
    handleCambiarClick,
    handleReemplazarImagen,
    handleImageChange,
    categoriasOptions,
    subcategoriasOptions,
    handleActualizarClick,
    handleDescripcionChange,
    handleEtiquetasChange,
    handleCategoryChange,
    handleSubcategoryChange,
    navigateToGallery,
  } = props;

return (
    <div className="info-container">
      <button className="botonFijo" onClick={navigateToGallery}>
        Galería
      </button>
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
        <button className="buttons" type="button" onClick={handleEliminarClick} id="hola">
          Eliminar Imagen
        </button>
        <button className="buttons" type="button" onClick={handleCambiarClick}>
        Cambiar Imagen
        </button>
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <button className="buttons" type="button" onClick={handleReemplazarImagen}>
          Reemplazar Imagen
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
          onChange={handleDescripcionChange}
        />
        <br />
        <label htmlFor="etiquetas">Etiquetas:</label>
        <br />
        <input
          className="textBox"
          type="text"
          id="listaEtiquetas"
          value={listaEtiquetas}
          onChange={handleEtiquetasChange}
        />
        <br />
        <label htmlFor="categoria">Categoría:</label>
        <br />
        <select
          className="textBox"
          id="categoria"
          value={categoriaSeleccionada}
          onChange={handleCategoryChange}
        >
          {categoriasOptions}
        </select>
        <br />
        <label htmlFor="subcategoria">Subcategoría:</label>
        <br />
        <select
          className="textBox"
          id="subcategoria"
          value={subcategoriaSeleccionada}
          onChange={handleSubcategoryChange}
        >
          {subcategoriasOptions}
        </select>
        <br />
        <button onClick={handleActualizarClick} className="buttons">Actualizar</button>
      </div>
    </div>
  );
}

export default InfoImagenAdminView;