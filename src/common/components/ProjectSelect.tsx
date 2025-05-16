import { CircularProgress, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import useProjects from '../../modules/Projects/hooks/useProjects';

export default () => {
  const params = useParams()
  const navigate = useNavigate()
  const [project, setProject] = React.useState(params?.projectId)
  const { projects } = useProjects()

  const onChangeSelect = (event: SelectChangeEvent) => {
    setProject(event.target.value);
    navigate(`/app/project/${event.target.value}`)
  }

  const menuItems = projects.map((project, key) => (
    <MenuItem key={key} value={project.projectid}>{project.name}</MenuItem>
  ))

  return projects.length > 0 ? (
    <Select
      className='project-select'
      value={project || ""}
      onChange={onChangeSelect}
      displayEmpty
      inputProps={{ 'aria-label': 'Without label' }}>
      {menuItems}
    </Select>
  ) : (
    <span>
      <CircularProgress size={10} />  
      <small style={{ marginLeft: "8px" }}>LOADING...</small>
    </span>
  );
}