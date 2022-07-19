import { AccountCircle } from "@mui/icons-material";
import { Button, ButtonGroup } from "@mui/material";
import React from "react";
import '../../styles/NavBar.scss';
import Login from "../connection/Login";
import Register from "../connection/Register";

interface Props { }

const NavBar: React.FC<Props> = ({ }) => {
    return (
      <div id="profile">
        {/* <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button>Catalogue</Button>
          <Button>Dashboard</Button>
          <Button>À propos</Button>
        </ButtonGroup> */}
        <Login />
      </div>
    );
}

export default NavBar;

