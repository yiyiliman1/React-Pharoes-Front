import { Button, Stack } from '@mui/material'
import { useRef, useState } from 'react'
import Dialog from '../../../common/components/Dialog'
import { useFormFactory } from '../../../common/hooks/useFormFactory'
import { DialogRef } from '../../../common/types'
import { IncompleteProject, Project } from '../types'

type Props = {
  onSave: (project: Project) => Promise<any>
  onCancel?: () => void
  defaultValues?: IncompleteProject
  children?: React.ReactChild
  confirmButtonLabel?: string
  cancelButtonLabel?: string
  title?: string
}

enum FormFields {
  name = 'name',
  chargecode = 'chargecode',
  status = 'status',
  description = 'description',
}

export default (props: Props) => {
  const { defaultValues, onSave, onCancel, children } = props
  const confirmButtonLabel = props.confirmButtonLabel || 'Save'
  const cancelButtonLabel = props.cancelButtonLabel || 'Cancel'
  const title = props.title || 'Create Project'
  const { createInput } = useFormFactory()
  const dialogRef = useRef<DialogRef>();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<Project>({
    chargecode: '',
    created: '',
    description: '',
    name: '',
    owner: '',
    projectid: '',
    status: '',
    usersid: '',
    ...defaultValues
  })
  
  const getOnChangeInputEvent = (formField: FormFields) => (event: React.ChangeEvent<HTMLInputElement>) => setProject({
    ...project,
    [formField]: event.target.value
  })
  
  
  const onClickCancel = () => {
    dialogRef.current?.hide()
    onCancel && onCancel()
  }

  const onClickSave = async () => {
    try {
      setLoading(true);
      await onSave(project);
      setLoading(false);
      dialogRef.current?.hide();
    } catch {
      setLoading(false);
    }
  }
  
  const nameInput = createInput(FormFields.name, {
    onChange: getOnChangeInputEvent(FormFields.name),
    defaultValue: defaultValues?.name,
    disabled: loading,
  })
  const codeInput = createInput('code', {
    onChange: getOnChangeInputEvent(FormFields.chargecode),
    defaultValue: defaultValues?.chargecode,
    disabled: loading,
  })
  const statusInput = createInput(FormFields.status, {
    onChange: getOnChangeInputEvent(FormFields.status),
    defaultValue: defaultValues?.status,
    disabled: loading,
  })
  const descriptionInput = createInput(FormFields.description, {
    onChange: getOnChangeInputEvent(FormFields.description),
    defaultValue: defaultValues?.description,
    disabled: loading,
    rows: 3
  })

  return (
    <Dialog title={title} executor={children} ref={dialogRef}>
      <div className='project-form'>
        <div className='form'>
          {nameInput}
          {codeInput}
          {statusInput}
          {descriptionInput}
        </div>
        <div className='project-form-buttons'>
          <Stack spacing={2} direction="row">
            <Button variant="text" onClick={onClickCancel}>{cancelButtonLabel}</Button>
            <Button variant="contained" disabled={loading} onClick={onClickSave}>{confirmButtonLabel}</Button>
          </Stack>
        </div>
      </div>
    </Dialog>
  )
}