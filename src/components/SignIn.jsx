import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import {useNavigate} from 'react-router-dom'

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigate('/galeria')
      })
      .catch((error) => {
        console.log(error);
        var errorMessage = document.getElementById('errorLogin');
        errorMessage.style.display = "block";
        errorMessage.textContent = "Correo o contraseña incorrecta";
        document.getElementById('espace').style.display = "none";
      });
  };

  const navigate = useNavigate();

  return (
    <div className="sign_in-container">
      <form onSubmit={signIn} className="formContainer">
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
  );
};

export default SignIn;
