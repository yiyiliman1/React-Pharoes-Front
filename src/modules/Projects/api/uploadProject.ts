import {AxiosRequestConfig, AxiosResponse} from 'axios';
import { API } from '../../../common/services/api';
import _ from "lodash";

const URLS = {
    Projects: `${import.meta.env.VITE_API_URL2}/projects2`,
}

export const createUploadProject = async (): Promise<AxiosResponse<any> | undefined> => {
    return API.call("POST", URLS.Projects, true);
}

export const uploadFile = async (file: any, presigned: any): Promise<AxiosResponse<string> | undefined> => {
    const data = new FormData();
    _.forIn(presigned.fields, (value: string, key: string) => {
        data.append(key, presigned.fields[key])
    })
    data.append('file', file)

    const config: AxiosRequestConfig = {
        data: data
    }
    return API.call("POST", presigned.url, false, config);
}
