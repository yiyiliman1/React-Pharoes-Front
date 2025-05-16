import PageTitle from '../../../common/components/PageTitle';
import useSelectedProject from '../../Projects/hooks/useSelectedProject';


export function WelcomeMain (): JSX.Element {
  const { selectedProject } = useSelectedProject()
  const projectName = selectedProject?.name || null

  return (
    <>
      {projectName && <PageTitle title={`Welcome to ${projectName} project`} />}
    </>
  )
}
