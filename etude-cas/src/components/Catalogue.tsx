import React from "react";
import '../styles/LightCatalogue.css';
import Button from './Button';

interface Props {}

const Catalogue: React.FC<Props> = ({ }) => { 
  return (
    <div className="main">
    <Button children="Se Connecter" styleName="se-connecter" onClick={() => console.log("You clicked")}></Button>
    <div className="line" >
    <div id="rectangle">
        <div id="catalogue-des-cas">Catalogue des cas</div>
        <input id="predictive-search"></input>
        <svg id="search"></svg>
    </div>
    <Button children="Consulter" styleName="consulter" onClick={() => console.log("You clicked")}></Button>
    </div>
    
    </div>
  );
}

export default Catalogue;