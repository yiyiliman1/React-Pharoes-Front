import {DataGrid} from "../../../common/components/DataGrid";
import dayjs from 'dayjs'
import useMonthConsumption from '../hooks/useMonthConsumption'
import { Consumption } from '../types'
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {useState} from "react";

type Props = {
  consumption: Consumption
}
export const ConsumptionDetailsTable = ({ consumption }: Props) => {
  const [cursor, setCursor] = useState<string>("")
  const { monthConsumptions } = useMonthConsumption(cursor, consumption.month)
  const [page, setPage] = useState<number>(0)
  const handlePageChange = (newPage: number) => {
    if (newPage > page){
      if (monthConsumptions.Cursor.has_next){
        setCursor(monthConsumptions.Cursor.next!)
      }
    }
    if (monthConsumptions.Cursor.has_prev){
      setCursor(monthConsumptions.Cursor.prev!)
      setPage(newPage)
    }
  }
  return (
    <div className='consumption-details__table'>
      <DataGrid
          handlePageChange={handlePageChange}
          data={monthConsumptions.Data}
          height={'50vh'}
          pageSize={10}
          totalRows={monthConsumptions.Cursor.amount}
          withSelection={false}
          idName = {"runid"}
          columns={
            [
              { field: 'status', headerName: 'STATUS', minWidth: 120,  sortable: false },
              { field: 'consumption', headerName: 'CPU (minutes)', minWidth: 120,  sortable: false},
              { field: 'usagecharge', headerName: 'USAGE CHARGE', minWidth: 170,  sortable: false },
              { field: 'globalTol', headerName: 'GLOBAL TOL', minWidth: 70,  sortable: false},
              { field: 'localTol', headerName: 'LOCAL TOL', minWidth: 70,  sortable: false },
              { field: 'timemax', headerName: 'MAX. TIME',minWidth: 120,  sortable: false},
            ]}
      />
    </div>
  )
}