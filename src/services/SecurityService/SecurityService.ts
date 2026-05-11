import { AxiosHeaders } from "axios"
import { HttpClient } from "../libs/axios/HttpClient"
import { Buffer } from 'buffer';
import { PostLoginResponse, GetLoginResponse, ErrorResponse } from "./../model/model";
import { ResponseCustom } from "../libs/axios/model/model";
import { SECURITY_URL } from "../../config/DefaultValues";
import { getAccessToken } from "../SessionService/SessionService";

function isLocalhostEnv() {
    return typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
}

export function auth(user: string, password: string, domain: ESessionType): Promise<ResponseCustom<PostLoginResponse, ErrorResponse> | undefined> {
    return login(user, password, domain);
}

async function login(user: string, password: string, sessionType: ESessionType): Promise<ResponseCustom<PostLoginResponse, ErrorResponse> | undefined> {
    if (isLocalhostEnv()) {
        return new ResponseCustom<PostLoginResponse, ErrorResponse>(201, {
            applicationToken: {
                bearer: 'local-dev-token',
                createAt: Math.round(Date.now() / 1000),
                expirationTime: 60 * 60 * 24
            }
        } as PostLoginResponse, null);
    }

    let headers = new AxiosHeaders();
    headers.set('Authorization', 'Basic ' + Buffer.from(user + ':' + password).toString('base64'));
    headers.set('Domain', sessionType);
    return await HttpClient.post<PostLoginResponse, ErrorResponse>(SECURITY_URL + '/auth/ldap', null, headers);
}

export enum ESessionType {
    NET01 = "NET01",
    NET02 = "NET02",
    SSO = "SSO"
  }

export async function verifyToken(token: string): Promise<ResponseCustom<GetLoginResponse, ErrorResponse> | undefined> {
    if (isLocalhostEnv()) {
        return new ResponseCustom<GetLoginResponse, ErrorResponse>(200, {
            valid: true,
            content: {
                maxUserLvl: 'USER',
                bankCode: '',
                memberOf: [],
                memberOfBanks: [],
                aplications: [],
                userOu: '',
                name: 'Local User',
                username: 'local.user'
            }
        } as GetLoginResponse, null);
    }

    let headers = new AxiosHeaders();
    headers.set('Authorization', 'Bearer ' + token);
    return await HttpClient.get<GetLoginResponse, ErrorResponse>(SECURITY_URL + '/auth', headers);
}

export async function loginMsal(token: string): Promise<ResponseCustom<PostLoginResponse, ErrorResponse> | undefined> {
    let headers = new AxiosHeaders();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers.set('Domain', ESessionType.SSO);
    return await HttpClient.post<PostLoginResponse, ErrorResponse>(SECURITY_URL + '/auth/msal', { "Authorization": 'Bearer ' + token, "Access-Token": getAccessToken() }, headers);
}
