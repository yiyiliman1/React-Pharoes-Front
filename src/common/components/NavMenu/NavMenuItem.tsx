import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { useNavigationContext } from '../../context/NavigationContext';
import { usePathParser } from '../../hooks/usePathParser';
import { NavMenuItemConfig } from '../../types'
import { Utils } from '../../utils/Utils';
import { useLocation } from "react-router";

type Props = {
  item: NavMenuItemConfig,
  parent?: string
}

export default ({ parent, item }: Props) => {
  const navigate = useNavigate();
  const { parsePathWithCurrentProject } = usePathParser()
  const { resetMenuItemsExpand } = useNavigationContext()
  const location = useLocation();

  const path = !!item.path ? parsePathWithCurrentProject(item.path) : undefined;

  const onClickItem = (item: NavMenuItemConfig) => async () => {
    if (!path) return
    resetMenuItemsExpand(parent);
    await Utils.sleep(250);
    navigate(path);
  }

  function ItemIcon() {
    return !!item.icon 
      ? (<ListItemIcon>{item.icon}</ListItemIcon>) 
      : (<></>)
  }

  return (
    <ListItemButton 
      onClick={onClickItem(item)} 
      dense={!!parent}
      divider={item.meta?.divider ?? false}
      selected={location.pathname === path}>
        <ListItemIcon sx={{ minWidth: "50px" }}>{item.icon}</ListItemIcon>
      <ListItemText primary={item.label} />
    </ListItemButton>
  )
}