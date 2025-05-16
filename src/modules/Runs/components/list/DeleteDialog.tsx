import { Alert, AlertTitle, Button, Stack } from "@mui/material";
import { useRef, useState } from "react";
import Dialog from "../../../../common/components/Dialog";
import { DialogRef } from "../../../../common/types";
import DeleteIcon from "@mui/icons-material/Delete";
import { MiniListRuns } from "./MiniListRuns";
import { useRuns } from "../../hooks/useRuns";
import { LoadingButton } from "@mui/lab";

type Props = {
  children?: React.ReactChild;
  selectedItems: any;
};

export const DeleteDialog = ({ children, selectedItems }: Props) => {
  const dialogRef = useRef<DialogRef>();
  const { deleteSelectedRuns } = useRuns();
  const [deleting, setDeleting] = useState(false);
  
  const onClickCancel = () => {
    dialogRef.current?.hide();
  };

  const onClickConfirm = async () => {
    try {
      setDeleting(true);
      await deleteSelectedRuns(selectedItems);
    } finally {
      setDeleting(false);
      dialogRef.current?.hide();
    }
  };

  return (
    <Dialog title="Delete runs" executor={children} ref={dialogRef}>
      <div className="delete-dialog">
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          Are you sure you want to <strong>delete</strong> the following runs?
        </Alert>

        <MiniListRuns runs={selectedItems}></MiniListRuns>

        <div className="delete-dialog__action-buttons">
          <Stack spacing={2} direction="row">
            <Button disabled={deleting} variant="text" onClick={onClickCancel}>
              Cancel
            </Button>
            <LoadingButton loading={deleting} variant="contained" onClick={onClickConfirm} color="error" startIcon={<DeleteIcon />}>
              Delete
            </LoadingButton>
          </Stack>
        </div>
      </div>
    </Dialog>
  );
};
