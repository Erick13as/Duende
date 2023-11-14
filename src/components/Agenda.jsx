import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es'; 
import { v4 as uuidv4 } from "uuid";

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
      // Muestra los detalles del evento al hacer clic
      setEventDetails({
        id: clickInfo.event.id,
        title: clickInfo.event.title,
        start: clickInfo.event.startStr,
        end: clickInfo.event.endStr,
        description: clickInfo.event.extendedProps.description || "",
      });
    
      // Puedes incluso abrir el formulario directamente al hacer clic
      setShowEventForm(true);
    };
    

    const handleGoGalery= () => {
      console.log("Volver button clicked");
      navigate('/galeriaAdmin');
    };

    const handleGoStore= () => {
      navigate('AccederTiendaAdmin/');
    };

    const handleCancel = () => {
      setShowEventForm(false);
    };

    const handleSaveEvent = () => {
      const newEvent = {
        id: uuidv4(),
        title: eventDetails.title,
        start: eventDetails.start,
        end: eventDetails.end,
        description: eventDetails.description,
      };
    
      setEvents([...events, newEvent]);
      setShowEventForm(false);
    };

    const handleDeleteEvent = () => {
      const updatedEvents = events.filter(
        (event) => event.id !== eventDetails.id
      );
    
      setEvents(updatedEvents);
      setShowEventForm(false);
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
                value={eventDetails.start}
                onChange={(e) =>
                  setEventDetails({ ...eventDetails, start: e.target.value })
                }
              />
              <label htmlFor="eventEnd">Fecha de fin:</label>
              <input
                type="datetime-local"
                id="eventEnd"
                value={eventDetails.end}
                onChange={(e) =>
                  setEventDetails({ ...eventDetails, end: e.target.value })
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
          eventOverlap={false} // false para que no pueda haber un evento a la misma hora que el otro.
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