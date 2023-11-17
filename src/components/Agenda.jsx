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
    
      // Selecciona solo la hora desde la fecha de inicio y fin
      setFormattedStart(clickInfo.event.start.toLocaleString());
      setFormattedEnd(clickInfo.event.end.toLocaleString());
    
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
        // Si el evento no tiene un ID, crea un nuevo evento
        const newEventRef = await addDoc(collection(db, 'evento'), {
          id: uuidv4(),
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
      if (eventDetails.id) {
        try {
          const eventRef = doc(db, 'evento', eventDetails.id);
          await deleteDoc(eventRef);
    
          // Recarga los eventos desde la base de datos
          const updatedEvents = await fetchEvents();
          setEvents(updatedEvents);
    
          setShowEventForm(false);
        } catch (error) {
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