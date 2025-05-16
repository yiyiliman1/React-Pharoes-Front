import { NavMenuItemConfig } from '../../../common/types';
import { DataPaths } from './phats';
import SsidChart from '@mui/icons-material/SsidChart';

export const profilesNavmenu = [
  {
    label: 'Profiles',
    path: DataPaths.DataList,
    icon: (<SsidChart sx={{ color: '#c3c3c3' }}/>),
  }
] as NavMenuItemConfig[]