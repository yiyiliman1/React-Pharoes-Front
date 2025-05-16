import { Alert, Button } from '@mui/material'
import { useNavigate } from 'react-router'
import { RepeatedSkeletons } from '../../../common/components/RepeatedSkeletons'
import { QueryError } from '../../../common/hooks/usePaginatedQuery'
import useProjects from '../hooks/useProjects'
import { Project } from '../types'
import ProjectListItem from './ProjectListItem'

export default () => {
  const navigate = useNavigate()
  const { projects, getProjectResponse } = useProjects()
  const { isLoading, error, refetch } = getProjectResponse
  
  const queryError = !!error ? QueryError.fromError(error) : undefined;

  const onClickProject = (project: Project) => {
    navigate(`/app/project/${project.projectid}`)
  }

  const projectListComponents = projects.map((project, index) => (
    <ProjectListItem
      key={index}
      onClick={onClickProject}
      project={project}
    />
  ))

  const loadingComponent = (
    <RepeatedSkeletons totalElements={6} variant="rectangular" width={400} height={200}/>
  )
  
  function ErrorComponent() {
    if (!queryError) return <></>
    else return (
      <Alert 
        severity='error' 
        sx={{ width: "100%" }}
        action={
          <Button size='small' color='inherit' onClick={() => refetch()}>Try again</Button>
        }>{ queryError.message }</Alert>
    )
  }

  return (
    <div className='project-list'>
      { !!queryError && ErrorComponent() }
      { (isLoading && !queryError) && loadingComponent }
      { (!isLoading && !queryError) && projectListComponents }
    </div>
  )
}