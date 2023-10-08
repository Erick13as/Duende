import React from 'react';
import { useLocation } from 'react-router-dom';

function InfoImagenAdmin() {
  const location = useLocation();
  const imagenUrl = location.state && location.state.imagenUrl;

  return (
    <div className="galeria-container">
        <div  className="imagen-container">
        {imagenUrl ? (
            <img src={imagenUrl} alt="Imagen" />
        ) : (
            <p>No se ha proporcionado una URL de imagen válida.</p>
        )}
        </div>
    </div>
  );
}

export default InfoImagenAdmin;
