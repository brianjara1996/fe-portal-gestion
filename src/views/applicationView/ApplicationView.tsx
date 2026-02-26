import React, { Suspense, useEffect, useState } from 'react';
import NavBar from '../../components/navBar/NavBar';
import HeaderPage from '../../components/headerPage/HeaderPage';
import Hr from '../../components/hr/Hr';
import { getApps } from '../../services/AppService/AppService';
import { RemoteComponent } from 'react-dynamic-remote-component';
import { getIfIsAdm, getToken, getUsername } from '../../services/SessionService/SessionService';
import { Token } from '../../services/model/model';

const ApplicationView = () => {
    const [title, setTitle] = useState('');
    const [applicationName, setApplicationName] = useState('');
    const [host, setHost] = useState('');
    const [shortTitle, setShortTitle] = useState('');
    const [token, setToken] = useState<Token>();

    const [username, setUsername] = useState('         ');
    const [isAdm, setIsAdm] = useState(false);

    useEffect(() => {
        const user = getUsername();
            if (user != null)
                setUsername(user);
            getIfIsAdm(() => { setIsAdm(true) }, () => { setIsAdm(true) })

        try {
            const urlParsed = String(window.location.href).split('/')
            const appName = String(urlParsed[urlParsed.length - 1]).toLowerCase()

            const token = getToken();
            if (token != null) {
                setToken(token)

                getApps(token.bearer).then(apps => {
                    console.log(apps)
                    if (appName !== null && appName !== undefined) {
                        const app = apps.applications.get(appName);
                        console.log(app.appName)
                        console.log(appName)

                        if (app !== null && app !== undefined && app.appName != null && String(app.appName).toLocaleLowerCase() === appName) {
                            console.log(appName)
                            const application = apps.applications.get(appName);
                            console.log(application)
                            console.log("--")
                            if (application !== null) {
                                console.log("-")
                                console.log(appName)
                                setApplicationName(appName);
                                setHost(application.host)
                                setTitle(application.title)
                                setShortTitle(application.shortTitle)
                            }
                        }
                    }
                });
            }

        } catch (error) {
            console.log(error)
        }
    }, []);

    return (
        <>
            <div className="container h-100 top">
                <NavBar username={username} isAdm={isAdm}></NavBar>
                <HeaderPage title={title} shortTitle={shortTitle} showPages={true}></HeaderPage>
                <Hr></Hr>
                {applicationName !== '' && host !== '' &&
                    <Suspense fallback={"Loading..."}>
                        <RemoteComponent
                            url={'/web/component/' + applicationName + "?token=" + token.bearer}
                            scope={host}
                            module={'./' + applicationName}
                        />
                    </Suspense>}
            </div>
        </>
    );
}

export default ApplicationView;
