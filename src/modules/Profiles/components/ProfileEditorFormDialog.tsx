import { Button, FormControlLabel, Radio, Stack } from '@mui/material'
import classNames from 'classnames'
import { isEmpty } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import Dialog from '../../../common/components/Dialog'
import { useFormFactory } from '../../../common/hooks/useFormFactory'
import { DialogRef } from '../../../common/types'
import { Profile } from '../types'
import { SourceFileUploadButton } from './SourceFileUploadButton'

type Props = {
  onSave: (profile: Profile, sourceFile?: File) => Promise<any>,
  onCancel?: () => void
  defaultValues?: Partial<Profile>
  children?: React.ReactChild
  disabled?: boolean
  confirmButtonLabel?: string
  cancelButtonLabel?: string
  title?: string
}

enum FormFields {
  name = 'Name',
  sourceFile = 'Sourcefile',
  formula = 'Formula',
  rule = 'Rule',
  comments = 'Comments',
}

export const ProfileEditorFormDialog = (props: Props) => {
  const { defaultValues, onCancel, onSave, children, disabled, confirmButtonLabel, title } = props
  const { createInput } = useFormFactory()
  const dialogRef = useRef<DialogRef>()
  const [typeSelected, setTypeSelected] = useState('file')
  const [uploadedFile, setUploadedFile] = useState(undefined as File | undefined)
  const [loading, setLoading] = useState(false)
  const [ profile, setProfile ] = useState<Profile>({
    Id: '',
    Comments: '',
    Formula: '',
    Name: '',
    Rule: '',
    Sourcefile: '',
    Date: '',
    ...defaultValues
  })
  
  useEffect(() => {
    setTypeSelected(isEmpty(defaultValues?.Formula) ? 'file' : 'formula')
    const editProfile: Profile = {
      Id: defaultValues?.Id || '',
      Name: defaultValues?.Name || '',
      Comments: defaultValues?.Comments || '',
      Formula: defaultValues?.Formula || '',
      Rule: defaultValues?.Rule || '',
      Sourcefile: defaultValues?.Sourcefile || '',
      Date: defaultValues?.Date || ''
    }
    setProfile(editProfile)
  }, [defaultValues])

  const onClickCancel = () => {
    dialogRef.current?.hide()
    onCancel && onCancel()
  }

  const onClickSave = async () => {
    try {
      setLoading(true)
      await onSave(profile, uploadedFile);
      setLoading(false);
      dialogRef.current?.hide();
    } catch {
      setLoading(false)
    }
  }

  const onChangeFile = (file: File) => {
    setUploadedFile(file);
  }

  const onDialogClose = () => {
    setUploadedFile(undefined);
  }

  const getOnChangeInputEvent = (formField: FormFields) => (event: React.ChangeEvent<HTMLInputElement>) => setProfile({
    ...profile,
    [formField]: event.target.value
  })

  const NameInput = createInput(FormFields.name, {
    disabled: loading,
    onChange: getOnChangeInputEvent(FormFields.name),
    defaultValue: defaultValues?.Name,
  })

  const FormulaInput = createInput(FormFields.formula, {
    disabled: isEmpty(defaultValues?.Formula) || loading,
    onChange: getOnChangeInputEvent(FormFields.formula),
    defaultValue: defaultValues?.Formula
  })
  
  const RuleInput = createInput(FormFields.rule, {
    disabled: loading,
    onChange: getOnChangeInputEvent(FormFields.rule),
    defaultValue: defaultValues?.Rule,
  })
  
  const CommentsInput = createInput(FormFields.comments, {
    disabled: loading,
    onChange: getOnChangeInputEvent(FormFields.comments),
    defaultValue: defaultValues?.Comments,
  })

  return (
    <Dialog title={title} executor={children} ref={dialogRef} disabled={disabled} onClose={onDialogClose}>
      <div className='profile-form'>
        <div className='form'>
          {NameInput}
          {RuleInput}
          {CommentsInput}
          <div className='file-formula-section formula-section'>
            <FormControlLabel disabled={isEmpty(defaultValues?.Formula)} value="formula" control={<Radio checked={typeSelected === 'formula'} />} label="Formula"/>
            <div className={classNames({ 'form-section': true, 'no-selected': typeSelected !== 'formula'})}>
              {FormulaInput}
            </div>
          </div>
          <div className='file-formula-section file-section'>
            <FormControlLabel disabled={!isEmpty(defaultValues?.Formula)} value="file" control={<Radio checked={typeSelected === 'file'} />} label="Source file"/>
            <div className={classNames({ 'form-section': true, 'no-selected': typeSelected !== 'file'})}>
              <SourceFileUploadButton disabled={!isEmpty(defaultValues?.Formula) || loading} accept='.csv' label='Upload source file' defaultValue={defaultValues?.Sourcefile} onChangeFile={onChangeFile}/>
            </div>
          </div>
        </div>
        <div className='profile-form-buttons'>
          <Stack spacing={2} direction="row">
            <Button variant="text" onClick={onClickCancel}>Cancel</Button>
            <Button variant="contained" disabled={loading} onClick={onClickSave}>{confirmButtonLabel}</Button>
          </Stack>
        </div>
      </div>
    </Dialog>
  )
}