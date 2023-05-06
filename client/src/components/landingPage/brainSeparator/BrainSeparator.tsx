import React from "react";
import "./BrainSeparator.scss";
import BrainSVG from "../../../img/brain.svg";
import ArrowSVG from "../../../img/arrow_down.svg";

const BrainSeparator = () => {
  return <div className="separator-container">
      <img className="brain" src={BrainSVG} alt="Brain image separator"></img>
      <img className="arrow" src={ArrowSVG} alt="Down arrow"></img>
      <div className="all-length-red"></div>
      <div className="all-length-orange"></div>
      <div className="all-length-green"></div>
      <div className="all-length-blue"></div>
  </div>
};

export default BrainSeparator;
