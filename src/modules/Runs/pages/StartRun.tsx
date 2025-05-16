import { useNavigate } from 'react-router';
import PageTitle from '../../../common/components/PageTitle'
import useSelectedProject from '../../Projects/hooks/useSelectedProject';
import { RunForm } from '../components/startRun/RunForm'
import {useRuns} from "../hooks/useRuns";
import { RunFormData } from '../types';

export const StartRunPage = () => {
  const { createRun } = useRuns()
  const navigate = useNavigate()
  const { selectedProject } = useSelectedProject()

  const defaultValues = {
    name: '',
    execution: '',
    maxTime: 10,
    tolerance: 0.05,
  }

  const createNewRun = async (data: RunFormData) => {
    try {
      await createRun(data);
      navigate(`/app/project/${selectedProject!.projectid}/runs`);
    } catch {}
  }

  return (
    <div className='start-run-page'>
      <PageTitle title='Start run' />
      
      <div className='start-run-page__content'>
        <div className='start-run-page__content__card'>
          <RunForm defaultValues={defaultValues} onSubmit={createNewRun} />
        </div>
      </div>
    </div>
  )
}