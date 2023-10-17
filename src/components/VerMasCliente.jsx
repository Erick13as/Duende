import React, { useState } from "react";
import {useNavigate} from 'react-router-dom'

const VerMasCliente = () => {
    const [date, setDate] = useState(new Date());

    return (
        <div className="vmasC-container">
            <h1>Contenedor</h1>
        </div>
    );

};

export default VerMasCliente;