import FileUploadIcon from '@mui/icons-material/FileUpload'
import React, { useRef } from 'react'
import { ButtonBase } from './ButtonBase'

type Props = {
  tooltip?: string
  disabled?: boolean
  onChange?: (files: File[]) => void
  resetAfterFire?: boolean
  accept: string
}

export const UploadButton = ({ tooltip, disabled, onChange, accept, resetAfterFire }: Props) => {
  const finalTooltip = tooltip || 'Upload'
  const inputRef = useRef<HTMLInputElement>(null)
  const shouldResetAfterFire = resetAfterFire ?? false;

  const onUploadInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    onChange?.(Array.from(event.target.files));
    if (shouldResetAfterFire && !!inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <label htmlFor="contained-button-file">
      <input ref={inputRef}
        disabled={disabled}
        style={{ display: "none" }}
        accept={accept}
        id="contained-button-file"
        multiple
        type="file"
        onInput={onUploadInput}>
      </input>
      <ButtonBase disabled={disabled} tooltip={finalTooltip}>
        <FileUploadIcon sx={{ fontSize: 17 }} />
      </ButtonBase>
    </label>
  )
}