import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useFormatDate } from '../hooks/useFormatDate';
import { Consumption } from '../types';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

type Props = {
  consumptions: Consumption[]
  onClickConsumption?: (consumption: Consumption) => void
}


export const ConsumptionTable = ({ consumptions, onClickConsumption }: Props) => {
  const { formatMonthToString } = useFormatDate()
  const onRowClick = (consumption: Consumption) => {
    onClickConsumption && onClickConsumption(consumption);
  }


  return (
    <div className='consumption-table'>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>MONTH</TableCell>
              <TableCell align="right">USAGE CHARGE</TableCell>
              <TableCell align="right">CONSUMPTION</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {consumptions.map((row, key) => (
              <TableRow
                hover
                onClick={() => onRowClick(row)}
                key={key}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
              >
                <TableCell>{formatMonthToString(row.month)}</TableCell>
                <TableCell align="right">{row.usagecharge}</TableCell>
                <TableCell align="right">{row.consumption}</TableCell>
                <TableCell align="right"><ArrowForwardIosRoundedIcon sx={{ fontSize: 10 }}/></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  )
}