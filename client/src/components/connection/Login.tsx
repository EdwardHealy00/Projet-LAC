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
import Register from "./Register";
import { UserLogin } from "../../model/User";
import axios from "axios";
import Cookies from "js-cookie";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Role } from "../../model/Role";

export default function Login() {
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<UserLogin>({
    email: "",
    password: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

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
    //console.log(e.target.elements.firstName.value);
    const user: UserLogin = {
      email: e.target.elements.email.value,
      password: e.target.elements.password.value,
    };
    sendLoginForm(user);
  };

  const sendLoginForm = (user: UserLogin) => {
    axios
      .post("http://localhost:3001/api/auth/login", user, {
        withCredentials: true,
      }
      )
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          handleClose();
          const role: Role = Role[res.data.role as keyof typeof Role]; 
          localStorage.setItem("name", res.data.name);
          localStorage.setItem("role", role);
        }
      });
  };

  return (
    <div>
      {!Cookies.get("logged_in") && (
        <Button id="loginButton" variant="contained" onClick={handleClickOpen}>
          Se connecter
        </Button>
      )}
      {Cookies.get("logged_in") && (
        <div>
          <AccountCircle sx={{ verticalAlign: "middle", fontSize: "32px" }} />
          {localStorage.getItem("name")}
        </div>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Se connecter</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
              autoFocus
              margin="dense"
              id="password"
              label="Mot de passe"
              type="password"
              fullWidth
              variant="outlined"
              name="password"
            />
            <FormControlLabel control={<Checkbox />} label="Mémoriser" />

            <a>Mot de passe oublié?</a>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button variant="contained" type="submit" form="loginForm">
            Valider
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
