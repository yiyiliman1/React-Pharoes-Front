import { ButtonBase } from './ButtonBase'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

type Props = {
  tooltip?: string
  onClick?: () => void
  disabled?: boolean
}

export const DuplicateButton = ({ tooltip, onClick, ...props }: Props) => {
  const finalTooltip = tooltip || 'Duplicate'
  const disabled = props?.disabled

  return (
    <ButtonBase tooltip={finalTooltip} onClick={onClick} disabled={disabled}>
      <ContentCopyIcon sx={{ fontSize: 17 }} />
    </ButtonBase>
  )
}