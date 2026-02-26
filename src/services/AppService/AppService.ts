import { getFavoritesApp } from "../SessionService/SessionService";
import {CardApp, Application, AllComponentsResponse } from "./../model/model";
import { HttpClient } from "../libs/axios/HttpClient";
import { AxiosHeaders } from "axios";



async function getAllComponents(token): Promise<AllComponentsResponse> {
    return new Promise((resolv, reject) => {
        let headers = new AxiosHeaders();        

        if (token !== null)
            headers.set('Authorization', token);

        HttpClient.get<AllComponentsResponse, any>("/web/component", headers).then(resp => {
            if (resp?.status == 200)
                resolv(resp.response);
            else
                reject({ apps: {} })
        }).catch(() => reject({ apps: {} }));

    });
}

export async function getApps(token): Promise<{ domain: string, applications: Map<string, CardApp>}> {

    const response = await getAllComponents(token);
    const apps: { [s: string]: Application; } = response.apps;
    let mapFavs: Map<string, CardApp> = new Map<string, CardApp>();

    for (const [appName, app] of Object.entries<Application>(apps)) {
        const favs = getFavoritesApp();
        mapFavs.set(appName, new CardApp(app.title, app.shortTitle, app.appName, app.host, favs.includes(app.appName)));
    }

    return { domain: response.domain, applications: mapFavs};
}