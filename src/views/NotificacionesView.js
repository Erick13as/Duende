// NotificacionesView.js
import React from 'react';

function NotificacionesView(props) {
  const { notificaciones, navigateToLogin, navigateToTienda } = props;

  return (
    <div>
      <form className="formBarra">
        <button onClick={navigateToTienda} className='botonOA'>Tienda</button>
        <button onClick={navigateToLogin} className='botonOA2'>Cerrar sesión</button>
      </form>

      <div className="notificaciones-header">
        <h1>Centro de Notificaciones</h1>
      </div>

      <div className="centered-container">
        <div className="notificaciones-container">
          <ul className="notificaciones-list">
            {notificaciones.map((notificacion) => (
              <li
                key={notificacion.id}
                className={`notificacion-item ${notificacion.estado === 'unread' ? 'unread-notification' : ''}`}
              >
                <div className="notificacion-details">
                  <p className="notificacion-mensaje"><strong>Mensaje:</strong> {notificacion.mensaje}</p>
                  <p className="notificacion-fecha"><strong>Fecha de la notificación:</strong> {notificacion.fecha}</p>
                  <p className="notificacion-orden-id"><strong>Orden ID:</strong> {notificacion.ordenId}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NotificacionesView;
