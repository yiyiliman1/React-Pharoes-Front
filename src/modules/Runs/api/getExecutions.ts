import { API } from '../../../common/services/api';
import { Project } from '../../Projects/types';
import {AxiosResponse} from 'axios';

export const getExecutions = async (project: Project) : Promise<AxiosResponse<Record<string, string>>> => {
    const URL = `${import.meta.env.VITE_API_URL2}/projects/${project.projectid}/executions-all`
    return API.call("GET", URL, true);
}