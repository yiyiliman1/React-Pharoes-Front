import { Button, Dialog, DialogContent, DialogContentText } from "@mui/material";
import { forwardRef, useImperativeHandle, useState } from "react"
import { DialogActions, DialogTitle } from "@material-ui/core";
import { LoadingButton } from "@mui/lab";

interface Props {
  onConfirm?: () => Promise<void>,
  onCancel?: () => Promise<void>,
  children?: React.ReactChild | never[],
  confirmText?: string,
  cancelText?: string,
  type?: "error" | "warning" | "success"
  title: string,
  message: string | JSX.Element,
  disabled?: boolean;
}

export default forwardRef((props: Props, ref) => {
  const [canceling, setCanceling] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    show: () => setOpen(true),
    hide: () => setOpen(false),
  }));

  const onClickExecutor = () => {
    if (!props.children || (Array.isArray(props.children) && props.children.length === 0)) return;
    const executor = props.children as any;
    const executorDisabled = executor?.props?.disabled === true;
    if (props.disabled || executorDisabled) return;
    setOpen(true);
  }

  const onConfirmClick = async () => {
    try {
      setConfirming(true);
      await props.onConfirm?.();
      setConfirming(false);
      setOpen(false);
    } catch (error) {
      setConfirming(false);
    }
  }
  
  const onCancelClick = async () => {
    try {
      setCanceling(true);
      await props.onCancel?.();
      setCanceling(false);
      setOpen(false);
    } catch (error) {
      setCanceling(false);
    }
  }

  const onClose = (event: object, reason: string) => {
    setOpen(false);
  }

  const ExecutorSection = () => {
    if (!!props.children) {
      return (<div className='executor' onClick={onClickExecutor}>{ props.children }</div>); 
    } else {
      return (<></>)
    }
  }

  return (
    <div>
      <ExecutorSection />
      <Dialog
        onClose={onClose}
        open={open}
        fullWidth={false}>
        <DialogTitle>{ props.title }</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            disabled={canceling || confirming}
            variant="text"
            onClick={onCancelClick}>
            <span>{props.cancelText || 'Cancel'}</span>
          </Button>
          <LoadingButton
            disableElevation
            loading={confirming}
            disabled={canceling}
            size="small"
            variant="contained"
            onClick={onConfirmClick}
            color={props.type || 'primary'}>
            <span>{props.confirmText || 'Confirm'}</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  )
})
