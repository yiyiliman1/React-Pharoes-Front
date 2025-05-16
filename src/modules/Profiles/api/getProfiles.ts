import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie'
import { COOKIES } from '../../../common/config/cookies';
import { API } from '../../../common/services/api';
import { Project } from '../../Projects/types';

const URL = `${import.meta.env.VITE_API_URL2}/projects/:projectId/profiles/all-profiles`


type Response = string

export const getProfiles = async (cursor?: string, projectId?: string): Promise<AxiosResponse<Response> | undefined> => {
  if (!projectId) return
  //const token = Cookies.get(COOKIES.Token)
  let url = URL.replace(':projectId', projectId);
  if (cursor){
    url = cursor
  }
  
  return API.call<Response>('GET', url, true)
}


export const getProjectProfiles = async (project: Project, cursor?: string): Promise<AxiosResponse<string>> => {
  const url = URL.replace(':projectId', project.projectid);
  return API.call<Response>('GET', url, true, {
    params: { cursor }
  });
}
