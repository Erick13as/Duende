import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

function AccederTiendaClienteView(props) {
  const {
    productos,
    handleNavigate,
    navigateToCarrito,
    email,
    navigate,
    userId,
  } = props;

  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    if (userId) {
      // Consulta para obtener las notificaciones basadas en userId y estado 'unread'
      const notificationsCollection = collection(db, 'notificacion');
      const notificationsQuery = query(
        notificationsCollection,
        where('userId', '==', "C"+userId),
        where('estado', '==', 'unread')
      );

      // Listener para las notificaciones
      const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
        const hasUnread = snapshot.docs.length > 0;
        console.log('Has Unread Notifications:', hasUnread);
        console.log(userId);
        // Actualizar el estado según si hay notificaciones no leídas
        setHasUnreadNotifications(hasUnread);
      });

      return () => unsubscribe(); // Limpiar el listener al desmontar el componente
    }
  }, [userId, setHasUnreadNotifications]);

  return (
    <div className="main_page-container">
      <form className="formBarra">
        <button onClick={() => navigate('/galeriaCliente', { state: { correo: email } })} className='botonOA'>Galería</button>
        <div className="botonBarra-container">
          <button
            onClick={() => navigate(`/Notificaciones/${"C"+userId}`, { state: { correo: email } })}
            className={`botonOA2 ${hasUnreadNotifications ? 'unread-notifications' : ''}`}
          >
            {hasUnreadNotifications ? (
              <span className="notification-flag"></span>
            ) : null}
            Notificaciones
          </button>
          <button onClick={() => navigate(`/ComprasRealizadas/${"C"+userId}`, { state: { correo: email } })} className='botonOA2'>Ordenes</button>
          <button onClick={navigateToCarrito} className='botonOA2'>Mi Carrito</button>
          <button onClick={() => navigate('/login')} className='botonOA2'>Cerrar sesión</button>
        </div>
      </form>

      <div>
        <div className="productos-container">
          {productos.map((product, index) => (
            <div key={index} className="producto">
              <div className="imagen-container2">
                <img className="imagen-galeria-container2" src={product.imagen} alt={product.nombre} />
              </div>
              <div className="details-container">
                <h3 className="titleAccederTienda">{product.nombre}</h3>
                <p className="precio"> ${product.precio}</p>
                <button className="botonImagen2" onClick={() => navigate('/VerMasCliente', { state: { correo: email, producto: product.id } })}>
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AccederTiendaClienteView;
