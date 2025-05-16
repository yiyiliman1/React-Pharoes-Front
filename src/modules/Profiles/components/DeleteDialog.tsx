import { Alert, AlertTitle, Button, Stack } from '@mui/material'
import { useRef, useState } from 'react'
import Dialog from '../../../common/components/Dialog'
import { DialogRef } from '../../../common/types'
import { MiniListProfiles } from './MiniListProfiles'
import DeleteIcon from '@mui/icons-material/Delete'
import { Profile } from '../types'
import { useProfilesContext } from '../context/ProfilesContext'

type Props = {
  onDelete: (profiles: Profile[]) => Promise<any>,
  children?: React.ReactChild
}

export const DeleteDialog = (props: Props) => {
  const { children, onDelete } = props;
  const [loading, setLoading] = useState(false)
  const { selection } = useProfilesContext()
  
  const dialogRef = useRef<DialogRef>()

  const onClickCancel = () => {
    dialogRef.current?.hide()
  }

  const onClickConfirm = async () => {
    try {
      setLoading(true);
      await onDelete(selection.items)
      setLoading(false);
      dialogRef.current?.hide()
    } catch {
      setLoading(false);
    }
  }

  return (
    <Dialog title='Remove Profiles' executor={children} ref={dialogRef}>
      <div className='delete-dialog'>
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          Are you sure you want to <strong>remove</strong> the following profiles?
        </Alert>
        <MiniListProfiles profiles={selection.items}></MiniListProfiles>
        <div className='delete-dialog__action-buttons'>
          <Stack spacing={2} direction="row">
            <Button variant="text" onClick={onClickCancel}>Cancel</Button>
            <Button disabled={loading} variant="contained" onClick={onClickConfirm} color="error"
              startIcon={<DeleteIcon />}>Delete</Button>
          </Stack>
        </div>
      </div>
    </Dialog>
  )
}