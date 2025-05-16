import {AxiosRequestConfig, AxiosResponse} from 'axios';
import { template } from 'lodash';
import { API } from '../../../common/services/api';
import { Project } from '../../Projects/types';


const URL_TEMPLATE = template(`${import.meta.env.VITE_API_URL2}/projects/<%= projectId %>/profiles/all-profiles/<%= profileId %>`)
type Response = { body: string }

export const deleteRuns = async (project: Project, ids: string[]): Promise<AxiosResponse<Response> | undefined> => {
    const url = `${import.meta.env.VITE_API_URL2}/projects/${project.projectid}/runs`
    const config: AxiosRequestConfig = {
        data: { ids },
    }
    return API.call<Response>('DELETE', url, true, config)
}
