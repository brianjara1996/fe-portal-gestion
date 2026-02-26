
import './BodyLoginSso.css';
import logo from "./../assets/logo-prisma.svg";
import React, { useEffect, useState } from 'react';
const { getLogin, postLogin } = require('../../../services/SecurityService/SecurityService')
import { setSession, unSetSession, getToken, existSessionMsal } from '../../../services/SessionService/SessionService';
import { Navigate } from 'react-router-dom';
import { Button, PasswordInput, TextInput } from '@orbita-ui/core';

import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../../authConfig";
import { loginMsal } from '../../../services/SecurityService/SecurityService';

const ERROR_LOGIN = "Usuario y/o contraseña son incorrectos.";
const ERROR_500 = "Servicio no disponible.";
const ERROR_SESSION_EXPIRED = "Sesión finalizada."
const SESSION_PROCESSING = 0;
const SESSION_VALID = 1;


const BodyLogin = () => {

    const [errorLogin, setErrorLogin] = useState(false);
    const [inLogin, setInLogin] = useState(false);
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(ERROR_LOGIN);
    const [validSession, setValidSession] = useState(SESSION_PROCESSING);

    const { instance } = useMsal();

    
    function checkSso() {
        const account = instance.getActiveAccount();
        if (account != null && account.idToken != null) {
            loginMsal(account.idToken).then(r => {
                if (r?.status === 201) {
                    setSession(r.response.applicationToken, account.username.split("@")[0]);
                    setTimeout(() => { setValidSession(SESSION_VALID) }, 1000);
                } else {
                    unSetSession();
                }
            }).catch(e => {
                invalidCredentials();
            });
        } else {
            unSetSession();
        }
    }


    instance.addEventCallback((event) => {
        if (event != null) {
            if (event.eventType === 'msal:loginSuccess' && event.interactionType === 'redirect')
                checkSso()
            if (event.eventType === 'msal:handleRedirectStart' && event.interactionType === 'redirect')
                setInLogin(true)
                setTimeout(() => { setInLogin(false) }, 2000);

            /*if (event.eventType === 'msal:handleRedirectEnd' && event.interactionType === 'redirect')
                setInLogin(false)*/
        }
    });

    function login(event: any) {
        event.preventDefault();
        setInLogin(true);
        postLogin(user, password).then(r => {
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

    function loginSso() {
        setInLogin(true);
        instance.loginRedirect(loginRequest)
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
                                        disabled={true}                                        
                                    />

                                </div>
                                <div className="form-group">
                                    <TextInput
                                        fullWidth={true}
                                        id='password'
                                        label="Contraseña"
                                        onChange={(e) => setPassword(e.target.value)}                                       
                                        value={password}
                                        type='password'
                                        disabled={true}
                                    />
                                </div>
                                <div className="form-group text-align" >
                                    <br />
                                    <Button onClick={(e) => { loginSso(); }} style={{ marginRight: "10px", display: inLogin ? 'none' : '' }} disabled={inLogin}>
                                        <div hidden={inLogin} style={{ background: "none", border: "none" }}>SSO</div>
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