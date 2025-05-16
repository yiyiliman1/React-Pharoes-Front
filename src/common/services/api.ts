import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import Cookies from 'js-cookie'
import { COOKIES } from '../config/cookies'


const getHeaderWithAuthorization = (): any => ({ Authorization: `Bearer ${Cookies.get(COOKIES.Token)}`})

function call<TResponse> (method: Method, url: string, authorization: boolean = false, requestConfig: AxiosRequestConfig = {}): AxiosPromise<TResponse> {
  const config = requestConfig
  if (authorization) {
    config.headers = {
      ...(config?.headers) ? config.headers : {},
      ...getHeaderWithAuthorization()
    }
  }
  return axios.request({ method, url, ...config })
}

export const API = { call }