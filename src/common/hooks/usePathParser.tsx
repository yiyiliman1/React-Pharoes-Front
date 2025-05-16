import { useParams } from 'react-router'
import { UseParserPath } from '../types'


export const usePathParser = (): UseParserPath => {
  const params = useParams()

  const parsePathWithCurrentProject = (path: string) => {
    const projectId = params?.projectId
    if (!projectId) throw 'projectId is not defined'
    return path.replace(':projectId', projectId)
  }

  return { parsePathWithCurrentProject }
}