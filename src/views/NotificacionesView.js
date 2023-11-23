import React from 'react';

function NotificacionesView(props) {
  const { notificaciones, navigateToLogin, navigateToTienda } = props;

  return (
    <div>
      <form className="formBarra">
        <button onClick={navigateToTienda} className='botonOA'>Tienda</button>
        <div className="botonBarra-container">
          <button onClick={navigateToLogin} className='botonOA2'>Cerrar sesión</button>
        </div>
      </form>
      <div className="centered-container">
        <div className="notificaciones-container">
          <div className="notificaciones-header">
            <h1>Centro de Notificaciones</h1>
          </div>
          <ul className="notificaciones-list">
            {notificaciones.map((notificacion) => (
              <li key={notificacion.id} className="notificacion-item">
                <div className="notificacion-details">
                  <p className="notificacion-mensaje"><strong>Mensaje:</strong> {notificacion.mensaje}</p>
                  <p className="notificacion-fecha"><strong>Fecha de notificación:</strong> {notificacion.fecha}</p>
                  <p className="notificacion-orden-id"><strong>Orden ID:</strong> {notificacion.ordenId}</p>
                  {/* Puedes agregar más detalles de la notificación según tus necesidades */}
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
