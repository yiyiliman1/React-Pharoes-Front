import ProjectList from '../components/ProjectList';
import { ProjectListTitle } from '../components/ProjectListTitle';

export function Home (): JSX.Element {

  return (
    <div className='home'>
      <div>
        <ProjectListTitle></ProjectListTitle>
      </div>
      <div>
        <ProjectList/>
      </div>
    </div>
  )
}
