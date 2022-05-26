import React from "react";
import '../styles/LightCatalogue.css';
import Button from './UI-Elements/Button';
import '../img/normal_search.svg';
import SearchIcon from "./UI-Elements/SearchIcon";
import DropDown from "./UI-Elements/Dropdown";

interface Props {}

const Catalogue: React.FC<Props> = ({ }) => { 
  return (
    <div id="main">
        <Button children="Se Connecter" styleName="se-connecter" onClick={() => console.log("You clicked")}></Button>
                <div id="content">
                    <div id="rectangle">
                        <div id="catalogue-des-cas">Catalogue des cas</div>
                        <div id="searchField">
                            <SearchIcon></SearchIcon>
                            <input id="predictive-search" placeholder="Rechercher dans le catalogue"></input>
                        </div>
                    </div>
                    <div id="smallRectangle">
                        <div id="type-de-contenu">Type de contenu :</div>
                            {/* TODO: insert div for tags here */}
                        <div id="effacer-tous-les-fil">Effacer tous les filtres</div>
                    </div>
                    <div id="smallRectangle"> 
                        <div id="filtrer-par">Filtrer par</div>
                    </div>
                    <div>
                        <div id="rectangleFilter">
{/* add dropdowns */}
                            <DropDown children="DISCIPLINE" onClick={() => console.log("You clicked")} ></DropDown>
                            <DropDown children="SUJET" onClick={() => console.log("You clicked")} ></DropDown>
                            <DropDown children="DATE DE PARUTION" onClick={() => console.log("You clicked")} ></DropDown>
                            <DropDown children="NOMBRE DE PAGES" onClick={() => console.log("You clicked")} ></DropDown>
                            <DropDown children="AUTEUR" onClick={() => console.log("You clicked")} ></DropDown>
                        </div>
                    </div>
                </div>
                
                
        {/* <Button children="Consulter" styleName="consulter" onClick={() => console.log("You clicked")}></Button> */}
    </div>
  );
}

export default Catalogue;