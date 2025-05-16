import { API } from '../../../common/services/api'
import { AxiosResponse } from 'axios'
import { template } from 'lodash'
import { Project } from '../types'

const URL_TEMPLATE = template(`${import.meta.env.VITE_API_URL2}/projects/<%= projectId %>/schema`)
type Response = string

export const getSchema = async (projectId?: string): Promise<AxiosResponse<Response> | undefined> => {
  if (!projectId) return
  
  const url = URL_TEMPLATE({ projectId })
  return await API.call<Response>('GET', url, true)
}

export const getProjectSchema = async (project: Project): Promise<AxiosResponse<string>> => {
  const url = URL_TEMPLATE({ projectId: project.projectid })
  return await API.call<Response>('GET', url, true)
}
