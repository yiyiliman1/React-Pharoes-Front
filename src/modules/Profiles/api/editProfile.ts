import {AxiosRequestConfig, AxiosResponse} from 'axios';
import { API } from '../../../common/services/api';
import {Profile} from "../types";
import _ from "lodash";



export const editFormulaProfile = async (projectId: string, profile: Profile): Promise<AxiosResponse<any> | undefined> => {
    const url=  `${import.meta.env.VITE_API_URL2}/projects/${projectId}/profiles/formula-profiles/${profile.Id}`
    const config: AxiosRequestConfig = {
        data: {
            "comments": profile.Comments,
            "name": profile.Name,
            "formula": profile.Formula,
            "rule": profile.Rule
        },
    }
    return API.call<Response>("PUT", url, true, config)
}

export const editFileProfile = async (profile: Profile, projectId: string): Promise<AxiosResponse<any> | undefined> => {
    const url=  `${import.meta.env.VITE_API_URL2}/projects/${projectId}/profiles/csv-profiles/${profile.Id}/description`
    const config: AxiosRequestConfig = {
        data: {
            "comments": profile.Comments,
            "name": profile.Name,
            "rule": profile.Rule,
        },
    }
    return API.call<Response>("PUT", url, true, config)
}


export const editFileProfileFile = async (projectId: string, profile: Profile, fileName: string): Promise<AxiosResponse<any>> => {
    const url = `${import.meta.env.VITE_API_URL2}/projects/${projectId}/profiles/csv-profiles/${profile.Id}/file`
    const config: AxiosRequestConfig = {
        data: {filename: fileName}
    }
    return API.call("PUT", url, true, config);
}

export const uploadEditedFile = async (file: any, presigned: any): Promise<AxiosResponse<string> | undefined> => {
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