import React from "react";
import logo from "../../img/logo-lac.png";
import "./Team.scss";
import "./About.scss";
import { TeamMember } from "../../model/Team";

export default function Team() {



  return (
    <div id="team">
      <div className="aboutHeader">
        <h2>Équipe de gestion</h2>
        <img src={logo} alt="LAC logo" />
      </div>

      <div>
        Avec l’appui du:
        <div>Bureau d’Appui et d’Innovation Pédagogique (BAIP)</div>
        <div>Presses Internationales Polytechnique</div>
      </div>

      <div className="aboutHeader">
        <h2>Comité scientifique</h2>
        <img src={logo} alt="LAC logo" />
      </div>

    </div>
  );
}
