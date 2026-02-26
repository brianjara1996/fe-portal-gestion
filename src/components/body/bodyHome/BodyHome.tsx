import Hr from '../../hr/Hr';
import './BodyHome.css';
import CardApplication from '../../cardApplication/CardApplication';
import { useEffect, useState } from 'react';
import { getApps } from '../../../services/AppService/AppService';
import HeaderPage from '../../headerPage/HeaderPage';
import { SearchInput } from '@orbita-ui/core';
import { getToken } from '../../../services/SessionService/SessionService';
import { Token, CardApp } from '../../../services/model/model';

const renderApp = (app: CardApp, callBack: (app: CardApp) => void) =>
    <CardApplication appName={app.appName} isFavorite={app.isFavorite} title={app.title} key={app.appName} onUpdate={callBack} ></CardApplication>

const BodyHome = (props: { isAdm: boolean }) => {
    const [listApps, setListApps] = useState<Map<string, CardApp>>();
    const [listJsxApp, setListJsxApp] = useState<React.JSX.Element[]>();
    const [token, setToken] = useState<Token>();

    function onUpdate() {
        getApps(token.bearer).then(apps => setListApps(apps.applications));
    }

    useEffect(() => {
        if (listApps != undefined) {
            const listFav = Array.from(listApps.values()).filter(app => app.isFavorite).map(app => app.appName);

            let jsxFavs: React.JSX.Element[] = [];
            let jsxNoFavs: React.JSX.Element[] = [];

            listApps.forEach((app, appName) => {
                if (listFav.includes(appName))
                    jsxFavs.push(renderApp(app, onUpdate))
                else
                    jsxNoFavs.push(renderApp(app, onUpdate))
            })
            setListJsxApp(jsxFavs.concat(jsxNoFavs));
        }
    }, [listApps]);


    useEffect(() => {
        const token = getToken();
        if (token != null)
            getApps(token.bearer).then(apps => {
                if ((props.isAdm != undefined && !props.isAdm) || apps.domain == "NET01" || apps.domain == "SSO") {
                    setListApps(apps.applications)
                }
            });

    }, [props.isAdm]);

    return (
        <div className="container h-100 top">
            <HeaderPage title='Aplicaciones' shortTitle='' showPages={false}></HeaderPage>
            <Hr></Hr>
            <div className="row">
                <div className="conteiner-finder">
                    <SearchInput placeholder="Buscar aplicación" />
                </div>
                <div>Tus aplicaciones</div>
            </div>
            <Hr></Hr>
            <div className="row">
                {listJsxApp}
            </div>
            <Hr></Hr>
        </div>
    );
}

export default BodyHome;