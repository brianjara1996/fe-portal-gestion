import { AxiosHeaders } from "axios"
import { HttpClient } from "../libs/axios/HttpClient"
import { PostLoginResponse, ErrorResponse, GetUserResponse, GetGroupsResponse } from "./../model/model";
import { ResponseCustom } from "../libs/axios/model/model";

const ADM_PATH = '/adm'

export async function getUsers(token: string): Promise<ResponseCustom<GetUserResponse, ErrorResponse> | undefined> {
    let headers = new AxiosHeaders();
    headers.set('Authorization', 'Bearer ' + token);
    return await HttpClient.get<GetUserResponse, ErrorResponse>(ADM_PATH + '/user', headers);
}

export interface ResponsePostUser {
    status: string
    groupsFiled: string[]
    error: ErrorResponse;
}

export async function postUser(token: string, userName: string, password: string, bankCode?: string, groups?: string[], givenName?: string, sn?: string): Promise<ResponseCustom<ResponsePostUser, ErrorResponse> | undefined> {
    let headers = new AxiosHeaders();
    headers.set('Authorization', 'Bearer ' + token);
    let params = {
        userName: userName,
        password: password,
        groups: groups
    }
    if (bankCode != undefined && bankCode != null && bankCode != '')
        params['bankCode'] = bankCode

    return await HttpClient.post<ResponsePostUser, ErrorResponse>(ADM_PATH + '/user', null, headers, params);
}

export async function putUser(token: string, userName: string, password?: string, enable?: boolean, bankCode?: string, checkToAdd?: string[], checkToRemove?: string[], email?: string, dni?: string, givenName?: string, sn?: string): Promise<ResponseCustom<any, ErrorResponse> | undefined> {
    let headers = new AxiosHeaders();
    headers.set('Authorization', 'Bearer ' + token);
    let params = {
        userName: userName,
    }
    if (bankCode != undefined && bankCode != null && bankCode != '')
        params['bankCode'] = bankCode
    if (password != undefined && password != null && password != '')
        params['password'] = password
    if (enable != undefined && enable != null)
        params['enable'] = enable
    if (checkToAdd != undefined && checkToAdd != null && checkToAdd.length > 0)
        params['checkToAdd'] = checkToAdd
    if (checkToRemove != undefined && checkToRemove != null && checkToRemove.length > 0)
        params['checkToRemove'] = checkToRemove
    if (email != undefined && email != null && email != '')
        params['email'] = email
    if (dni != undefined && dni != null && dni != '')
        params['dni'] = dni

    return await HttpClient.put<PostLoginResponse, ErrorResponse>(ADM_PATH + '/user', null, headers, params);
}

export async function getGroups(token: string): Promise<ResponseCustom<GetGroupsResponse, ErrorResponse> | undefined> {
    let headers = new AxiosHeaders();
    headers.set('Authorization', 'Bearer ' + token);
    return await HttpClient.get<GetGroupsResponse, ErrorResponse>(ADM_PATH + '/group', headers);
}