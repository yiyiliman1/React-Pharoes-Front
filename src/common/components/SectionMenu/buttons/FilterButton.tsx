import { ButtonBase } from './ButtonBase'
import FilterList from '@mui/icons-material/FilterList'

type Props = {
  tooltip?: string
  disabled?: boolean
  onClick?: () => void
  open?: boolean
  rawFilters?: any
}

export const FilterButton = ({ tooltip, onClick, disabled, open, rawFilters }: Props) => {
  const finalTooltip = tooltip || 'Filter'

  return (
    <ButtonBase disabled={disabled} tooltip={finalTooltip} onClick={onClick} open={open} rawFilters={rawFilters}>
      <FilterList sx={{ fontSize: 17 }} />
    </ButtonBase>
  )
}