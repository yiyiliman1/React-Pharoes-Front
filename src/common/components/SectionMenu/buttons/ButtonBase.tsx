import { CribSharp } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import cn from "classnames";

type Props = {
  tooltip?: string
  onClick?: () => void
  children: React.ReactNode
  disabled?: boolean
  open?: boolean
  rawFilters?: any
}

export const ButtonBase = ({ tooltip, onClick, children, disabled, open, rawFilters }: Props) => {
  const getActiveFilters = () => {
    if (rawFilters && !!Object.keys(rawFilters)?.length) {
      return true;
    }
    return false;
  }

  const IconButtonElement = (
    <IconButton
      onClick={onClick}
      className={cn('icon-buttom', {'icon-button-active': open || getActiveFilters() })}
      component="span"
      disabled={disabled}>
      {children}
    </IconButton>
  )

  const IconContainerElement = (tooltip)
    ? <Tooltip title={tooltip}>{IconButtonElement}</Tooltip>
    : IconButtonElement

  return (
    <>
      {IconContainerElement}
    </>
  )
}