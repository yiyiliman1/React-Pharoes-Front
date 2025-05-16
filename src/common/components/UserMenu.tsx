import { Logout } from '@mui/icons-material';
import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router';
import { AllExecutionsPaths } from '../../modules/AccountRuns/config/paths';
import { AuthPaths } from '../../modules/Auth/config/paths';
import { ConsumptionPaths } from '../../modules/Consumption/config/paths';
import { usePathParser } from '../hooks/usePathParser';


export default () => {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickLogout = () => navigate(AuthPaths.Logout)
  const onClickConsumtions = () => navigate(ConsumptionPaths.Main)
  const onClickAllExecutions = () => navigate(AllExecutionsPaths.Main)

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton className='user-menu-button' onClick={handleClick} size="small" sx={{ ml: 1 }}>
            <Avatar className='avatar'>A</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={onClickAllExecutions}>
          All account runs
        </MenuItem>
        <MenuItem onClick={onClickConsumtions}>
          Account consumption
        </MenuItem>
        <Divider />
        <MenuItem onClick={onClickLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}