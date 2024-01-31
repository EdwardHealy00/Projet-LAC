import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Button from "@mui/material/Button";
import "./Login.scss";
import axios from "axios";
import { Role } from "../../model/enum/Role";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import { Typography } from "@mui/material";
import ResubmitProofPopup, { ResubmitProofPopupRef } from "./ResubmitProofPopup";

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
  const resubmitProofPopupRef = useRef<ResubmitProofPopupRef | null>(null);
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("logged_in"))
  );
  const [hasToResubmitProof, setHasToResubmitProof] = useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/api/users/me`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          const user = res.data.data.user;
          const hasToResubmit = user.role === Role.ProfessorNotApproved && !user.proof;
          setHasToResubmitProof(hasToResubmit);
        }
      });
  }

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
          localStorage.removeItem("logged_in");
          setLoggedIn(false);
          navigate("/catalogue");
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
        return "Enseignant";
      case Role.ProfessorNotApproved:
        return "Enseignant en attente d'approbation";
      default:
        return "";
    }
  };

  const openPopup = () => {
    if (appContext) {
      appContext.openLogInPopup();
    }
  };

  const openResubmitProofPopup = () => {
    if(resubmitProofPopupRef.current) {
      resubmitProofPopupRef.current.setPopupOpen();
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
          {hasToResubmitProof && (
            <div id="resubmitInfo">
              <Button
                id="resubmitButton"
                variant="contained"
                color="warning"
                onClick={openResubmitProofPopup}
              >
                Resoumettre une preuve
              </Button>
            </div>
          )}
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
      <ResubmitProofPopup ref={resubmitProofPopupRef}/>
    </div>
  );
});

export default Login;

