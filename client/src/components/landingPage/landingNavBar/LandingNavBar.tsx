import LandingButton from "../landingButton/LandingButton";
import React from "react";
import "./LandingNavBar.scss";
import logo from "../../../img/logo-lac.png";

const LandingNavBar = () => {
    return <div className="nav-container">
        <LandingButton onClick={()=> { // @ts-ignore
            document.getElementById("a-propos").scrollIntoView({alignToTop:true, behavior: "smooth"});}} text={'À propos'}></LandingButton>
        <img src={logo} alt="LAC logo" />
        <LandingButton onClick={()=>{ // @ts-ignore
            document.getElementById("mission").scrollIntoView({alignToTop:true, behavior: "smooth"});}} text={'Mission'}></LandingButton>
        {/*
        <LandingButton onClick={()=>null} text={'Équipe'}></LandingButton>
        <LandingButton onClick={()=>null} text={'Histoire'}></LandingButton>
*/}    </div>;
};

export default LandingNavBar;
