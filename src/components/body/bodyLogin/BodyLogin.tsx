
import './BodyLogin.css';
import logo from "./../assets/logo-prisma.svg";
import React, { useEffect, useState } from 'react';
import { ESessionType, auth } from '../../../services/SecurityService/SecurityService';
import { setSession, unSetSession, getToken, existSessionMsal } from '../../../services/SessionService/SessionService';
import { Navigate } from 'react-router-dom';
import { Button, PasswordInput, TextInput } from '@orbita-ui/core';
import LoginDto from '../../../model/LoginDto';

const ERROR_LOGIN = "Usuario y/o contraseña son incorrectos.";
const ERROR_500 = "Servicio no disponible.";
const ERROR_SESSION_EXPIRED = "Sesión finalizada."
const SESSION_PROCESSING = 0;
const SESSION_VALID = 1;


const BodyLogin = (config: LoginDto) => {

    const [errorLogin, setErrorLogin] = useState(false);
    const [inLogin, setInLogin] = useState(false);
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(ERROR_LOGIN);
    const [validSession, setValidSession] = useState(SESSION_PROCESSING);


    function login(event: any) {
        event.preventDefault();
        setInLogin(true);
        auth(user, password, config.domain).then(r => {
            if (r?.status === 201) {
                setSession(r.response.applicationToken, user);
                setTimeout(() => { setValidSession(SESSION_VALID) }, 1000);
            } else {
                invalidCredentials();
            }
        }).catch(e => {
            errorSession(e);
        });
    }

    function expiredSession() {
        setErrorLogin(true);
        setErrorMessage(ERROR_SESSION_EXPIRED);
        unSetSession();
        setInLogin(false);
    }

    function invalidCredentials() {
        setErrorLogin(true);
        setErrorMessage(ERROR_LOGIN);
        unSetSession();
        setInLogin(false);
    }

    function errorSession(e: any) {
        console.log("Internal server error: " + String(e))
        setErrorMessage(ERROR_500);
        unSetSession();
        setInLogin(false);
    }


    /*
        useEffect(() => {
            console.log("Check session")
            const token = getToken();
            if (token != null && validSession !== SESSION_PROCESSING) {
                setInLogin(true);
                if (token.bearer != null && token.createAt != null && token.expirationTime != null &&
                    (token.createAt + token.expirationTime) >= Math.round((Date.now() / 1000) - 1)) {
                    getLogin(token.bearer).then(r => {
                        if (r !== undefined && r.status == 200) {
                            setTimeout(() => { setValidSession(SESSION_VALID) }, 1000);
                        } else {
                            expiredSession();
                        }
                    }).catch(e => {
                        errorSession(e);
                    });
                } else {
                    expiredSession();
                }
            }
    
    
        }, [validSession])*/

    return (
        <>
            {validSession === SESSION_VALID && <Navigate to="/home" />}
            <div className="container h-100">

                <div className="row align-items-center h-100">
                    <div className="col-2 mx-auto login-input">
                        <div className="row">
                            <img src={logo} className="logo-login" alt='' />
                        </div>
                        <div className="simil-hr"></div>
                        <form>
                            <div className="row text-form">

                                <div className="form-group">
                                    <TextInput
                                        fullWidth={true}
                                        id="user"
                                        label="Usuario"
                                        placeholder=""
                                        value={user}
                                        onChange={(e) => setUser(e.target.value)}

                                    />

                                </div>
                                <div className="form-group">
                                    <TextInput
                                        fullWidth={true}
                                        id='password'
                                        label="Contraseña"
                                        onChange={(e) => setPassword(e.target.value)}
                                        //onClickVisibilityIcon={function noRefCheck() { }}
                                        value={password}
                                        type='password'
                                    />
                                </div>
                                <div className="form-group text-align" >
                                    <br />
                                    <Button onClick={(e) => { login(e); }} disabled={inLogin}>
                                        <div hidden={inLogin} style={{ background: "none", border: "none" }}> Iniciar Sesión</div>
                                        <div className="loader" hidden={!inLogin}></div>
                                    </Button>
                                </div>
                                <div className="form-group text-align" >
                                    <small className="error" hidden={!errorLogin}>{errorMessage}</small>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </>
    );
}

export default BodyLogin;