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
import { Role } from "../../model/enum/Role";
import ForgotPassword from "./ForgotPassword";

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

  const onLogout = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/api/auth/logout`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          localStorage.removeItem("name");
          localStorage.removeItem("role");
          localStorage.removeItem("email");
          window.location.reload();
        }
      });
  }

  const showRole = (role: Role | null) => {
    switch (role) {
      case Role.Admin:
        return "Administrateur";
      case Role.Student:
        return "Étudiant";
      case Role.Comity:
        return "Comité scientifique";
      case Role.Deputy:
        return "Adjoint administratif";
      case Role.Professor:
        return "Professeur";
      case Role.ProfessorNotApproved:
        return "Professeur en attente d'approbation";
      default:
        return "";
    }
  }

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
          {localStorage.getItem("name")} &nbsp;
          <span>{showRole(localStorage.getItem("role") as Role)}</span>
          <Button id="logoutButton" variant="contained" onClick={onLogout}>Déconnexion</Button>
        </div>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Se connecter</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Veuillez fournir vos identifiants pour accéder aux études de cas non publiques.
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
    </div>
  );
}
