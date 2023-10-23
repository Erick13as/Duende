import React from 'react';

function SubirImagenView(props) {
  const {
    descripcion,
    handleDescriptionChange,
    etiquetas,
    selectedCategoria,
    categorias,
    selectedSubcategoria,
    subcategorias,
    handleImageChange,
    errorText,
    handleUpload,
    uploading,
    imageUrl,
    navigateToGallery,
    handleEtiquetasChange,
    handleCategoryChange,
    handleSubcategoryChange,
  } = props;

  return (
    <div className="subir_imagen-container">
      <form className="formBarra">
        <div className="botonBarra-container">
          <button onClick={navigateToGallery} className='botonOA2'>Galería</button>
        </div>
      </form>
      <form className="formSignUp">
        <h1 className="titleImagen">Nueva Imagen</h1>
        <h3 className="text">Ingrese la descripción de la imagen</h3>
        <textarea
          className="textBoxSingUp textarea-description"
          placeholder="Descripción"
          value={descripcion}
          onChange={handleDescriptionChange}
          rows="1"
        ></textarea>
        <h3 className="text">Ingrese las etiquetas de la imagen</h3>
        <input
          className="textBoxSingUp"
          type="text"
          placeholder="Etiquetas"
          value={etiquetas}
          onChange={handleEtiquetasChange}
        ></input>
        <h3 className="text">Seleccione la categoría</h3>
        <select
          className="textBoxSingUp"
          value={selectedCategoria}
          onChange={handleCategoryChange}
        >
          <option value="">...</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.nombre}>
              {categoria.nombre}
            </option>
          ))}
        </select>
        <h3 className="text">Seleccione la subcategoría</h3>
        <select
          className="textBoxSingUp"
          value={selectedSubcategoria}
          onChange={handleSubcategoryChange}
        >
          <option value="">...</option>
          {subcategorias.map((subcategoria) => (
            <option key={subcategoria.id} value={subcategoria.nombre}>
              {subcategoria.nombre}
            </option>
          ))}
        </select>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <h3 id="errorLogin" className="message">{errorText}</h3>
      </form>
      <button onClick={handleUpload} disabled={uploading} className="botonImagen">
        Subir imagen
      </button>
      <form className="formImagen">
      {uploading && <p>Subiendo imagen...</p>}
      {imageUrl && (
        <div className="imagen-container">
          <img src={imageUrl} alt="Imagen subida" />
        </div>
      )}
      </form>
    </div>
  );
}

export default SubirImagenView;