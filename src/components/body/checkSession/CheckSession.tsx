import React, { useEffect, useState } from 'react';
import { verifyToken } from '../../../services/SecurityService/SecurityService'
import { unSetSession, getToken } from '../../../services/SessionService/SessionService';
import { Navigate } from 'react-router-dom';

const SESSION_PROCESSING = 0;
const SESSION_INVALID = 1;


function isLocalhostEnv() {
    return typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
}

const CheckSession = () => {

    const [validSession, setValidSession] = useState(SESSION_PROCESSING);

    useEffect(() => {
        if (isLocalhostEnv()) {
            return;
        }

        const token = getToken();
        if (token != null) {            
            if (token.bearer !== null && token.createAt !== null && token.expirationTime !== null ) {
                verifyToken(token.bearer).then(r => {
                    if (r?.status != 200) {
                        unSetSession();
                        setValidSession(SESSION_INVALID)
                    }
                }).catch((e) => {                  
                    unSetSession();
                    setValidSession(SESSION_INVALID)
                });
            } else {
                unSetSession();
                setValidSession(SESSION_INVALID)
            }
        } else {
            unSetSession();
            setValidSession(SESSION_INVALID)
        }
    }, [])


    return (
        <>
            {validSession === SESSION_INVALID && <Navigate to="/login" />}
        </>
    );
}

export default CheckSession;