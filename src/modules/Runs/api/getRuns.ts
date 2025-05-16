import {AxiosResponse} from 'axios';
import { API } from '../../../common/services/api';
import { Project } from '../../Projects/types';

const URL = `${import.meta.env.VITE_API_URL2}/projects/:projectId/runs`;

export const getProjectRuns = async (project: Project, cursor?: string) : Promise<AxiosResponse<string>> => {
    const url = URL.replace(':projectId', project.projectid);
    return API.call<string>("GET", url, true, {
        params: { cursor }
    });
}
