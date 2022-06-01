import React from "react";
import '../styles/LightCaseStudy.css';
import Button from './UI-Elements/Button';
import '../img/normal_search.svg';
// import { useNavigate } from "react-router-dom";

interface Props {}

const CaseStudyWTconnection: React.FC<Props> = ({ }) => { 
    // const navigate = useNavigate();
  return (
    <div id="main">
        <Button children="Se Connecter" styleName="se-connecter" onClick={() => console.log("You clicked")}></Button>
        <div id="line"></div>
    </div>
  );
}

export default CaseStudyWTconnection;