import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { v4 as uuidv4 } from "uuid";

function Calendar() {

    const [events, setEvents] = useState([]);

    const handleDateSelect = (selectInfo) => {
        // Crear un nuevo evento y agregarlo al array de eventos
        const newEvent = {
            id: uuidv4(),
            title: "Nuevo Evento",
            start: selectInfo.startStr,
            end: selectInfo.endStr,
        };
      
        setEvents([...events, newEvent]);
      };

    const handleEventClick = (clickInfo) => {
        // Filtrar los eventos y eliminar el evento seleccionado por su id u otra propiedad única
        const updatedEvents = events.filter((event) => event.id !== clickInfo.event.id);
    
        setEvents(updatedEvents);
    };

    return (
      <div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={"dayGridMonth"}
          headerToolbar={{
            start: "today prev,next", // will normally be on the left. if RTL, will be on the right
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay", // will normally be on the right. if RTL, will be on the left
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