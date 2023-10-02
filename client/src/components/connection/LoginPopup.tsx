import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Typography } from "@mui/material";
import ForgotPassword from "./ForgotPassword";
import Register from "./Register";
import axios from "axios";
import { UserLogin } from "../../model/User";
import React, { forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";

export interface Props {
  onLoggedIn?: () => void;
}
export interface LoginPopupRef {
    setPopupOpen(): void;
}

const LoginPopup = forwardRef<LoginPopupRef, Props>(
    (props, ref) => {

    useImperativeHandle(ref, () => ({
        setPopupOpen() {
            setOpen(true);
        }
    }));

    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleCancel = () => {
      if(location.pathname != '/' && location.pathname != '/about') {
        navigate('/catalogue'); 
      } else {
        navigate('/'); 
      }
      
      handleClose();
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

          const hasExpired = localStorage.getItem("email") == res.data.email;
          localStorage.setItem("name", res.data.name);
          localStorage.setItem("role", res.data.role);
          localStorage.setItem("email", res.data.email);
          if(!hasExpired){
            window.location.reload(); // User logged in from landing page
          } else if(props.onLoggedIn){
            props.onLoggedIn(); // Refresh only Login/Logout button to not lose changes
          } 
        }
      }).catch((err) => {
        console.log(err);
      });
  };
      
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle><Typography variant="h4">Se connecter</Typography></DialogTitle>
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
        <Button onClick={handleCancel}>Annuler</Button>
        <Button variant="contained" type="submit" form="loginForm">
          Valider
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default LoginPopup;

