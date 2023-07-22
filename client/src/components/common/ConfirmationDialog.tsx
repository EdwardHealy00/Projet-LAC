import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import React, { useState } from 'react';

interface ConfirmationDialogProps {
    open: boolean;
    text: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, text, onConfirm, onCancel }) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>{text}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};