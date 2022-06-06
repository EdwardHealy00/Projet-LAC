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
        <Button children="> Retour au catalogue" styleName="return" onClick={() => console.log("You clicked")}></Button>
        <div id="part">
          <div id="top-part">
            <div id="first">
              <div id="title">
                Littéralement en changement
              </div>
              {/* <div id="title"> TODO
                L’impact de la COVID-19 sur l’écosystème littéraire québécois
              </div> */}
              <div id="information">Au début de l’année 2020, la pandémie de la COVID-19 a frappé de plein fouet le milieu littéraire. Fragilisé, l’écosystème littéraire a subi une énième vague de transformation. Les bibliothèques ont fermé. Les salons du livre, les lancements et les événements culturels ont été reportés ou carrément annulés. Les retards de paiement des éditeurs s’accumulent. Le droit de représentation empêche bon nombre d’auteurs et d’autrices de présenter leurs livres, même virtuellement. L’industrie du livre est-elle en crise?</div>
            </div>
            <div id="second">
              <div>Auteurs : Virginie Francoeur, Annie Passalacqua</div>
              <div>Discipline : Génie industriel</div>
              <div>Sujet(s) : Gestion du changement</div>
              <div>Nombre de pages : 9</div>
              <div>Date :   2021-02-28</div>

            </div>
          </div>
          <div id="bottom-part">

          </div>
        </div>

    </div>
  );
}

export default CaseStudyWTconnection;