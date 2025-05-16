import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Consumptions } from '../types';
import { useFormatDate } from '../hooks/useFormatDate';
import {useState} from "react";

type Props = {
  cursor: string
  setCursor:  (cursor: string) => void
  consumptions: Consumptions
}

export const ConsumptionChart = ({ consumptions, setCursor, cursor }: Props) => {
  const { formatMonthToString } = useFormatDate()
  const [page, setPage] = useState<number>(0)
  let black = '#000000'
  let grey = '#BDBDBD'
    const sortedData=  consumptions.Data.sort((a, b) => a.month.localeCompare(b.month));
    const data = sortedData.map(({ consumption, month }) => ({ consumption, name: formatMonthToString(month) }))
    const handlePageChange = (newPage: number) => {
        if (newPage > page && page < newPage){
            if (consumptions.Cursor.has_next){
                setCursor(consumptions.Cursor.next!)

            }
        }
        if (consumptions.Cursor.has_prev && page > newPage){
            setCursor(consumptions.Cursor.prev!)
            setPage(newPage)
        }
    }
  return (
    <div className='consumption-chart'>
        <ArrowBackIosNewIcon sx={{color: consumptions.Cursor.has_next? black: grey}} onClick={() => handlePageChange(page+1)}/>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="consumption" barSize={60} fill="#97c0e8" />
        </BarChart>
      </ResponsiveContainer>
        <ArrowForwardIosIcon sx={{color: consumptions.Cursor.has_prev? black:grey}} onClick={() => handlePageChange(page-1)}/>
    </div>
  );
}
