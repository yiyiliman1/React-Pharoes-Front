
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import { usePathParser } from '../../hooks/usePathParser';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { NavMenuItemConfig } from '../../types';
import { useNavigate } from 'react-router-dom';
import NavMenuItem from './NavMenuItem';
import { useNavigationContext } from '../../context/NavigationContext';
import { Utils } from '../../utils/Utils';
import { useEffect } from 'react';

type Props = {
  item: NavMenuItemConfig
};

export default ({ item }: Props) => {
  const { label, icon, children } = item
  const { parsePathWithCurrentProject } = usePathParser()
  const navigate = useNavigate()
  const ctx = useNavigationContext()
  
  const open = ctx.isMenuItemExpanded(item.label);
  
  const handleClick = () => {
    ctx.toggleMenuItemExpansion(item.label);
    if (!!item.meta?.redirect) {
      navigate(parsePathWithCurrentProject(item.meta.redirect));
    }
  }

  const childrenListComponent = (
    <List component="div" disablePadding>
      {children && children.map((child, index) => (
        <NavMenuItem key={index} item={child} parent={item.label} />
      ))}
    </List>
  )

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon sx={{ minWidth: "50px" }}>
          {icon}
        </ListItemIcon>
        <ListItemText primary={label} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {childrenListComponent}
      </Collapse>
    </>
  );
}
