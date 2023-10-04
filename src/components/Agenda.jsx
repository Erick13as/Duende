import React, { useState } from "react";
import {useNavigate} from 'react-router-dom'

const Agenda = () => {
    const prueba = useState("");


    const navigate = useNavigate();

    return (
        <div className="agenda-container">
            <h1 className="title">Agenda</h1>
        </div>

    );
};

export default Agenda;
