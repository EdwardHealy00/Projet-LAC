import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./Login.scss";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function Login() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button id="loginButton" variant="contained" onClick={handleClickOpen}>
        Se connecter
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Se connecter</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </DialogContentText>
          <a href="https://www.google.com">Vous n'avez pas de compte?</a>
          <form id="loginForm">
            <TextField
              autoFocus
              margin="dense"
              id="username"
              label="Identifiant"
              type="email"
              fullWidth
              variant="outlined"
            />
            <TextField
              autoFocus
              margin="dense"
              id="password"
              label="Mot de passe"
              type="password"
              fullWidth
              variant="outlined"
            />
            <FormControlLabel control={<Checkbox />} label="Mémoriser" />

            <a href="https://www.google.com">Mot de passe oublié?</a>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button variant="contained" onClick={handleClose}>
            Valider
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
