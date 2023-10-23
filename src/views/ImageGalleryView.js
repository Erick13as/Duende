import React from 'react';
import { Carousel } from 'react-responsive-carousel';

function GaleriaSinLoginView(props) {
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
          <button onClick={navigateToLogin} className='botonOA2'>Iniciar Sesión</button>
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
          {imageUrls
            .filter((image) => {
              // Filtrar por categoría y subcategoría seleccionadas
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
              // Si no se selecciona ninguna categoría ni subcategoría o si la imagen cumple con las condiciones,
              // mostrar la imagen
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

export default GaleriaSinLoginView;
