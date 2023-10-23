import React from 'react';

function SignInView(props) {
    const {
      email,
      signUp,
      password,
      confPassword,
      name,
      navigateToGallery,
      navigateToLogin,
      handleEmailChange,
      handlePasswordChange,
      handleConfPasswordChange,
      handleNameChange,
    } = props;

    return (
        <div className="galeria-container">
          <form className="formBarra">
            <div className="botonBarra-container">
              <button onClick={navigateToGallery} className='botonOA2'>Galería</button>
            </div>
          </form>
          <div className="sign_up-container">
            <form onSubmit={signUp} className="formSignUp">
              <h1 className="title">Crear Cuenta</h1>
              <h3 className="text">Ingrese su correo</h3>
              <input
                className="textBoxSingUp"
                type="email"
                placeholder="Correo"
                value={email}
                onChange={handleEmailChange}
              ></input>
              <h3 className="text">Ingrese su contraseña</h3>
              <input
                className="textBoxSingUp"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={handlePasswordChange}
              ></input>
              <input
                className="textBoxSingUp"
                type="password"
                placeholder="Confirmar Contraseña"
                value={confPassword}
                onChange={handleConfPasswordChange}
              ></input>
              <h3 className="text">Ingrese su nombre completo</h3>
              <input
                className="textBoxSingUp"
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={handleNameChange}
              ></input>
              <h3 id="errorLogin" className="message">Error</h3>
              <br id="espace"></br>
              <button type="submit" className="buttons">Registrarse</button>
              <button onClick={navigateToLogin} type="button" className="buttons">Iniciar Sesión</button>
            </form>
          </div>
        </div>
      );
    };
    
    export default SignInView;