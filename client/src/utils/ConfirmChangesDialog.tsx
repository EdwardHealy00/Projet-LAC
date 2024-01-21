import React, { FC } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface ConfirmChangesDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (e: any) => void;
}

const ConfirmChangesDialog: FC<ConfirmChangesDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const handleConfirm = (e: any) => {
    console.log(e)
    onConfirm(e);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h4">Attention !</Typography>
      </DialogTitle>
      <DialogContent>
        Cette action est irréversible. Êtes-vous certain de vouloir confirmer
        les changements?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Annuler
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmChangesDialog;