import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";
import ForgotPassword from "./ForgotPassword";
import Register from "./Register";
import axios from "axios";
import { UserLogin } from "../../model/User";
import React, { forwardRef, useImperativeHandle } from "react";

export interface LoginPopupRef {
    setPopupOpen(): void;
  }

const LoginPopup = forwardRef<LoginPopupRef>(
    (props, ref) => {

    useImperativeHandle(ref, () => ({
        setPopupOpen() {
            setOpen(true);
        }
    }));

    const [open, setOpen] = React.useState(false);
    const [state, setState] = React.useState<UserLogin>({
      email: "",
      password: "",
    });

    const handleClose = () => {
        setOpen(false);
      };
    
      const handleInputChange = (
        e:
          | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        setState({ ...state, [name]: value });
      };
    
      const handleSubmit = (e: any) => {
        e.preventDefault();
        const user: UserLogin = {
          email: e.target.elements.email.value,
          password: e.target.elements.password.value,
        };
        sendLoginForm(user);
      };
    
      const sendLoginForm = (user: UserLogin) => {
        axios
          .post(`${process.env.REACT_APP_BASE_API_URL}/api/auth/login`, user, {
            withCredentials: true,
          })
          .then((res) => {
            if (res.status === 200) {
              handleClose();
              localStorage.setItem("name", res.data.name);
              localStorage.setItem("role", res.data.role);
              localStorage.setItem("email", res.data.email);
              window.location.reload();
            }
          });
      };
      
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Se connecter</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Veuillez fournir vos identifiants pour accéder aux études de cas non
          publiques.
        </DialogContentText>
        <Register />

        <form id="loginForm" onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Identifiant"
            type="email"
            fullWidth
            variant="outlined"
            name="email"
          />
          <TextField
            margin="dense"
            id="password"
            label="Mot de passe"
            type="password"
            fullWidth
            variant="outlined"
            name="password"
          />
          {/* <FormControlLabel control={<Checkbox />} label="Mémoriser" /> */}

          <ForgotPassword />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button variant="contained" type="submit" form="loginForm">
          Valider
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default LoginPopup;

