import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { db } from '../firebase/firebaseConfig';
import {useNavigate} from 'react-router-dom'

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setconfPassword] = useState("");
  const [name, setName] = useState("");

  const agregarDatos = async() => {        
    try {
      const docRef = await addDoc(collection(db, "usuario"), {
        correo: email,
        nombreCompleto: name,
        rol: "Cliente",
      });
    
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const signUp = (e) => {
    e.preventDefault();

    if (password !== confPassword) {
      var errorMessage = document.getElementById('errorLogin');
      errorMessage.style.display = "block";
      errorMessage.textContent = "Las contraseñas no coinciden";
      document.getElementById('espace').style.display = "none";
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        agregarDatos();
        navigate('/galeriaSinLogin')
      })
      .catch((error) => {
        console.log(error);
        var errorMessage = document.getElementById('errorLogin');
        errorMessage.style.display = "block";
        errorMessage.textContent = "Datos no válidos";
        document.getElementById('espace').style.display = "none";
      });
  };

  const navigate = useNavigate();

  return (
    <div className="sign_in-container">
      <button className="botonBarra" onClick={()=>navigate('/galeriaSinLogin')}>
          Galería
      </button>
      <form onSubmit={signUp} className="formSignUp">
        <h1 className="title">Crear Cuenta</h1>
        <h3 className="text">Ingrese su correo</h3>
        <input
          className="textBoxSingUp"
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <h3 className="text">Ingrese su contraseña</h3>
        <input
          className="textBoxSingUp"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <input
          className="textBoxSingUp"
          type="password"
          placeholder="Confirmar Contraseña"
          value={confPassword}
          onChange={(e) => setconfPassword(e.target.value)}
        ></input>
        <h3 className="text">Ingrese su nombre completo</h3>
        <input
          className="textBoxSingUp"
          type="text"
          placeholder="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
        <h3 id="errorLogin" className="message">Error</h3>
        <br id="espace"></br>
        <button type="submit" className="buttons">Registrarse</button>
        <button onClick={()=>navigate('/duende')} className="buttons">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default SignUp;
