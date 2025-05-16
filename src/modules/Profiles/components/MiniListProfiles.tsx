import { Table, TableBody, TableCell, TableRow } from '@mui/material'
import { Profile } from '../types'

type Props = {
  profiles: Profile[]
}


export const MiniListProfiles = ({ profiles }: Props) => {
  return (
    <div className='mini-list-profiles'>
      <Table size="small" className='mini-list-profiles__table'>
        <TableBody>
          {profiles.map((profile, i) => (
            <TableRow key={i}>
              <TableCell>{profile.Name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}