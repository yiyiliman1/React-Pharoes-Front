import { Skeleton } from '@mui/material'

type Props = {
  totalElements: number
  variant?: "text" | "rectangular" | "circular"
  width?: number | string
  height?: number | string
}

export const RepeatedSkeletons = (props: Props) => {
  const { totalElements, variant, width, height } = props
  const skeletonsCompoent = [...Array(totalElements).keys()].map(i => (
    <Skeleton key={i} variant={variant} width={width} height={height} 
      sx={{ 
        bgcolor: 'grey.100',
        borderRadius: "4px"
      }} />
  ))

  return (<>{skeletonsCompoent}</>)
}