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

function Calendar() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    //const { state } = useLocation();   Para lo del correo, no me acuerdo cómo se maneja
    //let { email} = state;
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
      setEventDetails({
        id: clickInfo.event.id,
        title: clickInfo.event.title,
        start: clickInfo.event.start,
        end: clickInfo.event.end,
        description: clickInfo.event.extendedProps.description || "",
      });

      setSelectedEventId(clickInfo.event.id);
    
      if (clickInfo.event.start && clickInfo.event.end) {
        // Selecciona solo la hora desde la fecha de inicio y fin
        setFormattedStart(clickInfo.event.start.toLocaleString());
        setFormattedEnd(clickInfo.event.end.toLocaleString());
      }
    
      setShowEventForm(true);
    };
    

    const handleGoGalery= () => {
      console.log("Volver button clicked");
      navigate('/galeriaAdmin');
    };

    const handleGoStore= () => {
      navigate('/AccederTiendaAdmin');
    };

    const handleCancel = () => {
      setShowEventForm(false);
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
        });
      }
    
      // Recarga los eventos desde la base de datos
      const updatedEvents = await fetchEvents();
      setEvents(updatedEvents);
    
      setShowEventForm(false);
    };

    const handleDeleteEvent = async () => {
      console.log("Selected Event ID:", selectedEventId)
      console.log("Tipo del Selected Event ID:", typeof selectedEventId)

      if (selectedEventId){
        try {

          const querySnapshot = await getDocs(collection(db, 'evento'));

          querySnapshot.forEach(async (doc) => {
              const data = doc.data();
              console.log("El id en la base", data.id)
              console.log("El id en la base tiene tipo", typeof data.id)
              if (data.id === parseInt(selectedEventId, 10)) {
                console.log("dentro del if id's iguales", data.id, selectedEventId)
                  const categoryRef = doc.ref;

                  await deleteDoc(categoryRef);

                  console.log(`Evento con id: "${selectedEventId}" eliminado con éxito.`);

                  const updatedEvents = await fetchEvents();
                  setEvents(updatedEvents);
                  
              }

          });
      
        } catch (error) {
          // Manejo de errores: muestra un mensaje de error al usuario o realiza cualquier otra acción necesaria.
          console.error('Error al eliminar el evento:', error);
        }
      }

      /*if (selectedEventId) {
        try {
          // Obtiene la referencia al documento del evento utilizando el ID almacenado
          const eventRef = doc(db, 'evento', selectedEventId);
    
          // Elimina el documento del evento de la base de datos
          await deleteDoc(eventRef);
    
          // Recarga los eventos desde la base de datos (opcional, depende de tus necesidades)
          const updatedEvents = await fetchEvents();
          setEvents(updatedEvents);
    
          // Oculta el formulario después de eliminar el evento
          setShowEventForm(false);
        } catch (error) {
          console.error('Error al eliminar el evento:', error);
        }
      }*/
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
    

    return (
      <div>
        {/*Esta primera parte es el form que sale para añadir un evento*/}
        {showEventForm && (
          <div className="event-form-overlay">
            <div className="event-form-container">
              <label htmlFor="eventTitle">Agregar Título:</label>
              <input
                type="text"
                id="eventTitle"
                value={eventDetails.title}
                onChange={(e) =>
                  setEventDetails({ ...eventDetails, title: e.target.value })
                }
              />

              <label>ID del Evento:</label>
              <span>{selectedEventId}</span>

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
              <button onClick={handleSaveEvent}>Guardar Evento</button>
              <button onClick={handleDeleteEvent}>Eliminar Evento</button>
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