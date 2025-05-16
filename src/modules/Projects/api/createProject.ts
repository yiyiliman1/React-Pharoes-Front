import {AxiosRequestConfig, AxiosResponse} from 'axios';
import { API } from '../../../common/services/api';
import {Project} from "../types";
import useSelectedProject from "../hooks/useSelectedProject";



export const createProject = async (project: Project): Promise<AxiosResponse<Response> | undefined> => {
    const url=  `${import.meta.env.VITE_API_URL2}/projects`
    const config: AxiosRequestConfig = {
        data: {
            "name": project.name,
            "description": project.description,
            "chargecode": project.chargecode,
            "status": project.status
        },
    }
    return API.call<Response>("POST", url, true, config)
}
