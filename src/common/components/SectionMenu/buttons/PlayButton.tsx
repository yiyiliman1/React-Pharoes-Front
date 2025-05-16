import { ButtonBase } from './ButtonBase';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';


type Props = {
  tooltip?: string
  onClick?: () => void
  disabled?: boolean
}


export const PlayButton = ({ tooltip, onClick, ...props}: Props) => {
  const finalTooltip = tooltip || 'Play';
  const disabled = props?.disabled
  return (
    <ButtonBase tooltip={finalTooltip} onClick={onClick} disabled={disabled}>
      <PlayArrowIcon sx={{ fontSize: 17 }} />
    </ButtonBase>
  )
}