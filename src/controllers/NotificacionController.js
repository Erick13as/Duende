import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import NotificacionesView from '../views/NotificacionesView';

function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state && location.state.correo;
  const { id } = useParams();

  useEffect(() => {
    // Consulta Firestore para obtener notificaciones del usuario actual
    const q = query(collection(db, 'notificacion'), where('userId', '==', id));

    getDocs(q)
      .then((querySnapshot) => {
        const notificacionesData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          notificacionesData.push({
            id: doc.id,
            mensaje: data.mensaje,
            fecha: data.fecha.toDate().toLocaleDateString(),
            ordenId: data.ordenId,
            estado: data.estado,
          });
        });
        setNotificaciones(notificacionesData);
      })
      .catch((error) => {
        console.error('Error al obtener las notificaciones:', error);
      });
  }, [id]);

  const navigateToLogin = () => {
    marcarNotificacionesComoLeidas(); // Marcar notificaciones como leídas antes de navegar a login
    navigate('/login');
  };

  const navigateToTienda = () => {
    marcarNotificacionesComoLeidas(); // Marcar notificaciones como leídas antes de navegar a la tienda
    navigate('/AccederTiendaCliente', { state: { correo: email } });
  };

  const marcarNotificacionesComoLeidas = async () => {
    const notificacionesRef = collection(db, 'notificacion');

    // Filtra solo las notificaciones que son "unread"
    const notificacionesUnread = notificaciones.filter(
      (notificacion) => notificacion.estado === 'unread'
    );

    // Marca como "read" solo las notificaciones "unread"
    await Promise.all(
      notificacionesUnread.map(async (notificacion) => {
        const docRef = doc(notificacionesRef, notificacion.id);
        await updateDoc(docRef, { estado: 'read' });
      })
    );
  };

  return (
    <NotificacionesView
      notificaciones={notificaciones}
      navigateToLogin={navigateToLogin}
      navigateToTienda={navigateToTienda}
    />
  );
}

export { Notificaciones };
