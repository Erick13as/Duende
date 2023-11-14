import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
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
        />
      </div>
    );
  }
  
  export default Calendar;