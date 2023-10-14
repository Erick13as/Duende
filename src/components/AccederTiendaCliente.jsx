import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <div className="main_page-container">
      <form className="formBarra">
        <button
          className="botonBarra boton-pequeno" // Clase para hacer el botón más pequeño
          onClick={() => handleNavigate('/')}
        >
          Inicio
        </button>
        <button
          className="botonBarra boton-pequeno margen-izquierdo2" // Clase para hacer el botón más pequeño
          onClick={() => handleNavigate('/ordenes')}
        >
          Ordenes
        </button>
        <button
          className="botonBarra boton-pequeno margen-izquierdo" // Clase para agregar margen izquierdo
          onClick={() => handleNavigate('/carrito')}
        >
          Mi carrito
        </button>
      </form>
      {/* Aquí puedes agregar el contenido principal de la página */}
    </div>
  );
}

export default HomePage;
