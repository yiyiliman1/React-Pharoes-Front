import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

type Props = {
  title?: string
  executor?: React.ReactChild
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false | string
  fullWidth?: boolean
  className?: string
  children?: React.ReactChild | React.ReactChild[]
  actions?: React.ReactChild
  disabled?: boolean
  onOpen?: () => void
  onClose?: () => void
  rawFilters?: any
  nullifyFilters?: () => void
}


export default forwardRef(({ executor, title, children, actions, maxWidth, fullWidth, onOpen, onClose, rawFilters, nullifyFilters, ...props }: Props, ref) => {
  const disabled = props.disabled || false
  const className = props.className || ''

  const [open, setOpen] = React.useState(false)

  const onClickExecutor = () => {
    const executorDisabled = (executor as any)?.props?.disabled === true;
    if (disabled || executorDisabled) return
    setOpen(true)
    onOpen && onOpen()
  }

  const onCloseDialog = () => {
    setOpen(false)
    onClose && onClose()
    if (nullifyFilters && rawFilters && !Object.keys(rawFilters)?.length) {
      nullifyFilters();
    }
  }

  useImperativeHandle(ref, () => ({
    show: () => setOpen(true),
    hide: () => setOpen(false),
  }));

  const newExecutorComponent = () => {
    if (executor) {
     return React.cloneElement(executor, {
       open, rawFilters
     });
    }
    return null
  }

  const executorComponent = newExecutorComponent()
  const titleComponent = title && (<DialogTitle>{title}</DialogTitle>)
  const actionsComponent = actions && (<DialogActions>{actions}</DialogActions>)

  return (
    <div>
      <div className='executor' onClick={onClickExecutor}>
        {executorComponent}
      </div>
      <Dialog open={open} onClose={onCloseDialog} fullWidth={fullWidth ?? true} maxWidth='md'>
        {titleComponent}
        <DialogContent>
          <div className={className}>
            {children}
          </div>
        </DialogContent>
        {actionsComponent}
      </Dialog>
    </div>
  )
})