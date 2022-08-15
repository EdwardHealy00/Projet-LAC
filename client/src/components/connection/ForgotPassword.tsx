import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";

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
        "http://localhost:3001/api/auth/forgot-password",
        {
          email: email,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <a href="#" onClick={handleClickOpen}>
        Mot de passe oublié?
      </a>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Mot de passe oublié</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Entrez votre adresse e-mail pour réinitialiser votre mot de passe.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
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
