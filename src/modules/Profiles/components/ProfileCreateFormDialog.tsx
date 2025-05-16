import { Button, Stack } from '@mui/material'
import { useRef, useState } from 'react'
import Dialog from '../../../common/components/Dialog'
import { useFormFactory } from '../../../common/hooks/useFormFactory'
import { DialogRef } from '../../../common/types'
import { Profile } from '../types'

type Props = {
  onSave: (profile: Profile) => Promise<any>,
  onCancel?: () => void
  defaultValues?: Partial<Profile>
  children?: React.ReactChild
}

enum FormFields {
  name = 'Name',
  sourceFile = 'Sourcefile',
  formula = 'Formula',
  rule = 'Rule',
  comments = 'Comments',
}

const DEFAULT_PROFILE: Profile = {
  Id: '',
  Comments: '',
  Formula: '',
  Name: '',
  Rule: '',
  Sourcefile: '',
  Date: ''
  
}

export const ProfileCreateFormDialog = (props: Props) => {
  const { defaultValues, onCancel, onSave, children } = props
  const { createInput } = useFormFactory()
  const dialogRef = useRef<DialogRef>()
  const [loading, setLoading] = useState(false)
  const [ profile, setProfile ] = useState<Profile>(DEFAULT_PROFILE)
  
  const onClickCancel = () => {
    dialogRef.current?.hide()
    onCancel && onCancel()
  }

  const onClickSave = async () => {
    try {
      setLoading(true);
      await onSave(profile);
      setLoading(false);
      dialogRef.current?.hide();
    } catch {
      setLoading(false);
    }
  }

  const getOnChangeInputEvent = (formField: FormFields) => (event: React.ChangeEvent<HTMLInputElement>) => setProfile({
    ...profile,
    [formField]: event.target.value
  })
  

  const NameInput = createInput(FormFields.name, {
    onChange: getOnChangeInputEvent(FormFields.name),
    defaultValue: defaultValues?.Name,
    disabled: loading
  })

  const FormulaInput = createInput(FormFields.formula, {
    onChange: getOnChangeInputEvent(FormFields.formula),
    defaultValue: defaultValues?.Name,
    disabled: loading
  })
  
  const RuleInput = createInput(FormFields.rule, {
    onChange: getOnChangeInputEvent(FormFields.rule),
    defaultValue: defaultValues?.Name,
    disabled: loading
  })
  
  const CommentsInput = createInput(FormFields.comments, {
    onChange: getOnChangeInputEvent(FormFields.comments),
    defaultValue: defaultValues?.Name,
    disabled: loading
  })

  return (
    <Dialog title='Create formula' executor={children} ref={dialogRef}>
      <div className='profile-form'>
        <div className='form'>
          {NameInput}
          {FormulaInput}
          {RuleInput}
          {CommentsInput}
        </div>
        <div className='profile-form-buttons'>
          <Stack spacing={2} direction="row">
            <Button variant="text" onClick={onClickCancel}>Cancel</Button>
            <Button variant="contained" disabled={loading} onClick={onClickSave}>Create</Button>
          </Stack>
        </div>
      </div>
    </Dialog>
  )
}