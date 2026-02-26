import axios, { AxiosHeaders } from "axios";
import { ResponseCustom } from "./model/model";

const validateStatus: ((status: number) => boolean) = (status: number) => {
    return status < 500;
}

export class HttpClient {

    public static async post<T, X>(url: string, body: any, headers?: AxiosHeaders, params: any = {}): Promise<ResponseCustom<T, X> | undefined> {
        try {
            const { data, status } = await axios.post(url, body, { params: params, headers: headers, validateStatus: validateStatus });
            return new ResponseCustom<T, X>(status, data, null)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return new ResponseCustom<T, X>(error.status, null, error.response)
            } else {
                throw new Error("Internal Server error: " + String(error));
            }
        }
    }

    public static async get<T, X>(url: string, headers?: AxiosHeaders, params: any = {}): Promise<ResponseCustom<T, X> | undefined> {
        try {
            const { data, status } = await axios.get(url, { params: params, headers: headers, validateStatus: validateStatus });
            return new ResponseCustom<T, X>(status, data, null)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return new ResponseCustom<T, X>(error.status, null, error.response)
            } else {
                throw new Error("Internal Server error: " + String(error));
            }
        }
    }

    public static async put<T, X>(url: string, body: any, headers?: AxiosHeaders, params: any = {}): Promise<ResponseCustom<T, X> | undefined> {
        try {
            const { data, status } = await axios.put(url, body, { params: params, headers: headers, validateStatus: validateStatus });
            return new ResponseCustom<T, X>(status, data, null)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return new ResponseCustom<T, X>(error.status, null, error.response)
            } else {
                throw new Error("Internal Server error: " + String(error));
            }
        }
    }

}