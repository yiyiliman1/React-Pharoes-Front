import AddIcon from '@mui/icons-material/Add';
import { ButtonBase } from './ButtonBase';

type Props = {
  tooltip?: string
  disabled?: boolean
  onClick?: () => void
}

export const AddButton = ({ disabled, tooltip, onClick }: Props) => {
  const finalTooltip = tooltip || 'Add';
  return (
    <ButtonBase disabled={disabled ?? false} tooltip={finalTooltip} onClick={onClick}>
      <AddIcon sx={{ fontSize: 17 }} />
    </ButtonBase>
  )
}