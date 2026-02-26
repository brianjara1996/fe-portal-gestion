import { EModeAdministration, Token } from '../model/model';
import { verifyToken } from '../SecurityService/SecurityService';
export const TOKEN_KEY = 'token';
export const USERNAME_KEY = 'username';
export const FAVORITE_APP_KEY = 'favorites_app';
export const LOGIN_BY_SSO = 'login_by_sso'

export function setSession(token: Token, username: string) {
    sessionStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    sessionStorage.setItem(USERNAME_KEY, username);
}

export function getAccessToken(): string | null {
    for (let i = 0; i < sessionStorage.length; i++) {
        let key = sessionStorage.key(i);
        if(key.includes('accesstoken')){
            return sessionStorage.getItem(key);
        }
    }
    return null;
}

export function getUsername(): string | null {
    return sessionStorage.getItem(USERNAME_KEY);
}

export function getToken(): Token | null {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token !== null && token !== undefined) {
        //console.log(token);
        return JSON.parse(token);
    } else {
        console.log("Invalid Token.");
        return null;
    }
}

export function getIfIsAdm(isAdmCallBack: Function = () => { }, isRootCallBack: Function = () => { }, isUserCallBack: Function = () => { }) {
    const token = getToken();
    if (token != null && token != undefined) {
        verifyToken(token.bearer).then((r) => {
            if (r.status == 200 && r.response.valid) {
                if (r.response.content.maxUserLvl === EModeAdministration.ADMIN && isAdmCallBack != undefined)
                    isAdmCallBack(r.response);
                if (r.response.content.maxUserLvl === EModeAdministration.ROOT && isRootCallBack != undefined)
                    isRootCallBack(r.response)
                if (r.response.content.maxUserLvl === EModeAdministration.USER && isUserCallBack != undefined)
                    isUserCallBack(r.response)
            }
        });
    }
}

export function unSetSession() {
    sessionStorage.clear();
}

export function existSessionMsal() {
    return sessionStorage.getItem("msal.account.keys") != null;
}

export function addFavoriteApp(appName: string) {
    const favorites = sessionStorage.getItem(FAVORITE_APP_KEY);
    if (favorites == null) {
        sessionStorage.setItem(FAVORITE_APP_KEY, appName + ',');
    } else {
        sessionStorage.setItem(FAVORITE_APP_KEY, favorites + appName + ',');
    }
}

export function getFavoritesApp(): string[] {
    const favorites = sessionStorage.getItem(FAVORITE_APP_KEY);
    if (favorites == null) {
        return [];
    } else {
        return favorites.split(',');
    }
}

export function removeFavoriteApp(appName: string) {
    let favs = getFavoritesApp();
    let newFavs: string[] = [];
    favs.forEach((f) => {
        if (f !== appName)
            newFavs.push(f);
    })
    sessionStorage.setItem(FAVORITE_APP_KEY, newFavs.join(','));
}