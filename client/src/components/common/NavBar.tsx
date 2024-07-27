import {
  AppBar,
  Box,
  Button,
  Toolbar,
  alpha,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import "./NavBar.scss";
import Login, { LoginRef } from "../connection/Login";
import { Role } from "../../model/enum/Role";
import { UnlockAccess } from "../connection/UnlockAccess";
import logo from "../../img/logo-lac-short.png";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {}

export interface NavBarRef {
  SetIsLoggedIn(value: boolean): void;
}

const NavBar = forwardRef<NavBarRef, Props>((_props, ref) => {
  const location = useLocation();
  const theme = useTheme();

  useImperativeHandle(ref, () => ({
    SetIsLoggedIn(value: boolean) {
      if (loginRef.current) {
        loginRef.current.SetIsLoggedIn(value);
      }
    },
  }));

  const loginRef = useRef<LoginRef | null>(null);

  const WhiteButton = styled(Button)(({ href }: { href: string }) => ({
    color: theme.palette.primary.contrastText,
    backgroundColor: isPageSelected(window.location.pathname, href) ? alpha(theme.palette.common.white, 0.10) : 'transparent',

    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.15), // Change to the desired hover color
    },
  }));

  const isPageSelected = (pathname: string, buttonPath: string) => {
    if (buttonPath === "/dashboard") {
      return pathname === buttonPath || pathname === "/approval/paid" || pathname === "/approval/free";
    }
    return pathname === buttonPath;
  }

  const appBarStyles = {
    backgroundColor: theme.palette.primary.main,
  };

  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <div>
      {!(
        window.location.pathname === "/" ||
        window.location.pathname === "/about"
      ) && (
        <AppBar position="fixed" id="nav-bar" style={appBarStyles}>
          <Toolbar disableGutters id="toolbar">
            <a href="/"><img src={logo} alt="LAC logo" id="lac-logo"/></a>

            {
              (window.location.pathname !== "/catalogue" || isLargeScreen) && 
              <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
              <WhiteButton className="navbutton" href="/catalogue">
                Catalogue
              </WhiteButton>
              <UnlockAccess
                role={[Role.Deputy, Role.ComityDirector, Role.Comity]}
                children={
                  <WhiteButton href="/dashboard">Tableau de bord</WhiteButton>
                }
              ></UnlockAccess>
              <UnlockAccess
                role={[Role.Professor]}
                children={
                  <WhiteButton
                    className="navbutton"
                    href="/my-pending-case-studies/paid"
                  >
                    Mes études de cas
                  </WhiteButton>
                }
              ></UnlockAccess>
              <WhiteButton className="navbutton" href="/guide">
                Guides
              </WhiteButton>
            </Box>
            }
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
