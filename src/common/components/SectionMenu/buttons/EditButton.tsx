import DeleteIcon from '@mui/icons-material/Delete'
import { ButtonBase } from './ButtonBase'
import EditIcon from '@mui/icons-material/Edit';

type Props = {
  tooltip?: string
  onClick?: () => void
  disabled?: boolean
}

export const EditButton = ({ tooltip, onClick, ...props }: Props) => {
  const finalTooltip = tooltip || 'Edit'
  const disabled = props?.disabled || false
  return (
    <ButtonBase tooltip={finalTooltip} onClick={onClick} disabled={disabled}>
      <EditIcon sx={{ fontSize: 17 }} />
    </ButtonBase>
  )
}