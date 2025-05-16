import { Button } from '@mui/material';
import React, { useState } from 'react';

type Props = {
  disabled?: boolean
  defaultValue?: string
  accept?: string
  label?: string
  onChangeFile?: (file: File) => void
}

export const SourceFileUploadButton = ({ disabled, accept, onChangeFile, defaultValue, ...props }: Props) => {
  const [filename, setFilename] = useState(defaultValue);
  const label = props.label || 'Upload';


  const onChangeInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()
    event.preventDefault()
    if (!event?.target?.files || event?.target?.files?.length <= 0) return
    const file = event.target.files[0]
    setFilename(file.name)
    onChangeFile && onChangeFile(file)
  }


  return (
    <div>
      <label htmlFor="contained">
        <input style={{ display: "none" }} accept={accept} id="contained" multiple type="file" onChange={onChangeInputFile} />
        <Button component="span" variant="contained" disabled={disabled} >{label}</Button>
        {filename && <span className='upload-button__filename'>{filename}</span>}
      </label>
    </div>
  )
}