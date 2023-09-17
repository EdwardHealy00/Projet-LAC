import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import Button from "@mui/material/Button";
import "./Login.scss";
import axios from "axios";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Role } from "../../model/enum/Role";
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

export interface Props{}
export interface LoginRef {
  SetIsLoggedIn(value: boolean): void;
}

const Login = forwardRef<LoginRef, Props>(
  (props, ref) => {
    useImperativeHandle(ref, () => ({
      SetIsLoggedIn(value: boolean) {
        setLoggedIn(value);
      },
    }));

  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('logged_in')));

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
          navigate('/');
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
  }

  const openPopup = () => {
    if(appContext) {
      appContext.openLogInPopup();
    }
  };

  return (
    <div>
      {!loggedIn && (
        <Button id="loginButton" variant="contained" onClick={openPopup}>
          {window.location.pathname === '/' ? "Accéder à la plateforme" : "Se connecter"}
        </Button>
      )}
      {loggedIn && (
        <div>
          <AccountCircle sx={{ verticalAlign: "middle", fontSize: "32px" }} />
          {localStorage.getItem("name")} &nbsp;
          <span>{showRole(localStorage.getItem("role") as Role)}</span>
          <Button id="logoutButton" variant="contained" onClick={onLogout}>Déconnexion</Button>
        </div>
      )}
    </div>
  );
})

export default Login;