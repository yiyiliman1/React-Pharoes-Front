import { Table, TableBody, TableCell, TableRow } from '@mui/material'
import { RunDetails } from '../../types'

type Props = {
  runs: RunDetails[]
}


export const MiniListRuns = ({ runs }: Props) => {
  return (
    <div className='mini-list-profiles'>
      <Table size="small" className='mini-list-profiles__table'>
        <TableBody>
          {runs.map((run, i) => (
            <TableRow key={i}>
              <TableCell>{run.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}