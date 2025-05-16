import { Button, ButtonBase, DialogActions } from '@mui/material'
import { ComplexCellTable } from './ComplexCellTable'
import Dialog from '../../../common/components/Dialog'
import { DialogRef } from '../../../common/types'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { useRef } from 'react'

interface Props {
  cellParams: GridRenderCellParams<any>
  schema: any
}

export const ComplexCell = ({ cellParams, schema }: Props) => {
  // HOOKS
  const dialogRef = useRef<DialogRef>();

  // DATA
  const title = cellParams.row.Name || cellParams.row.id
  

  // EVENTS
  const onClose = () => {}
  const onClick = () => {
    dialogRef.current?.show()
  }
  
  
  // RENDER

  return (
    <div>
      <Button variant="text" size='small' onClick={onClick}>see more</Button>
      <Dialog title={title} ref={dialogRef} onClose={onClose}>
        <ComplexCellTable cellParams={cellParams} schema={schema} />
      </Dialog>
    </div>
  )
}