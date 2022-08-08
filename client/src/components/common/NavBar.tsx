import { Button, ButtonGroup } from "@mui/material";
import React, { useCallback } from "react";
import './NavBar.scss';
import Login from "../connection/Login";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";

interface Props { }

const NavBar: React.FC<Props> = ({ }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const navigate = useNavigate();
    const navigateSummary = useCallback(() => navigate("/summary"), [
       navigate,
    ]);
    const navigateMission = useCallback(() => navigate("/mission"), [
        navigate,
    ]);

    return (
      <div id="navbar">
        <div id="profile">
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button href="/catalogue">Catalogue</Button>
            <Button href="/dashboard">Tableau de board</Button>
            <div>
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleOpen}
              >
                À propos
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={navigateSummary}>Sommaire</MenuItem>
                <MenuItem onClick={navigateMission}>
                  Mission, vision et objectifs
                </MenuItem>
                <MenuItem onClick={handleClose}>Équipe</MenuItem>
                <MenuItem onClick={handleClose}>Création du LAC</MenuItem>
              </Menu>
            </div>
          </ButtonGroup>
        </div>
        <div id="loginStatus">
          <Login />
        </div>
      </div>
    );
}

export default NavBar;

