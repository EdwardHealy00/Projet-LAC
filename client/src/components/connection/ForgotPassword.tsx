import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { Typography } from "@mui/material";

export default function ForgotPassword() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleForgotPassword = () => {
    sendForgotPasswordForm(email);
  };

  const sendForgotPasswordForm = (email: string) => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_API_URL}/api/auth/forgot-password`,
        {
          email: email,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <a href="#" onClick={handleClickOpen}>
        <Typography>Mot de passe oublié?</Typography>
      </a>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle><Typography variant="h4">Mot de passe oublié</Typography></DialogTitle>
        <DialogContent>
          <DialogContentText>
            Entrez votre adresse courriel pour réinitialiser votre mot de passe.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Adresse courriel"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleForgotPassword}>Réinitialiser</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
