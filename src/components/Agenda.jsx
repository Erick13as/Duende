import React, { useState } from "react";
// import {useNavigate} from 'react-router-dom'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Agenda = () => {
    const [date, setDate] = useState(new Date());

    const handleDateChange = (date) => {
        setDate(date);
      };

    // const navigate = useNavigate();

    return (
        <div className="agenda-container">

            <h1>Agenda para {date.toLocaleDateString()}</h1>
            <div className="calendar-container">
                <Calendar onChange={handleDateChange} value={date} />
            </div>

        </div> 

    );
};

export default Agenda;