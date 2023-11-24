import React from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es'; 

function AgendaView(props) {
    const {
        showEventForm,
        eventType,
        setEventType,
        eventDetails,
        setEventDetails,
        formatDatetimeLocal,
        handleSaveEvent,
        handleCancel,
        showDetailsForm,
        selectedEventDetails,
        handleViewOrder,
        handleEditEvent,
        showEditForm,
        setSelectedEventDetails,
        handleUpdateEvent,
        handleDeleteEvent,
        handleGoGalery,
        handleGoStore,
        handleDateSelect,
        handleEventClick,
        events,

    } = props;

return (
    <div>
        {/*Esta primera parte es el form que sale para añadir un evento*/}
        {showEventForm && (
        <div className="event-form-overlay">
            <div className="event-form-container">
            <h1>Creación de Evento</h1>
            <label htmlFor="eventType">Tipo de Evento:</label>
            <select
                id="eventType"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
            >
                <option value="maquillaje">Maquillaje</option>
                <option value="reunion">Reunión</option>
            </select>

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
            {selectedEventDetails.tipo !== "orden" && (
                <div className="event-form-container">
                <label htmlFor="eventEnd">Fecha de fin:</label>
                <input
                type="datetime-local"
                id="eventEnd"
                value={selectedEventDetails.end ? formatDatetimeLocal(selectedEventDetails.end) : ""}
                readOnly={true}
                />
                </div>
            )}
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
            {/* Mostrar el campo de edición del tipo de evento solo si el tipo no es "orden" */}
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
            {selectedEventDetails.tipo !== "orden" && (
                <div className="event-form-container">
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
                </div>)}
                
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
        defaultAllDayEventDuration={{ days: 1 }}
        />
    </div>
    );
}
export default AgendaView;