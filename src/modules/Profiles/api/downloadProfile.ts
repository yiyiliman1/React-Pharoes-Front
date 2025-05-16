import {AxiosResponse} from 'axios';
import { API } from '../../../common/services/api';


export const getPresignedURL = async (projectId: string, profileId: string): Promise<AxiosResponse<string>> => {
    const url= `${import.meta.env.VITE_API_URL2}/projects/${projectId}/profiles/csv-profiles/${profileId}`

    return API.call("GET", url, true);
}