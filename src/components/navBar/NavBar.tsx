import downArrow from './down-arrow.svg';
import logo from './logo-prisma.svg';
import './NavBar.css';
import { getIfIsAdm, getToken, getUsername, unSetSession } from '../../services/SessionService/SessionService';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CheckSession from '../body/checkSession/CheckSession';
import { Avatar, Icon } from '@orbita-ui/core';

const NavBar = (props: { username: string, isAdm: boolean }) => {

    const [validSession, setValidSession] = useState(false);
    const [toAdm, setToAdm] = useState(false);

    function closeSession(event: any) {
        event.preventDefault();
        unSetSession();
        setValidSession(true);
    }

    function redirectToAdm(event: any) {
        event.preventDefault();
        setToAdm(true);
    }

   
    return (
        <>
            <CheckSession></CheckSession>
            {validSession && <Navigate to="/login" />}
            {toAdm && <Navigate to="/administration" />}
            <nav className="navbar navbar-expand-md fixed-top navbar-custom">
                <div className="container container-fluid">
                    <img src={logo} className="navbar-brand logo" />

                    <div style={{ display: 'flex' }}>
                        <div className="navbar-icon">
                            <Icon
                                className="navbar-icon"
                                color="neutralStrong"
                                name="NotificationIcon"
                                size="L"
                            />
                        </div>
                        <div>
                            <div className="simil-vertical-hr"></div>
                        </div>
                        <div className="dropdown pointer" style={{ minWidth: "180px" }}>
                            <Avatar
                                style={{ display: "inline-flex" }}
                                className="navbar-icon"
                                color="green"
                                variant="icon"
                                size="small"
                            />
                            <span className="alingn-center">{props.username}</span>
                            <img src={downArrow} style={{ width: "20px" }} />

                            <div className="dropdown-content">
                                <div style={{ width: "100%", height: "16px" }}></div>
                                {props.isAdm &&
                                    <a href="" onClick={(e) => { redirectToAdm(e) }}>
                                        <Icon
                                            className="navbar-icon"
                                            color="neutralStrong"
                                            name="ConfigurationIcon"
                                        />
                                        Administración
                                    </a>}
                                <a href="" onClick={(e) => { closeSession(e) }}>
                                    <Icon
                                        className="navbar-icon"
                                        color="neutralStrong"
                                        name="LogOutIcon"
                                    />
                                    Salir
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </nav>
        </>
    );
}

export default NavBar;