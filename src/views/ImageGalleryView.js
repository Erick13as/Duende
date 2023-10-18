import React from 'react';
import { Carousel } from 'react-responsive-carousel';

function ImageGalleryView(props) {
  const {
    imageUrls,
    selectedCategory,
    selectedSubcategory,
    categories,
    subcategories,
    handleCategoryChange,
    handleSubcategoryChange,
    navigateToLogin,
  } = props;

  return (
    <div className="galeria-container">
      <form className="formBarra">
        <div className="botonBarra-container">
          <button className="botonBarra" onClick={navigateToLogin}>
            Iniciar Sesión
          </button>
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

      <div className="carousel-container">
        <Carousel>
          {imageUrls.map((image, index) => (
            <div key={index} className="imagen-galeria-container">
              <img src={image.url} alt={`Imagen ${index}`} />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export default ImageGalleryView;
