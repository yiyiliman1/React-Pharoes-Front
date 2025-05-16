import DeleteIcon from '@mui/icons-material/Delete'
import { ButtonBase } from './ButtonBase'

type Props = {
  tooltip?: string
  onClick?: () => void
  disabled?: boolean
}

export const DeleteButton = ({ tooltip, onClick, ...props }: Props) => {
  const finalTooltip = tooltip || 'Delete'
  const disabled = props?.disabled || false
  return (
    <ButtonBase tooltip={finalTooltip} onClick={onClick} disabled={disabled}>
      <DeleteIcon sx={{ fontSize: 17 }} />
    </ButtonBase>
  )
}