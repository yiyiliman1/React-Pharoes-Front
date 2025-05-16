import { isObjectLike } from 'lodash'


export interface UseObjectToTree {
  objectToTree: (data: any) => any
}

export const useObjectToTree = (): UseObjectToTree => {
  
  const objectToTree = (data: any) => {
    const parseElement = (key: string, value: any): any => {
      if (isObjectLike(value)) {
        return {
          id: key,
          label: key,
          children: Object.keys(value).map((key2) =>  parseElement(key2, value[key2]))
        }
      } else {
        return { id: key, label: key, value: value }
      }
    }
    return Object.keys(data).map((key) => parseElement(key, data[key])) 
  }

  return { objectToTree }
}