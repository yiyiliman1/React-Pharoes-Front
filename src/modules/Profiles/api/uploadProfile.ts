import {AxiosRequestConfig, AxiosResponse} from 'axios';
import { API } from '../../../common/services/api';
import _ from "lodash";


export const createSourceFileProfile = async (projectId: string, file: any): Promise<AxiosResponse<string>> => {
    const url = `${import.meta.env.VITE_API_URL2}/projects/${projectId}/profiles/csv-profiles`
    const config: AxiosRequestConfig = {
        data: {filename: file.name}
    }
    return API.call("POST", url, true, config);
}

export const uploadSourceFile = async (file: any, presigned: any): Promise<AxiosResponse<any>> => {
    const data = new FormData();
    const parsedResponse = JSON.parse(presigned)
    _.forIn(parsedResponse.fields, (value: string, key: string) => {
        data.append(key, parsedResponse.fields[key])
    })
    data.append('file', file)
    const config: AxiosRequestConfig = {
        data: data
    }
    return API.call("POST", parsedResponse.url, false, config);
}