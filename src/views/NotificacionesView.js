import React from 'react';
import { Carousel } from 'react-responsive-carousel';

function NotificacionesView(props) {
    const { notificaciones } = props;
  
    return (
      <div className="notificaciones-container">
        <form className="formBarra">
          {/* Agrega los botones necesarios en la barra de navegación */}
        </form>
        <h1>Centro de Notificaciones</h1>
        <ul>
          {notificaciones.map((notificacion) => (
            <li key={notificacion.id}>
              <p>Mensaje: {notificacion.mensaje}</p>
              <p>Fecha de notificación: {notificacion.fecha}</p>
              <p>Orden ID: {notificacion.ordenId}</p>
              {/* Puedes agregar más detalles de la notificación según tus necesidades */}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default NotificacionesView;
  