import React from 'react';

function SignInView(props) {
    const {
      signIn,
      email,
      password,
      navigateToGallery,
      navigateToRegister,
      handleEmailChange,
      handlePasswordChange,
    } = props;

    return (
        <div className="galeria-container">
          <form className="formBarra">
            <div className="botonBarra-container">
              <button onClick={navigateToGallery} className='botonOA2'>Galería</button>
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
                onChange={handleEmailChange}
              ></input>
              <h3 className="text">Ingrese su contraseña</h3>
              <input
                className="textBox"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={handlePasswordChange}
              ></input>
              <br></br>
              <h3 id="errorLogin" className="message">Error</h3>
              <br id="espace"></br>
              <button type="submit" className="buttons">Iniciar Sesión</button>
              <button onClick={navigateToRegister} type="button" className="buttons">Registrarse</button>
            </form>
          </div>
        </div>
      );
    };
    
    export default SignInView;