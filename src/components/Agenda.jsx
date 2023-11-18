import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es'; 
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, storage } from '../firebase/firebaseConfig';
import {query, where} from 'firebase/firestore';

function Calendar() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const [showEventForm, setShowEventForm] = useState(false);
    const [eventDetails, setEventDetails] = useState({
      title: "",
      start: null,
      end: null,
      description: "",
    });

    const [formattedStart, setFormattedStart] = useState("");
    const [formattedEnd, setFormattedEnd] = useState("");

    const [selectedEventId, setSelectedEventId] = useState(null);

    const [showDetailsForm, setShowDetailsForm] = useState(false);
    const [selectedEventDetails, setSelectedEventDetails] = useState({
      id: "",
      title: "",
      start: null,
      end: null,
      description: "",
      tipo: "",
    });

    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedEditDetails, setSelectedEditDetails] = useState({
      id: "",
      title: "",
      start: null,
      end: null,
      description: "",
      tipo: "",
    });
    
    useEffect(() => {
      // Cargar eventos desde la base de datos al montar el componente
      const fetchEvents = async () => {
        const eventsCollection = collection(db, 'evento');
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventData = eventsSnapshot.docs.map((doc) => doc.data());
        setEvents(eventData);
      };
  
      fetchEvents();
    }, []);

    const handleDateSelect = (selectInfo) => {
      setEventDetails({
        title: "",
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        description: "",
      });
      setShowEventForm(true);
    };
    
    const handleEventClick = (clickInfo) => {
      setSelectedEventDetails({
        id: clickInfo.event.id,
        title: clickInfo.event.title,
        start: clickInfo.event.start,
        end: clickInfo.event.end,
        description: clickInfo.event.extendedProps.description || "",
        tipo: clickInfo.event.extendedProps.tipo || "",
      });
    
      // Verificar que start y end no sean null antes de intentar formatear
      if (clickInfo.event.start && clickInfo.event.end) {
        // Selecciona solo la hora desde la fecha de inicio y fin
        setFormattedStart(clickInfo.event.start.toLocaleString());
        setFormattedEnd(clickInfo.event.end.toLocaleString());
      }
    
      setShowDetailsForm(true);
      setSelectedEventId(clickInfo.event.id);

    };
    
    const handleGoGalery= () => {
      navigate('/galeriaAdmin');
    };

    const handleGoStore= () => {
      navigate('/AccederTiendaAdmin');
    };

    const handleCancel = () => {
      setShowEventForm(false);
      setShowDetailsForm(false);
      setShowEditForm(false);
    };

    const handleEditEvent = () => {
      setShowDetailsForm(false);
      setShowEditForm(true);
    };

    const getNextEventId = (events) => {
      // Obtener el máximo ID existente
      const maxId = events.reduce((max, event) => (event.id > max ? event.id : max), 0);
    
      // Incrementar el máximo ID para el próximo evento
      return maxId + 1;
    };

    const handleSaveEvent = async () => {
      if (eventDetails.id) {
        // Si el evento ya tiene un ID, actualiza el evento existente
        const eventRef = doc(db, 'evento', eventDetails.id);
        await updateDoc(eventRef, {
          title: eventDetails.title,
          start: new Date(eventDetails.start).toISOString(),
          end: new Date(eventDetails.end).toISOString(),
          description: eventDetails.description,
          tipo: "maquillaje"
        });
      } else {
        // Si el evento no tiene un ID, crea un nuevo evento con un ID incremental
        const nextEventId = getNextEventId(events);
    
        const newEventRef = await addDoc(collection(db, 'evento'), {
          id: nextEventId,
          title: eventDetails.title,
          start: new Date(eventDetails.start).toISOString(),
          end: new Date(eventDetails.end).toISOString(),
          description: eventDetails.description,
          tipo: "maquillaje"
        });
      }
    
      // Recarga los eventos desde la base de datos
      const updatedEvents = await fetchEvents();
      setEvents(updatedEvents);
    
      setShowEventForm(false);
    };

    const handleDeleteEvent = async () => {
      if (selectedEventId){
        try {

          const querySnapshot = await getDocs(collection(db, 'evento'));

          querySnapshot.forEach(async (doc) => {
              const data = doc.data();

              if (data.id === parseInt(selectedEventId, 10)) {
                  const categoryRef = doc.ref;

                  await deleteDoc(categoryRef);

                  const updatedEvents = await fetchEvents();
                  setEvents(updatedEvents);
                  
              }

          });

          // Oculta el formulario después de eliminar el evento
          setShowEditForm(false);
      
        } catch (error) {
          // Manejo de errores: muestra un mensaje de error al usuario o realiza cualquier otra acción necesaria.
          console.error('Error al eliminar el evento:', error);
        }
      }
    };
    
    
    const fetchEvents = async () => {
      const eventsCollection = collection(db, 'evento');
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventData = eventsSnapshot.docs.map((doc) => doc.data());
      return eventData;
    };

    const formatDatetimeLocal = (date) => {
      if (!date || !(date instanceof Date)) {
        return ""; // Manejar el caso de fecha nula o no válida
      }
    
      const year = date.getFullYear();
      const month = (`0${date.getMonth() + 1}`).slice(-2);
      const day = (`0${date.getDate()}`).slice(-2);
      const hours = (`0${date.getHours()}`).slice(-2);
      const minutes = (`0${date.getMinutes()}`).slice(-2);
    
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    

    const handleUpdateEvent = async () => {
      try {
        // Actualiza los datos en Firestore
        const formattedStart = selectedEventDetails.start ? new Date(selectedEventDetails.start).toISOString() : null;
        const formattedEnd = selectedEventDetails.end ? new Date(selectedEventDetails.end).toISOString() : null;
    
        const updatedQuery = query(
          collection(db, 'evento'),
          where('id', '==', parseInt(selectedEventDetails.id))
        );
    
        const querySnapshot = await getDocs(updatedQuery);
    
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
    
          // Actualiza el documento
          await updateDoc(docRef, {
            id: parseInt(selectedEventDetails.id),
            title: selectedEventDetails.title,
            start: formattedStart,
            end: formattedEnd,
            description: selectedEventDetails.description,
            tipo: "maquillaje"
          });
    
          // Actualiza el estado local con los eventos actualizados
          const updatedEvents = await fetchEvents();
          setEvents(updatedEvents);
    
          //alert("Datos actualizados correctamente");
        }
      } catch (error) {
        console.error("Error al actualizar datos:", error);
      }
    };

    const handleViewOrder = () => {

    };

    return (
      <div>
        {/*Esta primera parte es el form que sale para añadir un evento*/}
        {showEventForm && (
          <div className="event-form-overlay">
            <div className="event-form-container">
              <h1>Creación de Evento</h1>
              <label htmlFor="eventTitle">Agregar Título:</label>
              <input
                type="text"
                id="eventTitle"
                value={eventDetails.title}
                onChange={(e) =>
                  setEventDetails({ ...eventDetails, title: e.target.value })
                }
              />

              <label htmlFor="eventStart">Fecha de inicio:</label>
              <input
                type="datetime-local"
                id="eventStart"
                value={eventDetails.start ? formatDatetimeLocal(eventDetails.start) : ""}
                onChange={(e) =>
                  setEventDetails({
                    ...eventDetails,
                    start: new Date(e.target.value),
                  })
                }
              />
              <label htmlFor="eventEnd">Fecha de fin:</label>
              <input
                type="datetime-local"
                id="eventEnd"
                value={eventDetails.end ? formatDatetimeLocal(eventDetails.end) : ""}
                onChange={(e) =>
                  setEventDetails({
                    ...eventDetails,
                    end: new Date(e.target.value),
                  })
                }
              />
              <label htmlFor="eventDescription">Descripción:</label>
              <textarea
                id="eventDescription"
                value={eventDetails.description}
                onChange={(e) =>
                  setEventDetails({ ...eventDetails, description: e.target.value })
                }
              />
              {/* Agrega otros campos del formulario según tus necesidades */}
              <button onClick={handleSaveEvent}>Crear Evento</button>
              <button onClick={handleCancel}>Cerrar</button>
            </div>
          </div>
        )}

        {/*Esta parte es el form para ver detalles del evento*/}
        {showDetailsForm && (
          <div className="event-form-overlay">
            <div className="event-form-container">
              <h1>Detalles del Evento</h1>
              <label htmlFor="eventTitle">Título:</label>
              <input
                type="text"
                id="eventTitle"
                value={selectedEventDetails.title}
                readOnly={true}
              />

              <div style={{ marginBottom: '8px' }}>
                <label>ID del Evento: </label>
                <span style={{ fontWeight: 'bold' }}>{selectedEventDetails.id}</span>
              </div>
              

              <div style={{ marginBottom: '8px' }}>
                <label>Tipo: </label>
                <span style={{ fontWeight: 'bold' }}>{selectedEventDetails.tipo}</span>
              </div>

              <span>{""}</span>

              <label htmlFor="eventStart">Fecha de inicio:</label>
              <input
                type="datetime-local"
                id="eventStart"
                value={selectedEventDetails.start ? formatDatetimeLocal(selectedEventDetails.start) : ""}
                readOnly={true}
              />
              <label htmlFor="eventEnd">Fecha de fin:</label>
              <input
                type="datetime-local"
                id="eventEnd"
                value={selectedEventDetails.end ? formatDatetimeLocal(selectedEventDetails.end) : ""}
                readOnly={true}
              />
              <label htmlFor="eventDescription">Descripción:</label>
              <textarea
                id="eventDescription"
                value={selectedEventDetails.description}
                readOnly={true}
              />

              {selectedEventDetails.tipo === "orden" && (
                <button onClick={handleViewOrder}>Ver Orden</button>
              )}
              <button onClick={handleEditEvent}>Editar Evento</button>
              <button onClick={handleCancel}>Cerrar</button>
            </div>
          </div>
        )}

        {/*Esta parte es el form para editar el evento*/}
        {showEditForm && (
          <div className="event-form-overlay">
            <div className="event-form-container">
            <h1>Editar Evento</h1>
              <label htmlFor="eventTitle">Título del Evento:</label>
              <input
                type="text"
                id="eventTitle"
                value={selectedEventDetails.title}
                onChange={(e) =>
                  setSelectedEventDetails({ ...selectedEventDetails, title: e.target.value })
                }
              />

              <label htmlFor="eventStart">Fecha de inicio:</label>
              <input
                type="datetime-local"
                id="eventStart"
                value={selectedEventDetails.start ? formatDatetimeLocal(selectedEventDetails.start) : ""}
                onChange={(e) =>
                  setSelectedEventDetails({
                    ...selectedEventDetails,
                    start: new Date(e.target.value),
                  })
                }
              />
              <label htmlFor="eventEnd">Fecha de fin:</label>
              <input
                type="datetime-local"
                id="eventEnd"
                value={selectedEventDetails.end ? formatDatetimeLocal(selectedEventDetails.end) : ""}
                onChange={(e) =>
                  setSelectedEventDetails({
                    ...selectedEventDetails,
                    end: new Date(e.target.value),
                  })
                }
              />
              <label htmlFor="eventDescription">Descripción:</label>
              <textarea
                id="eventDescription"
                value={selectedEventDetails.description}
                onChange={(e) =>
                  setSelectedEventDetails({ ...selectedEventDetails, description: e.target.value })
                }
              />
              {/* Agrega otros campos del formulario según tus necesidades */}
              <button onClick={handleUpdateEvent}>Guardar Cambios</button>
              <button onClick={handleDeleteEvent}>Eliminar evento</button>
              <button onClick={handleCancel}>Cerrar</button>
            </div>
          </div>
        )}


        {/*Esta parte es la que muestra el calendario*/}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={"dayGridMonth"}
          headerToolbar={{
            start: "today prev,next goGalery goStore", // Los botones en la barra superior izquierda
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay", // Los botones en la barra superior izquierda
          }}
          //En esta parte se añaden botones personalizados
          customButtons={{
            goGalery: {
              text: "Galería",
              click: handleGoGalery,
            },
            goStore: {
              text: "Tienda",
              click: handleGoStore,
            },
          }}
          height={"90vh"}
          selectable={true} // Habilita la selección de fechas
          select={handleDateSelect}
          eventClick={handleEventClick}
          events={events}
          //Estas 3 lineas son para ajustar un ver más cuando hay muchos eventos
          dayMaxEventRows={true}
          dayMaxEvents={4} // Cantidad de eventos que se muestran por día
          moreLinkClick="popover"
          editable={true} //permite arrastrar los eventos
          eventDurationEditable={true} //editar la duración redimensionando el evento. Es horizontal, para varios días
          eventStartEditable={true} // editar hora de inicio arrastrando la actividad
          //eventOverlap={false} // false para que no pueda haber un evento a la misma hora que el otro.
          navLinks={true} // permite que los dias lleven a otra parte
          navLinkDayClick="timeGridDay" // presionar el número del día lo lleva al a vista de ese día
          weekNumbers={true} //muestra el número de la semana
          weekNumberCalculation="ISO" //la semana empieza con lunes
          weekNumberFormat={{
            week: 'numeric', //Muestra la semana con número y no letras
          }}
          nowIndicator={true} //esto le dice en dónde está cuando utiliza la vista del día
          locales={[esLocale]}  // Configura el locale español
          locale="es"  // Establece el idioma español
        />
      </div>
    );
  }
  
  export default Calendar;