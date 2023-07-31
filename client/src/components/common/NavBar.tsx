import { Button, ButtonGroup } from "@mui/material";
import React, { useCallback } from "react";
import "./NavBar.scss";
import Login from "../connection/Login";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { Role } from "../../model/enum/Role";
import { UnlockAccess } from "../connection/UnlockAccess";

interface Props {}

const NavBar: React.FC<Props> = ({}) => {
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
            role={[Role.Deputy, Role.Comity, Role.PolyPress]}
            children={<Button href="/dashboard">Tableau de bord</Button>}
        ></UnlockAccess>
        <UnlockAccess
            role={[Role.Professor]}
            children={<Button className="navbutton" href="/my-pending-case-studies">Mes études de cas</Button>}
        ></UnlockAccess>
        <Button className="navbutton" href="/guide">Guides</Button>
        <span>
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
            <MenuItem onClick={navigateTeam}>Équipe</MenuItem>
            <MenuItem onClick={navigateCreation}>Création du LAC</MenuItem>
          </Menu>
        </span>
      </div>
      <div id="loginStatus">
        <Login />
      </div>
    </div>
  );
};

export default NavBar;
