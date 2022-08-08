import React from "react";
import logo from "../../img/logo-lac.png";
import "./Summary.scss";
import "./About.scss";

export default function Summary() {
  return (
    <div id="summary">
      <div className="aboutHeader">
        <h2>LAC</h2>
        <img src={logo} alt="LAC logo" />
      </div>
      <div id="summaryContent">
        <div className="summaryAspect" id="aspect1">
          <div>Plateforme</div>
          <div>
            Partager des connaissances grâce à une plateforme collaborative
          </div>
        </div>
        <div className="summaryAspect" id="aspect2">
          <div>Catalogue de cas</div>
          <div>
            Accès à un catalogue d’étude de cas en libre accès et payant pour
            faciliter l’enseignement par les cas
          </div>
        </div>
        <div className="summaryAspect" id="aspect3">
          <div>Intégration</div>
          <div>
            Jumeler l’expérience entre génie et sciences sociales pour faire le
            pont entre le milieu universitaire et le milieu de la pratique
          </div>
        </div>
        <div className="summaryAspect" id="aspect4">
          <div>Communauté</div>
          <div>
            Rassembler la communauté pour déployer des solutions d’apprentissage
            renouvelées et innovantes
          </div>
        </div>
      </div>
    </div>
  );
}
