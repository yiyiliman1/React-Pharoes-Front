import {useContext, useEffect, useState} from "react";
import { toast } from 'react-toastify';
import PageTitle from '../../../common/components/PageTitle';
import { ConsumptionChart } from '../components/ConsumptionChart';
import { ConsumptionDetails } from '../components/ConsumptionDetails';
import { ConsumptionTable } from '../components/ConsumptionTable';
import useConsumption from '../hooks/useConsumption';
import {Project} from "../../Projects/types";

export const ConsumptionMain = () => {
  const [cursor, setCursor] = useState<string>("");

  const {
    consumptions,
    selectedConsumption,
    setSelectedConsumption
  } = useConsumption(cursor)

  const {getConsumptionResponse} = useConsumption(cursor);

  useEffect( () => {
     if (getConsumptionResponse.status === 'error') {
      toast.error("Request error", {
         position: "top-right",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
         theme: "light",
       })
     }}, [getConsumptionResponse]);


  const onCloseDetailsDialog = () => setSelectedConsumption(undefined)
  const changeCursor = (cursor: string) => setCursor(cursor)
  return (
    <>

      <PageTitle title='Account Consumption'/>
      <div className='consumption'>
        <ConsumptionChart cursor={cursor} setCursor={changeCursor} consumptions={consumptions} />
        <ConsumptionDetails consumption={selectedConsumption} onClose={onCloseDetailsDialog}/>
        <ConsumptionTable consumptions={consumptions.Data} onClickConsumption={setSelectedConsumption} />
      </div>
    </>
  )
}