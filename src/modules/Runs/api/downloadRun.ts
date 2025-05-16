import {AxiosResponse} from 'axios';
import { API } from '../../../common/services/api';
import { Project } from '../../Projects/types';
import { RunDetails } from '../types';

export const getPresignedURL = async (project: Project, run: RunDetails): Promise<AxiosResponse<string>> => {
    const url= `${import.meta.env.VITE_API_URL2}/projects/${project.projectid}/runs/${run.runid}/data-full`
    return API.call("GET", url, true);
}