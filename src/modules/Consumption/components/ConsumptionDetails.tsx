import { useEffect, useRef } from 'react'
import Dialog from '../../../common/components/Dialog'
import { DialogRef } from '../../../common/types'
import { useFormatDate } from '../hooks/useFormatDate'
import useMonthConsumption from '../hooks/useMonthConsumption'
import { Consumption } from '../types'
import { ConsumptionDetailsTable } from './ConsumptionDetailsTable'


type Props = {
  consumption?: Consumption
  onClose?: () => void
}

export const ConsumptionDetails = ({ consumption, onClose }: Props) => {
  const { formatMonthToString } = useFormatDate()
  
  const dialogRef = useRef<DialogRef>();
  const title = (consumption) ? `${formatMonthToString(consumption.month)} consumptions (${consumption.month})` : ''

  useEffect(() => {
    if (consumption) dialogRef.current?.show()
  }, [consumption])

  return (
    <Dialog title={title} ref={dialogRef} onClose={onClose}>
      {consumption && <ConsumptionDetailsTable consumption={consumption} />}
    </Dialog>
  )
}