import {AxiosRequestConfig, AxiosResponse} from 'axios';
import { API } from '../../../common/services/api';
import {Project} from "../types";



export const editProject = async (project: Project): Promise<AxiosResponse<Response> | undefined> => {
    const url=  `${import.meta.env.VITE_API_URL2}/projects/${project.projectid}`
    const config: AxiosRequestConfig = {
        data: {
            "name": project.name,
            "description": project.description,
            "chargecode": String(project.chargecode),
            "status": project.status
        },
    }
    return API.call<Response>("PUT", url, true, config)
}
