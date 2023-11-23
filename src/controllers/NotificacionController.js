import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, getDocs, doc, updateDoc, where, deleteDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Modal from 'react-modal'; // Importa react-modal
import NotificacionesView from '../views/NotificacionesView';
import { getMessaging, getToken } from 'firebase/messaging';

  function Notificaciones() {
    const [notificaciones, setNotificaciones] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state && location.state.correo;
    const { id } = useParams();
    useEffect(() => {
      // Obtener el ID del usuario actual desde la ubicación (location)
     
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
            });
          });
          setNotificaciones(notificacionesData);
        })
        .catch((error) => {
          console.error('Error al obtener las notificaciones:', error);
        });
    }, []);
    
    const navigateToLogin = () => {
      navigate('/login');
    };
  
    const navigateToTienda = () => {
      navigate('/AccederTiendaCliente', { state: { correo: email } });
    };
      return <NotificacionesView 
      notificaciones={notificaciones}
      navigateToLogin={navigateToLogin}
      navigateToTienda={navigateToTienda}
       />;
    }
    export {Notificaciones};