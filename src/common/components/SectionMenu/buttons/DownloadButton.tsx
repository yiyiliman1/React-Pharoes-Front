import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { ButtonBase } from './ButtonBase'

type Props = {
  tooltip?: string
  onClick?: () => void
  disabled?: boolean
}

export const DownloadButton = ({ tooltip, onClick, ...props }: Props) => {
  const finalTooltip = tooltip || 'Download'
  const disabled= props?.disabled
  return (
    <ButtonBase tooltip={finalTooltip} onClick={onClick} disabled={disabled}>
      <FileDownloadIcon sx={{ fontSize: 17 }} />
    </ButtonBase>
  )
}