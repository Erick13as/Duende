import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import {useNavigate} from 'react-router-dom'
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const userQuery = query(collection(db, 'usuario'), where('correo', '==', email));
        const querySnapshot = await getDocs(userQuery);
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const rolValue = userData.rol;
  
          // Check the value of rolValue and navigate accordingly
          if (rolValue === 'Admin') {
            navigate('/galeriaAdmin');
          } else {
            navigate('/galeriaCliente');
          }
        });
      })
      .catch((error) => {
        var errorMessage = document.getElementById('errorLogin');
        errorMessage.style.display = "block";
        errorMessage.textContent = "Correo o contraseña incorrecta";
        document.getElementById('espace').style.display = "none";
      });
  };
  
  

  const navigate = useNavigate();

  return (
    <div className="galeria-container">
      <form className="formBarra">
        <div className="botonBarra-container">
          <button className="botonBarra" onClick={() => navigate('/duende')}>
            Galería
          </button>
        </div>
      </form>
      <div className="sign_in-container">
        <form onSubmit={signIn} className="formSignIn">
          <h1 className="title">Iniciar Sesión</h1>
          <h3 className="text">Ingrese su correo</h3>
          <input
            className="textBox"
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <h3 className="text">Ingrese su contraseña</h3>
          <input
            className="textBox"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <br></br>
          <h3 id="errorLogin" className="message">Error</h3>
          <br id="espace"></br>
          <button type="submit" className="buttons">Iniciar Sesión</button>
          <button onClick={()=>navigate('/registro')} className="buttons">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
