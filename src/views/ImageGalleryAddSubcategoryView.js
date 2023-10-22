import { useNavigate } from 'react-router-dom';

function CrearSubCategoriaView(props) {
    const {
        nombreC,
        descripcion,
        errorText,
        uploading,
        selectedCategory,
        setSelectedCategory,
        categories,
        handleNameChange,
        handleDescriptionChange,
        handleNewSCategory,

    } = props;

    const navigate = useNavigate();

      return(
        <div className='crearCategoria-containter'>
          <form className='formTopOA'>
            <div>
              <button onClick={()=>navigate('/galeriaAdmin')} className='botonOA'>Galería</button>     
            </div>
          </form>
  
          <form className='formCC'>
            <h1 className="titleImagen">Crear nueva Subcategoría</h1>
            <h3 className='text'>Nombre de la Subcategoria:</h3>
            <textarea
              className="textBoxCC textarea-description"
              placeholder="Subcategoría"
              value={nombreC}
              onChange={handleNameChange}
              rows="1"
            ></textarea>
            <h3 className='text'>Descripción:</h3>
            <textarea
              className="textBoxCC textarea-description"
              placeholder="Descripción"
              value={descripcion}
              onChange={handleDescriptionChange}
            ></textarea>
            <div className='select-container'>
                    <label htmlFor='categorySelect'></label>
                    <select
                        id='categorySelect'
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">...</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    </div>
            <div>
              <button onClick={handleNewSCategory} className='botonCC'>
                Crear Subategoria
              </button>
            </div>
            <div id="errorLogin" style={{ display: 'none' }}></div>
          </form>
        </div>
      );

};

export default CrearSubCategoriaView;