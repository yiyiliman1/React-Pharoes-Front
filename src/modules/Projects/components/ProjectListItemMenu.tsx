import * as React from 'react';

import { IconButton } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Project } from "../types";
import ProjectFormDialog from "./ProjectFormDialog";
import useProjects from '../hooks/useProjects';
import ConfirmationDialog from '../../../common/components/ConfirmationDialog';
import { DialogRef } from '../../../common/types';

type Props = {
  project: Project
}
export const ProjectListItemMenu = (props: Props) => {
  const { project } = props
  const { duplicateSelectedProject, deleteSelectedProject, editSelectedProject, downloadSelectedProject } = useProjects()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onEditProjectSave = async (project: Project) => {
    await editSelectedProject(project)
    handleClose()
  }

  const deleteProject = async () => {
    await deleteSelectedProject(project)
    handleClose()
  }

  const duplicateProject = async () => {
    await duplicateSelectedProject(project);
    handleClose();
  }

  const downloadProject = async () => {
    await downloadSelectedProject(project);
    handleClose()
  }

  return (
    <div>
      <IconButton
        className='edit-button'
        aria-label="upload picture"
        size='small'
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        component="span">
        <MoreVertIcon fontSize='small' />
      </IconButton>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <ConfirmationDialog
          title='Duplicate project'
          message={(<span>Are you sure you want to <strong>duplicate</strong> the project <strong>{project.name}</strong>?</span>)}
          confirmText='Duplicate'
          onConfirm={duplicateProject}>
          <MenuItem>Duplicate</MenuItem>
        </ConfirmationDialog>
        <MenuItem onClick={downloadProject}>Download</MenuItem>
        <ConfirmationDialog
          title='Delete project'
          type='error'
          confirmText='Delete'
          message={(<span>Are you sure you want to <strong>delete</strong> the project <strong>{project.name}</strong>?</span>)}
          onConfirm={deleteProject}>
          <MenuItem>Delete</MenuItem>
        </ConfirmationDialog>
        <ProjectFormDialog onSave={onEditProjectSave} defaultValues={project} title='Edit project'>
          <MenuItem>Edit</MenuItem>
        </ProjectFormDialog>
      </Menu>
    </div>
  );
}