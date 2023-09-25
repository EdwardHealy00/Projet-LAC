import {
  AppBar,
  Box,
  Button,
  Toolbar,
  alpha,
  styled,
  useTheme,
} from "@mui/material";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import "./NavBar.scss";
import Login, { LoginRef } from "../connection/Login";
import { Role } from "../../model/enum/Role";
import { UnlockAccess } from "../connection/UnlockAccess";
import logo from "../../img/logo-lac-short.png";
import { useNavigate } from "react-router-dom";

interface Props {}

export interface NavBarRef {
  SetIsLoggedIn(value: boolean): void;
}

const NavBar = forwardRef<NavBarRef, Props>((_props, ref) => {
  const navigate = useNavigate()

  useImperativeHandle(ref, () => ({
    SetIsLoggedIn(value: boolean) {
      if (loginRef.current) {
        loginRef.current.SetIsLoggedIn(value);
      }
    },
  }));

  const loginRef = useRef<LoginRef | null>(null);

  const theme = useTheme();

  const WhiteButton = styled(Button)({
    color: theme.palette.primary.contrastText,

    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.15), // Change to the desired hover color
    },
  });

  const appBarStyles = {
    backgroundColor: theme.palette.primary.main,
  };

  return (
    <div>
      {!(
        window.location.pathname === "/" ||
        window.location.pathname === "/about"
      ) && (
        <AppBar position="fixed" id="nav-bar" style={appBarStyles}>
          <Toolbar disableGutters id="toolbar">
            <a href="/"><img src={logo} alt="LAC logo" id="lac-logo"/></a>
            <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
              <WhiteButton className="navbutton" href="/catalogue">
                Catalogue
              </WhiteButton>
              <UnlockAccess
                role={[Role.Deputy, Role.ComityDirector]}
                children={
                  <WhiteButton href="/dashboard">Tableau de bord</WhiteButton>
                }
              ></UnlockAccess>
              <UnlockAccess
                role={[Role.Professor]}
                children={
                  <WhiteButton
                    className="navbutton"
                    href="/my-pending-case-studies"
                  >
                    Mes études de cas
                  </WhiteButton>
                }
              ></UnlockAccess>
              <WhiteButton className="navbutton" href="/guide">
                Guides
              </WhiteButton>
            </Box>

            <div id="loginStatus">
              <Login ref={loginRef} />
            </div>
          </Toolbar>
        </AppBar>
      )}
    </div>
  );
});

export default NavBar;
