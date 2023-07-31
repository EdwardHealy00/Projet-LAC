import React, { useRef } from 'react';
import Button from "@mui/material/Button";
import "./Login.scss";
import axios from "axios";
import Cookies from "js-cookie";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Role } from "../../model/enum/Role";
import LoginPopup, { LoginPopupRef } from "./LoginPopup";

export default function Login() {
  const loginPopupRef = useRef<LoginPopupRef | null>(null);
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

  const openPopup = () => {
    if (loginPopupRef.current) {
      loginPopupRef.current.setPopupOpen();
    }
  };

  return (
    <div>
      {!Cookies.get("logged_in") && (
        <Button id="loginButton" variant="contained" onClick={openPopup}>
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
      <LoginPopup ref={loginPopupRef}/>
    </div>
  );
}
