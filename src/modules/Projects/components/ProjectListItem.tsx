import { Chip } from '@mui/material'
import { Project } from '../types';
import { ProjectListItemMenu } from './ProjectListItemMenu';

type Props = {
  project: Project
  onClick?: (project: Project) => void
  onClickEdit?: (project: Project) => void
}


export default (props: Props) => {
  const { onClick, onClickEdit, project } = props
  const { name, description, status, chargecode } = project
  const onClickElement = () => !!onClick && onClick(project)
  const onClickEditButton = (e: any) => {
    e.stopPropagation()
    !!onClickEdit && onClickEdit(project)
  }

  return (
    <div onClick={onClickElement} className='project-list-item'>
      <div className='project-list-item__header'>
        <h3>{name}</h3>
        <div onClick={onClickEditButton}>
          <ProjectListItemMenu  project={project}/>
        </div>
      </div>

      <div className='project-list-item__subheader'>
        <Chip label={status} color="success" size="small" variant="outlined" />
        <span className='project-list-item__subheader--code'>{chargecode}</span>
      </div>

      <div className='project-list-item__content'>
        <p style={{ wordBreak: "break-word" }}>{description}</p>
      </div>
    </div>
  )
}