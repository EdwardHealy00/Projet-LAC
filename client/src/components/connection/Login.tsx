import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useState,
} from "react";
import Button from "@mui/material/Button";
import "./Login.scss";
import axios from "axios";
import { Role } from "../../model/enum/Role";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import Cookies from "js-cookie";
import { Typography, alpha, styled, useTheme } from "@mui/material";

export interface Props {}
export interface LoginRef {
  SetIsLoggedIn(value: boolean): void;
}

const Login = forwardRef<LoginRef, Props>((props, ref) => {
  useImperativeHandle(ref, () => ({
    SetIsLoggedIn(value: boolean) {
      setLoggedIn(value);
    },
  }));

  const appContext = useContext(AppContext);
  const [loggedIn, setLoggedIn] = useState(Boolean(Cookies.get("logged_in")));

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
          setLoggedIn(false);
          window.location.reload();
        }
      });
  };

  const showRole = (role: Role | null) => {
    switch (role) {
      case Role.Admin:
        return "Administrateur";
      case Role.Student:
        return "Étudiant";
      case Role.Comity:
        return "Comité scientifique";
      case Role.ComityDirector:
        return "Directrice du comité scientifique";
      case Role.Deputy:
        return "Adjoint administratif";
      case Role.Professor:
        return "Professeur";
      case Role.ProfessorNotApproved:
        return "Professeur en attente d'approbation";
      default:
        return "";
    }
  };

  const openPopup = () => {
    if (appContext) {
      appContext.openLogInPopup();
    }
  };

  return (
    <div>
      {!loggedIn && (
        <div id="login">
          <div id="loginInfo">
            <Button id="loginButton" variant="contained" onClick={openPopup}>
              Se connecter
            </Button>
          </div>
        </div>
      )}
      {loggedIn && (
        <div id="login">
          <div id="loginInfo">
            <Typography variant="body1">
              Bienvenue, <b>{localStorage.getItem("name")}</b>
            </Typography>
            <Typography variant="caption">
              {showRole(localStorage.getItem("role") as Role)}
            </Typography>
          </div>
          <Button
            id="logoutButton"
            variant="contained"
            color="error"
            onClick={onLogout}
          >
            Déconnexion
          </Button>
        </div>
      )}
    </div>
  );
});

export default Login;
