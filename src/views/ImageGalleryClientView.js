import React from 'react';
import { Carousel } from 'react-responsive-carousel';

function GaleriaClientView(props) {
    const {
      imageUrls,
      selectedCategory,
      selectedSubcategory,
      categories,
      subcategories,
      handleVerInfo,
      navigateToLogin,
      navigateToTienda,
      handleCategoryChange,
      handleSubcategoryChange,
      handleIndex,
    } = props;
    
return (
    <div className="galeria-container">
      <form className="formBarra">
        <button onClick={navigateToTienda} className='botonOA'>Tienda</button>
        <div className="botonBarra-container">
          <button onClick={navigateToLogin} className='botonOA2'>Cerrar sesión</button>
        </div>
      </form>
      <form className="formFiltro">
        <div className="select-container">
          <label htmlFor="categorySelect">Categoría: </label>
          <select
            id="categorySelect"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">...</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="select-container">
          <label htmlFor="subcategorySelect">Subcategoría: </label>
          <select
            id="subcategorySelect"
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
          >
            <option value="">...</option>
            {subcategories.map((subcategory, index) => (
              <option key={index} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
        </div>
      </form>
      <button className="ver-info-button" onClick={handleVerInfo}>
        Ver información de la imagen
      </button>
      
      <div className="carousel-container">
        <Carousel onChange={handleIndex}>
          {imageUrls
            .filter((image) => {
              if (selectedCategory && selectedCategory !== '') {
                if (image.categoria !== selectedCategory) {
                  return false;
                }
              }
              if (selectedSubcategory && selectedSubcategory !== '') {
                if (image.subcategoria !== selectedSubcategory) {
                  return false;
                }
              }
              return true;
            })
            .map((image, index) => (
              <div key={index} className="imagen-galeria-container">
                <img src={image.url} alt={`Imagen ${index}`} />
              </div>
            ))}
        </Carousel>
      </div>
    </div>
  );
}

export default GaleriaClientView;