import React from "react";
import "../../styles/LightCaseStudy.scss";
import Button from "@mui/material/Button";
import "../img/normal_search.svg";
// import { useNavigate } from "react-router-dom";
import Tabs from './Tabs';

interface Props {}

const CaseStudyWTconnection: React.FC<Props> = ({}) => {
  // const navigate = useNavigate();
  return (
    <div id="main">
      <div id="profile">
        <Button variant="contained" onClick={() => console.log("You clicked")}>
          Se Connecter
        </Button>
      </div>
      <div id="main-line"></div>
      <div>
        <Button className="return" onClick={() => console.log("You clicked")}>
          &gt; Retour au catalogue
        </Button>
        <div className="section">
          <div className="section-line"></div>
          <div id="first">
            <div id="title">
              Littéralement en changement
              <div id="subtitle">
                L’impact de la COVID-19 sur l’écosystème littéraire québécois
              </div>
            </div>
            <br />
            <div id="information">
              <div>
                Au début de l’année 2020, la pandémie de la COVID-19 a frappé de
                plein fouet le milieu littéraire. Fragilisé, l’écosystème
                littéraire a subi une énième vague de transformation. Les
                bibliothèques ont fermé. Les salons du livre, les lancements et
                les événements culturels ont été reportés ou carrément annulés.
                Les retards de paiement des éditeurs s’accumulent. Le droit de
                représentation empêche bon nombre d’auteurs et d’autrices de
                présenter leurs livres, même virtuellement. L’industrie du livre
                est-elle en crise?
              </div>
              <div>
                <div>
                  <b>Auteurs :</b> Virginie Francoeur, Annie Passalacqua
                </div>
                <div>
                  <b>Discipline :</b> Génie industriel
                </div>
                <div>
                  <b>Sujet(s) :</b> Gestion du changement
                </div>
                <div>
                  <b>Nombre de pages :</b> 9
                </div>
                <div>
                  <b>Date :</b> 2021-02-28
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="section-line"></div>
          <Tabs></Tabs>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyWTconnection;
