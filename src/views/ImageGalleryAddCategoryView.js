import React from 'react';
import { useNavigate } from 'react-router-dom';


function CrearCategoriaView(props) {
    const {
        nombreC,
        descripcion,
        handleNameChange,
        handleDescriptionChange,
        handleNewCategory,  

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
            <h1 className="titleImagen">Crear nueva Categoría</h1>
            <h3 className='text'>Nombre de la categoria:</h3>
            <textarea
              className="textBoxCC textarea-description"
              placeholder="Categoría"
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
            <div>
              <button onClick={handleNewCategory} className='botonCC'>
                Crear Categoria
              </button>
            </div>
            <div id="errorLogin" style={{ display: 'none' }}></div>
          </form>
        </div>
      );
};

export default CrearCategoriaView;