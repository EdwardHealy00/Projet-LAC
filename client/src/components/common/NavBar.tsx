import { Button, ButtonGroup } from "@mui/material";
import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import "./NavBar.scss";
import Login, { LoginRef } from "../connection/Login";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { Role } from "../../model/enum/Role";
import { UnlockAccess } from "../connection/UnlockAccess";

interface Props {}

export interface NavBarRef {
  SetIsLoggedIn(value: boolean): void;
}

const NavBar = forwardRef<NavBarRef, Props>(
  (_props, ref) => {
  useImperativeHandle(ref, () => ({
    SetIsLoggedIn(value: boolean) {
      if(loginRef.current) {
        loginRef.current.SetIsLoggedIn(value);
      }
    },
  }));
  
  const loginRef = useRef<LoginRef | null>(null);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const navigateSummary = useCallback(() => {
    navigate("/summary");
    handleClose();
  }, [navigate]);

  const navigateMission = useCallback(() => {
    navigate("/mission");
    handleClose();
  }, [navigate]);

  const navigateTeam = useCallback(() => {
    navigate("/team");
    handleClose();
  }, [navigate]);

  const navigateCreation = useCallback(() => {
    navigate("/creation");
    handleClose();
  }, [navigate]);

  return (
    <div id="navbar">
      <div id="profile">
        <Button className="navbutton" href="/catalogue">Catalogue</Button>
        <UnlockAccess
            role={[Role.Deputy, Role.ComityDirector]}
            children={<Button href="/dashboard">Tableau de bord</Button>}
        ></UnlockAccess>
        <UnlockAccess
            role={[Role.Professor]}
            children={<Button className="navbutton" href="/my-pending-case-studies">Mes études de cas</Button>}
        ></UnlockAccess>
        <Button className="navbutton" href="/guide">Guides</Button>
      </div>
      <div id="loginStatus">
        <Login ref={loginRef}/>
      </div>
    </div>
  );
});

export default NavBar;
