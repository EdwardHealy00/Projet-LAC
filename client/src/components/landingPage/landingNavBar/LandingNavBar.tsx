import LandingButton from "../landingButton/LandingButton";
import React from "react";
import "./LandingNavBar.scss";
import logo from "../../../img/logo-lac.png";

const LandingNavBar = () => {
    return <div className="nav-container">
        <LandingButton onClick={()=>null} text={'À propos'}></LandingButton>
        <LandingButton onClick={()=>null} text={'Mission'}></LandingButton>
        <img src={logo} alt="LAC logo" />
        <LandingButton onClick={()=>null} text={'Équipe'}></LandingButton>
        <LandingButton onClick={()=>null} text={'Histoire'}></LandingButton>
    </div>;
};

export default LandingNavBar;
