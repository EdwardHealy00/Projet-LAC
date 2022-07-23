import { Button, ButtonGroup } from "@mui/material";
import React from "react";
import './NavBar.scss';
import Login from "../connection/Login";

interface Props { }

const NavBar: React.FC<Props> = ({ }) => {
  
    return (
      <div id="navbar">
        <div id="profile">
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button href="/catalogue">Catalogue</Button>
            <Button href="/dashboard">Tableau de board</Button>
            <Button>À propos</Button>
          </ButtonGroup>
        </div>
        <div id="loginStatus">
          <Login />
        </div>
      </div>
    );
}

export default NavBar;

