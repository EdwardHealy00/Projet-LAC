import { AccountCircle } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import '../../styles/NavBar.scss';
import Login from "../connection/Login";
import Register from "../connection/Register";

interface Props { }

const NavBar: React.FC<Props> = ({ }) => {
    return (
        <div id="profile">
            {/* <Button variant="contained" onClick={() => console.log("You clicked")}>
                Se Connecter
            </Button> */}
            {/* <Login /> */}
            <Register />
        </div>
        // <div id="profile">
        //      <AccountCircle sx={{ verticalAlign: "middle", fontSize: "32px" }} />
        //         Professeur
        // </div>
    );
}

export default NavBar;

