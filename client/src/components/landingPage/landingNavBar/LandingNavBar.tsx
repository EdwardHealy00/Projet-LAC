import LandingButton from "../landingButton/LandingButton";
import React, {useRef} from "react";
import "./LandingNavBar.scss";
import logo from "../../../img/logo-lac.png";
import Login, {LoginRef} from "../../connection/Login";

const LandingNavBar = () => {

    return <div className="nav-container">
        <img src={logo} alt="LAC logo" />
        <LandingButton onClick={()=> { // @ts-ignore
            document.getElementById("a-propos").scrollIntoView({alignToTop:true, behavior: "smooth"});}} text={'À propos'}></LandingButton>
        <LandingButton onClick={()=>{ // @ts-ignore
            document.getElementById("mission").scrollIntoView({alignToTop:true, behavior: "smooth"});}} text={'Mission'}></LandingButton>

        <LandingButton onClick={()=>{ // @ts-ignore
            document.getElementById("equipe").scrollIntoView({alignToTop:true, behavior: "smooth"});}} text={'Équipe'}></LandingButton>
        <LandingButton onClick={()=>{ // @ts-ignore
            document.getElementById("histoire").scrollIntoView({alignToTop:true, behavior: "smooth"});}} text={'Histoire'}></LandingButton>

      </div>;
};

export default LandingNavBar;
