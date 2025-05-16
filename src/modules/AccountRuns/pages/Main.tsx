import { Box } from '@mui/material'
import PageTitle from '../../../common/components/PageTitle'
import { RunsList } from '../components/RunsList'


export const AllExecutionMain = () => {
  return (
    <>
      <PageTitle title='All account runs' />
      <Box sx={{ bgcolor: 'background.paper' }}>
        <RunsList/>
      </Box>
    </>
  )
}
